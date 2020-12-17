import React, { useContext, useState, useEffect } from 'react'
import { ItemContext } from "../Providers/ItemProvider";

const EbayFees = (e) => {
    return e * 0.1 + (e * 0.029 + 0.3)
}

export default function Summarydata(props) {
    const [profit, setProfit] = useState(0)
    const [finalPrice, setFinalPrice] = useState(0)
    const { selectedEbayItem, selectedAliexpressItem } = useContext(ItemContext);

// data total sales of product
// chart range of prices - line of ur product price
// add ebay data - sponsored, sellers reviews
// 
// 
// 

useEffect(() => {
if ( selectedAliexpressItem && selectedEbayItem ) {
let productPrice = selectedAliexpressItem.price + profit;
let productFees = EbayFees(productPrice)
setFinalPrice((Number(productPrice + productFees).toFixed(2)))
}
}, [profit, selectedAliexpressItem, selectedEbayItem])


    return (
        <div>
            {selectedEbayItem && selectedAliexpressItem &&
                <>
                    <p><b>How much profit do you want to make?</b>
          <input onChange={(e) => !isNaN(Number(e.target.value)) && setProfit(Number(e.target.value))} value={profit} />
                    </p>
                    <p>You will have to sell it for <b>{finalPrice}$ </b><em>(Including ebay and paypal fees)</em></p>
                    {finalPrice < selectedEbayItem.price ?
                <p> Your product is <b>cheaper</b> than the selected listing on ebay <em style={{color:'green'}}>(-{(selectedEbayItem.price-finalPrice).toFixed(2)}$)</em></p> :
                <p> Your product is <b>more expensive</b> than the selected listing on ebay <em style={{color:'red'}}>(+{(finalPrice-selectedEbayItem.price).toFixed(2)}$)</em></p>    
                }
{}
                </>
}
        </div>
    )
}
