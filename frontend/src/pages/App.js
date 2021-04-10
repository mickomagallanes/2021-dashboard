import React from 'react';
import './App.scss';
import { Redirect, withRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { connect } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from "../store";

const mapStateToProps = (state) => {
  return { theme: state.themeReducer.theme };
};


class App extends React.Component {


  render() {

    return (
      <PersistGate loading={null} persistor={persistor}>
        <div className={`container-scroller ${this.props.theme}`} id="main-wrapper">
          <AppRoutes />
        </div>
      </PersistGate>
    );

  }
}


export default connect(mapStateToProps)(withRouter(App));
