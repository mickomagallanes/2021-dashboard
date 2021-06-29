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
import RolesForm from './Roles/RolesForm/RolesForm.lazy';
import RouteRolesForm from './Roles/RouteRolesForm/RouteRolesForm.lazy';
import PageRolesForm from './Roles/PageRolesForm/PageRolesForm.lazy';
import ParentMenus from './ParentMenus/ParentMenus.lazy';
import ParentMenusForm from './ParentMenus/ParentMenusForm/ParentMenusForm.lazy';
import Menus from './Menus/Menus.lazy';
import Home from './Home/Home.lazy';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import Footer from '../components/Footer/Footer';
import axios from 'axios';

const axiosConfig = {
  withCredentials: true,
  timeout: 10000
}

const pagesByRoleUrl = `${process.env.REACT_APP_BACKEND_HOST}/API/page/getPagesBySession`;
const subPagesByRoleUrl = `${process.env.REACT_APP_BACKEND_HOST}/API/subpage/getSubPagesBySession`;

const MainComponent = RequireLogin(DefaultContainer);
const LoginComponent = RequireLogout(LoginContainer);

class AppRoutes extends PureComponent {
  constructor() {
    super();

  }

  render() {


    return (

      <Suspense fallback={<Spinner />}>

        <Switch>

          <Route path="/login" component={LoginComponent} />

          <Route component={MainComponent} />

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

  const [pagesData, setPagesData] = useState([]);
  const [subPagesData, setSubPagesData] = useState([]);
  const [PagesElements, setPagesElements] = useState([]);
  const [SubPagesElements, setSubPagesElements] = useState([]);

  // Similar to componentDidMount:
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
  }, []);  // passing an empty array as second argument triggers the callback in 
  // useEffect only after the initial render thus replicating `componentDidMount` lifecycle behaviour


  // similar to componentDidUpdate
  useEffect(() => {

    if (pagesData.length) {
      setPagesElements(pagesData.map(item =>
        <Route exact path={`${item.PagePath}`} key={`${item.PageID}`} component={RequireAuth(matchComponentName(item.PageName))} />
      ));
    }

  }, [pagesData]);

  useEffect(() => {

    if (subPagesData.length) {

      setSubPagesElements(subPagesData.map(item =>
        <Route path={`${item.SubPagePath}`} key={`${item.SubPageID}`} component={RequireAuth(matchComponentName(item.SubPageName), item.PagePath)} />
      ));
    }
  }, [subPagesData]);

  return (

    <>
      <Sidebar />
      <div className="container-fluid page-body-wrapper">
        <Navbar />
        <div className="main-panel">
          <div className="content-wrapper">

            <Switch>

              {PagesElements}
              {SubPagesElements}
              <Route exact path="/" render={() => (<Redirect to="/home" />)} />
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

async function fetchPagesData() {


  try {
    const resp = await axios.get(
      pagesByRoleUrl,
      axiosConfig
    );

    if (resp.data.status === true) {
      return resp.data.data;

    } else {
      // if no sidebar data is found
      return false;

    }

  } catch (error) {
    console.log(error)
    return false;

  }

}

async function fetchSubPagesData() {


  try {
    const resp = await axios.get(
      subPagesByRoleUrl,
      axiosConfig
    );

    if (resp.data.status === true) {

      return resp.data.data;
    } else {
      // if no sidebar data is found
      return false;
    }

  } catch (error) {
    console.log(error)
    return false;
  }

}

function matchComponentName(name) {

  switch (name) {
    case "Home": return Home;
    case "Users": return Users;
    case "UsersForm": return UsersForm;
    case "Roles": return Roles;
    case "RolesForm": return RolesForm;
    case "RouteRolesForm": return RouteRolesForm;
    case "PageRolesForm": return PageRolesForm;
    case "ParentMenus": return ParentMenus;
    case "ParentMenusForm": return ParentMenusForm;
    case "Menus": return Menus;

    default: return undefined;
  }

}


export default withRouter(AppRoutes);