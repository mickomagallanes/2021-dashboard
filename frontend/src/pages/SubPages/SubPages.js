import React, { useEffect, useState } from 'react'
import ReactDOM from "react-dom";
import './SubPages.css';
import Table from '../../components/Table/Table.lazy';
import { PRIVILEGES } from "../../helpers/constants"
import { Link, useHistory, useLocation } from 'react-router-dom';
import Pagination from '../../components/Pagination/Pagination';
import useAlert from '../../components/useAlert';
import useFetch from '../../components/useFetch';
import useDidUpdateEffect from '../../components/useDidUpdateEffect';
import Spinner from '../../components/Spinner/Spinner';

const subPageURL = `${process.env.REACT_APP_BACKEND_HOST}/API/subpage/get/all`;
const subPageCountURL = `${process.env.REACT_APP_BACKEND_HOST}/API/subpage/get/all/count`;

const colData = [
  { "id": "SubPageID", "name": "SubPage ID" },
  { "id": "SubPageName", "name": "SubPage Name" }
];

const idKey = "SubPageID";

const style = {
  inputEntry: {
    'maxWidth': '4rem',
    'width': 'auto',
    'display': 'inline-block'
  }
}

function SubPages({ priv }) {

  // HOOKS DECLARATIONS AND VARIABLES

  const location = useLocation();

  const [subPageData, setSubPageData] = useState([]);

  const searchParams = new URLSearchParams(location.search);
  const pageParams = searchParams.get('page');
  const entryParams = searchParams.get('entry');
  const pageInitOptional = parseInt(pageParams);
  const entryInitOptional = parseInt(entryParams);

  const [currentPage, setCurrentPage] = useState(pageParams ? pageInitOptional : 1);
  const [currentEntries, setCurrentEntries] = useState(entryParams ? entryInitOptional : 5);
  const [maxPage, setMaxPage] = useState(null);
  const [maxSubPages, setMaxSubPages] = useState(null);

  const history = useHistory();

  // to determine if initial fetch of data is done

  const fetchDeps = [currentEntries, currentPage];

  const [dataCount, loadingCount] = useFetch(subPageCountURL, { customDeps: fetchDeps });
  const [dataSubPages, loadingSubPages] = useFetch(`${subPageURL}?page=${currentPage}&limit=${currentEntries}`, { customDeps: fetchDeps });

  const {
    timerSuccessAlert,
    timerErrorAlert,
    passErrorMsg,
    AlertElements,
    clearErrorMsg,
    errorMsg,
    successMsg,
    errorTimerValue
  } = useAlert();


  const isWriteable = priv === PRIVILEGES.readWrite;

  // FUNCTIONS AND EVENT HANDLERS
  const paginationClick = async (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  const entryOnChange = async (e) => {
    setCurrentEntries(e.target.value);
  }

  const checkFetchedData = async () => {
    if (dataSubPages && dataCount) {
      if (dataCount.status === true) {
        let count = dataCount.data.count;

        const newMaxPage = Math.ceil(count / currentEntries);

        // if state.currentPage is higher than the maxPage, for instance when
        // state.currentEntries is changed with higher state.currentPage
        if (currentPage > newMaxPage) {
          setCurrentPage(1); // triggers fetch again

          return;
        }

        if (dataSubPages.status === true) {
          ReactDOM.unstable_batchedUpdates(() => {
            setMaxSubPages(count);
            setMaxPage(newMaxPage);
            setSubPageData(dataSubPages.data);
            if (!errorTimerValue) {
              clearErrorMsg();
            }
          });

        } else {
          passErrorMsg(`${dataSubPages.msg}`);
        }

      } else {
        passErrorMsg(`${dataCount.msg}`);

      }
    }
  }

  // LIFECYCLES

  // show passed errorMsg or successMsg only once
  useEffect(() => {

    if (location.errorMsg) {

      const loadErrorProp = () => {

        timerErrorAlert(location.errorMsg);
      }

      loadErrorProp();

      return () => {
        location.errorMsg = null;
      }
    }

    if (location.successMsg) {

      const loadSuccessProp = () => {
        timerSuccessAlert(location.successMsg);
      }

      loadSuccessProp();
      return () => {
        location.successMsg = null;
      }
    }

  }, [location, timerErrorAlert, timerSuccessAlert])


  useDidUpdateEffect(() => {

    checkFetchedData();
  }, [dataSubPages, dataCount]);


  // update url search params when currentPage or currentEntries changes
  useDidUpdateEffect(() => {
    const currSearch = `?page=${currentPage}&entry=${currentEntries}`;

    if (location.search !== currSearch) {
      history.push({
        search: currSearch
      })
    }

  }, [currentPage, currentEntries]);

  // UI
  const actionButtons = (subPageID) => {
    return (
      <>
        <Link to={`/subpages/form/${subPageID}${location.search}`} className="btn btn-icon-text btn-outline-secondary mr-3">
          {isWriteable ? "Edit" : "Read"} SubPage
          <i className={`mdi ${isWriteable ? "mdi-pencil" : "mdi-read"} btn-icon-append `}></i>
        </Link>

      </>
    )
  };

  return (

    <>
      <div>
        <div className="page-header">
          <h3 className="page-title"> SubPage Page</h3>
        </div>

        <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
        <div className="row" data-testid="SubPage" >
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title"> SubPage Table </h4>

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
                      of {maxSubPages} entries
                    </span>
                  </div>

                  {loadingSubPages && loadingCount ? <Spinner /> :
                    <div className="col-lg-6 mt-3">
                      <Pagination currentPage={currentPage} maxPage={maxPage} onClick={paginationClick} />
                    </div>}
                  <div className="col mt-3">
                    {isWriteable &&
                      <Link to={`/subpages/form/add${location.search}`} className="btn btn-outline-secondary float-sm-right d-block">
                        <i className="mdi mdi-account-plus"> </i>
                        Add SubPage
                      </Link>
                    }

                  </div>
                </div>
                {loadingSubPages && loadingCount ? <Spinner /> :
                  <Table
                    data={subPageData}
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


export default SubPages;