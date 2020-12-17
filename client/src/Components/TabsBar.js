import React, { useState, useEffect } from 'react'
import { CompareTab } from './';

export default function Tabsbar(props) {
    const [tab, setTab] = useState(1)

    return (
        <>
            <div className="tabsBar">
                <button style={{background: tab === 1 ? 'white' : '#f1f1f1'}} onClick={() => setTab(1)} className='searchTab'>Title 1</button>
                <button style={{background: tab === 2 ? 'white' : '#f1f1f1'}} onClick={() => setTab(2)} className='searchTab'>Title 2</button>
                <button style={{background: tab === 3 ? 'white' : '#f1f1f1'}} onClick={() => setTab(3)} className='searchTab'>Title 3</button>
                <button style={{background: tab === 4 ? 'white' : '#f1f1f1'}} onClick={() => setTab(4)} className='searchTab'>Title 4</button>
                <button style={{background: tab === 5 ? 'white' : '#f1f1f1'}} onClick={() => setTab(5)} className='searchTab'>Title 5</button>
            </div>
            <div style={{position:'relative', top:'100px', background:'white'}}>
            <CompareTab key={1} display={tab === 1 ? 'block' : 'none'} />
            <CompareTab key={2} display={tab === 2 ? 'block' : 'none'} />
            <CompareTab key={3} display={tab === 3 ? 'block' : 'none'} />
            <CompareTab key={4} display={tab === 4 ? 'block' : 'none'} />
            <CompareTab key={5} display={tab === 5 ? 'block' : 'none'} />
        </div>
        </>
    )
}
