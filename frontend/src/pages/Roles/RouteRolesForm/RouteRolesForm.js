import React from 'react';
import './RouteRolesForm.css';
import axios from 'axios';
import { retryRequest, axiosConfig } from "../../../helpers/utils";
import { Form, Alert, Table } from 'react-bootstrap';
import Select from '../../../components/FormFields/SelectFormField/SelectFormField';
import Spinner from '../../../components/Spinner/Spinner';
import { Link } from 'react-router-dom';
import { PRIVILEGES } from "../../../helpers/constants";
import * as currentModule from './RouteRolesForm'; // use currentmodule to call func outside class, for testing

const routesRoleUrl = `${process.env.REACT_APP_BACKEND_HOST}/API/routerole/get/left/`;
const privUrl = `${process.env.REACT_APP_BACKEND_HOST}/API/privilege/get/all`;
const editURL = `${process.env.REACT_APP_BACKEND_HOST}/API/routerole/post/data`;

export async function fetchRouteRoleData(roleIdParam) {
  try {
    const resp = await axios.get(
      routesRoleUrl + roleIdParam,
      axiosConfig
    );
    const { data } = resp;

    return data;
  } catch (error) {
    return { status: false, msg: error }
  }
}

export async function fetchPrivData() {
  try {
    const resp = await axios.get(
      privUrl,
      axiosConfig
    );

    const { data } = resp;
    return data;
  } catch (error) {
    return { status: false, msg: error }
  }
}

