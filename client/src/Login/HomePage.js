import React from 'react'
import './HomePage.css'
import { Login, SignUp } from './'
import { Route, Switch} from "react-router-dom";
import { CompareTab } from '../Components';

   
export default function HomePage(props) {

    return (
        <div className="container">
            <div className="login">
            <Switch>
          <Route path="/signUp">
              <SignUp/>
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
            </div>
            <div className="logo">
<h1 className="logoTitle">
    Dropper <br/> &nbsp;&nbsp;&nbsp; Express.
    
    </h1>
            </div>
        </div>
    )
}
