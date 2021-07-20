import React from 'react';

import './Login.css';

import { Alert } from 'react-bootstrap';
import logo from "../../assets/images/logo.svg";
import axios from 'axios';
import { Formik, Form, Field } from "formik";
import TextFormField from '../../components/FormFields/TextFormField/TextFormField';
import * as yup from 'yup';
import { axiosConfig } from "../../helpers/utils";
import { withRouter } from 'react-router-dom';
import { profileChange } from '../../actions';
import { connect } from 'react-redux';
import { List } from 'immutable';

const mapStateToProps = (state) => {
  return { userName: state.profileReducer.userName, userImg: state.profileReducer.userImg };
};

const mapDispatchToProps = (dispatch) => {
  return ({
    changeProfile: (userName, userImg) => { dispatch(profileChange(userName, userImg)) }
  })
}

const schema = yup.object().shape({
  username: yup.string().max(45, 'Must be 45 characters or less').required('Required'),
  password: yup.string().required('Required')
});

const loginURL = `${process.env.REACT_APP_BACKEND_HOST}/API/user/login`;

class Login extends React.PureComponent {

  constructor() {
    super();
    this.state = {
      errorMsg: List([])
    }
  }

  signIn = async (fields) => {

    let param = fields;

    try {
      const resp = await axios.post(
        loginURL,
        param,
        axiosConfig
      );

      let { data } = resp;

      // save user data because it is returned after login
      if (data.status === true) {
        this.props.changeProfile(data.data.uname, data.data.uimage);

        this.props.history.push('/home');

      } else {
        this.setErrorMsg(0, `${data.msg}`);
      }

    } catch (error) {
      this.setErrorMsg(0, `${error}`);
    }

  }

  clearErrorMsg() {

    if (this.state.errorMsg.size) {
      const errorArr = this.state.errorMsg.clear();
      this.setState({ errorMsg: errorArr });
    }
  }

  setErrorMsg(index, errorVal) {
    const errorArr = this.state.errorMsg.set(index, errorVal);

    this.setState({ errorMsg: errorArr });
  }

  pushErrorMsg(errorVal) {
    const errorArr = this.state.errorMsg.push(errorVal);
    this.setState({ errorMsg: errorArr });
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
                  initialValues={{ username: "", password: "" }}
                  onSubmit={this.signIn}
                >
                  {() => (
                    <Form>
                      {this.state.errorMsg.map((err) =>
                        <Alert
                          className="p-1"
                          variant="danger"
                          show={err}
                          transition={false}
                          key={err}
                        >
                          {err}
                        </Alert>
                      )}
                      <div>
                        <Field
                          type="text"
                          name="username"
                          placeholder="Username"
                          component={TextFormField}
                        />
                      </div>
                      <div>
                        <Field
                          type="password"
                          placeholder="Password"
                          name="password"
                          component={TextFormField} />
                      </div>

                      <div className="mt-3">
                        <button type="submit" className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn">SIGN IN</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
