import React from 'react'
import './Roles.css';
import axios from 'axios';
import Table from '../../components/Table/Table.lazy';
import { retryRequest } from "../../helpers/utils";
import { Alert } from 'react-bootstrap';

const roleURL = `${process.env.REACT_APP_BACKEND_HOST}/API/role/get/all`;

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

    let data = await this.fetchData();
    saveData(data);
  }

  fetchData = async () => {
    const axiosConfig = {
      withCredentials: true,
      timeout: 10000
    }

    try {
      const resp = await axios.get(
        roleURL,
        axiosConfig
      );

      const { data } = resp;

      return data;

    } catch (error) {
      this.setState({
        errorMsg: `${error}`
      });
    }
  }

  async saveData(data) {

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

                  <Table
                    urlRedirect="/roles/form"
                    isWriteable={false}
                    data={this.state.data}
                    tblClass=""
                    colData={this.colData}
                    actionDisabled={true}
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
