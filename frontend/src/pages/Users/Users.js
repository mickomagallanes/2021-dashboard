import React from 'react'
import './Users.css';
import axios from 'axios';
import Table from '../../components/Table/Table.lazy';
import { retryRequest } from "../../helpers/utils";
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination/Pagination';
import { Alert } from 'react-bootstrap';
import * as currentModule from './Users'; // use currentmodule to call func outside class, for testing

const userURL = `${process.env.REACT_APP_BACKEND_HOST}/API/user/get/all`;
const userCountURL = `${process.env.REACT_APP_BACKEND_HOST}/API/user/get/all/count`;

const axiosConfig = {
  withCredentials: true,
  timeout: 10000
}

export async function fetchCount() {

  try {
    const respCount = await axios.get(
      userCountURL,
      axiosConfig
    );
    const { data } = respCount;

    return data;

  } catch (error) {
    return { status: false, msg: error }
  }
}

export async function fetchUsersData(pageNumber, currentEntries) {

  try {

    const resp = await axios.get(
      `${userURL}?page=${pageNumber}&limit=${currentEntries}`,
      axiosConfig
    );

    const { data } = resp;

    return data;

  } catch (error) {
    return { status: false, msg: error }
  }
}

class Users extends React.Component {

  constructor() {
    super();
    this.state = {
      data: [],
      maxPage: null,
      maxUsers: null,
      currentPage: 1,
      currentEntries: 5,
      errorMsg: false
    }

    this.colData = [
      { "id": "id", "name": "User ID" },
      { "id": "uname", "name": "Username" },
      { "id": "rname", "name": "Role Name" }
    ];
  }

  componentDidMount() {

    this.fetchAndSave();
  }

  async fetchAndSave(pageNumber = this.state.currentPage) {
    // first, fetch count first to send the right page on the next request
    let respCount = await currentModule.fetchCount();

    if (respCount.status === true) {
      let count = respCount.data.count;

      const maxPage = Math.ceil(count / this.state.currentEntries);

      // if state.currentPage is higher than the maxPage, for instance when
      // state.currentEntries is changed with higher state.currentPage
      if (pageNumber > maxPage) {
        pageNumber = 1;
      }

      // second, fetch the users data
      const resp = await currentModule.fetchUsersData(pageNumber, this.state.currentEntries);

      if (resp.status === true) {
        this.setState({
          currentPage: pageNumber,
          data: resp.data,
          maxPage: maxPage,
          maxUsers: count,
          errorMsg: false
        });
      } else {
        this.setState({
          errorMsg: resp.msg
        });
      }

    } else {
      this.setState({
        errorMsg: respCount.msg
      });
    }


  }

  paginationClick = async (pageNumber) => {
    this.fetchAndSave(pageNumber);
  }

  entryOnChange = async (e) => {
    await this.setState({ currentEntries: e.target.value });
    this.fetchAndSave();
  }


  render() {
    const { maxPage, currentPage } = this.state;

    return (
      <>
        <div>
          <div className="page-header">
            <h3 className="page-title">Users Page</h3>
          </div>
          <Alert
            className="p-1"
            variant="danger"
            show={this.state.errorMsg}
            transition={false}
          >
            {this.state.errorMsg}
          </Alert>
          <div className="row" data-testid="Users" >
            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Users Table</h4>
                  <div className="row mb-4">
                    <div className="col mt-3">
                      <span className="float-sm-left d-block mt-1 mt-sm-0 text-center">
                        Show
                        <input
                          className="form-control ml-2 mr-2"
                          value={this.state.currentEntries}
                          onChange={(e) => { this.entryOnChange(e) }}
                          type="text" style={style.inputEntry}
                        />
                        of {this.state.maxUsers} entries
                      </span>
                    </div>
                    <div className="col-lg-6 mt-3">
                      <Pagination currentPage={currentPage} maxPage={maxPage} onClick={this.paginationClick} />
                    </div>
                    <div className="col mt-3">
                      {this.props.priv === "RW" && <Link to="/users/form/add" className="btn btn-outline-secondary float-sm-right d-block">
                        <i className="mdi mdi-account-plus"> </i>
                        Add User
                      </Link>}

                    </div>
                  </div>
                  <Table
                    urlRedirect="/users/form"
                    isWriteable={this.props.priv === "RW"}
                    data={this.state.data}
                    tblClass=""
                    colData={this.colData} />
                </div>
              </div>
            </div>
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
