import React from 'react';
import './RouteRolesForm.css';
import axios from 'axios';
import { retryRequest } from "../../../helpers/utils";
import { Form, Alert, Table } from 'react-bootstrap';
import Select from '../../../components/Select/Select';
import Spinner from '../../../components/Spinner/Spinner';
import { Link } from 'react-router-dom';
import { PRIVILEGES } from "../../../helpers/constants";

const routesRoleUrl = `${process.env.REACT_APP_BACKEND_HOST}/API/routerole/get/left/`;
const privUrl = `${process.env.REACT_APP_BACKEND_HOST}/API/privilege/get/all`;
const editURL = `${process.env.REACT_APP_BACKEND_HOST}/API/routerole/post/data`;

const axiosConfig = {
  withCredentials: true,
  timeout: 10000
}

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

export default class RouteRolesForm extends React.Component {

  constructor(props) {
    super();
    this.state = {
      routeRoleData: [],
      privData: [],
      routeRoleSelected: [], // sent to the backend for post
      errorMsg: false
    }

    this.roleIdParam = props.match.params.id;
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = () => {
      return;
    };
  }

  async componentDidMount() {

    const routeRoleData = await fetchRouteRoleData(this.roleIdParam);

    this.saveRouteRoleData(routeRoleData);

    const privData = await fetchPrivData();
    this.savePrivData(privData);
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
    } else {
      // if no role is found, like invalid param "deeznuts", redirect back to history or role page
      this.props.history.push('/routeroles');
    }
  }

  savePrivData = async (privData) => {

    if (privData.status === true) {
      this.setState({
        privData: privData.data
      });
    } else {
      this.setState({
        errorMsg: privData.msg
      });
    }
  }

  // submits form
  submitForm = async () => {
    const param = {
      "routeRoles": this.state.routeRoleSelected
    }

    try {
      const resp = await axios.post(
        editURL,
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

  handlePrivSelect = async (PrivilegeID, RouteID, RoleID) => {

    const newRouteRoleSelected = this.state.routeRoleSelected.map(obj =>
      (obj.RouteID === RouteID && obj.RoleID === RoleID) ?
        { ...obj, PrivilegeID: PrivilegeID } :
        obj
    );

    await this.setState({
      routeRoleSelected: newRouteRoleSelected
    });

  }


  // TODO: make animation transition on routing using Framer Motion
  // and use Unit Testing with Jest
  render() {
    if (!this.state.routeRoleData.length || !this.state.privData.length) {
      return (<Spinner />)
    } else {
      return (
        <div>
          <div className="page-header">
            <Link className="btn btn-outline-light btn-icon-text btn-md" to="/routeroles">
              <i className="mdi mdi-keyboard-backspace btn-icon-prepend mdi-18px"></i>
              <span className="d-inline-block text-left">
                Back
              </span>
            </Link>

          </div>
          <div className="row">
            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card px-4 px-sm-5">

                <div className="card-body">

                  <h4 className="card-title">Edit Privileges of Role to Routes</h4>
                  <div className="row mb-4">
                    <div className="col mt-3">

                      <Form className="forms-sample" onKeyPress={e => e.key === 'Enter' && this.handleSubmitForm()}>
                        <Alert
                          className="p-1"
                          variant="danger"
                          show={this.state.errorMsg}
                          transition={false}
                        >
                          {this.state.errorMsg}
                        </Alert>

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

                        <div className="mt-4">
                          {this.props.priv === PRIVILEGES.readWrite && <button type="button" className="btn btn-primary mr-2" onClick={this.submitForm}>Submit</button>}

                          {/* <button className="btn btn-dark">Cancel</button> */}
                        </div>

                      </Form>

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

