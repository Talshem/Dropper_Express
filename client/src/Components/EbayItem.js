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
    <div
      className="productContainer"
      style={{
        background:
          selectedEbayItem && selectedEbayItem.url === url
            ? "rgb(141, 110, 110, 0.3)"
            : "rgb(255, 252, 246)",
      }}
    >
      <h3>{title.split(" ").slice(0, 8).join(" ")}</h3>
      <a target="_blank" href={url}>
        <img src={image} height="100" width="100" />
        <br />
      </a>
      <span>
        sold: <b>{sold}</b> | price: <b>{price}$</b>
      </span>
      <br />
      <span>
        shipping: <b>{shipping.price ? `${shipping.price}$` : "Free"}</b>,
        delivery: <b>{shipping.days[0]}</b> to <b>{shipping.days[1]}</b>{" "}
        days
      </span>
      <br />
      <br />
      <span style={{ fontSize: "20px" }}>
        <b> total: {(price + shipping.price).toFixed(2)}$</b>
      </span>
      <br />
      <button
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
      >
        {" "}
        Select{" "}
      </button>
      <br />
    </div>
  );
}
