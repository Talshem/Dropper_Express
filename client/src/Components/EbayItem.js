import React, { useContext, useEffect } from "react";
import "./Product.css";
import { ItemContext } from "../Providers/ItemProvider";

export default function EbayItem({
  title,
  image,
  price,
  shipping,
  sold,
  url,
  index,
}) {
  const { handleSelect, selectedEbayItem } = useContext(ItemContext);

  useEffect(() => {
    if (!selectedEbayItem && index === 0)
      handleSelect(
        {
          title,
          image,
          price: price + shipping.price,
          shipping,
          sold,
          url,
          index,
        },
        "ebay"
      );
  }, []);

  return (
    <div style={{display:'block'}}>
      <a target="_blank" href={url}>
        <img className="productImg" src={image} height="132" width="132" />
      </a>
      <div
        onClick={() =>
          handleSelect(
            {
              title,
              image,
              price: price + shipping.price,
              shipping,
              sold,
              url,
              index,
            },
            "ebay"
          )
        }
        className="productContainer"
        style={{
          background:
            selectedEbayItem && selectedEbayItem.url === url
              ? "rgb(141, 110, 110, 0.3)"
              : "rgb(245, 244, 239)",
        }}
      >
        <div style={{ width: "100%" }}>
          <h3 style={{ marginTop: "0" }}>
            {title.split(" ").slice(0, 8).join(" ")}
          </h3>
          <span>
            Sold: <b>{sold}</b> | Price: <b>{price}$</b> | Shipping:{" "}
            <b>{shipping.price ? `${shipping.price}$` : "Free"}</b> | Delivery:{" "}
            <b>{shipping.days[0]}</b> to <b>{shipping.days[1]}</b> days
          </span>
          <br />
          <br />
          <span style={{ fontSize: "20px" }}>
            <b> Total: {(price + shipping.price).toFixed(2)}$</b>
          </span>
        </div>
      </div>
    </div>
  );
}
