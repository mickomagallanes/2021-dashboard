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
      errorMsg: false,
      imgSrc: "", // src of image
      // just to not connect the initialValues to main state username to prevent forced reinitialize, used after backend fetch userdata
      formikUsername: ""
    }

    this.imgFile = ""; // pure user image file, for submit image after handling file change
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
      this.setState({
        errorMsg: roleData.msg
      });
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
        // TODO: create a success alert after adding user or editing
        return resp.data.id;


      } else {
        this.setState({ errorMsg: resp.data.msg });
        return false;

      }

    } catch (error) {
      this.setState({ errorMsg: `${error}` });
      return false;
    }

  }

  // submits form using edit then returns insertId of user for submit image to use
  submitFormEdit = async () => {
    const param = {
      "username": this.state.username,
      "password": this.state.password,
      "roleid": this.state.selectedRole,
      "userid": this.urlParam,

    }

    try {
      const resp = await axios.put(
        editUserURL,
        param,
        axiosConfig
      );

      if (resp.data.status === true) {
        return true;

      } else {
        this.setState({ errorMsg: resp.data.msg });
        return false;
      }

    } catch (error) {
      this.setState({ errorMsg: `${error}` });
      return false;
    }

  }

  // executes after submitFormAdd or submitFormEdit
  // @param {String} userId id of user
  submitImage = async (userId) => {

    // if there's no new uploaded image, then prevent from uploading
    if (!this.imgFile.length) {
      this.props.history.push('/users');
      return false;
    }
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

        return true;
      } else {

        this.setState({ errorMsg: resp.data.msg });
        return false;
      }

    } catch (error) {
      this.setState({ errorMsg: `${error}` });
      return false;

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

  handleChangeRole = async (e) => {
    await this.setState({ selectedRole: e.target.value, errorMsg: false });
  }

  handleSubmitForm = async () => {
    if (this.isAddMode()) {
      let newUserId = await this.submitFormAdd();

      if (newUserId !== false) {
        let isImageSuccess = await this.submitImage(newUserId);

        if (isImageSuccess) {
          this.props.history.push('/users');
        }
      }

    } else {
      let isEditSuccess = await this.submitFormEdit();

      if (isEditSuccess) {
        let isImageSuccess = await this.submitImage(this.urlParam);

        if (isImageSuccess) {
          this.props.history.push('/users');
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
            <div className="col-lg-4 col-xlg-3 col-md-12">
              <div className="row">
                <div className="col">

                  <Form.Control type="file" name="file" onChange={this.handleFileChange} disabled={this.props.priv === "R"} />
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
                            <Alert
                              className="p-1"
                              variant="danger"
                              show={this.state.errorMsg}
                              transition={false}
                            >
                              {this.state.errorMsg}
                            </Alert>

                            <div className="row">
                              <div className="col">
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
                              </div>
                            </div>

                            { // dont show password fields if Privilege is READ
                              this.props.priv === "RW"
                              &&
                              <>
                                <div className="row">
                                  <div className="col">
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
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col">
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
                                  disabled={this.props.priv === "R"}
                                ></Select>
                              </div>
                            </div>

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

