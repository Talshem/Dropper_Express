import React, { useState, useEffect, useReducer, useRef } from "react";
import { SearchBar } from "./";
import "./TabsBar.css";
import { useContext } from "react";
import { UserContext } from "../Providers/UserProvider";
import network from "../Helpers/Network";

const ACTIONS = {
  ADD: "ADD",
  REMOVE: "REMOVE",
};

function reducer(tabs, action) {
  switch (action.type) {
    case ACTIONS.ADD:
      return [...tabs, action.payload];
    case ACTIONS.REMOVE:
      return tabs.filter((tab) => tab !== action.payload);
    default:
      return;
  }
}

export default function Tabsbar(props) {
  const [focus, setFocus] = useState(1);
  const [titles, setTitles] = useState({
    1: "New Tab",
    2: "New Tab",
    3: "New Tab",
    4: "New Tab",
    5: "New Tab",
  });
  const [tabs, dispatch] = useReducer(reducer, [1]);
  const [cacheData, setCacheData] = useState({});
  const { user } = useContext(UserContext);
  const [toggle, setToggle] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await network.get(`/history/${user.email}`);
        if (data) {
          setCacheData(data);
          for (let i = 1; i < 5; i++) {
            if (data[`tab${i}`] && !tabs.includes(i)) {
              addTab(i);
            }
          }
        }
      } catch (err) {
        return;
      }
    };
    fetchData();
  }, [toggle]);



  const handleTitles = (index, content) => {
    setTitles((prevState) => ({
      ...prevState,
      [index]: content.charAt(0).toUpperCase() + content.slice(1),
    }));
  };

  const addTab = (e = null) => {
    if (e) return dispatch({ type: ACTIONS.ADD, payload: e });
    let i;
    for (i = 1; i < 5; i++) {
      if (!tabs.includes(i)) {
        break;
      }
    }
    if (!tabs.includes(i)) {
      dispatch({ type: ACTIONS.ADD, payload: i });
      setFocus(i);
    }
  };

  const removeTab = (e) => {
    Promise.resolve(dispatch({ type: ACTIONS.REMOVE, payload: e }))
      .then(async () => {
        await network.delete(`/clearCache/${user.email}${e}`);
        handleTitles(e, "New Tab");
        setToggle(Math.random());
      })
      .catch(() => {
        return;
      });
  };

  return (
    <>
      <div
        id="searchBar"
        style={{ top: "932px", position: "absolute", width: "0" }}
      />
      <div className="tabsBar">
        {tabs.map((e) => (
          <>
            <button
              id={`tab${e}`}
              style={{
                color: titles[e] === "New Tab" ? "grey" : "black",
                background: focus === e ? "white" : "#e5e5e5",
                overflow: "hidden",
              }}
              onClick={() => setFocus(e)}
              className="searchTab"
            >
              <span>{titles[e]}</span>
            </button>
            <button
              className="removeButton"
              onClick={() => {
                focus === e && setFocus(tabs[tabs.indexOf(e) - 1]);
                removeTab(e);
              }}
            >
              &#x2716;
            </button>{" "}
          </>
        ))}
        <button className="addButton" onClick={() => addTab()}>
          &#x2b;
        </button>
      </div>
      <div
        style={{
          zIndex: "10",
          height: "4px",
          background: "white",
          position: "sticky",
          top: "52px",
        }}
      />
      <div style={{ position: "relative", top: "0px", background: "white", marginBottom:'300px' }}>
        {tabs.map((e) => (
          <SearchBar
            recent={cacheData["search"]}
            cacheData={cacheData[`tab${e}`]}
            setTitle={(input) => handleTitles(e, input)}
            key={e}
            index={e}
            display={focus === e ? "block" : "none"}
          />
        ))}
      </div>
    </>
  );
}
