import React, { createContext, useState } from "react";

export const UserContext = createContext({ user: null});

export const UserProvider = (props) => {
const [ user, setUser ] = useState(null)

function userLogin (type, email, password) {
// send to server http request with user details, handle it for case google
// and case normal, then send the results back to the context API
setUser({email, type})
}

function userLogout (){
setUser(null)
}



  return (
      <UserContext.Provider value={{ user, userLogin, userLogout }}>
        {props.children}
      </UserContext.Provider>
    );
}