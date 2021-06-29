import React from 'react'
import './Menus.css';
import axios from 'axios';
import Table from '../../components/Table/Table.lazy';
import { retryRequest } from "../../helpers/utils";
import { Alert } from 'react-bootstrap';
import * as currentModule from './Menus'; // use currentmodule to call func outside class, for testing
import { PRIVILEGES } from "../../helpers/constants"
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination/Pagination';

const menuURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/get/all`;
const menuCountURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/get/all/count`;

const axiosConfig = {
  withCredentials: true,
  timeout: 10000
}

export async function fetchCount() {

  try {
    const respCount = await axios.get(
      menuCountURL,
      axiosConfig
    );
    const { data } = respCount;

    return data;

  } catch (error) {
    return { status: false, msg: error }
  }
}

export async function fetchMenusData(pageNumber, currentEntries) {

  try {
    const resp = await axios.get(
      `${menuURL}?page=${pageNumber}&limit=${currentEntries}`,
      axiosConfig
    );

    const { data } = resp;

    return data;

  } catch (error) {
    return { status: false, msg: error };
  }
}

class Menus extends React.Component {

  constructor() {
    super();
    this.state = {
      data: [],
      errorMsg: [],
      successMsg: [],
      maxPage: null,
      maxMenus: null,
      currentPage: 1,
      currentEntries: 5
    }

    this.colData = [
      { "id": "MenuID", "name": "Menu ID" },
      { "id": "MenuName", "name": "Menu Name" }
    ];

    this.successTimer = null;
    this.errorTimer = null;

    this.idKey = "MenuID";
  }

  async componentDidMount() {

    await this.fetchAndSave();

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

  setErrorMsg(errorVal) {
    this.setState({ errorMsg: [errorVal] });
  }

  pushErrorMsg(errorVal) {
    this.setState({ errorMsg: [...this.state.errorMsg, errorVal] });
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
      this.showSuccessAlert(this.props.location.successMsg);
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

    // make timeout reset when success alert is continuous
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

  paginationClick = async (pageNumber) => {
    this.fetchAndSave(pageNumber);
  }

  entryOnChange = async (e) => {
    await this.setState({ currentEntries: e.target.value });
    this.fetchAndSave();
  }

  fetchAndSave = async (pageNumber = this.state.currentPage) => {
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

      // second, fetch the menu data
      // import current module and call fetchMenusData for testing benefits
      const resp = await currentModule.fetchMenusData(pageNumber, this.state.currentEntries);

      if (resp.status === true) {
        this.setState({
          currentPage: pageNumber,
          data: resp.data,
          maxPage: maxPage,
          maxMenus: count
        });

        this.clearErrorMsg();
      } else {
        this.setErrorMsg(`${resp.msg}`);

      }

    } else {
      this.setErrorMsg(`${respCount.msg}`);

    }
  }

  render() {
    const { maxPage, currentPage } = this.state;
    let isWriteable = this.props.priv === PRIVILEGES.readWrite;

    const actionButtons = (menuID) => {
      return (
        <>
          <Link to={`/menus/form/${menuID}`} className="btn btn-icon-text btn-outline-secondary mr-3">
            {isWriteable ? "Edit" : "Read"} Menu
            <i className={`mdi ${isWriteable ? "mdi-pencil" : "mdi-read"} btn-icon-append `}></i>
          </Link>

        </>
      )
    };

    return (

      <>
        <div>
          <div className="page-header">
            <h3 className="page-title"> Menu Page</h3>
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

          <div className="row" data-testid="Menu" >
            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title"> Menu Table</h4>
                  <div className="row mb-4">
                    <div className="col mt-3">
                      <span className="float-sm-left d-block mt-1 mt-sm-0 text-center">
                        Show
                        <input
                          id="inputEntry"
                          className="form-control ml-2 mr-2"
                          value={this.state.currentEntries}
                          onChange={(e) => { this.entryOnChange(e) }}
                          type="text" style={style.inputEntry}
                        />
                        of {this.state.maxMenus} entries
                      </span>
                    </div>
                    <div className="col-lg-6 mt-3">
                      <Pagination currentPage={currentPage} maxPage={maxPage} onClick={this.paginationClick} />
                    </div>
                    <div className="col mt-3">
                      {this.props.priv === PRIVILEGES.readWrite &&
                        <Link to="/menus/form/add" className="btn btn-outline-secondary float-sm-right d-block">
                          <i className="mdi mdi-account-plus"> </i>
                          Add Menu
                        </Link>
                      }

                    </div>
                  </div>
                  <Table
                    data={this.state.data}
                    tblClass=""
                    colData={this.colData}
                    idKey={this.idKey}
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

const style = {
  inputEntry: {
    'maxWidth': '4rem',
    'width': 'auto',
    'display': 'inline-block'
  }
}

export default Menus;