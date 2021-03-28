import React, { PureComponent, Suspense } from 'react';
import { Redirect, Switch, Route, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import Spinner from '../components/Spinner/Spinner';
import RequireAuth from '../components/RequireAuth';
import RequireLogout from '../components/RequireLogout';
import RequireLogin from '../components/RequireLogin';

import Login from './Login/Login.lazy';
import Users from './Users/Users.lazy';
import UsersForm from './Users/UsersForm/UsersForm.lazy';
import Home from './Home/Home.lazy';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import Footer from '../components/Footer/Footer';

const LoggedInContainer = RequireLogin(DefaultContainer);

class AppRoutes extends PureComponent {
  constructor() {
    super();
  }

  render() {

    return (

      <Suspense fallback={<Spinner />}>

        <Switch>

          <Route path="/login" component={RequireLogout(LoginContainer)} />

          <Route component={LoggedInContainer} />

        </Switch>

      </Suspense>

    );
  }
}

function LoginContainer() {

  return (

    <div className="container-fluid page-body-wrapper full-page-wrapper">
      <div className="main-panel">
        <div className="content-wrapper">
          <Login />
        </div>
      </div>
    </div>

  );
}


function DefaultContainer() {
  // let loginMiddleware = compose(RequireLogout, PlainPageLayout);
  // let otherMiddleware = compose(RequireAuth, FullPageLayout);
  return (
    <>
      <Sidebar />
      <div className="container-fluid page-body-wrapper">
        <Navbar />
        <div className="main-panel">
          <div className="content-wrapper">

            <Switch>
              <Route path="/home" component={RequireAuth(Home)} />
              <Route exact path="/users" component={RequireAuth(Users)} />
              <Route path="/users/form/:id" component={RequireAuth(UsersForm, "/users")} />
              <Redirect to="/home" />
            </Switch>

          </div>
          <Footer />
        </div>
      </div>
    </>

  );
}
export default withRouter(AppRoutes);