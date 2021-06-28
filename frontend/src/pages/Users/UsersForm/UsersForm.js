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
import { PRIVILEGES } from "../../../helpers/constants";

const userURL = `${process.env.REACT_APP_BACKEND_HOST}/API/user/get/`;
const roleURL = `${process.env.REACT_APP_BACKEND_HOST}/API/role/get/all`;
const addUserURL = `${process.env.REACT_APP_BACKEND_HOST}/API/user/insert`;
const editUserURL = `${process.env.REACT_APP_BACKEND_HOST}/API/user/modify`;
const uploadImgUserURL = `${process.env.REACT_APP_BACKEND_HOST}/API/user/upload/img`;
const imgSrcMainPath = `${process.env.REACT_APP_BACKEND_HOST}`;

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

export async function fetchUserData(urlParam) {
  try {
    const resp = await axios.get(
      userURL + urlParam,
      axiosConfig
    );
    const { data } = resp;

    return data;
  } catch (error) {
    return { status: false, msg: error }
  }
}

export async function fetchRoleData() {
  try {
    const resp = await axios.get(
      roleURL,
      axiosConfig
    );

    const { data } = resp;
    return data;
  } catch (error) {
    return { status: false, msg: error }
  }
}

yup.addMethod(yup.string, 'equalTo', equalTo);

export default class UsersForm extends React.Component {

