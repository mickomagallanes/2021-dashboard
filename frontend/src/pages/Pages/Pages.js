import React, { useEffect, useState } from 'react'
import ReactDOM from "react-dom";
import './Pages.css';
import Table from '../../components/Table/Table.lazy';
import { PRIVILEGES } from "../../helpers/constants"
import { Link, useLocation } from 'react-router-dom';
import Pagination from '../../components/Pagination/Pagination';
import useAlert from '../../components/useAlert';
import useFetch from '../../components/useFetch';
import useDidUpdateEffect from '../../components/useDidUpdateEffect';
import Spinner from '../../components/Spinner/Spinner';

const pageURL = `${process.env.REACT_APP_BACKEND_HOST}/API/pages/get/all`;
const pageCountURL = `${process.env.REACT_APP_BACKEND_HOST}/API/pages/get/all/count`;

const colData = [
  { "id": "PageID", "name": "Page ID" },
  { "id": "PageName", "name": "Page Name" }
];

const idKey = "PageID";

const style = {
  inputEntry: {
    'maxWidth': '4rem',
    'width': 'auto',
    'display': 'inline-block'
  }
}

function Pages({ priv }) {

  // HOOKS DECLARATIONS AND VARIABLES

  const [pageData, setPageData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentEntries, setCurrentEntries] = useState(5);
  const [maxPage, setMaxPage] = useState(null);
  const [maxPages, setMaxPages] = useState(null);

  // to determine if initial fetch of data is done
  const [initialFetchStatus, setInitialFetchStatus] = useState(false);

  const fetchDeps = [currentEntries, currentPage];

  const [dataCount, loadingCount] = useFetch(pageCountURL, fetchDeps);
  const [dataPages, loadingPages] = useFetch(`${pageURL}?page=${currentPage}&limit=${currentEntries}`, fetchDeps);


  const {
    timerSuccessAlert,
    timerErrorAlert,
    passErrorMsg,
    AlertElements,
    clearErrorMsg,
    errorMsg,
    successMsg
  } = useAlert();

  const location = useLocation();

  const isWriteable = priv === PRIVILEGES.readWrite;

  // FUNCTIONS AND EVENT HANDLERS
  const paginationClick = async (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  const entryOnChange = async (e) => {
    setCurrentEntries(e.target.value);
  }

  const checkFetchedData = async () => {
    if (dataPages && dataCount) {
      if (dataCount.status === true) {
        let count = dataCount.data.count;

        const newMaxPage = Math.ceil(count / currentEntries);

        // if state.currentPage is higher than the maxPage, for instance when
        // state.currentEntries is changed with higher state.currentPage
        if (currentPage > newMaxPage) {
          setCurrentPage(1); // triggers fetch again
        }

        if (dataPages.status === true) {
          ReactDOM.unstable_batchedUpdates(() => {
            setMaxPages(count);
            setMaxPage(newMaxPage);
            setPageData(dataPages.data);
            clearErrorMsg();
            setInitialFetchStatus(true);
          });


        } else {
          passErrorMsg(`${dataPages.msg}`);
        }

      } else {
        passErrorMsg(`${dataCount.msg}`);

      }
    }
  }

  // LIFECYCLES
  useEffect(() => {
    if (initialFetchStatus) {

      const loadSuccessProp = () => {
        if (location.successMsg) {
          timerSuccessAlert(location.successMsg);
        }
      }

      const loadErrorProp = () => {
        if (location.errorMsg) {
          timerErrorAlert(location.errorMsg);
        }
      }

      loadSuccessProp();

      loadErrorProp();

      return () => {
        location.errorMsg = null;
        location.successMsg = null;
      }
    }

    // show error after setting the page data
  }, [location, initialFetchStatus, timerSuccessAlert, timerErrorAlert])

  useDidUpdateEffect(() => {

    checkFetchedData();
  }, [dataPages, dataCount]);


  // UI
  const actionButtons = (pageID) => {
    return (
      <>
        <Link to={`/pages/form/${pageID}`} className="btn btn-icon-text btn-outline-secondary mr-3">
          {isWriteable ? "Edit" : "Read"} Page
          <i className={`mdi ${isWriteable ? "mdi-pencil" : "mdi-read"} btn-icon-append `}></i>
        </Link>

      </>
    )
  };

  return (

    <>
      <div>
        <div className="page-header">
          <h3 className="page-title"> Page Page</h3>
        </div>

        <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
        <div className="row" data-testid="Page" >
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title"> Page Table </h4>

                <div className="row mb-4">
                  <div className="col mt-3">
                    <span className="float-sm-left d-block mt-1 mt-sm-0 text-center">
                      Show
                      <input
                        id="inputEntry"
                        className="form-control ml-2 mr-2"
                        value={currentEntries}
                        onChange={(e) => { entryOnChange(e) }}
                        type="text" style={style.inputEntry}
                      />
                      of {maxPages} entries
                    </span>
                  </div>

                  {loadingPages && loadingCount ? <Spinner /> :
                    <div className="col-lg-6 mt-3">
                      <Pagination currentPage={currentPage} maxPage={maxPage} onClick={paginationClick} />
                    </div>}
                  <div className="col mt-3">
                    {isWriteable &&
                      <Link to="/pages/form/add" className="btn btn-outline-secondary float-sm-right d-block">
                        <i className="mdi mdi-account-plus"> </i>
                        Add Page
                      </Link>
                    }

                  </div>
                </div>
                {loadingPages && loadingCount ? <Spinner /> :
                  <Table
                    data={pageData}
                    tblClass=""
                    colData={colData}
                    idKey={idKey}
                    actionButtons={actionButtons}
                  />
                }
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}






export default Pages;