function wrapperTable(wrappedContent) {
  return (
    <div className="row">
      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card px-4 px-sm-5">
          <div className="card-body">
            {wrappedContent}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
  * creates a route roles form table
  * @param {Boolean} [isRenderedAsChild] if true, then component will be treated as child. Otherwise, as page
  * @param {Function} [onChangePriv] onchange function for priv radios, needs isRenderedAsChild to be true
  * @param {Function} [onRouteRoleSave] executed when routeRoleSelected is initialized, needs isRenderedAsChild to be true
  * @param {HTML Elements} [header] redefined header for the table, needs isRenderedAsChild to be true
  * @param {Function} [onAllPrivSave] executed when privData is initialized, needs isRenderedAsChild to be true 
  */
export default class RouteRolesForm extends React.Component {

  constructor(props) {
    super();
    this.state = {
      routeRoleData: [],
      privData: [],
      routeRoleSelected: [], // sent to the backend for post
      errorMsg: []
    }

    this.onChangePriv = props.onChangePriv;
    this.isRenderedAsChild = props.isRenderedAsChild;
    this.onRouteRoleSave = props.onRouteRoleSave;
    this.onAllPrivSave = props.onAllPrivSave;
    this.header = props.header;

    this.roleIdParam = props.match.params.id;
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = () => {
      return;
    };
  }

  async componentDidMount() {

    const routeRoleData = await currentModule.fetchRouteRoleData(this.roleIdParam);

    this.saveRouteRoleData(routeRoleData);

    const privData = await currentModule.fetchPrivData();
    this.savePrivData(privData);
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

  saveRouteRoleData = async (routeRoleData) => {
    if (routeRoleData.status === true) {
      let routeRoleSelected = routeRoleData.data.map((e) => {
        return { RouteID: e.RouteID, RoleID: e.RoleID, PrivilegeID: e.PrivilegeID }
      });

      this.setState({
        routeRoleData: routeRoleData.data,
        routeRoleSelected: routeRoleSelected
      });

      if (this.isRenderedAsChild) {
        this.onRouteRoleSave(routeRoleSelected);
      }

    } else {
      // if no role is found, like invalid param "deeznuts", redirect back to history or role page
      this.props.history.push('/roles');
    }
  }

  savePrivData = async (privData) => {

    if (privData.status === true) {
      await this.setState({
        privData: privData.data
      });

      if (this.isRenderedAsChild && this.onAllPrivSave !== undefined) {
        this.onAllPrivSave(privData);
      }

    } else {
      this.setErrorMsg(privData.msg);

    }
  }

  // submits form
  submitForm = async () => {

    let strippedNullArr = this.state.routeRoleSelected.map((e) => {
      return {
        RouteID: e.RouteID,
        // convert all "null" values of roleID to selected RoleID
        RoleID: (e.RoleID == null ? this.roleIdParam : e.RoleID),
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
        editURL,
        param,
        axiosConfig
      );

      if (resp.data.status === true) {
        this.props.history.push({
          pathname: '/roles',
          successMsg: [resp.data.msg]
        });
        return true;
      } else {
        this.setErrorMsg(resp.data.msg);
        return false;
      }

    } catch (error) {
      this.setErrorMsg(`${error}`);
      return false;
    }

  }

  handlePrivSelect = async (PrivilegeID, RouteID, RoleID) => {

    const newRouteRoleSelected = this.state.routeRoleSelected.map(obj =>
      (obj.RouteID === RouteID && obj.RoleID === RoleID) ?
        { ...obj, PrivilegeID: PrivilegeID } :
        obj
    );

    this.setState({
      routeRoleSelected: newRouteRoleSelected
    });
    if (this.isRenderedAsChild) {
      this.onChangePriv(newRouteRoleSelected);
    }
  }

  isWrapped(wrappedContent) {
    if (this.isRenderedAsChild) {
      return wrappedContent;
    } else {
      return wrapperTable(wrappedContent);
    }
  }

  // TODO: make animation transition on routing using Framer Motion
  // TODO: and use Unit Testing with Jest
  render() {
    if (!this.state.routeRoleData.length || !this.state.privData.length) {
      return (<Spinner />)
    } else {
      return (
        <div>
          <div className="page-header">
            {
              !this.isRenderedAsChild &&
              <Link className="btn btn-outline-light btn-icon-text btn-md" to="/roles">
                <i className="mdi mdi-keyboard-backspace btn-icon-prepend mdi-18px"></i>
                <span className="d-inline-block text-left">
                  Back
                </span>
              </Link>
            }

          </div>

          {this.isWrapped(
            <>
              {
                !this.isRenderedAsChild ?
                  <h4 className="card-title">Role-Routes Privileges</h4> :
                  this.header
              }

              <div className="row mb-4">
                <div className="col mt-3">


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

                  <div className="row mb-4">
                    <div className="col">
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Route Name</th>
                            {this.state.privData.map(priv => {
                              return <th key={`th${priv.PrivilegeID}`}>{priv.PrivilegeName}</th>
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.routeRoleSelected.map(routeRole => {
                            // connect to the routeRoleSelected state
                            let routeMatch = this.state.routeRoleData.find(e => e.RouteID == routeRole.RouteID);
                            let routeName = !!routeMatch ? routeMatch.RouteName : routeMatch;
                            let privMatch = this.state.privData.find(e => e.PrivilegeID == routeRole.PrivilegeID);
                            let privName = !!privMatch ? privMatch.PrivilegeName : privMatch;

                            return (
                              <tr key={`tr${routeRole.RouteID}`}>
                                <td>{routeName}</td>
                                {this.state.privData.map(priv => {

                                  let translatedPriv = !privName ? PRIVILEGES.none : privName;
                                  let isChecked = translatedPriv == priv.PrivilegeName;

                                  return (
                                    <td key={`td${routeRole.RouteID}${priv.PrivilegeID}`}>
                                      <Form.Check
                                        inline
                                        checked={isChecked}
                                        onChange={() => this.handlePrivSelect(priv.PrivilegeID, routeRole.RouteID, routeRole.RoleID)}
                                        value={priv.PrivilegeID}
                                        key={`priv${routeRole.RouteID}${priv.PrivilegeID}`}
                                        name={`priv${routeRole.RouteID}`}
                                        type="radio"
                                      />
                                    </td>
                                  )
                                })}
                              </tr>
                            )
                          })}
                        </tbody>
                      </Table>

                    </div>
                  </div>

                  {
                    !this.isRenderedAsChild &&
                    <div className="mt-4">
                      {this.props.priv === PRIVILEGES.readWrite && <button type="button" className="btn btn-primary mr-2" onClick={this.submitForm}>Submit</button>}
                    </div>
                  }




                </div>
              </div>
            </>

          )}

        </div>

      );
    }
  }

}

