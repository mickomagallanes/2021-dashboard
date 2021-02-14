import React from 'react';

import './Login.css';

import { Form } from 'react-bootstrap';
import logo from "../../assets/images/logo.svg";
import axios from 'axios';
import { retryRequest } from "../../helpers/utils";

const loginURL = "http://localhost:3000/API/user/login";

class Login extends React.Component {


  constructor() {
    super();
    this.state = {
      username: undefined,
      password: undefined,
      isLoggedIn: false
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
                <Form className="pt-3" onKeyPress={e => e.key === 'Enter' && this.signIn()}>
                  <Form.Group className="d-flex search-field">
                    <Form.Control type="text"
                      placeholder="Username"
                      size="lg"
                      className="h-auto"
                      autoComplete="username"
                      onChange={(e) => this.setState({ username: e.target.value })} />
                  </Form.Group>
                  <Form.Group className="d-flex search-field">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      size="lg"
                      className="h-auto"
                      autoComplete="current-password"
                      onChange={(e) => this.setState({ password: e.target.value })} />
                  </Form.Group>
                  <div className="mt-3">
                    <button type="button" className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                      onClick={this.signIn}>SIGN IN</button>

                  </div>

                </Form>
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
        // you're not doing server-side rendering
        window.location = resp.data.redirect;

      }

    } catch (error) {
      retryRequest(this.signIn);
    }

  }
}

export default Login;
