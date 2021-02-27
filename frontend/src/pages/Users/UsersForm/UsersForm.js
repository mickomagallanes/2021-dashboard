import React from 'react';
import './UsersForm.css';
import axios from 'axios';
import { retryRequest } from "../../../helpers/utils";
import { Form, Alert } from 'react-bootstrap';
import Select from '../../../components/Select/Select';
import { Formik } from 'formik';
import * as yup from 'yup';
import Spinner from '../../../components/Spinner/Spinner';

const schema = yup.object().shape({
  username: yup.string().max(45, 'Must be 45 characters or less').required('Required'),
  password: yup.string().required('Required')
});

const userURL = "http://localhost:3000/API/user/get/";
const roleURL = "http://localhost:3000/API/role/get/all";
const submitFormURL = "http://localhost:3000/API/user/insert";

class UsersForm extends React.Component {
  // TODO: make add and edit functionality

  constructor() {
    super();
    this.state = {
      userData: [],
      roleData: [],
      selectedRole: "",
      username: "",
      password: "",
      errorMsg: false
    }

  }

  componentDidMount() {

    this.fetchUserData();
    this.fetchRoleData();
  }

  fetchUserData = async () => {
    const axiosConfig = {
      withCredentials: true,
      timeout: 10000
    }

    try {
      const resp = await axios.get(
        userURL + this.props.match.params.id,
        axiosConfig
      );

      if (resp.data.status === true) {

        this.setState({
          userData: resp.data.data,
          username: resp.data.data.uname,
          selectedRole: resp.data.data.rid
        });
      }

    } catch (error) {
      // TODO: if no user is found, like param as 'add', redirect back to history or user page
      retryRequest(this.fetchUserData);
    }
  }

  fetchRoleData = async () => {
    const axiosConfig = {
      withCredentials: true,
      timeout: 10000
    }

    try {
      const resp = await axios.get(
        roleURL,
        axiosConfig
      );

      if (resp.data.status === true) {
        this.setState({ roleData: resp.data.data });
      }

    } catch (error) {
      retryRequest(this.fetchRoleData);
    }
  }

  submitForm = async () => {
    const axiosConfig = {
      withCredentials: true,
      timeout: 10000
    }

    let param = {
      "username": this.state.username,
      "password": this.state.password,
      "roleid": this.state.selectedRole,
    }
    try {
      const resp = await axios.post(
        submitFormURL,
        param,
        axiosConfig
      );

      if (resp.data.status === true) {
        this.setState({ roleData: resp.data.data });
      } else {
        this.setState({ errorMsg: resp.data.msg });
      }

    } catch (error) {
      retryRequest(this.fetchUserData);
    }

  }

  // TODO: make animation transition on routing using Framer Motion
  // and use Unit Testing with Jest
  render() {
    if (!!this.state.userData.length && !!this.state.roleData.length) {
      return (<Spinner />)
    } else {
      return (
        <div className="d-flex align-items-center px-0">
          <div className="row w-100 mx-0">
            <div className="col-12 grid-margin stretch-card">
              <div className="card px-4 px-sm-5">
                <div className="card-body">
                  <h4 className="card-title">User information</h4>
                  <Formik
                    validationSchema={schema}
                    initialValues={{
                      username: "",
                      password: ""
                    }}
                  >
                    {props => (
                      <Form className="forms-sample" onKeyPress={e => e.key === 'Enter' && this.submitForm()}>
                        <Alert
                          className="p-1"
                          variant="danger"
                          show={this.state.errorMsg}
                          transition={false}
                        >
                          {this.state.errorMsg}
                        </Alert>

                        <Form.Group>
                          <label htmlFor="username">Username</label>
                          <Form.Control
                            type="text"
                            value={this.state.username}
                            autoComplete="username"
                            className="form-control"
                            id="username"
                            placeholder="Username"
                            isInvalid={(props.errors.username && props.touched.username) || this.state.errorMsg}
                            onChange={(e) => { this.setState({ username: e.target.value, errorMsg: false }); props.handleChange(e) }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {this.state.errorMsg ? null : props.errors.username}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                          <label htmlFor="passwordId">Create New Password</label>
                          <Form.Control
                            type="password"
                            value={this.state.password}
                            autoComplete="current-password"
                            className="form-control"
                            id="passwordId"
                            placeholder="Password"
                            isInvalid={(props.errors.password && props.touched.password) || this.state.errorMsg}
                            onChange={(e) => { this.setState({ password: e.target.value, errorMsg: false }); props.handleChange(e) }}
                          />
                        </Form.Group>

                        <label htmlFor="roleSelect">Role</label>
                        <Select
                          id="roleSelect"
                          value={this.state.selectedRole}
                          data={this.state.roleData}
                          idKey="RoleID"
                          valueKey="RoleName"
                          onChange={(e) => { this.setState({ selectedRole: e.target.value, errorMsg: false }); props.handleChange(e) }}
                        ></Select>

                        <div className="mt-4">
                          <button type="submit" className="btn btn-primary mr-2" onClick={this.submitForm}>Submit</button>
                          {/* <button className="btn btn-dark">Cancel</button> */}
                        </div>

                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>


        // this.state.data && this.state.data.map(x => <p key={x.id}>{x.rname} | {x.uname}</p>)
      );
    }
  }

}

export default UsersForm;