  constructor(props) {
    super();
    this.state = {
      userData: [],
      roleData: [],
      selectedRole: "",
      username: "",
      password: "",
      confirmPassword: "",
      errorMsg: [],
      imgSrc: "", // src of image
      // just to not connect the initialValues to main state username to prevent forced reinitialize, used after backend fetch userdata
      formikUsername: ""
    }

    this.imgFile = ""; // pure user image file, for submit image after handling file change
    this.urlParam = props.match.params.id;

    // send back to users page when Privilege is Read and accessing add mode
    if (this.isAddMode() && props.priv === PRIVILEGES.read) {
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

  async componentDidMount() {
    // check if is on add mode
    if (!this.isAddMode()) {
      const userData = await fetchUserData(this.urlParam);
      this.saveUserData(userData);
    }

    const roleData = await fetchRoleData();
    this.saveRoleData(roleData);
  }

  isAddMode() {
    return this.urlParam === "add";
  }

  clearErrorMsg() {
    this.setState({ errorMsg: [] });
  }

  setErrorMsg(errorArr) {
    this.setState({ errorMsg: [errorArr] });
  }

  pushErrorMsg(errorArr) {
    this.setState({ errorMsg: [...this.state.errorMsg, errorArr] });
  }

  saveUserData = async (userData) => {
    if (userData.status === true) {

      this.setState({
        userData: userData.data,
        username: userData.data.uname,
        selectedRole: userData.data.rid,
        formikUsername: userData.data.uname,
        imgSrc: imgSrcMainPath + userData.data.img
      });
    } else {
      // if no user is found, like param as 'add', redirect back to history or user page
      this.props.history.push('/users');
    }
  }

  saveRoleData = async (roleData) => {
    if (roleData.status === true) {
      this.setState({
        roleData: roleData.data,
        selectedRole: roleData.data[0].RoleID
      });
    } else {
      this.setErrorMsg(roleData.msg);

    }
  }
  // submits form using add then returns insertId of user for submit image to use
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
        return resp;

      } else {
        this.setErrorMsg(resp.data.msg);

        return false;

      }

    } catch (error) {
      this.setErrorMsg(`${error}`);
      return false;
    }

  }

  // submits form using edit then returns insertId of user for submit image to use
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
        return resp;

      } else {
        this.setErrorMsg(resp.data.msg);
        return false;
      }

    } catch (error) {
      this.setErrorMsg(`${error}`);
      return false;
    }

  }

  // executes after submitFormAdd or submitFormEdit
  // @param {String} userId id of user
  submitImage = async (userId) => {
    const formData = new FormData();
    formData.append("userImgUpload", this.imgFile[0]);
    formData.append("id", userId);

    try {
      const resp = await axios.post(
        uploadImgUserURL,
        formData,
        { ...axiosConfig, headers: { 'Content-Type': "multipart/form-data" } } // add new property to axios config
      );

      if (resp.data.status === true) {

        this.setState({
          imgSrc: resp.data.data
        });

        return resp;
      } else {
        this.setErrorMsg(resp.data.msg);
        return false;
      }

    } catch (error) {
      this.setErrorMsg(`${error}`);
      return false;

    }

  }

  handleChangeUsername = async (e, formikProps) => {
    await this.setState({ username: e.target.value }); // set first the state to update on formik validation
    this.clearErrorMsg();
    formikProps.handleChange(e);
  }

  handleChangePassword = async (e, formikProps) => {
    await this.setState({ password: e.target.value });
    this.clearErrorMsg();
    formikProps.handleChange(e);
  }

  handleChangeConfirm = async (e, formikProps) => {
    await this.setState({ confirmPassword: e.target.value });
    this.clearErrorMsg();
    formikProps.handleChange(e);
  }

  handleChangeRole = async (e) => {
    await this.setState({ selectedRole: e.target.value });
    this.clearErrorMsg();
  }

  handleSubmitForm = async () => {
    let submitResp;
    let isImageSuccess;

    if (this.isAddMode()) {
      // save new user id
      submitResp = await this.submitFormAdd();
    } else {
      submitResp = await this.submitFormEdit();
    }

    let userIdParam = this.isAddMode() ? submitResp.data.id : this.urlParam;

    let successArr = [];

    if (submitResp !== false) {

      successArr.push(submitResp.data.msg);

      // if there's no new uploaded image, then prevent from uploading
      if (!this.imgFile.length) {
        this.props.history.push({
          pathname: '/users',
          successMsg: successArr
        });

      } else {
        isImageSuccess = await this.submitImage(userIdParam);

        if (isImageSuccess !== false) {
          successArr.push(isImageSuccess.data.msg);

          this.props.history.push({
            pathname: '/users',
            successMsg: successArr
          });

        }
      }

    }
  }

  handleFileChange = e => {
    const files = Array.from(e.target.files);

    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ imgSrc: reader.result });
      this.imgFile = files;
    };

    reader.readAsDataURL(e.target.files[0]);

  }

  // TODO: make animation transition on routing using Framer Motion
  // TODO: and use Unit Testing with Jest
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
            <div className="col-lg-4 col-xlg-3 col-md-12">
              <div className="row">
                <div className="col">

                  <Form.Control type="file" name="file" onChange={this.handleFileChange} disabled={this.props.priv === PRIVILEGES.read} />
                  <img className="img-fluid" id="userImg" src={this.state.imgSrc} alt="User Profile" name="userImgUpload" />
                </div>
              </div>
            </div>
            <div className="col-lg-8 col-xlg-9 col-md-12">
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
                            {this.state.errorMsg.map((err) =>
                              <Alert
                                className="p-1"
                                variant="danger"
                                show={err}
                                transition={false}
                              >
                                {err}
                              </Alert>
                            )}

                            <div className="row">
                              <div className="col">
                                <Form.Group controlId="username">
                                  <Form.Label>Username</Form.Label>
                                  <Form.Control
                                    value={this.state.username}
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    autoComplete="username"
                                    onBlur={props.handleBlur}
                                    isInvalid={(props.errors.username && props.touched.username) || this.state.errorMsg.length}
                                    onChange={(e) => this.handleChangeUsername(e, props)}
                                    disabled={this.props.priv === PRIVILEGES.read}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {this.state.errorMsg.length ? null : props.errors.username}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </div>
                            </div>

                            { // dont show password fields if Privilege is READ
                              this.props.priv === PRIVILEGES.readWrite
                              &&
                              <>
                                <div className="row">
                                  <div className="col">
                                    <Form.Group controlId="password">
                                      <Form.Label>{!this.isAddMode() && '(Optional) Create New '}Password </Form.Label>
                                      <Form.Control
                                        value={this.state.password}
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        autoComplete="new-password"
                                        onBlur={props.handleBlur}
                                        isInvalid={(props.errors.password && props.touched.password) || this.state.errorMsg.length}
                                        onChange={(e) => this.handleChangePassword(e, props)}
                                      />

                                      <Form.Control.Feedback type="invalid">
                                        {/* put null to prevent showing error message from backend to each input boxes */}
                                        {this.state.errorMsg.length ? null : props.errors.password}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col">
                                    <Form.Group controlId="confirmPassword">
                                      <Form.Label>{!this.isAddMode() && '(Optional) '}Confirm Password</Form.Label>
                                      <Form.Control
                                        value={this.state.confirmPassword}
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        autoComplete="new-password"
                                        onBlur={props.handleBlur}
                                        isInvalid={(props.errors.confirmPassword && props.touched.confirmPassword) || this.state.errorMsg.length}
                                        onChange={(e) => this.handleChangeConfirm(e, props)}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {this.state.errorMsg.length ? null : props.errors.confirmPassword}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </div>
                                </div>
                              </>
                            }
                            <div className="row mb-4">
                              <div className="col">
                                <label htmlFor="roleSelect">Role</label>
                                <Select
                                  id="roleSelect"
                                  value={this.state.selectedRole}
                                  data={this.state.roleData}
                                  className="form-control btn"
                                  idKey="id"
                                  valueKey="rname"
                                  onChange={(e) => this.handleChangeRole(e)}
                                  disabled={this.props.priv === PRIVILEGES.read}
                                ></Select>
                              </div>
                            </div>

                            <div className="mt-4">
                              {this.props.priv === PRIVILEGES.readWrite && <button type="button" className="btn btn-primary mr-2" onClick={this.handleSubmitForm}>Submit</button>}

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

