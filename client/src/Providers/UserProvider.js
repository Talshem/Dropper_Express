import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import network from "../Helpers/Network";
import { TYPE } from "../Login";
export const UserContext = createContext({ user: null });

export const UserProvider = (props) => {
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [signupError, setSignupError] = useState(null);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await network.get("/auto");
      if (data) setUserState(data);
      setResponse(true);
    };
    fetchData();
  }, []);

  async function userSignup({ type, email, password, name }) {
    try {
      const { data } = await axios.post("/register", {
        type,
        email,
        password,
        name,
      });
      if (data) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("type", data.type);
        setUser(data);
      } else setSignupError("Email is already in use");
    } catch (err) {
      setSignupError("Undetected error");
      return err;
    }
  }

  async function userLogin({ type, email, password, name, token }) {
    try {
      const { data } = await axios.put("/login", {
        type,
        email,
        password,
        name,
        token,
      });
      if (data) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("type", data.type);
        setUser(data);
      } else
        setLoginError(
          type === TYPE.GOOGLE
            ? "Email is already in use "
            : "Email or password is incorrect"
        );
    } catch (err) {
      setLoginError("Undetected error");
      return;
    }
  }
  function userLogout() {
    setUser(null);
    localStorage.clear();
  }

  function setUserState(e) {
    setUser(e);
  }

  return (
    <UserContext.Provider
      value={{
        user,
        response,
        userLogin,
        userLogout,
        userSignup,
        signupError,
        loginError,
        setUserState,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
