import React, { useState, useEffect } from 'react'
import './Application.css'
import axios from 'axios'
import { EbaySection, AliexpressSection } from './'

function CompareTab({ display }) {
    const [search, setsSearch] = useState(false)
    const [input, setInput] = useState('')
    const [ebay, setEbay] = useState([])
    const [aliexpress, setAliexpress] = useState([])
    const [country, setCountry] = useState(null)


    useEffect(() => {
        const fetchData = async () => {
if (input !== '') {
    const { data: ebay } = await axios.get('/ebaymock')
    setEbay(ebay)
    const { data: aliexpress } = await axios.get('/aliexpressmock')
    setAliexpress(aliexpress)
    setCountry(Object.keys(ebay[0])[0])
}
        };
        fetchData();
    }, [search])


    return (
        <center style={{ display: display }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} className="searchBar" />
            <button onClick={() => setsSearch(!search)} className="searchButton">Search</button><br/>
           <br/>
            {ebay.map((e, index) => <button key={index} onClick={() => setCountry(Object.keys(e)[0])}>{Object.keys(e)[0]}</button>)}
            <EbaySection ebay={ebay} country={country}/>
           <br/><hr/>
            <AliexpressSection aliexpress={aliexpress} country={country} />
        </center >
    )
}

export default React.memo(CompareTab)