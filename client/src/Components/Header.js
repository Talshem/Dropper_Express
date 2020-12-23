import React, { useEffect, useState } from "react";
import "./Application.css";
import { Logout } from "../Login";
import logo from "./logo.png";
import banner1 from "../Banners/banner1.jpg";
import banner2 from "../Banners/banner2.jpg";
import banner3 from "../Banners/banner3.jpg";
import banner4 from "../Banners/banner4.jpg";
import { Fade } from "@material-ui/core";
import { useContext } from "react";
import { UserContext } from "../Providers/UserProvider";
import { Button } from "@material-ui/core";

const images = [banner2, banner4 , banner1, banner3];

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
    }, 5000);
    return () => clearInterval(interval);
  }, [index]);

  return (
    <>
      <div className="header">
        <center>
          <img src={logo} height="100%" alt="logo" />
        </center>
        <div
          style={{ float: "right", marginTop: "-100px", marginRight: "30px" }}
        >
          <Button disabled style={{ color: "rgb(185, 157, 136)" }}>
            {user.name}
          </Button>{" "}
          | <Logout />
        </div>

        <h1 className="pageTitle">
          Check how much you can make with dropshipping to the USA!
        </h1>
      </div>
      <div
        style={{
          background: "rgb(233, 227, 216)",
          height: "800px",
          marginTop: "129px",
          width: "100%",
        }}
      >
        <div className="refButton">
          <a
            style={{ textDecoration: "none", color: "white" }}
            href="#searchBar"
          >
            SCAN NOW
          </a>
        </div>
        {images.map((e, i) => (
          <Fade timeout={1500} in={index === i} key={i}>
            <img
              width="80%"
              height="800px"
              src={e}
              alt="banner"
              style={{
                position: "absolute",
                borderRight: "4px solid white",
                borderLeft: "4px solid white",
                left: "10%",
              }}
            />
          </Fade>
        ))}
      </div>
    </>
  );
}
