import React, { useState, useContext, useEffect, useRef } from "react";
import "./Product.css";
import { ItemContext } from "../Providers/ItemProvider";

export default function AliexpressItem({
  title,
  image,
  price,
  shipping,
  sold,
  url,
  rating,
  delivery,
  reviews,
  index,
}) {
  const [shippingMethod, setShippingMethod] = useState(0);
  const { handleSelect, selectedAliexpressItem } = useContext(ItemContext);
  const details = useRef();


  useEffect(() => {
    if (!selectedAliexpressItem && index === 0)
      handleSelect(
        {
          title,
          image,
          price: price + shipping[shippingMethod].price,
          shipping: shipping[shippingMethod],
          sold,
          url,
          rating,
          reviews,
          index,
        },
        "aliexpress"
      );
    else if (selectedAliexpressItem && selectedAliexpressItem.url === url)
      handleSelect(
        {
          title,
          image,
          price: price + shipping[shippingMethod].price,
          shipping: shipping[shippingMethod],
          sold,
          url,
          rating,
          reviews,
          index,
        },
        "aliexpress"
      );
  }, [shippingMethod]);

  const sortTable = (array) => {
    return array.filter((e) => {
      if (
        isNaN(e["days"])
          ? e["days"][0] <= Number(delivery)
          : e["days"] <= Number(delivery)
      ) {
        return true;
      }
      return false;
    });
  };

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
            price: price + shipping[shippingMethod].price,
            shipping: shipping[shippingMethod],
            sold,
            url,
            rating,
            reviews,
            index,
          },
          "aliexpress"
        )
      }
      className="productContainer"
      style={{
        background:
          selectedAliexpressItem && selectedAliexpressItem.url === url
            ? "rgba(192, 183, 183, 0.5)"
            : "rgb(245, 244, 239)",
      }}
    >
      {" "}
      <div style={{ width: "100%" }}>
        <h3 style={{ marginTop: "0" }}>
          {title.split(" ").slice(0, 8).join(" ")}
        </h3>
        <span>
          Sold: <b>{sold}</b> | Price: <b>{price}$</b> | Rating:{" "}
          <b>{rating ? rating : "none"}</b> | Reviews: <b>{reviews}</b> |
          Delivery:{" "}
          {isNaN(sortTable(shipping)[shippingMethod].days) ? (
            <span>
              <b>{Number(sortTable(shipping)[shippingMethod].days[0])}</b> to{" "}
              <b>{Number(sortTable(shipping)[shippingMethod].days[1])}</b> days
            </span>
          ) : (
            <span>
              <b>{Number(sortTable(shipping)[shippingMethod].days)}</b> days
            </span>
          )}
        </span>
        <br />
        <br />
        <details
        className="shippingDetails"
          onClick={(e) => e.stopPropagation()}
          ref={details}
          onMouseLeave={() => (details.current.open = false)}
        >
          <summary>
            Shipping: {sortTable(shipping)[shippingMethod].carrier},{" "}
            <b>
              {sortTable(shipping)[shippingMethod].price
                ? sortTable(shipping)[shippingMethod].price + "$"
                : "Free"}
            </b>
          </summary>
          <table className="shippingTable">
            <tr>
              <th>Price</th>
              <th>Delivery</th>
              <th>Carrier</th>
            </tr>
            {sortTable(shipping).map((e, index) => (
              <tr
                style={{
                  cursor: "pointer",
                  background:
                    index === shippingMethod
                      ? "rgb(235, 234, 229)"
                      : "transparent",
                }}
                onClick={() => setShippingMethod(index)}
              >
                <td>
                  <b>{e.price ? `${e.price}$` : "Free"}</b>
                </td>
                {isNaN(e.days) ? (
                  <td>
                    {" "}
                    <b>{Number(e.days[0])}</b> to <b>{Number(e.days[1])}</b> days
                  </td>
                ) : (
                  <td>
                    <b>{Number(e.days)}</b> days
                  </td>
                )}
                <td> {e.carrier}</td>
                <br />
              </tr>
            ))}
          </table>
        </details>
        <b style={{ fontSize: "20px" }}>
          {" "}
          Total: {(price + sortTable(shipping)[shippingMethod].price).toFixed(2)}$
        </b>
      </div>
    </div>
    </div>
  );
}
