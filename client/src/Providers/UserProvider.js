import React, { createContext, useState } from "react";
import axios from 'axios'
export const UserContext = createContext({ user: null});

export const UserProvider = (props) => {
const [ user, setUser ] = useState(null)
const [ loginError, setLoginError ] = useState(null)
const [ signupError, setSignupError ] = useState(null)

async function userSignup ({type, email, password, name}) {
try {
const { data } = await axios.post('/signup', {
type, email, password, name
})
if (data) {
localStorage.setItem('token', data.token);
localStorage.setItem('type', data.type)
setUser(data)
}
else setSignupError('Email is already in use')
} catch (err) {
setSignupError('Undetected error')
return err
}
}

async function userLogin ({type, email, password, name, token}) {
  try {
const { data } = await axios.put('/login', {
type, email, password, name, token
})
if (data) {
localStorage.setItem('token', data.token);
localStorage.setItem('type', data.type)
setUser(data)
}
else setLoginError('Email or password is incorrect')
} catch (err) {
setLoginError('Undetected error')
return
}
}

function userLogout (){
setUser(null)
localStorage.clear();
}

function setUserState(e) {
setUser(e)
}

  return (
      <UserContext.Provider value={{ user, userLogin, userLogout, userSignup, signupError, loginError, setUserState}}>
        {props.children}
      </UserContext.Provider>
    );
}