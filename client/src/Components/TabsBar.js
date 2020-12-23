import React, { useState, useEffect } from "react";
import { SearchBar } from "./";
import "./Application.css";
import { useContext } from "react";
import { UserContext } from "../Providers/UserProvider";
import network from "../Helpers/Network";

export default function Tabsbar(props) {
  const [tab, setTab] = useState(1);
  const [name, setName] = useState({ 1: '', 2: '', 3:'', 4:'', 5:'' });

        const handleChange = (e, index) => {
            setName(prevState => ({
                ...prevState,
                [index]: e
            }));
        };
        
  const [cacheData, setCacheData] = useState({});
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await network.get(`/history/${user.email}`);
        if (data) setCacheData(data);
      } catch (err) {
        return;
      }
    };
    fetchData();
  }, []);

const array = [1, 2, 3, 4, 5]

  return (
    <>
      <div id="searchBar" style={{ top: "810px", position: "absolute" }} />
      <div className="tabsBar">
        {array.map(e => 
        <button
          style={{
            background: tab === e ? "white" : "#f1f1f1",
            overflow: "hidden",
          }}
          onClick={() => setTab(e)}
          className="searchTab"
        >
          {name[e]}
        </button>
        )}
      </div>

    <div style={{zIndex:'10', height:'4px', background:'white', position:'sticky', top:'179px'}}/>
          <br/>
      <div style={{ position: "relative", top: "0px", background: "white" }}>
        {array.map(e => 
        <SearchBar
          recent={cacheData['search']}
          cacheData={cacheData[`tab${e}`]}
          setTitle={(input) => handleChange(input, e)}
          key={e}
          index={e}
          display={tab === e ? "block" : "none"}
        />
        )}
      </div>
    </>
  );
}
