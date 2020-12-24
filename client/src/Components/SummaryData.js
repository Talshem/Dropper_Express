import React, { useContext, useState, useEffect } from "react";
import { ItemContext } from "../Providers/ItemProvider";
import { CompareChart } from "./";
import "./Product.css";
import _ from "lodash";


export default function Summarydata({ range, index }) {
  const [profit, setProfit] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const { selectedEbayItem, selectedAliexpressItem } = useContext(ItemContext);

const EbayFees = (e) => {
  return e * 0.1 + (e * 0.029 + 0.3);
};


  useEffect(() => {
    if (selectedAliexpressItem && selectedEbayItem) {
      let productPrice = selectedAliexpressItem.price + profit;
      let productFees = EbayFees(productPrice);
      setFinalPrice(Number(productPrice + productFees).toFixed(2));
    }
  }, [profit, selectedAliexpressItem, selectedEbayItem]);

  return (
    <div className="profitSection">
      {selectedEbayItem && selectedAliexpressItem && (
        <>
          <h2 style={{fontWeight:'500'}}>How much profit do you want to make? </h2>
          <input
          type="number"
            style={{
              width: "70%",
              borderRadius: "5px",
              border: "2px solid #e5e5e5",
              padding: "5px",
            }}
            onChange={_.debounce((e) => setProfit(Number(e.target.value)), 250)
            }
            defaultValue={0}
          />
          <p>
            You will have to sell it for{" "}
            <b style={{ fontSize: "20px" }}>{finalPrice}$ </b>
            <em>(Including ebay and paypal fees)</em>, which is
            {finalPrice < selectedEbayItem.price ? (
              <>
                <b style={{ fontSize: "20px" }}> cheaper</b> than the selected
                listing on ebay{" "}
                <b>
                  <em style={{ color: "green" }}>
                    (-{(selectedEbayItem.price - finalPrice).toFixed(2)}$)
                  </em>
                </b>
              </>
            ) : (
              <>
                {" "}
                <b style={{ fontSize: "20px" }}> more expensive</b> than the
                selected listing on ebay{" "}
                <b>
                  <em style={{ color: "red" }}>
                    (+{(finalPrice - selectedEbayItem.price).toFixed(2)}$)
                  </em>
                </b>
              </>
            )}
          </p>
        </>
      )}
      <br />
      <CompareChart index={index} price={finalPrice} range={range} />
    </div>
  );
}
