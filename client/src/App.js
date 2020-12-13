import logo from './logo.svg';
import './App.css';
import { HomePage } from './Login'
import { Switch, Route } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./Providers/UserProvider";
import { Application } from './Components'


function App() {
 const { response, user, userLogout} = useContext(UserContext);


  return (
    <div>
{!user ? 
<Switch>
<Route path="/">
    <HomePage/>
</Route>
</Switch>
:
<Application/>
}
    </div>
  );
}

export default App;
