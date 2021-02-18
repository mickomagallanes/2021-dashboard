import React from 'react'
import './Users.css';
import axios from 'axios';
import Table from '../../components/Table/Table.lazy';
import { retryRequest } from "../../helpers/utils";

const userURL = "http://localhost:3000/API/user/get/all";

class Users extends React.Component {

  constructor() {
    super();
    this.state = {
      data: false
    }

    this.colData = [
      { "id": "id", "name": "User ID" },
      { "id": "uname", "name": "Username" },
      { "id": "rname", "name": "Role Name" }
    ];
  }

  componentDidMount() {

    this.fetchData();
  }

  fetchData = async () => {
    const axiosConfig = {
      timeout: 10000
    }

    try {
      const resp = await axios.get(
        userURL,
        axiosConfig
      );

      if (resp.data.status === true) {
        this.setState({ data: resp.data.data });
      }

    } catch (error) {
      retryRequest(this.fetchData);
    }
  }

  render() {
    // TODO: make new Table component with button edit and delete, 
    // or just add it to the table component like pass prop the priv

    return (
      <Table
        urlRedirect="/users/form"
        isWriteable={this.props.priv == "RW"}
        data={this.state.data}
        title="Users"
        tblClass="table-bordered"
        colData={this.colData} />
    );
  }

}


export default Users;
