import React from 'react';
import './RolesForm.css';
import axios from 'axios';
import { retryRequest } from "../../../helpers/utils";
import { Form, Alert } from 'react-bootstrap';
import Select from '../../../components/Select/Select';
import { Formik } from 'formik';
import * as yup from 'yup';
import Spinner from '../../../components/Spinner/Spinner';
import { Link } from 'react-router-dom';
import { PRIVILEGES } from "../../../helpers/constants";
// import RouteRolesForm from '../../RouteRoles/RouteRolesForm/RouteRolesForm';

// const NewRouteRolesForm = new RouteRolesForm({ props: { match: { params: { id: "add" } } } });
// console.log(NewRouteRolesForm)
// NewRouteRolesForm.prototype.submitForm = async () => {

// }

// TODO: check if you can change the implementation of RouteRolesForm so you can 
// reuse it here

// TODO: make roles as the main page for routeroles, pageroles.... show different buttons in a row (like: Edit Route Roles)
const roleURL = `${process.env.REACT_APP_BACKEND_HOST}/API/role/get/all`;
const addUserURL = `${process.env.REACT_APP_BACKEND_HOST}/API/user/insert`;
const editUserURL = `${process.env.REACT_APP_BACKEND_HOST}/API/user/modify`;

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

export default class RolesForm extends React.Component {

  constructor(props) {
    super();
    this.state = {
      roleData: [],
      rolename: "",
      errorMsg: false,
      // just to not connect the initialValues to main state username to prevent forced reinitialize, used after backend fetch userdata
      formikRoleName: ""
    }

    this.imgFile = ""; // pure user image file, for submit image after handling file change
    this.urlParam = props.match.params.id;

    // send back to users page when Privilege is Read and accessing add mode
    if (this.isAddMode() && props.priv === PRIVILEGES.read) {
      props.history.push('/users');
    }

    this.schema = yup.object().shape({
      rolename: yup.string().max(45, 'Must be 45 characters or less').required('Required')
    });


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
      const roleData = await fetchRoleData(this.urlParam);
      this.saveRoleData(roleData);
    }
  }

  isAddMode() {
    return this.urlParam === "add";
  }

  saveRoleData = async (roleData) => {
    if (roleData.status === true) {
      this.setState({
        rolename: roleData.data.rname,
        formikRoleName: roleData.data.rname
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
      "userid": this.urlParam
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

  handleChangeRoleName = async (e, formikProps) => {
    await this.setState({ rolename: e.target.value, errorMsg: false }); // set first the state to update on formik validation
    formikProps.handleChange(e);
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

  // TODO: make animation transition on routing using Framer Motion
  // and use Unit Testing with Jest
  render() {

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
                              <Form.Group controlId="rolename">
                                <Form.Label>Role Name</Form.Label>
                                <Form.Control
                                  value={this.state.rolename}
                                  type="text"
                                  name="rolename"
                                  placeholder="Role Name"
                                  autoComplete="rolename"
                                  onBlur={props.handleBlur}
                                  isInvalid={(props.errors.rolename && props.touched.rolename) || this.state.errorMsg}
                                  onChange={(e) => this.handleChangeUsername(e, props)}
                                  disabled={this.props.priv === PRIVILEGES.read}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {this.state.errorMsg ? null : props.errors.rolename}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </div>
                          </div>

                          {/* <div className="mt-4">
                            {this.props.priv === PRIVILEGES.readWrite && <button type="button" className="btn btn-primary mr-2" onClick={this.handleSubmitForm}>Submit</button>}

                            
                          </div> */}

                        </Form>
                      )}
                    </Formik>

                    <NewRouteRolesForm />
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

