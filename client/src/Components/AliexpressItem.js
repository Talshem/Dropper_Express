import React, { useState, useContext, useEffect, useRef } from 'react'
import './Product.css'
import { ItemContext } from "../Providers/ItemProvider";

export default function AliexpressItem({ title, image, price, shipping, sold, url, rating, reviews, index}) {
    const [shippingMethod, setShippingMethod] = useState(0)
    const { handleSelect, selectedAliexpressItem } = useContext(ItemContext);
    const details = useRef();



useEffect(() => {
    if (!selectedAliexpressItem && index === 0) handleSelect({ title, image, price: price + shipping[shippingMethod].price , shipping: shipping[shippingMethod], sold, url, rating, reviews, index}, 'aliexpress')
    else if (selectedAliexpressItem && selectedAliexpressItem.url === url) handleSelect({ title, image, price: price + shipping[shippingMethod].price , shipping: shipping[shippingMethod], sold, url, rating, reviews, index}, 'aliexpress')
}, [shippingMethod])

    return (
        <div className="productContainer" style={{background: selectedAliexpressItem && selectedAliexpressItem.url === url ? 'rgb(255, 223, 164)': 'rgb(255, 252, 246)'}}>
            <h6>{title.split(' ').slice(0, 8).join(' ')}</h6>
            <a target="_blank" href={url}><img src={image} height="100" width="100" /><br /></a>
            <span>sold: <b>{sold}</b> | price: <b>{price}$</b></span><br />
            <span>rating: <b>{rating ? rating : 'none'}</b> | reviews: <b>{reviews}</b> | Delivery: {isNaN(shipping[shippingMethod].days) ?
                    <span><b>{shipping[shippingMethod].days[0]}</b> to <b>{shipping[shippingMethod].days[1]}</b> days</span>
                    :
                    <span><b>{shipping[shippingMethod].days}</b> days</span>
                }</span><br />
            <br />
            <b> total: {(price + shipping[shippingMethod].price).toFixed(2)}$</b><br/>
            <button onClick={() => handleSelect({ title, image, price: price + shipping[shippingMethod].price, shipping: shipping[shippingMethod], sold, url, rating, reviews, index}, 'aliexpress')}> Select </button><br/>

            <details ref={details} onMouseLeave={() => details.current.open = false} >
                <summary>Shipping: {shipping[shippingMethod].carrier}</summary>
                <table  className="shippingTable">
                    <tr>
                        <th>Price</th>
                        <th>Delivery</th>
                        <th>Carrier</th>
                    </tr>
                    {shipping.map((e, index) =>
                        <tr style={{ cursor: 'pointer', background: index === shippingMethod ? 'rgb(243, 234, 216)' : 'transparent' }} onClick={() => setShippingMethod(index)}>
                            <td><b>{e.price ? `${e.price}$` : 'Free'}</b></td>
                            {isNaN(e.days) ?
                                <td> between <b>{e.days[0]}</b> to <b>{e.days[1]}</b> days</td>
                                :
                                <td><b>{e.days}</b> days</td>
                            }
                            <td> {e.carrier}</td>
                            <br />
                        </tr>
                    )}
                </table>
            </details>
        </div>
    )
}
