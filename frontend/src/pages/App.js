import React from 'react';
import './App.scss';
import { Redirect, withRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import Footer from '../components/Footer/Footer';

class App extends React.Component {


  render() {

    return (
      <AppRoutes />
    );

  }
}


export default withRouter(App);
