import React, { useState, useEffect } from "react";
import { SearchBar } from "./";
import "./Application.css";
import { useContext } from "react";
import { UserContext } from "../Providers/UserProvider";
import axios from "axios";

export default function Tabsbar(props) {
  const [tab, setTab] = useState(1);
  const [name1, setName1] = useState("New Tab");
  const [name2, setName2] = useState("New Tab");
  const [name3, setName3] = useState("New Tab");
  const [name4, setName4] = useState("New Tab");
  const [name5, setName5] = useState("New Tab");
  const [cacheData, setCacheData] = useState({});
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/history/${user.email}`);
        setCacheData(data);
      } catch (err) {
        return;
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div id="searchBar" style={{ top: "810px", position: "absolute" }} />
      <div className="tabsBar">
        <button
          style={{
            background: tab === 1 ? "white" : "#f1f1f1",
            overflow: "hidden",
          }}
          onClick={() => setTab(1)}
          className="searchTab"
        >
          {name1}
        </button>
        <button
          style={{
            background: tab === 2 ? "white" : "#f1f1f1",
            overflow: "hidden",
          }}
          onClick={() => setTab(2)}
          className="searchTab"
        >
          {name2}
        </button>
        <button
          style={{
            background: tab === 3 ? "white" : "#f1f1f1",
            overflow: "hidden",
          }}
          onClick={() => setTab(3)}
          className="searchTab"
        >
          {name3}
        </button>
        <button
          style={{
            background: tab === 4 ? "white" : "#f1f1f1",
            overflow: "hidden",
          }}
          onClick={() => setTab(4)}
          className="searchTab"
        >
          {name4}
        </button>
        <button
          style={{
            background: tab === 5 ? "white" : "#f1f1f1",
            overflow: "hidden",
          }}
          onClick={() => setTab(5)}
          className="searchTab"
        >
          {name5}
        </button>
      </div>
    <div style={{zIndex:'10', height:'4px', background:'white', position:'sticky', top:'179px'}}/>
      <div style={{ position: "relative", top: "0px", background: "white" }}>
        <SearchBar
          cacheData={cacheData.tab1}
          setTitle={(e) => setName1(e)}
          key={1}
          index={1}
          display={tab === 1 ? "block" : "none"}
        />
        <SearchBar
          cacheData={cacheData.tab2}
          setTitle={(e) => setName2(e)}
          key={2}
          index={2}
          display={tab === 2 ? "block" : "none"}
        />
        <SearchBar
          cacheData={cacheData.tab3}
          setTitle={(e) => setName3(e)}
          key={3}
          index={3}
          display={tab === 3 ? "block" : "none"}
        />
        <SearchBar
          cacheData={cacheData.tab4}
          setTitle={(e) => setName4(e)}
          key={4}
          index={4}
          display={tab === 4 ? "block" : "none"}
        />
        <SearchBar
          cacheData={cacheData.tab5}
          setTitle={(e) => setName5(e)}
          key={5}
          index={5}
          display={tab === 5 ? "block" : "none"}
        />
      </div>
    </>
  );
}
