import React from 'react'
import './Application.css'

function RecentSearches({recent, setSearch}) {

    return (
        <div style={{width:'50%'}}>
            <h2 style={{fontWeight:'100'}}>Recent Searches</h2>
          {recent.map(e => <button className='recentButton' onClick={() => setSearch(e)}>{e}</button>).reverse()}  
        </div>
    )
}

export default RecentSearches
