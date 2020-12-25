import React from "react";
import { HomePage } from "./Login";
import { Switch, Route } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./Providers/UserProvider";
import { Application } from "./Components";
import "./App.css";

function App() {
  const { user, response } = useContext(UserContext);


  return (
    <div>
      {response && (
        <>
          {!user ? (
            <Switch>
              <Route path="/">
                <HomePage />
              </Route>
            </Switch>
          ) : (
            <Route path="/">
              <Application />
            </Route>
          )}
        </>
      )}
    </div>
  );
}

export default App;
