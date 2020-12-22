import React, { useState, useEffect } from "react";
import "./Application.css";
import axios from "axios";
import { EbaySection, AliexpressSection, SummaryData } from ".";
import { ItemProvider } from "../Providers/ItemProvider";
import LoadingOverlay from "react-loading-overlay";
import BeatLoader from "react-spinners/BeatLoader";
import { Fade } from "@material-ui/core";
import { useContext } from "react";
import { UserContext } from "../Providers/UserProvider";

function CompareTab({ search, setSearch, toggle, index, cacheData }) {
  const [ebay, setEbay] = useState(null);
  const [aliexpress, setAliexpress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    setEbay(cacheData && cacheData.ebay);
    setAliexpress(cacheData && cacheData.aliexpress);
  }, [cacheData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading("Scanning product");
        const { data } = await axios.get(
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
    };
    if (!loading && search && search !== "") fetchData();
  }, [toggle]);

  useEffect(() => {
    if (loading) {
    const interval = setInterval(() => {
      if (dots === " . . .") {
        setDots("");
      } else {
        setDots((e) => `${e} .`);
      }
    }, 250);
    return () => clearInterval(interval);
  }
  }, [dots]);

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
        {search && <h1>{search}</h1>}
            {ebay.length > 0 && aliexpress.length > 0 ? (
            <ItemProvider>
              <SummaryData
                range={ebay.map((e) =>
                  Number((e.price + e.shipping.price).toFixed(2))
                )}
              />
              <br />
              <br />
              <div style={{ display: "flex" }}>
                <EbaySection ebay={ebay} />
                <hr />
                <AliexpressSection aliexpress={aliexpress} />
              </div>
            </ItemProvider>
          ) : (
            <h1>Something went wrong...</h1>
          )}
        </>
      )}
    </>
  );
}

export default React.memo(CompareTab);
