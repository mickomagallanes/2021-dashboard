import React, { useEffect, useState, useRef } from 'react'
import ReactDOM from "react-dom";
import './Menus.css';
import axios from 'axios';
import Table from '../../components/Table/Table.lazy';
import * as currentModule from './Menus'; // use currentmodule to call func outside class, for testing
import { PRIVILEGES } from "../../helpers/constants"
import { Link, useLocation } from 'react-router-dom';
import Pagination from '../../components/Pagination/Pagination';
import useAlert from '../../components/useAlert';
import useFetch from '../../components/useFetch';

const menuURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/get/all`;
const menuCountURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/get/all/count`;

const axiosConfig = {
  withCredentials: true,
  timeout: 10000
}

export async function fetchCount() {
  console.log("fetch count")
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

// TODO: move into its own module
function useDidUpdateEffect(fn, inputs) {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current)
      fn();
    else
      didMountRef.current = true;
  }, inputs);
}

function Menus({ priv }) {

  // HOOKS DECLARATIONS

  const [menuData, setMenuData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentEntries, setCurrentEntries] = useState(5);
  const [maxPage, setMaxPage] = useState(null);
  const [maxMenus, setMaxMenus] = useState(null);

  const [dataCount, loadingCount] = useFetch(menuCountURL);
  const [dataMenus, loadingMenus] = useFetch(`${menuURL}?page=${currentPage}&limit=${currentEntries}`);

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

  // CONSTANT DATA

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

  const isWriteable = priv === PRIVILEGES.readWrite;

  // FUNCTIONS AND EVENT HANDLERS
  const paginationClick = async (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  const entryOnChange = async (e) => {
    setCurrentEntries(e.target.value);
  }

  const fetchAndSave = async () => {

    if (dataCount.status === true) {
      let count = dataCount.data.count;

      const newMaxPage = Math.ceil(count / currentEntries);

      // if state.currentPage is higher than the maxPage, for instance when
      // state.currentEntries is changed with higher state.currentPage
      if (currentPage > newMaxPage) {
        setCurrentPage(1);
      }

      if (dataMenus.status === true) {

        ReactDOM.unstable_batchedUpdates(() => {
          setCurrentPage(currentPage);
          setMaxMenus(count);
          setMaxPage(newMaxPage);
          setMenuData(dataMenus.data);
          clearErrorMsg();
        });


      } else {
        passErrorMsg(`${dataMenus.msg}`);
      }

    } else {
      passErrorMsg(`${dataCount.msg}`);

    }
  }

  // LIFECYCLES
  useEffect(() => {
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

    fetchAndSave();

    loadSuccessProp();

    loadErrorProp();

  }, [loadingCount, loadingMenus])

  // TODO: optimize call of fetchAndSave, learn more about hooks
  useDidUpdateEffect(() => {
    fetchAndSave();
  }, [currentEntries, maxPage, maxMenus, currentPage, loadingCount, loadingMenus]);


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
                  <div className="col-lg-6 mt-3">
                    <Pagination currentPage={currentPage} maxPage={maxPage} onClick={paginationClick} />
                  </div>
                  <div className="col mt-3">
                    {isWriteable &&
                      <Link to="/menus/form/add" className="btn btn-outline-secondary float-sm-right d-block">
                        <i className="mdi mdi-account-plus"> </i>
                        Add Menu
                      </Link>
                    }

                  </div>
                </div>
                <Table
                  data={menuData}
                  tblClass=""
                  colData={colData}
                  idKey={idKey}
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






export default Menus;