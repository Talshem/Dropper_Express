import React, { useState, useEffect } from 'react'
import './Application.css'
import axios from 'axios'
import { EbaySection, AliexpressSection, SummaryData } from './'
import { Button } from '@material-ui/core';
import { ItemContext, ItemProvider } from '../Providers/ItemProvider';

function CompareTab({ display }) {
    const [input, setInput] = useState('')
    const [ebay, setEbay] = useState(null)
    const [aliexpress, setAliexpress] = useState(null)
    const [country, setCountry] = useState(null)

    const fetchData = async (e) => {
        if (e !== '') {
            const { data: ebay } = await axios.get(`/ebay?product=${e}`)
           console.log(ebay)
            setEbay(ebay)
            const { data: aliexpress } = await axios.get(`/aliexpress?product=${e}`)
          console.log(aliexpress)
            setAliexpress(aliexpress)
            setCountry(Object.keys(ebay[0])[0])
        }
    };

    return (
        <center style={{ display: display, zIndex: '3', background: 'white', position: 'relative' }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} className="searchBar" />
            <button onClick={() => fetchData(input)} className="searchButton">Search</button>

            <br />
            <br />
            {ebay && aliexpress &&
                <>
                    {ebay.map((e, index) => <Button style={{ background: 'orange', color: 'white', margin: '5px' }} variant="contained" key={index} onClick={() => setCountry(Object.keys(e)[0])}>{Object.keys(e)[0]}</Button>)}
                    <hr />
                    <ItemProvider>
                        <SummaryData />
                        <hr />
                        <div style={{ display: 'flex' }}>
                            <EbaySection ebay={ebay} country={country} />
                            <hr />
                            <AliexpressSection aliexpress={aliexpress} country={country} />
                        </div>
                    </ItemProvider>
                </>
            }
        </center >
    )
}

export default React.memo(CompareTab)