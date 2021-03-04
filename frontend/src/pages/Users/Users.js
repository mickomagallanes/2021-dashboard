import React from 'react'
import './Users.css';
import axios from 'axios';
import Table from '../../components/Table/Table.lazy';
import { retryRequest } from "../../helpers/utils";
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination/Pagination';
import * as yup from 'yup';
import { Formik } from 'formik';

const schema = yup.object().shape({
  currentEntries: yup.string().max(45, 'Must be 45 characters or less').required('Required')
});

const userURL = "http://localhost:3000/API/user/get/all";

class Users extends React.Component {

  constructor() {
    super();
    this.state = {
      data: [],
      maxPage: null,
      maxUsers: null,
      currentPage: 1,
      currentEntries: 5
    }

    this.colData = [
      { "id": "id", "name": "User ID" },
      { "id": "uname", "name": "Username" },
      { "id": "rname", "name": "Role Name" }
    ];
  }

  componentDidMount() {

    this.fetchData(this.state.currentPage);
  }

  // passed pageNumber as param to prevent executing render twice when setting state twice
  fetchData = async (pageNumber) => {
    const axiosConfig = {
      withCredentials: true,
      timeout: 10000
    }

    try {
      const resp = await axios.get(
        userURL + `?page=${pageNumber}&limit=${this.state.currentEntries}`,
        axiosConfig
      );

      const { data } = resp;

      if (data.status === true) {
        this.setState({
          currentPage: pageNumber,
          data: data.data.users,
          maxPage: Math.ceil(data.data.count / this.state.currentEntries),
          maxUsers: data.data.count
        });
      }

    } catch (error) {
      // retryRequest(this.fetchData);
    }
  }

  paginationClick = async (pageNumber) => {
    this.fetchData(pageNumber);
  }

  render() {
    const { maxPage, currentPage } = this.state;
    console.log("dogs")
    return (
      <>
        <Table
          urlRedirect="/users/form"
          isWriteable={this.props.priv === "RW"}
          data={this.state.data}
          title="Users"
          tblClass="table-bordered"
          colData={this.colData} />

        <div className="row">
          <div className="col">
            <Link to="/users/form/add" className="btn btn-outline-secondary btn-lg">
              <i className="mdi mdi-account-plus"> </i>
            Add User
            </Link>
          </div>
          <div className="col-lg-6">
            <Pagination currentPage={currentPage} maxPage={maxPage} onClick={this.paginationClick} />
          </div>
          <div className="col">
            <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">
              Show
              <input
                className="form-control"
                value={this.state.currentEntries}
                onChange={(e) => { this.setState({ currentEntries: e.target.value }) }}
                type="text" style={style.inputEntry}
              />
              of {this.state.maxUsers} entries
            </span>
          </div>
        </div>
      </>
    );
  }

}

const style = {
  inputEntry: {
    'maxWidth': '4rem',
    'width': 'auto',
    'display': 'inline-block'
  }
}
export default Users;
