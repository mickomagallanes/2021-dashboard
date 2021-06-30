import React from 'react';
import './RolesForm.css';
import axios from 'axios';
import { retryRequest } from "../../../helpers/utils";
import { Form, Alert } from 'react-bootstrap';
import Select from '../../../components/FormFields/SelectFormField/SelectFormField';
import { Formik } from 'formik';
import * as yup from 'yup';
import Spinner from '../../../components/Spinner/Spinner';
import { Link } from 'react-router-dom';
import { PRIVILEGES } from "../../../helpers/constants";
import RouteRolesForm from '../RouteRolesForm/RouteRolesForm';
import PageRolesForm from '../PageRolesForm/PageRolesForm';

const roleURL = `${process.env.REACT_APP_BACKEND_HOST}/API/role/get/`;
const addRoleURL = `${process.env.REACT_APP_BACKEND_HOST}/API/role/insert`;
const editRoleURL = `${process.env.REACT_APP_BACKEND_HOST}/API/role/modify`;
const routeRoleURL = `${process.env.REACT_APP_BACKEND_HOST}/API/routerole/post/data`;
const pageRoleURL = `${process.env.REACT_APP_BACKEND_HOST}/API/pagerole/post/data`;

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

export async function fetchRoleData(urlParam) {
  try {
    const resp = await axios.get(
      roleURL + urlParam,
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
      routeRoleSelected: [],
      pageRoleSelected: [],
      privData: [],
      errorMsg: [],
      // just to not connect the initialValues to main state rolename to prevent forced reinitialize, used after backend fetch roledata
      formikRoleName: ""
    }

    this.urlParam = props.match.params.id;

    // send back to roles page when Privilege is Read and accessing add mode
    if (this.isAddMode() && props.priv === PRIVILEGES.read) {
      props.history.push('/roles');
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

  saveRoleData = async (roleData) => {
    if (roleData.status === true) {
      this.setState({
        rolename: roleData.data.rname,
        formikRoleName: roleData.data.rname
      });
    } else {
      this.setErrorMsg(roleData.msg);

    }
  }

  /**
   * submit privilege after new role is inserted
   * @param {Number} roleId id of the role
   * @return {Object} resp contains the status, etc
   */
  submitRoutePrivilege = async (roleId) => {
    let strippedNullArr = this.state.routeRoleSelected.map((e) => {
      return {
        RouteID: e.RouteID,
        // convert all "null" values of roleID to selected RoleID
        RoleID: (e.RoleID == null ? roleId : e.RoleID),
        // convert all "null" values of priv to ID of "None"
        PrivilegeID: (e.PrivilegeID == null ?
          (this.state.privData.find(e => e.PrivilegeName == PRIVILEGES.none)).PrivilegeID :
          e.PrivilegeID)
      }
    });

    const param = {
      "routeRoles": strippedNullArr
    }

    try {
      const resp = await axios.post(
        routeRoleURL,
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

  /**
   * submit privilege after new role is inserted
   * @param {Number} roleId id of the role
   * @return {Object} resp contains the status, etc
   */
  submitPagePrivilege = async (roleId) => {
    let strippedNullArr = this.state.pageRoleSelected.map((e) => {
      return {
        PageID: e.PageID,
        // convert all "null" values of roleID to selected RoleID
        RoleID: (e.RoleID == null ? roleId : e.RoleID),
        // convert all "null" values of priv to ID of "None"
        PrivilegeID: (e.PrivilegeID == null ?
          (this.state.privData.find(e => e.PrivilegeName == PRIVILEGES.none)).PrivilegeID :
          e.PrivilegeID)
      }
    });

    const param = {
      "pageRoles": strippedNullArr
    }

    try {
      const resp = await axios.post(
        pageRoleURL,
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

  // submits form using add then returns insertId of role for submit image to use
  submitFormAdd = async () => {
    const param = {
      "rolename": this.state.rolename
    }

    try {
      const resp = await axios.post(
        addRoleURL,
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

  // submits form using edit then returns insertId of role
  submitFormEdit = async () => {
    const param = {
      "rolename": this.state.rolename,
      "roleid": this.urlParam
    }

    try {
      const resp = await axios.put(
        editRoleURL,
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

  saveRouteRoleFormState = async (newState) => {
    // just make the state in-sync from the RouteRolesForm
    await this.setState({
      routeRoleSelected: newState
    });

  }

  savePageRoleFormState = async (newState) => {
    // just make the state in-sync from the PageRolesForm
    await this.setState({
      pageRoleSelected: newState
    });

  }

  saveAllPrivState = async (newState) => {
    // just make the state in-sync from the RouteRolesForm
    await this.setState({
      privData: newState.data
    });

  }

  handleChangeRoleName = async (e, formikProps) => {
    await this.setState({ rolename: e.target.value }); // set first the state to update on formik validation
    this.clearErrorMsg();
    formikProps.handleChange(e);
  }

  handleSubmitForm = async () => {

    if (this.isAddMode()) {
      let submitResp = await this.submitFormAdd();

      if (submitResp !== false) {
        let newRoleId = submitResp.data.id;

        let isRouteSuccess = await this.submitRoutePrivilege(newRoleId);

        if (isRouteSuccess !== false) {

          let isPageSuccess = await this.submitPagePrivilege(newRoleId);

          if (isPageSuccess !== false) {
            this.props.history.push({
              pathname: '/roles',
              successMsg: [submitResp.data.msg, isRouteSuccess.data.msg, isPageSuccess.data.msg]
            });
          }

        }
      }

    } else {
      let submitResp = await this.submitFormEdit();
      if (submitResp !== false) {
        this.props.history.push({
          pathname: '/roles',
          successMsg: [submitResp.data.msg]
        });

      }

    }
  }

  // TODO: make animation transition on routing using Framer Motion
  // TODO: and use Unit Testing with Jest
  render() {

    return (
      <div>
        <div className="page-header">
          <Link className="btn btn-outline-light btn-icon-text btn-md" to="/roles">
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

                <h4 className="card-title">{this.isAddMode() ? 'Add' : 'Edit'} Role</h4>
                <div className="row mb-4">
                  <div className="col mt-3">
                    <Formik
                      initialValues={{
                        rolename: this.state.formikRoleName
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
                              <Form.Group controlId="rolename">
                                <Form.Label>Role Name</Form.Label>
                                <Form.Control
                                  value={this.state.rolename}
                                  type="text"
                                  name="rolename"
                                  placeholder="Role Name"
                                  autoComplete="rolename"
                                  onBlur={props.handleBlur}
                                  isInvalid={(props.errors.rolename && props.touched.rolename) || this.state.errorMsg.length}
                                  onChange={(e) => this.handleChangeRoleName(e, props)}
                                  disabled={this.props.priv === PRIVILEGES.read}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {this.state.errorMsg.length ? null : props.errors.rolename}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </div>
                          </div>

                        </Form>
                      )}
                    </Formik>

                    {/* add privileges table only if add mode */}
                    {this.isAddMode() &&
                      <RouteRolesForm
                        isRenderedAsChild={true}
                        onChangePriv={this.saveRouteRoleFormState}
                        onRouteRoleSave={this.saveRouteRoleFormState}
                        header={<h5 className="card-title">Role Privileges to Routes</h5>}
                        onAllPrivSave={this.saveAllPrivState}
                        {...this.props} />
                    }

                    {this.isAddMode() &&
                      <PageRolesForm
                        isRenderedAsChild={true}
                        onChangePriv={this.savePageRoleFormState}
                        onPageRoleSave={this.savePageRoleFormState}
                        header={<h5 className="card-title">Role Privileges to Pages</h5>}
                        {...this.props} />
                    }

                    <div className="mt-4">
                      {this.props.priv === PRIVILEGES.readWrite && <button type="button" className="btn btn-primary mr-2" onClick={this.handleSubmitForm}>Submit</button>}
                    </div>
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

