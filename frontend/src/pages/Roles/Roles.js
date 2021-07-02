import React from 'react'
import './Roles.css';
import axios from 'axios';
import Table from '../../components/Table/Table.lazy';
import { retryRequest } from "../../helpers/utils";
import { Alert } from 'react-bootstrap';
import * as currentModule from './Roles'; // use currentmodule to call func outside class, for testing
import { PRIVILEGES } from "../../helpers/constants"
import { Link } from 'react-router-dom';

const roleURL = `${process.env.REACT_APP_BACKEND_HOST}/API/role/get/all`;

const axiosConfig = {
  withCredentials: true,
  timeout: 10000
}

export async function fetchRolesData() {

  try {
    const resp = await axios.get(
      roleURL,
      axiosConfig
    );

    const { data } = resp;

    return data;

  } catch (error) {
    return { status: false, msg: error };
  }
}

class Roles extends React.Component {

  constructor() {
    super();
    this.state = {
      data: [],
      errorMsg: [],
      successMsg: []
    }

    this.colData = [
      { "id": "id", "name": "Role ID" },
      { "id": "rname", "name": "Role name" }
    ];

    this.idKey = "id";

    this.successTimer = null;
    this.errorTimer = null;
  }

  async componentDidMount() {

    // import current module and call fetchRolesData for testing benefits
    let data = await currentModule.fetchRolesData();

    await this.saveData(data);

    this.loadSuccessProp();

    this.loadErrorProp();
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = () => {
      return;
    };
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

  clearSuccessMsg() {
    this.setState({ successMsg: [] });
  }

  setSuccessMsg(successArr) {
    this.setState({ successMsg: [successArr] });
  }

  pushSuccessMsg(successArr) {
    this.setState({ successMsg: [...this.state.successMsg, successArr] });
  }

  loadSuccessProp() {
    if (this.props.location.successMsg) {
      this.showSuccessAlert(this.props.location.successMsg)
    }
  }

  loadErrorProp() {
    if (this.props.location.errorMsg) {
      this.showErrorAlert(this.props.location.errorMsg);
    }
  }

  showSuccessAlert(msgArr) {
    this.setState({ successMsg: msgArr });

    clearTimeout(this.successTimer);

    this.successTimer = setTimeout(() => {
      this.clearSuccessMsg()
    }, 6000)

  }

  showErrorAlert(msgArr) {
    this.setState({ errorMsg: msgArr });

    clearTimeout(this.errorTimer);

    // make timeout reset when error alert is continuous
    this.errorTimer = setTimeout(() => {
      this.clearErrorMsg()
    }, 6000)

  }

  saveData = async (data) => {

    if (data.status === true) {
      this.setState({
        data: data.data
      });
      this.clearErrorMsg();
    } else {
      this.setErrorMsg(data.msg);
    }
  }

  render() {
    let isWriteable = this.props.priv === PRIVILEGES.readWrite;
    const actionButtons = (roleId) => {
      return (
        <>
          <Link to={`/roles/form/${roleId}`} className="btn btn-icon-text btn-outline-secondary mr-3">
            {isWriteable ? "Edit" : "Read"} Role
            <i className={`mdi ${isWriteable ? "mdi-pencil" : "mdi-read"} btn-icon-append `}></i>
          </Link>

          {isWriteable &&
            <>
              <Link to={`/routeroles/form/${roleId}`} className="btn btn-icon-text btn-outline-secondary mr-3">
                Edit Role-Routes Privileges
                <i className={`mdi ${isWriteable ? "mdi-pencil" : "mdi-read"} btn-icon-append `}></i>
              </Link>

              <Link to={`/pageroles/form/${roleId}`} className="btn btn-icon-text btn-outline-secondary mr-3">
                Edit Role-Pages Privileges
                <i className={`mdi ${isWriteable ? "mdi-pencil" : "mdi-read"} btn-icon-append `}></i>
              </Link>
            </>
          }
        </>
      )
    };

    return (
      <>
        <div>
          <div className="page-header">
            <h3 className="page-title">Roles Page</h3>
          </div>
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

          {this.state.successMsg.map((succ) =>
            <Alert
              className="p-1"
              variant="success"
              show={succ}
              transition={false}
              key={succ}
            >
              {succ}
            </Alert>
          )}

          <div className="row" data-testid="Roles">
            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Roles Table</h4>

                  {this.props.priv === PRIVILEGES.readWrite &&
                    <Link to="/roles/form/add" className="btn btn-outline-secondary float-sm-right d-block">
                      <i className="mdi mdi-account-plus"> </i>
                      Add Role
                    </Link>
                  }

                  <Table
                    data={this.state.data}
                    tblClass=""
                    colData={this.colData}
                    actionButtons={actionButtons}
                    idKey={this.idKey}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      </>
    );
  }

}

export default Roles;