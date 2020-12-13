import React, { useState, useEffect } from 'react'
import { AliexpressItem } from './'
import _ from 'lodash';

export default function AliexpressSection({ aliexpress, country }) {
    const [sort, setSort] = useState('sold')
    const [page, setPage] = useState(0)

    const [rating, setRating] = useState(0)
    const [delivery, setDelivery] = useState(5000)
    const [price, setPrice] = useState(5000)
    const [reviews, setReviews] = useState(0)
    const [sold, setSold] = useState(0)

    const [data, setData] = useState(null)

    useEffect(() => {
        country && setData(aliexpress.find(e => Object.keys(e)[0] === country)[country])
    }, [country])



    function sortItems(e) {

        function averageDelivery(days) {
            if (typeof days === 'Array') return days.reduce((a, b) => a + b, 0) / days.length
            return days
        }


        e = e.filter(e => e['rating'] >= Number(rating))
            .filter(e => e['reviews'] >= Number(reviews))
            .filter(e => e['price'] + e['shipping'][0]['price'] <= Number(price))
            .filter(e => + e['sold'] >= Number(sold))
            .filter(e => {
                for (let method of e['shipping']) {
                    if (isNaN(method['days']) ? method['days'][1] <= Number(delivery) : method['days'] <= Number(delivery)) {
                        return true
                    }
                } return false
            })

        switch (sort) {
            case 'sold':
                return e.sort((a, b) => { return b['sold'] - a['sold'] })
            case 'rating':
                return e.sort((a, b) => { return b['rating'] - a['rating'] })
            case 'reviews':
                return e.sort((a, b) => { return b['reviews'] - a['reviews'] })
            case 'price':
                return e.sort((a, b) => { return (a['price'] + a['shipping'][0]['price']) - (b['price'] + b['shipping'][0]['price']) })
            case 'delivery':
                return e.sort((a, b) => { return averageDelivery(a['shipping'][0]['days']) - averageDelivery(b['shipping'][0]['days']) })
            default:
                return
        }
    }


    return (
        <div className='aliexpress'>
            {data &&
                <>
                    <h3>Aliexpress</h3>
            Sort By: <select onChange={(e) => setSort(e.target.value)}>
                        <option value="sold">Sold</option>
                        <option value="price">Price</option>
                        <option value="delivery">Delivery</option>
                        <option value="rating">Rating</option>
                        <option value="reviews">Reviews</option>
                    </select>
            Delivery: <input onChange={_.debounce((e) => { setDelivery(e.target.value); setPage(0) }, 250)} defaultValue="5000" type="range" min="0" max={Math.max(...data.map(e => e['shipping'][0]['days']))} />
            Sold:<input onChange={_.debounce((e) => { setSold(e.target.value); setPage(0) }, 250)} defaultValue="0" type="range" min="0" max={Math.max(...data.map(e => e.sold))} />
            Price: <input onChange={_.debounce((e) => { setPrice(e.target.value); setPage(0) }, 250)} defaultValue="5000" type="range" min="0" max={Math.max(...data.map(e => e['price'] + e['shipping'][0]['price']))} />
            Rating: <input onChange={_.debounce((e) => { setRating(e.target.value); setPage(0) }, 250)} defaultValue="0" type="range" min="0" max="5" step="0.1" />
            Reviews: <input onChange={_.debounce((e) => { setReviews(e.target.value); setPage(0) }, 250)} defaultValue="0" type="range" min="0" max={Math.max(...data.map(e => e.reviews))} />

                    <br /><br />
                    {sortItems(data)
                        .slice(page, page + 3)
                        .map((e, index) =>
                            <AliexpressItem
                                key={e.url}
                                image={e.image}
                                title={e.title}
                                url={e.url}
                                sold={e.sold}
                                shipping={e.shipping}
                                price={e.price}
                                reviews={e.reviews}
                                rating={e.rating}
                            />
                        )}
                    <br />
                    <button onClick={() => page > 2 ? setPage(e => e - 3) : setPage(0)}>Previous</button> <button onClick={() => page + 3 < sortItems(data).length - 2 && setPage(e => e + 3)}>Next</button>
                </>
            }
        </div>
    )
}
