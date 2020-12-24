import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin, TYPE} from "./";
import logo from "./logo.png";
import { UserContext } from "../Providers/UserProvider";

export default function Signup(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const { userSignup, signupError: error } = useContext(UserContext);

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget;
    if (name === "userEmail") {
      setEmail(value);
    } else if (name === "userPassword") {
      setPassword(value);
    } else if (name === "displayName") {
      setDisplayName(value);
    }
  };

const handleSignup = (event) => {
event.preventDefault();
userSignup({type:TYPE.NORMAL, email, password, name:displayName})
}

  return (
    <div className="sign">
      <center>
        <img src={logo} alt="logo" />

        <h1>Sign Up</h1>
      </center>
      <div>
        {error !== null && (
          <div className="error">
            {error}
            <br />
            <br />
          </div>
        )}
        <form className="">
          <label htmlFor="displayName">Display Name:</label>
          <br />
          <input
            type="text"
            name="displayName"
            value={displayName}
            placeholder="Your Name"
            id="displayName"
            required
            onChange={(event) => onChangeHandler(event)}
          />
          <br />
          <label htmlFor="userEmail" className="block">
            Email:
          </label>
          <br />
          <input
            type="email"
            name="userEmail"
            value={email}
            placeholder="Your Email"
            id="userEmail"
            required
            onChange={(event) => onChangeHandler(event)}
          />
          <br />
          <label htmlFor="userPassword" className="block">
            Password:
          </label>
          <br />
          <input
            type="password"
            name="userPassword"
            value={password}
            placeholder="Your Password"
            id="userPassword"
            required
            onChange={(event) => onChangeHandler(event)}
          />
          <br />
          <br />
          <button onClick={handleSignup} className="signNormal">Sign up</button>
        </form>
        <center>or</center>
        <GoogleLogin />
        <br />
        <br />
        <center>
          Already have an account? <Link to="/login">Sign in here</Link>
        </center>
      </div>
    </div>
  );
}
