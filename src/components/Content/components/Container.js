import React from "react";
import {
  Switch,
  Route,
} from "react-router-dom";

import Home from "./Home";
import Users from "./Users/Users";
import Payments from "./Payments/Payments";
import Services from './Services/Services';
function Container() {
    console.log('Rendering => Container');
  return (
    <div class="app-main__outer">
      <div class="app-main__inner">
        
            <Switch>
            {/* <Route path="/users/:user">
                <UserDetails />
              </Route> */}
              <Route path="/users">
                <Users />
              </Route>
              <Route path="/payments">
                <Payments />
              </Route>
              <Route path="/services">
                <Services />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
        
      </div>
    </div>
  );
}

export default Container;
