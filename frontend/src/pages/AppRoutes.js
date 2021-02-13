import React, { Component, Suspense } from 'react';
import { Redirect, Switch, Route, withRouter } from 'react-router-dom';

import Spinner from '../components/Spinner/Spinner';
import RequireAuth from '../components/RequireAuth';
import RequireLogout from '../components/RequireLogout';
import Login from './Login/Login.lazy';
import User from './User/User.lazy';
import Home from './Home/Home.lazy';

class AppRoutes extends Component {
  render() {

    return (
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route exact path="/home" component={RequireAuth(Home)} />

          <Route path="/login" component={RequireLogout(Login)} />
          <Route path="/user" component={RequireAuth(User)} />
          <Redirect to="/home" />
        </Switch>
      </Suspense>
    );
  }
}

export default withRouter(AppRoutes);