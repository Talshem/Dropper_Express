import React, { useState, useEffect } from "react";
import { CompareTab } from "./";
import ErrorBoundary from "../Helpers/ErrorBoundary";

function SearchBar({ display, setTitle, index, cacheData }) {
  const [input, setInput] = useState("");
  const [search, setSearch] = useState(null);
  const [toggle, setToggle] = useState(0);

  useEffect(() => {
    if (cacheData && cacheData.product) {
    setTitle(cacheData.product)
    setSearch(cacheData.product)
    }
  }, [cacheData]);


  return (
    <center
      style={{
        display: display,
        zIndex: "3",
        background: "white",
        position: "relative",
        minHeight: "400px",
      }}
    >
      <br />
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="searchBar"
      />
      <button
        onClick={() => {
          if (input !== "") {
            setTitle(input);
            setSearch(input);
            setToggle((e) => e + 1);
          }
        }}
        className="searchButton"
      >
        Search
      </button>
      <ErrorBoundary>
        <CompareTab
          cacheData={cacheData}
          index={index}
          toggle={toggle}
          search={search}
          setSearch={(e) => setSearch(e)}
        />
      </ErrorBoundary>
    </center>
  );
}

export default SearchBar;
