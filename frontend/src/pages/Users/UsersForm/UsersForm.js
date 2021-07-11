import React from 'react';
import './UsersForm.css';
import axios from 'axios';
import { axiosConfig, equalTo } from "../../../helpers/utils";
import { Alert } from 'react-bootstrap';
import TextFormField from '../../../components/FormFields/TextFormField/TextFormField'
import { Formik, Form, Field } from "formik";
import * as yup from 'yup';
import Spinner from '../../../components/Spinner/Spinner';
import { Link } from 'react-router-dom';
import { PRIVILEGES, ERRORMSG } from "../../../helpers/constants";
import SelectFormField from '../../../components/FormFields/SelectFormField/SelectFormField';
import * as currentModule from './UsersForm'; // use currentmodule to call func outside class, for testing

const userByIdURL = `${process.env.REACT_APP_BACKEND_HOST}/API/user/get/by/`;
const roleURL = `${process.env.REACT_APP_BACKEND_HOST}/API/role/get/all`;
const addUserURL = `${process.env.REACT_APP_BACKEND_HOST}/API/user/insert`;
const editUserURL = `${process.env.REACT_APP_BACKEND_HOST}/API/user/modify/`;
const uploadImgUserURL = `${process.env.REACT_APP_BACKEND_HOST}/API/user/upload/img`;
const imgSrcMainPath = `${process.env.REACT_APP_BACKEND_HOST}`;

