import React from 'react'
import './Users.css';
import axios from 'axios';
import Table from '../../components/Table/Table.lazy';
import { retryRequest } from "../../helpers/utils";
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination/Pagination';
import { Alert } from 'react-bootstrap';

const userURL = "http://localhost:3000/API/user/get/all";
const userCountURL = "http://localhost:3000/API/user/get/all/count";

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

    this.fetchData();
  }

  // passed pageNumber as param to prevent executing render twice when setting state twice
  fetchData = async (pageNumber = this.state.currentPage) => {
    const axiosConfig = {
      withCredentials: true,
      timeout: 10000
    }

    // first, fetch count first to send the right page on the next request
    let rowCount;
    try {
      const respCount = await axios.get(
        userCountURL,
        axiosConfig
      );

      rowCount = respCount.data.data.count;
    } catch (error) {
      this.setState({
        errorMsg: `${error}`
      });
      return;
    }

    // second, fetch the users data
    try {
      const maxPage = Math.ceil(rowCount / this.state.currentEntries);

      // if state.currentPage is higher than the maxPage, for instance when
      // state.currentEntries is changed with higher state.currentPage
      if (pageNumber > maxPage) {
        pageNumber = 1;
      }

      const resp = await axios.get(
        userURL + `?page=${pageNumber}&limit=${this.state.currentEntries}`,
        axiosConfig
      );

      const { data } = resp;

      if (data.status === true) {
        this.setState({
          currentPage: pageNumber,
          data: data.data.users,
          maxPage: maxPage,
          maxUsers: data.data.count,
          errorMsg: false
        });
      } else {
        this.setState({
          errorMsg: data.msg
        });
      }

    } catch (error) {
      this.setState({
        errorMsg: `${error}`
      });
    }
  }

  paginationClick = async (pageNumber) => {
    this.fetchData(pageNumber);
  }

  entryOnChange = async (e) => {
    await this.setState({ currentEntries: e.target.value });
    this.fetchData();
  }


  render() {
    const { maxPage, currentPage } = this.state;

    return (
      <>

        <Table
          urlRedirect="/users/form"
          isWriteable={this.props.priv === "RW"}
          data={this.state.data}
          title="Users"
          tblClass="table-bordered"
          colData={this.colData} />
        <Alert
          className="p-1"
          variant="danger"
          show={this.state.errorMsg}
          transition={false}
        >
          {this.state.errorMsg}
        </Alert>
        <div className="row">
          <div className="col mt-3">
            {this.props.priv === "RW" && <Link to="/users/form/add" className="btn btn-outline-secondary btn-lg float-sm-left d-block">
              <i className="mdi mdi-account-plus"> </i>
            Add User
            </Link>}
          </div>
          <div className="col-lg-6 mt-3">
            <Pagination currentPage={currentPage} maxPage={maxPage} onClick={this.paginationClick} />
          </div>
          <div className="col mt-3">
            <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">
              Show
              <input
                className="form-control"
                value={this.state.currentEntries}
                onChange={(e) => { this.entryOnChange(e) }}
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
