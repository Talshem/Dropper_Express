import React, {useState} from 'react'
import './LoginSystem.css'
import { Link } from "react-router-dom";
import { GoogleLogin, TYPE } from './'
import { useContext } from "react";
import { UserContext } from "../Providers/UserProvider";
import logo from './logo.png';

export default function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { userLogin, loginError: error } = useContext(UserContext);

    const onChangeHandler = (event) => {
        const {name, value} = event.currentTarget;

        if(name === 'userEmail') {
            setEmail(value);
        }
        else if(name === 'userPassword'){
          setPassword(value);
        }
    };

const handleLogin = (event) => {
event.preventDefault();
userLogin({type:TYPE.NORMAL, email, password})
}

    return (

        <div className="sign">
<center>
<img min src={logo} alt="logo"/>
<h1>Sign In</h1></center>
      <div>
      {error !== null && (
          <div className='error'>
            {error}
            <br/><br/>
          </div>
        )}
        <form>
          <label htmlFor="userEmail">
            Email:
          </label>
          <br/>
          <input
            type="email"
            name="userEmail"
            value = {email}
            placeholder="Your Email"
            id="userEmail"
            onChange = {(event) => onChangeHandler(event)}
          />
          <br/>
          <label htmlFor="userPassword">
            Password:
          </label>
          <br/>
          <input
            type="password"
            name="userPassword"
            value = {password}
            placeholder="Your Password"
            id="userPassword"
            onChange = {(event) => onChangeHandler(event)}
          />
          <br/><br/><br/>
          <button onClick={handleLogin} className="signNormal">
            Sign in
          </button>
        </form>
        <center>or</center>
        <GoogleLogin/>
        <br/><br/>
        <center>
          Don't have an account?{" "}
          <Link to="/signUp" style={{textDecoration:"none", color:'rgb(90, 90, 211)'}}>
            Sign up here
          </Link>{" "}
          <br /><br/>{" "}
          <Link to="/passwordReset" style={{textDecoration:"none", color:'rgb(90, 90, 211)'}}>
            Forgot Password? 
          </Link>
        </center>
      </div>
    </div>


    )
}