export async function fetchUserData(urlParam) {
  try {
    const resp = await axios.get(
      userByIdURL + urlParam,
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
      roleData: [],
      errorMsg: [],
      formData: {
        username: "",
        password: "",
        confirmPassword: "",
        selectedRole: "",
        userImg: ""
      },
      isLoading: true,
      imgSrc: "" // src of image, just for display purposes
    }

    this.urlParam = props.match.params.id;

    // send back to users page when Privilege is Read and accessing add mode
    if (this.isAddMode() && props.priv === PRIVILEGES.read) {
      // put error message on table page
      props.history.push({
        pathname: '/users',
        errorMsg: [ERRORMSG.noPrivilege]
      });
    }

    // dont require password field when edit mode
    if (!this.isAddMode()) {
      this.schema = yup.object().shape({
        username: yup.string().max(45, 'Must be 45 characters or less').required('Required'),
        password: yup.string().min(12, 'Must be longer than 12'),
        confirmPassword: yup.string().equalTo(yup.ref('password'), "Passwords don't match!")
      });
    } else {
      this.schema = yup.object().shape({
        username: yup.string().max(45, 'Must be 45 characters or less').required('Required'),
        password: yup.string().min(12, 'Must be longer than 12').required('Required'),
        confirmPassword: yup.string().equalTo(yup.ref('password'), "Passwords don't match!").required('Required')
      });
    }

    this.handleSubmitForm = this.handleSubmitForm.bind(this);
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
      const userData = await currentModule.fetchUserData(this.urlParam);

      this.saveUserData(userData);
    } else {
      this.setState({ isLoading: false });
    }

    const roleData = await currentModule.fetchRoleData();
    this.saveRoleData(roleData);
  }

  isAddMode() {
    return this.urlParam === "add";
  }

  clearErrorMsg() {
    if (this.state.errorMsg.length) {
      this.setState({ errorMsg: [] });
    }
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
        imgSrc: imgSrcMainPath + userData.data.img,
        formData: {
          username: userData.data.uname,
          password: "",
          confirmPassword: "",
          selectedRole: userData.data.rid,
          userImg: ""
        },
        isLoading: false
      });
    } else {
      this.setErrorMsg(`${userData.msg}`);
      this.setState({ isLoading: false });
    }
  }

  saveRoleData = async (roleData) => {
    if (roleData.status === true) {
      this.setState({
        roleData: roleData.data
      });
    } else {
      this.setErrorMsg(roleData.msg);

    }
  }
  // submits form using add then returns insertId of user for submit image to use
  submitFormAdd = async (fields) => {
    const param = {
      "username": fields.username,
      "password": fields.password,
      "roleid": fields.selectedRole,
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
  submitFormEdit = async (fields) => {
    const param = {
      "username": fields.username,
      "password": fields.password,
      "roleid": fields.selectedRole
    }

    try {
      const resp = await axios.put(
        editUserURL + this.urlParam,
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
  submitImage = async (userImgFile, userId) => {
    const formData = new FormData();
    formData.append("userImgUpload", userImgFile[0]);
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

  async handleSubmitForm(fields) {

    let submitResp;
    let isImageSuccess;

    if (this.isAddMode()) {
      // save new user id
      submitResp = await this.submitFormAdd(fields);
    } else {
      submitResp = await this.submitFormEdit(fields);
    }

    let userIdParam = this.isAddMode() ? submitResp.data.id : this.urlParam;

    let successArr = [];

    if (submitResp !== false) {

      successArr.push(submitResp.data.msg);

      // if there's no new uploaded image, then prevent from uploading
      if (!fields.userImg.length) {
        this.props.history.push({
          pathname: '/users',
          successMsg: successArr
        });

      } else {
        isImageSuccess = await this.submitImage(fields.userImg, userIdParam);

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
    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ imgSrc: reader.result });
    };

    reader.readAsDataURL(e.target.files[0]);

  }

  // TODO: make animation transition on routing using Framer Motion
  // TODO: and use Unit Testing with Jest
  render() {
    // TODO: change form fields like from Ben Awad

    if ((!this.isAddMode() && !this.state.formData.username.length) && !this.state.roleData.length) {
      return (<Spinner />)
    } else {
      return (
        <div data-testid="UsersForm">
          <div className="page-header">
            <Link className="btn btn-outline-light btn-icon-text btn-md" to="/users">
              <i className="mdi mdi-keyboard-backspace btn-icon-prepend mdi-18px"></i>
              <span className="d-inline-block text-left">
                Back
              </span>
            </Link>

          </div>
          <Formik
            initialValues={this.state.formData}
            validationSchema={this.schema}
            onSubmit={this.handleSubmitForm}
            enableReinitialize
          >
            {({ setFieldValue }) => (

              <Form>
                <div className="row w-100 mx-0">
                  <div className="col-lg-4 col-xlg-3 col-md-12">
                    <div className="row">
                      <div className="col">
                        <input name="userImg" type="file" disabled={this.props.priv !== PRIVILEGES.readWrite} onChange={(event) => {
                          setFieldValue("userImg", Array.from(event.target.files));
                          this.handleFileChange(event);
                        }} className="form-control-file h-auto" />

                        <img className="img-fluid" src={this.state.imgSrc} alt="User Profile" name="userImgUpload" />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-8 col-xlg-9 col-md-12">
                    <div className="card px-4 px-sm-5">

                      <div className="card-body">

                        <h4 className="card-title">{this.isAddMode() ? 'Add' : 'Edit'} User</h4>
                        <div className="row mb-4">
                          <div className="col mt-3">
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
                            <div className="row">
                              <div className="col">
                                <Field
                                  label="Username"
                                  type="text"
                                  name="username"
                                  placeholder="Username"
                                  component={TextFormField}
                                  disabled={this.props.priv !== PRIVILEGES.readWrite}
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col">
                                <Field
                                  label="Password"
                                  type="password"
                                  placeholder="Password"
                                  name="password"
                                  component={TextFormField}
                                  disabled={this.props.priv !== PRIVILEGES.readWrite}
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col">
                                <Field
                                  label="Confirm Password"
                                  type="password"
                                  placeholder="Confirm Password"
                                  name="confirmPassword"
                                  component={TextFormField}
                                  disabled={this.props.priv !== PRIVILEGES.readWrite}
                                />
                              </div>
                            </div>
                            <div className="row mb-4">
                              <div className="col">
                                <Field
                                  label="Role"
                                  options={this.state.roleData}
                                  idKey="id"
                                  valueKey="rname"
                                  name="selectedRole"
                                  component={SelectFormField}
                                  disabled={this.props.priv !== PRIVILEGES.readWrite}
                                />
                              </div>
                            </div>
                            <div className="mt-4">
                              {this.props.priv === PRIVILEGES.readWrite &&
                                <button type="submit" className="btn btn-primary mr-2">Submit</button>}

                            </div>

                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>

      );
    }
  }

}

