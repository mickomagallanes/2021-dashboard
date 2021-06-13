import React from 'react';

import './Login.css';

import { Form, Alert } from 'react-bootstrap';
import logo from "../../assets/images/logo.svg";
import axios from 'axios';
import { Formik } from 'formik';
import * as yup from 'yup';
import { retryRequest } from "../../helpers/utils";
import { withRouter } from 'react-router-dom';
import { profileChange } from '../../actions';
import { connect } from 'react-redux';
import { sidebarChange } from '../../actions';

const axiosConfig = {
  withCredentials: true,
  timeout: 10000
}

const menusByRoleUrl = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/getMenusByRole`;

const mapStateToProps = (state) => {
  return { userName: state.profileReducer.userName, userImg: state.profileReducer.userImg };
};

const mapDispatchToProps = (dispatch) => {
  return ({
    changeProfile: (userName, userImg) => { dispatch(profileChange(userName, userImg)) },
    changeSidebar: (sidebarData) => { dispatch(sidebarChange(sidebarData)) }
  })
}

const schema = yup.object().shape({
  username: yup.string().max(45, 'Must be 45 characters or less').required('Required'),
  password: yup.string().required('Required')
});

const loginURL = `${process.env.REACT_APP_BACKEND_HOST}/API/user/login`;

async function fetchSidebarData() {


  try {
    const resp = await axios.get(
      menusByRoleUrl,
      axiosConfig
    );

    if (resp.data.status === true) {
      return resp.data.data

    } else {
      // if no sidebar data is found
      return false;
    }

  } catch (error) {
    console.log(error)
    return false;
  }

}
class Login extends React.Component {

  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      errorMsg: false
    }
  }

  signIn = async () => {
    let axiosConfig = {
      withCredentials: true,
      timeout: 10000
    };
    let param = { "username": this.state.username, "password": this.state.password };

    try {
      const resp = await axios.post(
        loginURL,
        param,
        axiosConfig
      );

      if (resp.data.status === true) {
        let { data } = resp;
        this.props.changeProfile(data.data.uname, data.data.uimage);

        let sidebarData = await fetchSidebarData();

        if (sidebarData != false) {
          // TODO: filter sidebar data based on parentmenu
          this.props.changeSidebar(sidebarData);
          this.props.history.push('/home');

        } else {
          this.setState({ errorMsg: "Failed fetching sidebar data" });
        }

      } else {

      }

    } catch (error) {
      this.setState({ errorMsg: `${error}` });
    }

  }

  render() {

    return (
      <div>
        <div className="d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="card text-left py-5 px-4 px-sm-5">
                <div className="brand-logo">
                  <img src={logo} alt="logo" />
                </div>
                <h4>Hello! let's get started</h4>
                <h6 className="font-weight-light">Sign in to continue.</h6>
                <Formik
                  validationSchema={schema}
                  initialValues={{
                    username: this.state.username,
                    password: this.state.password
                  }}
                >
                  {props => (
                    <Form className="pt-3" onKeyPress={e => e.key === 'Enter' && this.signIn()}>
                      <Alert
                        className="p-1"
                        variant="danger"
                        show={this.state.errorMsg}
                        transition={false}
                      >
                        {this.state.errorMsg}
                      </Alert>
                      <Form.Group>
                        <Form.Control
                          value={this.state.username}
                          type="text"
                          name="username"
                          placeholder="Username"
                          size="lg"
                          className="h-auto"
                          autoComplete="username"
                          onBlur={props.handleBlur}
                          isInvalid={(props.errors.username && props.touched.username) || this.state.errorMsg}
                          onChange={(e) => { this.setState({ username: e.target.value, errorMsg: false }); props.handleChange(e) }} />
                        <Form.Control.Feedback type="invalid">
                          {this.state.errorMsg ? null : props.errors.username}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group>
                        <Form.Control
                          value={this.state.password}
                          type="password"
                          name="password"
                          placeholder="Password"
                          size="lg"
                          className="h-auto"
                          autoComplete="current-password"
                          onBlur={props.handleBlur}
                          isInvalid={(props.errors.password && props.touched.password) || this.state.errorMsg}
                          onChange={(e) => { this.setState({ password: e.target.value, errorMsg: false }); props.handleChange(e) }} />
                        <Form.Control.Feedback type="invalid">
                          {this.state.errorMsg ? null : props.errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <div className="mt-3">
                        <button type="button" className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                          onClick={this.signIn}>SIGN IN</button>

                      </div>

                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }


}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));;
