import React, { createContext, useState } from "react";

export const ItemContext = createContext({ user: null});

export const ItemProvider = (props) => {
const [ selectedEbayItem, setSelectedEbayItem ] = useState(null)
const [ selectedAliexpressItem, setSelectedAliexpressItem ] = useState(null)

function handleSelect(item, type){

switch(type){
    case 'ebay':
        setSelectedEbayItem(item)
        return
    case 'aliexpress':
        setSelectedAliexpressItem(item)
        return
    default: return
}
}


  return (
      <ItemContext.Provider value={{ selectedEbayItem, selectedAliexpressItem, handleSelect }}>
        {props.children}
      </ItemContext.Provider>
    );
}