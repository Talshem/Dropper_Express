import React from 'react'
import './HomePage.css'
import { Login, SignUp } from './'
import { Route, Switch} from "react-router-dom";
   
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
            <img style={{flex:'7'}} width="100%" height="100%" src='https://media-public.canva.com/9wSUc/MAEJLA9wSUc/1/s3.jpg' alt="logo"/>
        </div>
    )
}
