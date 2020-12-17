import React, { useState, useEffect, useContext } from 'react'
import { AliexpressItem } from './'
import _ from 'lodash';
import { Button, Slider, Typography, InputLabel, MenuItem, FormControl, Select, Menu } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ItemContext } from "../Providers/ItemProvider";


const useStyles = makeStyles((theme) => ({
    root: {
        width: 100,
        display: 'inline-block',
        margin: 10
    },
    formControl: {
        minWidth: 120,
    },
}))



export default function AliexpressSection({ aliexpress, country }) {
    const [sort, setSort] = useState(null)
    const [page, setPage] = useState(0)

    const [rating, setRating] = useState(0)
    const [delivery, setDelivery] = useState(5000)
    const [price, setPrice] = useState(5000)
    const [reviews, setReviews] = useState(0)
    const [sold, setSold] = useState(0)

    const [data, setData] = useState(null)
    const classes = useStyles();
    const { handleSelect } = useContext(ItemContext);

    useEffect(() => {
        if (country) {
            let data = aliexpress.find(e => Object.keys(e)[0] === country)[country]
            setData(data)
        }
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
                return e
        }
    }


    return (
        <div className='aliexpress'>
            {data &&
                <>
                    <h3>Aliexpress - <span style={{fontWeight:'400'}}>Choose the item you want to dropship</span></h3>

                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="demo-simple-select-outlined-label">Sort By</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            label="Sort By"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="sold">Sold</MenuItem>
                            <MenuItem value="price">Price</MenuItem>
                            <MenuItem value="delivery">Delivery</MenuItem>
                            <MenuItem value="rating">Rating</MenuItem>
                            <MenuItem value="reviews">Reviews</MenuItem>
                        </Select>
                    </FormControl>
                    <br />
                    <div className={classes.root}>
                        <Typography id="range-slider" gutterBottom>
                            Delivery
                        </Typography>
                        <Slider valueLabelDisplay="auto" onChange={_.debounce((e, newValue) => { setDelivery(newValue); setPage(0) }, 250)} defaultValue={5000} min={0} max={Math.max(...data.map(e => e['shipping'][0]['days']))} />
                    </div>
                    <div className={classes.root}>
                        <Typography id="range-slider" gutterBottom>
                            Sold
                        </Typography>
                        <Slider valueLabelDisplay="auto" onChange={_.debounce((e, newValue) => { setSold(newValue); setPage(0) }, 250)} defaultValue={0} min={0} max={Math.max(...data.map(e => e.sold))} />
                    </div>
                    <div className={classes.root}>
                        <Typography id="range-slider" gutterBottom>
                            Price
                        </Typography>
                        <Slider valueLabelDisplay="auto" onChange={_.debounce((e, newValue) => { setPrice(newValue); setPage(0) }, 250)} defaultValue={5000} min={0} max={Math.max(...data.map(e => e['price'] + e['shipping'][0]['price']))} />
                    </div>
                    <div className={classes.root}>
                        <Typography id="range-slider" gutterBottom>
                            Rating
                        </Typography>
                        <Slider valueLabelDisplay="auto" onChange={_.debounce((e, newValue) => { setRating(newValue); setPage(0) }, 250)} defaultValue={0} step={0.1} min={0} max={Math.max(...data.map(e => e['rating']))} />
                    </div>
                    <div className={classes.root}>
                        <Typography id="range-slider" gutterBottom>
                            Reviews
                        </Typography>
                        <Slider valueLabelDisplay="auto" onChange={_.debounce((e, newValue) => { setReviews(newValue); setPage(0) }, 250)} defaultValue={0} min={0} max={Math.max(...data.map(e => e['reviews']))} />
                    </div>
                    <br /><br />
                    <div className='itemContainer'>

                        {sortItems(data)
                            .slice(page, page + 4)
                            .map((e, index) =>
                                <AliexpressItem
                                    index={index}
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
                    </div>
                    <br />
                    <Button onClick={() => page > 3 ? setPage(e => e - 4) : setPage(0)}>Previous</Button>
                    <Button onClick={() => page + 4 < sortItems(data).length - 3 && setPage(e => e + 4)}>Next</Button>
                </>
            }
        </div>
    )
}
