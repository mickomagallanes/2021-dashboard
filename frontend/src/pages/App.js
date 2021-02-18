import React from 'react';
import './App.scss';
import { Redirect, withRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';

class App extends React.Component {


  render() {

    return (
      <AppRoutes />
    );

  }
}


export default withRouter(App);
