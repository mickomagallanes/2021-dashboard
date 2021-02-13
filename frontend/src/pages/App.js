import React from 'react';
import './App.scss';
import { Redirect, withRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import Footer from '../components/Footer/Footer';

class App extends React.Component {


  render() {
    let urlPath = this.props.location.pathname;
    let navbarComponent = urlPath !== "/login" ? <Navbar /> : '';
    let sidebarComponent = urlPath !== "/login" ? <Sidebar /> : '';
    let footerComponent = urlPath !== "/login" ? <Footer /> : '';

    return (
      <div className="container-scroller">
        { sidebarComponent}
        <div className="container-fluid page-body-wrapper">
          {navbarComponent}
          <div className="main-panel">
            <div className="content-wrapper">
              <AppRoutes />
            </div>
            {footerComponent}
          </div>
        </div>
      </div>
    );

  }
}


export default withRouter(App);
