import React, { PureComponent, Suspense, useState, useEffect } from 'react';
import { Redirect, Switch, Route, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import Spinner from '../components/Spinner/Spinner';
import RequireAuth from '../components/RequireAuth';
import RequireLogout from '../components/RequireLogout';
import RequireLogin from '../components/RequireLogin';

import Login from './Login/Login.lazy';
import Users from './Users/Users.lazy';
import UsersForm from './Users/UsersForm/UsersForm.lazy';
import Roles from './Roles/Roles.lazy';
import Home from './Home/Home.lazy';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import Footer from '../components/Footer/Footer';
import axios from 'axios';

const axiosConfig = {
  withCredentials: true,
  timeout: 10000
}

const pagesByRoleUrl = `${process.env.REACT_APP_BACKEND_HOST}/API/pagerole/getPageByRole`;
const subPagesByRoleUrl = `${process.env.REACT_APP_BACKEND_HOST}/API/subpage/getSubPageByRole`;

// TODO: pass in data pages and subpages
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

async function fetchPagesData() {

  return new Promise(async (resolve, reject) => {
    try {
      const resp = await axios.get(
        pagesByRoleUrl,
        axiosConfig
      );

      if (resp.data.status === true) {

        resolve(resp.data.data);
      } else {
        // if no sidebar data is found
        resolve(false);
      }

    } catch (error) {
      console.log(error)
      resolve(false);
    }
  });
}

async function fetchSubPagesData() {

  return new Promise(async (resolve, reject) => {
    try {
      const resp = await axios.get(
        subPagesByRoleUrl,
        axiosConfig
      );

      if (resp.data.status === true) {

        resolve(resp.data.data);
      } else {
        // if no sidebar data is found
        resolve(false);
      }

    } catch (error) {
      console.log(error)
      resolve(false);
    }
  });
}

function matchComponentName(name) {
  switch (name) {
    case "Users": return Users;
    case "UsersForm": return UsersForm;
    case "Roles": return Roles;
    // case "RolesForm": return RolesForm;


    default: return undefined;
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

// TODO: make path connected to the database
function DefaultContainer() {
  // let loginMiddleware = compose(RequireLogout, PlainPageLayout);
  // let otherMiddleware = compose(RequireAuth, FullPageLayout);

  const [pagesData, setPagesData] = useState([]);
  const [subPagesData, setSubPagesData] = useState([]);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    let isMounted = true;

    (async function () {
      let pagesData = await fetchPagesData();
      let subPagesData = await fetchSubPagesData();

      if (isMounted) {

        setPagesData(pagesData);
        setSubPagesData(subPagesData);
      }

    })()
    return () => { isMounted = false };

  }, []);

  return (
    <>
      <Sidebar />
      <div className="container-fluid page-body-wrapper">
        <Navbar />
        <div className="main-panel">
          <div className="content-wrapper">

            <Switch>
              <Route path="/home" component={RequireAuth(Home)} />
              {(pagesData.length) && pagesData.map(item =>
                <Route exact path={`${item.PagePath}`} key={`${item.PageRolesID}`} component={RequireAuth(matchComponentName(item.PageName))} />
              )}
              {(subPagesData.length) && subPagesData.map(item =>
                <Route path={`${item.SubPagePath}`} key={`${item.PageRolesID}`} component={RequireAuth(matchComponentName(item.SubPageName), item.PagePath)} />
              )}
              <Route>
                <p>ERROR 404</p>
              </Route>
            </Switch>

          </div>
          <Footer />
        </div>
      </div>
    </>

  );
}
export default withRouter(AppRoutes);