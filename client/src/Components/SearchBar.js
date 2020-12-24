import React, { useState, useEffect } from "react";
import { CompareTab } from "./";
import ErrorBoundary from "../Helpers/ErrorBoundary";
import { RecentSearches } from "./";

export default function SearchBar({ display, setTitle, index, cacheData, recent }) {
  const [input, setInput] = useState("");
  const [search, setSearch] = useState(null);
  const [toggle, setToggle] = useState(0);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (cacheData && cacheData.product) {
      setTitle(cacheData.product);
      setSearch(cacheData.product);
    }
  setTimeout(() => {
    setRefresh(true)
    }, 200);
  }, [cacheData]);

  return (
    <center
      style={{
        display: display,
        zIndex: "5",
        background: "white",
        position: "relative",
        minHeight: "400px",
      }}
    >
      {refresh && <> <br />
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="searchBar"
      />
            <button
        onClick={() => {
          if (input.trim() !== "") {
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
      {recent && !toggle && !cacheData && (
        <RecentSearches
          recent={recent}
          setSearch={(data) => {
            setTitle(data);
            setSearch(data);
            setToggle((e) => e + 1);
          }}
        />
      )}
      </>
      }
    </center>
  );
}
