import React, {useState,useEffect} from 'react'
import { EbayItem } from './'
import _ from 'lodash';

export default function EbaySection({ebay, country}) {
    const [sort, setSort] = useState('sold')
    const [page, setPage] = useState(0)

    const [delivery, setDelivery] = useState(5000)
    const [price, setPrice] = useState(5000)
    const [sold, setSold] = useState(0)

    const [data, setData] = useState(null)

useEffect(() => {
country && setData(ebay.find(e => Object.keys(e)[0] === country)[country])
}, [country])

    function sortItems(e) {
        function averageDelivery(days) {
            if(typeof days === 'Array') return days.reduce((a, b) => a + b, 0) / days.length
            return days
        }

        e = e.filter(e => e['price'] + e['shipping']['price'] <= Number(price))
            .filter(e => + e['sold'] >= Number(sold))
            .filter(e => e['shipping']['days'][1] <= Number(delivery))

        switch (sort) {
            case 'sold':
                return e.sort((a, b) => { return b['sold'] - a['sold'] })
            case 'price':
                return e.sort((a, b) => { return (a['price'] + a['shipping']['price']) - (b['price'] + b['shipping']['price']) })
            case 'delivery':
                return e.sort((a, b) => { return averageDelivery(a['shipping']['days']) - averageDelivery(b['shipping']['days']) })
            default:
                return
       
        }}

    return (
<div className='ebay'>
{ data && 
<>
<h3>Ebay</h3>
                Sort By: <select onChange={(e) => setSort(e.target.value)}>
                    <option value="sold">Sold</option>
                    <option value="price">Price</option>
                    <option value="delivery">Delivery</option>
                </select>
            Delivery: <input onChange={_.debounce((e) => {setDelivery(e.target.value); setPage(0)}, 250)} defaultValue="5000" type="range" min="0" max={Math.max(...data.map(e => e['shipping']['days'][1]))} />
            Sold:<input onChange={_.debounce((e) => {setSold(e.target.value); setPage(0)}, 250)} defaultValue="0" type="range" min="0" max={Math.max(...data.map(e => e.sold))} />
            Price: <input onChange={_.debounce((e) => {setPrice(e.target.value); setPage(0)}, 250)} defaultValue="5000" type="range" min="0" max={Math.max(...data.map(e => e['price'] + e['shipping']['price']))} />
                <br /><br />
                {sortItems(data)
                        .slice(page, page + 4)
                        .map((e, index) =>
                            <EbayItem
                                key={index}
                                image={e.image}
                                title={e.title}
                                url={e.url}
                                sold={e.sold}
                                shipping={e.shipping}
                                price={e.price}
                            />
                        )}
                         <br/>
                         <button onClick={() => page > 3 ? setPage(e => e - 4) : setPage(0)}>Previous</button> <button onClick={() => page + 4 < sortItems(data).length - 3 && setPage(e => e + 4)}>Next</button>

</>
}
            </div>
    )
}
