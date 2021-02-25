import React from 'react';

import './Login.css';

import { Form, Alert } from 'react-bootstrap';
import logo from "../../assets/images/logo.svg";
import axios from 'axios';
import { Formik } from 'formik';
import * as yup from 'yup';
import { retryRequest } from "../../helpers/utils";

const schema = yup.object().shape({
  username: yup.string().max(45, 'Must be 45 characters or less').required('Required'),
  password: yup.string().required('Required')
});

const loginURL = "http://localhost:3000/API/user/login";

class Login extends React.Component {

  constructor() {
    super();
    this.state = {
      username: undefined,
      password: undefined,
      isLoggedIn: false,
      errorMsg: false
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
                    username: "",
                    password: ""
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
        // LESSON: You can use the 'window' object from the browser as long as 
        // you're not doing server-side rendering, but it reloads the page
        window.location = resp.data.redirect;

      } else {
        this.setState({ errorMsg: resp.data.msg });
      }

    } catch (error) {
      // retryRequest(this.signIn);
    }

  }
}

export default Login;
