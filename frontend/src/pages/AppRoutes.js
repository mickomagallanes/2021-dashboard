import React, { Component, Suspense } from 'react';
import { Redirect, Switch, Route, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import Spinner from '../components/Spinner/Spinner';
import RequireAuth from '../components/RequireAuth';
import RequireLogout from '../components/RequireLogout';
import FullPageLayout from '../components/FullPageLayout';
import PlainPageLayout from '../components/PlainPageLayout';
import Login from './Login/Login.lazy';
import User from './User/User.lazy';
import Home from './Home/Home.lazy';

class AppRoutes extends Component {
  render() {

    let loginMiddleware = compose(RequireLogout, PlainPageLayout);
    let otherMiddleware = compose(RequireAuth, FullPageLayout);
    return (
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route exact path="/home" component={otherMiddleware(Home)} />

          <Route path="/login" component={loginMiddleware(Login)} />
          <Route path="/user" component={otherMiddleware(User)} />
          <Redirect to="/home" />
        </Switch>
      </Suspense>
    );
  }
}

export default withRouter(AppRoutes);