import React, { useState } from 'react'
import './Application.css'

export default function AliexpressItem({ title, image, price, shipping, sold, url, rating, reviews }) {
const [shippingMethod, setShippingMethod] = useState(0)

    return (        
        <div href={url} target="_blank" className="aliexpressItem">
            <h6>{title.split(' ').slice(0, 8).join(' ')}</h6>
            <img src={image} height="100" width="100" /><br />
            <span>sold: <b>{sold}</b> | price: <b>{price}$</b> <b>| total: {(price + shipping[shippingMethod].price).toFixed(2)}$</b></span><br />
          <span>rating: <b>{rating ? rating : 'none'}</b> | reviews: <b>{reviews}</b></span><br />
<br/>
            <table className="shippingTable">
                <tr>
                <th>Price</th>
                <th>Delivery</th>
                <th>Carrier</th>
                </tr>
            {shipping.map((e, index) => 
            <tr style={{cursor:'pointer', background: index === shippingMethod ? 'yellow' : 'transparent'}} onClick={() => setShippingMethod(index)}>
            <td><b>{e.price ? `${e.price}$` : 'Free'}</b></td>
         {typeof shipping.days === 'Array' ?
                    <td> between <b>{e.days[0]}</b> to <b>{e.days[1]}</b> days</td>
                    :
                    <td><b>{e.days}</b> days</td>
                }
                <td> {e.carrier}</td>
            <br/>
            </tr>
            )}
            </table>
        </div>
    )
}
