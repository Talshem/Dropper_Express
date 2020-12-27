import React, { useEffect, useState } from "react";
import "./Application.css";
import { Logout } from "../Login";
import logo from "./logo.png";
import banner1 from "../Banners/banner1.jpg";
import banner2 from "../Banners/banner2.jpg";
import banner3 from "../Banners/banner3.jpg";
import banner4 from "../Banners/banner4.jpg";
import banner5 from "../Banners/banner5.jpg";
import { Fade } from "@material-ui/core";
import { useContext } from "react";
import { UserContext } from "../Providers/UserProvider";
import { Button } from "@material-ui/core";

const images = [banner2, banner4, banner3, banner5];

export default function Header(props) {
  const [index, setIndex] = useState(0);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const interval = setInterval(() => {
      if (index >= images.length - 1) {
        setIndex(0);
      } else {
        setIndex((e) => e + 1);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [index]);

const subBanner = (margin, serial) => ( 
<Fade timeout={1500} in={(index+serial) % 2 !== 0}>
  <div>
        <div
        style={{
        marginLeft: `${margin}%`
        }} 
        className="refButton">
          <a
            style={{ textDecoration: "none", color: "white" }}
            href="#searchBar"
          >
          S C A N
          </a>
        </div>

<div className="subBanner" style={{marginLeft: `${margin}%`}}>
        <img
        height="100%"
        width="100%"
        src={banner1}
        style={{
        objectFit:'cover',
        opacity:'0.5',
        }}/>
        </div>
        </div>
        </Fade>
)

  return (
    <div>
          <div
          style={{top:'8px', zIndex:11, position:'fixed', right:'10px'}}
        >
          <Button disabled style={{ color: " rgb(155, 123, 133)" }}>
         {user.name}
          </Button>{" "}
          | <Logout />
    
        </div>


      <div className="header">
        <center>
          <img src={logo} height="100%" alt="logo" />
        </center>
        <h1 className="pageTitle">
          Check how much you can make with dropshipping to the USA!
        </h1>
      </div>




      <div
        style={{
          background: "rgb(233, 227, 216)",
          height: "800px",
          marginTop: "129px",
          width: "100vw",
        }}
      >
{subBanner(5, 1)}

{subBanner(75.5, 2)}

        {images.map((e, i) => (
          <Fade timeout={1500} in={index === i} key={i}>
            <img
              height="800px"
              width="70%"
              src={e}
              alt="banner"
              style={{
                objectFit:'cover',
                zIndex:'3',
                position: "absolute",
                borderRight: "4px solid white",
                borderLeft: "4px solid white",
                right: i % 2 === 0 && '-1.1vw'
              }}
            />
          </Fade>
        ))}
      </div>
    </div>
  );
}
