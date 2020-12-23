import React, { useEffect, useState } from "react";
import { HomePage } from "./Login";
import { Switch, Route } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./Providers/UserProvider";
import { Application } from "./Components";
import network from "./Helpers/Network";
import "./App.css";

function App() {
  const { user, setUserState } = useContext(UserContext);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await network.get("/auto");
      if (data) setUserState(data);
      setResponse(true);
    };
    fetchData();
  }, []);

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
