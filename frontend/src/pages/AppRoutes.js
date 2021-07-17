import React, { Component, Suspense, useState, useEffect } from 'react';
import { Redirect, Switch, Route, withRouter } from 'react-router-dom';
import Spinner from '../components/Spinner/Spinner';
import withPriv from '../components/withPriv';
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
import { sidebarChange } from '../actions';
import { useDispatch } from 'react-redux';
import useFetch from '../components/useFetch';
import MenusForm from './Menus/MenusForm/MenusForm';
import Pages from './Pages/Pages';
import PagesForm from './Pages/PagesForm/PagesForm';
import SubPages from './SubPages/SubPages';
import SubPagesForm from './SubPages/SubPagesForm/SubPagesForm';
import PagesFormBulk from './Pages/PagesFormBulk/PagesFormBulk';

const pagesByRoleUrl = `${process.env.REACT_APP_BACKEND_HOST}/API/page/get/by/session`;
const subPagesByRoleUrl = `${process.env.REACT_APP_BACKEND_HOST}/API/subpage/get/by/session`;
const menusByRoleUrl = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/get/by/role`;

const MainComponent = RequireLogin(DefaultContainer);
const LoginComponent = RequireLogout(LoginContainer);

class AppRoutes extends Component {

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

  const [PagesElements, setPagesElements] = useState(null);
  const [SubPagesElements, setSubPagesElements] = useState(null);

  const [pagesData] = useFetch(pagesByRoleUrl);
  const [subPagesData] = useFetch(subPagesByRoleUrl);
  const [sidebarData] = useFetch(menusByRoleUrl);

  const dispatch = useDispatch();

  // Similar to componentDidMount:
  useEffect(() => {
    if (sidebarData) {
      dispatch(sidebarChange(sidebarData.data));
    }

  }, [dispatch, sidebarData]);  // passing an empty array as second argument triggers the callback in 
  // useEffect only after the initial render thus replicating `componentDidMount` lifecycle behaviour


  // similar to componentDidUpdate
  useEffect(() => {

    if (pagesData) {
      setPagesElements(pagesData.data.map(item =>
        <Route exact path={`${item.PagePath}`} key={`${item.PageID}`} component={withPriv(matchComponentName(item.PageName))} />
      ));
    }

  }, [pagesData]);

  useEffect(() => {

    if (subPagesData) {

      setSubPagesElements(subPagesData.data.map(item =>
        <Route path={`${item.SubPagePath}`} key={`${item.SubPageID}`} component={withPriv(matchComponentName(item.SubPageName), item.PagePath)} />
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
    case "MenusForm": return MenusForm;
    case "Pages": return Pages;
    case "PagesForm": return PagesForm;
    case "PagesFormBulk": return PagesFormBulk;
    case "SubPages": return SubPages;
    case "SubPagesForm": return SubPagesForm;

    default: return undefined;
  }

}


export default withRouter(AppRoutes);