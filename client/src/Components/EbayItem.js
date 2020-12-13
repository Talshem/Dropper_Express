import React from 'react'
import './Application.css'
export default function EbayItem({title, image, price, shipping, sold, url}) {
    

    return (
        <div href={url} target="_blank" className="ebayItem">
         <h6>{title.split(' ').slice(0, 8).join(' ')}</h6>
         <img src={image} height="100" width="100" /><br/>
         <span>sold: <b>{sold}</b> | price: <b>{price}$</b></span><br/>
         <p>shipping: <b>{shipping.price ? `${shipping.price}$` : 'Free'}</b>, delivery between <b>{shipping.days[0]}</b> to <b>{shipping.days[1]}</b> days</p>
         <p><b> total: {(price + shipping.price).toFixed(2)}$</b></p>
        </div>
    )
}
