import React from 'react';
import './UsersForm.css';
import axios from 'axios';
import { retryRequest } from "../../../helpers/utils";
import { Form, Alert } from 'react-bootstrap';
import Select from '../../../components/Select/Select';
import { Formik } from 'formik';
import * as yup from 'yup';
import Spinner from '../../../components/Spinner/Spinner';
import { Link } from 'react-router-dom';

const userURL = "http://localhost:3000/API/user/get/";
const roleURL = "http://localhost:3000/API/role/get/all";
const addUserURL = "http://localhost:3000/API/user/insert";
const editUserURL = "http://localhost:3000/API/user/modify";
const uploadImgUserURL = "http://localhost:3000/API/user/upload/img";

const axiosConfig = {
  withCredentials: true,
  timeout: 10000
}

function equalTo(ref, msg) {
  return this.test({
    name: 'equalTo',
    exclusive: false,
    message: msg,
    params: {
      reference: ref.path
    },
    test: function (value) {
      return value === this.resolve(ref)
    }
  })
};

yup.addMethod(yup.string, 'equalTo', equalTo);

class UsersForm extends React.Component {
  // TODO: make add and edit functionality

  constructor(props) {
    super();
    this.state = {
      userData: [],
      roleData: [],
      selectedRole: "",
      username: "",
      password: "",
      confirmPassword: "",
      errorMsg: false,
      imgSrc: "", // base 64 user image
      imgFile: "", // pure user image file
      // just to not connect the initialValues to main state username to prevent forced reinitialize, used after backend fetch userdata
      formikUsername: ""
    }

    this.urlParam = props.match.params.id;

    // send back to users page when Privilege is Read and accessing add mode
    if (this.isAddMode() && props.priv === "R") {
      props.history.push('/users');
    }

    // dont require password field when edit mode
    if (!this.isAddMode()) {
      this.schema = yup.object().shape({
        username: yup.string().max(45, 'Must be 45 characters or less').required('Required'),
        password: yup.string().min(12, 'Must be longer than 12'),
        confirmPassword: yup.string()
      });
    } else {
      this.schema = yup.object().shape({
        username: yup.string().max(45, 'Must be 45 characters or less').required('Required'),
        password: yup.string().min(12, 'Must be longer than 12').required('Required'),
        confirmPassword: yup.string().equalTo(yup.ref('password'), "Passwords don't match!").required('Required')
      });
    }

  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = () => {
      return;
    };
  }

  componentDidMount() {
    // check if is on add mode
    if (!this.isAddMode()) {
      this.fetchUserData();
    }

    this.fetchRoleData();
  }

  isAddMode() {
    return this.urlParam === "add";
  }

  fetchUserData = async () => {
    try {
      const resp = await axios.get(
        userURL + this.urlParam,
        axiosConfig
      );

      if (resp.data.status === true) {

        this.setState({
          userData: resp.data.data,
          username: resp.data.data.uname,
          selectedRole: resp.data.data.rid,
          formikUsername: resp.data.data.uname
        });
      } else {
        // if no user is found, like param as 'add', redirect back to history or user page
        this.props.history.push('/users');
      }

    } catch (error) {
      console.log(error)
      // retryRequest(this.fetchUserData);
    }
  }

  fetchRoleData = async () => {
    try {
      const resp = await axios.get(
        roleURL,
        axiosConfig
      );

      if (resp.data.status === true) {
        this.setState({
          roleData: resp.data.data,
          selectedRole: resp.data.data[0].RoleID
        });
      }

    } catch (error) {
      console.log(error)
      // retryRequest(this.fetchRoleData);
    }
  }

  submitFormAdd = async () => {
    const param = {
      "username": this.state.username,
      "password": this.state.password,
      "roleid": this.state.selectedRole,
    }

    try {
      const resp = await axios.post(
        addUserURL,
        param,
        axiosConfig
      );

      if (resp.data.status === true) {
        // TODO: create a success alert after adding user or editing
        this.props.history.push('/users');
        this.setState({ roleData: resp.data.data });
      } else {
        this.setState({ errorMsg: resp.data.msg });
      }

    } catch (error) {
      this.setState({ errorMsg: `${error}` });
    }

  }

  submitFormEdit = async () => {
    const param = {
      "username": this.state.username,
      "password": this.state.password,
      "roleid": this.state.selectedRole,
      "userid": this.urlParam
    }

    try {
      const resp = await axios.put(
        editUserURL,
        param,
        axiosConfig
      );

      if (resp.data.status === true) {
        // TODO: create a success alert after adding user or editing
        this.props.history.push('/users');
        this.setState({ roleData: resp.data.data });
      } else {
        this.setState({ errorMsg: resp.data.msg });
      }

    } catch (error) {
      this.setState({ errorMsg: `${error}` });
    }

  }

  // executes after submitFormAdd or submitFormEdit
  // @param {String} userId id of user
  submitImage = async (userId) => {
    const formData = new FormData();

    this.state.imgFile.forEach((file, i) => {
      formData.append(i, file);
    })
    formData.append("id", userId);

    try {
      const resp = await axios.post(
        uploadImgUserURL,
        formData,
        { ...axiosConfig, headers: { 'Content-Type': "multipart/form-data" } } // add new property to axios config
      );

      if (resp.data.status === true) {

        this.setState({
          imgSrc: resp.data.path
        });
      } else {

        this.setState({ errorMsg: resp.data.msg });
      }

    } catch (error) {
      this.setState({ errorMsg: `${error}` });
    }
  }

