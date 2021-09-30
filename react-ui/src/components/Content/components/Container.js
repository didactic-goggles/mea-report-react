import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import Users from './Users/Users';
import UserDetails from './Users/UserDetails';
import Payments from './Payments/Payments';
import Services from './Services/Services';
import ServiceDetails from './Services/ServiceDetails';
import Categories from './Categories/Categories';
import CategoryDetails from './Categories/CategoryDetails';
import Upload from './System/Upload';
import Files from './System/Files';

function Container() {
  console.log('Rendering => Container');
  return (
    <div className="app-main__outer">
      <div className="app-main__inner">
        <Switch>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/user/:userId">
            <UserDetails />
          </Route>
          <Route path="/payments">
            <Payments />
          </Route>
          <Route path="/services">
            <Services />
          </Route>
          <Route path="/service/:serviceId">
            <ServiceDetails />
          </Route>
          <Route path="/categories/">
            <Categories />
          </Route>
          <Route path="/category/:categoryId">
            <CategoryDetails />
          </Route>
          <Route path="/upload">
            <Upload />
          </Route>
          <Route path="/files">
            <Files />
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
