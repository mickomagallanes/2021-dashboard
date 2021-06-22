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
      errorMsg: false
    }

    this.colData = [
      { "id": "id", "name": "Role ID" },
      { "id": "rname", "name": "Role name" }
    ];
  }

  async componentDidMount() {

    // import current module and call fetchRolesData for testing benefits
    let data = await currentModule.fetchRolesData();

    this.saveData(data);
  }

  saveData = async (data) => {

    if (data.status === true) {
      this.setState({
        data: data.data,
        errorMsg: false
      });
    } else {
      this.setState({
        errorMsg: data.msg
      });
    }
  }

  render() {
    let isWriteable = this.props.priv === PRIVILEGES.readWrite;
    const actionButtons = (roleId) => {
      return (
        <>
          <Link to={`/roles/form/${roleId}`} className="btn btn-icon-text btn-outline-secondary">
            {isWriteable ? "Edit" : "Read"}
            <i className={`mdi ${isWriteable ? "mdi-pencil" : "mdi-read"} btn-icon-append `}></i>
          </Link>

        </>
      )
    };

    return (
      <>
        <div>
          <div className="page-header">
            <h3 className="page-title">Roles Page</h3>
          </div>
          <Alert
            className="p-1"
            variant="danger"
            show={this.state.errorMsg}
            transition={false}
          >
            {this.state.errorMsg}
          </Alert>
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