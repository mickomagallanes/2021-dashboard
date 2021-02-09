import React, { Component, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import Spinner from '../components/Spinner/Spinner';

import Login from './Login/Login.lazy';


class AppRoutes extends Component {
  render() {
    return (
      <Suspense fallback={<Spinner />}>
        <Switch>
          {/* <Route exact path="/home" component={ Dashboard } /> */}

          <Route path="/login" component={Login} />

          {/* <Redirect to="/home" /> */}
        </Switch>
      </Suspense>
    );
  }
}

export default AppRoutes;