import React from 'react';
import './App.scss';
import { Redirect, withRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return { theme: state.themeReducer.theme };
};


class App extends React.Component {


  render() {

    return (
      <div className={`container-scroller ${this.props.theme}`} id="main-wrapper">
        <AppRoutes />
      </div>
    );

  }
}


export default connect(mapStateToProps)(withRouter(App));
