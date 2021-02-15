import React, { Component, Suspense } from 'react';
import { Redirect, Switch, Route, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import Spinner from '../components/Spinner/Spinner';
import RequireAuth from '../components/RequireAuth';
import RequireLogout from '../components/RequireLogout';

import Login from './Login/Login.lazy';
import User from './User/User.lazy';
import Home from './Home/Home.lazy';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import Footer from '../components/Footer/Footer';

class AppRoutes extends Component {
  constructor() {
    super();
  }

  loginContainer() {
    return (
      <div className="container-scroller">
        <div className="container-fluid page-body-wrapper full-page-wrapper">
          <div className="main-panel">
            <div className="content-wrapper">
              <Login />
            </div>
          </div>
        </div>
      </div>
    );
  }

  defaultContainer() {
    return (
      <div className="container-scroller">
        <Sidebar />
        <div className="container-fluid page-body-wrapper">
          <Navbar />
          <div className="main-panel">
            <div className="content-wrapper">
              <Switch>
                <Route path="/home" component={Home} />
                <Route path="/user" component={User} />
                <Redirect to="/home" />
              </Switch>
            </div>
            <Footer />
          </div>
        </div>
      </div>


    )
  }

  render() {

    // let loginMiddleware = compose(RequireLogout, PlainPageLayout);
    // let otherMiddleware = compose(RequireAuth, FullPageLayout);
    return (
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route path="/login" component={RequireLogout(this.loginContainer)} />
          <Route component={RequireAuth(this.defaultContainer)} />

        </Switch>
      </Suspense>
    );
  }
}


export default withRouter(AppRoutes);