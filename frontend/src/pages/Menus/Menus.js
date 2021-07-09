import React, { useEffect, useState } from 'react'
import ReactDOM from "react-dom";
import './Menus.css';
import Table from '../../components/Table/Table.lazy';
import { PRIVILEGES } from "../../helpers/constants"
import { Link, useLocation } from 'react-router-dom';
import Pagination from '../../components/Pagination/Pagination';
import useAlert from '../../components/useAlert';
import useFetch from '../../components/useFetch';
import useDidUpdateEffect from '../../components/useDidUpdateEffect';
import Spinner from '../../components/Spinner/Spinner';

const menuURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/get/all`;
const menuCountURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/get/all/count`;

const colData = [
  { "id": "MenuID", "name": "Menu ID" },
  { "id": "MenuName", "name": "Menu Name" }
];

const idKey = "MenuID";

const style = {
  inputEntry: {
    'maxWidth': '4rem',
    'width': 'auto',
    'display': 'inline-block'
  }
}

function Menus({ priv }) {

  // HOOKS DECLARATIONS AND VARIABLES

  const [menuData, setMenuData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentEntries, setCurrentEntries] = useState(5);
  const [maxPage, setMaxPage] = useState(null);
  const [maxMenus, setMaxMenus] = useState(null);

  // to determine if initial fetch of data is done
  const [initialFetchStatus, setInitialFetchStatus] = useState(false);

  const fetchDeps = [currentEntries, currentPage];

  const [dataCount, loadingCount] = useFetch(menuCountURL, fetchDeps);
  const [dataMenus, loadingMenus] = useFetch(`${menuURL}?page=${currentPage}&limit=${currentEntries}`, fetchDeps);


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

    if (dataMenus && dataCount) {
      if (dataCount.status === true) {
        let count = dataCount.data.count;

        const newMaxPage = Math.ceil(count / currentEntries);

        // if state.currentPage is higher than the maxPage, for instance when
        // state.currentEntries is changed with higher state.currentPage
        if (currentPage > newMaxPage) {
          setCurrentPage(1); // triggers fetch again
        }

        if (dataMenus.status === true) {
          ReactDOM.unstable_batchedUpdates(() => {
            setMaxMenus(count);
            setMaxPage(newMaxPage);
            setMenuData(dataMenus.data);
            clearErrorMsg();
            setInitialFetchStatus(true);
          });


        } else {
          passErrorMsg(`${dataMenus.msg}`);
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

    // show error after setting the menu data
  }, [location, initialFetchStatus, timerSuccessAlert, timerErrorAlert])

  useDidUpdateEffect(() => {

    checkFetchedData();
  }, [dataMenus, dataCount]);


  // UI
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

        <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
        <div className="row" data-testid="Menu" >
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title"> Menu Table </h4>

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
                      of {maxMenus} entries
                    </span>
                  </div>

                  {loadingMenus && loadingCount ? <Spinner /> :
                    <div className="col-lg-6 mt-3">
                      <Pagination currentPage={currentPage} maxPage={maxPage} onClick={paginationClick} />
                    </div>}
                  <div className="col mt-3">
                    {isWriteable &&
                      <Link to="/menus/form/add" className="btn btn-outline-secondary float-sm-right d-block">
                        <i className="mdi mdi-account-plus"> </i>
                        Add Menu
                      </Link>
                    }

                  </div>
                </div>
                {loadingMenus && loadingCount ? <Spinner /> :
                  <Table
                    data={menuData}
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






export default Menus;