  handleChangeUsername = async (e, formikProps) => {
    await this.setState({ username: e.target.value, errorMsg: false }); // set first the state to update on formik validation
    formikProps.handleChange(e);
  }

  handleChangePassword = async (e, formikProps) => {
    await this.setState({ password: e.target.value, errorMsg: false });
    formikProps.handleChange(e);
  }

  handleChangeConfirm = async (e, formikProps) => {
    await this.setState({ confirmPassword: e.target.value, errorMsg: false });
    formikProps.handleChange(e);
  }

  handleChangeRole = (e) => {
    this.setState({ selectedRole: e.target.value, errorMsg: false });
  }

  handleSubmitForm = () => {
    if (this.isAddMode()) {
      this.submitFormAdd();
    } else {
      this.submitFormEdit();
    }
  }

  handleFileChange = e => {
    const files = Array.from(e.target.files);

    const reader = new FileReader();
    reader.onload = function () {
      this.setState({ imgSrc: reader.result, imgFile: files });
    };

    reader.readAsDataURL(e.target.files[0]);

  }

  // TODO: make animation transition on routing using Framer Motion
  // and use Unit Testing with Jest
  render() {
    if (!this.state.roleData.length) {
      return (<Spinner />)
    } else {
      return (
        <div>
          <div className="page-header">
            <Link className="btn btn-outline-light btn-icon-text btn-md" to="/users">
              <i className="mdi mdi-keyboard-backspace btn-icon-prepend mdi-18px"></i>
              <span className="d-inline-block text-left">
                Back
              </span>
            </Link>

          </div>
          <div className="row w-100 mx-0">
            <div className="col-12 grid-margin stretch-card">
              <div className="card px-4 px-sm-5">

                <div className="card-body">

                  <h4 className="card-title">{this.isAddMode() ? 'Add' : 'Edit'} User</h4>
                  <div className="row mb-4">
                    <div className="col mt-3">
                      <Formik
                        initialValues={{
                          username: this.state.formikUsername,
                          password: "",
                          confirmPassword: ""
                        }}
                        validationSchema={this.schema}
                        enableReinitialize
                      >
                        {props => (
                          <Form className="forms-sample" onKeyPress={e => e.key === 'Enter' && this.handleSubmitForm()}>
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
                                value={this.state.username}
                                type="text"
                                name="username"
                                id="username"
                                placeholder="Username"
                                autoComplete="username"
                                onBlur={props.handleBlur}
                                isInvalid={(props.errors.username && props.touched.username) || this.state.errorMsg}
                                onChange={(e) => this.handleChangeUsername(e, props)}
                                disabled={this.props.priv === "R"}
                              />
                              <Form.Control.Feedback type="invalid">
                                {this.state.errorMsg ? null : props.errors.username}
                              </Form.Control.Feedback>
                            </Form.Group>

                            { // dont show password fields if Privilege is READ
                              this.props.priv === "RW"
                              &&
                              <>
                                <Form.Group>
                                  <label htmlFor="password">{!this.isAddMode() && '(Optional) Create New '}Password</label>
                                  <Form.Control
                                    value={this.state.password}
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    autoComplete="current-password"
                                    onBlur={props.handleBlur}
                                    isInvalid={(props.errors.password && props.touched.password) || this.state.errorMsg}
                                    onChange={(e) => this.handleChangePassword(e, props)}
                                  />

                                  <Form.Control.Feedback type="invalid">
                                    {/* put null to prevent showing error message from backend to each input boxes */}
                                    {this.state.errorMsg ? null : props.errors.password}
                                  </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group>
                                  <label htmlFor="confirmPassword">{!this.isAddMode() && '(Optional) '}Confirm Password</label>
                                  <Form.Control
                                    value={this.state.confirmPassword}
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    placeholder="Confirm Password"

                                    onBlur={props.handleBlur}
                                    isInvalid={(props.errors.confirmPassword && props.touched.confirmPassword) || this.state.errorMsg}
                                    onChange={(e) => this.handleChangeConfirm(e, props)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {this.state.errorMsg ? null : props.errors.confirmPassword}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </>
                            }

                            <label htmlFor="roleSelect">Role</label>
                            <Select
                              id="roleSelect"
                              value={this.state.selectedRole}
                              data={this.state.roleData}
                              className="form-control btn"
                              idKey="RoleID"
                              valueKey="RoleName"
                              onChange={(e) => this.handleChangeRole(e)}
                              disabled={this.props.priv === "R"}
                            ></Select>

                            {/* TODO: add image to users */}
                            <Form.Control type="file" name="file" onChange={this.handleFileChange} />
                            <img id="userImg" src={this.state.imgSrc} alt="your image" name="userImgUpload" />

                            <div className="mt-4">
                              {this.props.priv === "RW" && <button type="button" className="btn btn-primary mr-2" onClick={this.handleSubmitForm}>Submit</button>}

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
          </div>
        </div>

      );
    }
  }

}

export default UsersForm;
