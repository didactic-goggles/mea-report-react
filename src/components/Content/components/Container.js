import React from "react";
import {
  Switch,
  Route,
} from "react-router-dom";

import Home from "./Home";
import Users from "./Users";
import UserDetails from "./UserDetails";

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
              
              <Route path="/">
                <Home />
              </Route>
            </Switch>
        
      </div>
    </div>
  );
}

export default Container;
