import React, { useState, useEffect } from "react";
import "./Application.css";
import { EbaySection, AliexpressSection, SummaryData } from ".";
import { ItemProvider } from "../Providers/ItemProvider";
import LoadingOverlay from "react-loading-overlay";
import BeatLoader from "react-spinners/BeatLoader";
import { Fade } from "@material-ui/core";
import { useContext } from "react";
import { UserContext } from "../Providers/UserProvider";
import socketIOClient from "socket.io-client";
import network from "../Helpers/Network";

function CompareTab({ search, setSearch, toggle, index, cacheData }) {
  const [ebay, setEbay] = useState(null);
  const [aliexpress, setAliexpress] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);

  
  useEffect(() => {
    setEbay(cacheData && cacheData.ebay);
    setAliexpress(cacheData && cacheData.aliexpress);
  }, [cacheData]);

  useEffect(() => {
    const fetchData = async () => {
      const socket = socketIOClient("/");
      socket.on(`${user.email}${index}`, (data) => {
        setLoading(data);
      });
      try {
        setLoading("Scanning product");
        const { data } = await network.get(
          `/scrape?product=${search}&email=${user.email}&index=${index}`
        );
        if (!data.ebay || !data.aliexpress) {
          setAliexpress([]);
          setEbay([]);
          return;
        }
        setEbay(data.ebay);
        setAliexpress(data.aliexpress);
      } catch (err) {
        setAliexpress([]);
        setEbay([]);
        return setSearch("");
      }
      setLoading(false);
      return () => socket.disconnect();
    };
    if (!loading && search && search !== "" && toggle > 0) fetchData();
  }, [toggle]);

  const override = `
  position:relative;
  background:white;
  opacity:0.5;
`;

  return (
    <>
      <Fade in={loading ? true : false}>
        <h1 className="loadingText">{loading}</h1>
      </Fade>
      <LoadingOverlay
        active={loading ? true : false}
        spinner={
          <BeatLoader
            css={override}
            color="black"
            style={{ zIndex: 50 }}
            size={50}
          />
        }
      ></LoadingOverlay>
      {ebay && aliexpress && !loading && (
        <>
          {ebay.length > 0 && aliexpress.length > 0 ? (
            <ItemProvider>
              {search && <h1 style={{ fontWeight: "100", fontSize: "50px", letterSpacing:'15px' }}>{search.toUpperCase()}</h1>}
              <SummaryData
                index={index}
                range={ebay.map((e) =>
                  Number((e.price + e.shipping.price).toFixed(2))
                )}
              />
              <br/><br/>
              <div style={{ display: "flex" }}>
                <EbaySection ebay={ebay} />
                <hr className="hrProduct"/>
                <AliexpressSection aliexpress={aliexpress} />
              </div>
            </ItemProvider>
          ) : (
            <h1 style={{ fontWeight: "100", fontSize: "50px" }}>
              Something went wrong...
            </h1>
          )}
        </>
      )}
    </>
  );
}

export default CompareTab;
