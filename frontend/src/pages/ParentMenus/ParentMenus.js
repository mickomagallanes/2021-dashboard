import React, { useRef, useState } from 'react'
import './ParentMenus.css';
import ReactDOM from "react-dom";
import { PRIVILEGES } from "../../helpers/constants"
import { Link, useLocation } from 'react-router-dom';
import useBundledTable from '../../components/useBundledTable';
import useFetch from '../../components/useFetch';
import useDelete from '../../components/useDelete';
import usePost from '../../components/usePost';
import useDialog from '../../components/useDialog';
import useAlert from '../../components/useAlert';
import useDidUpdateEffect from '../../components/useDidUpdateEffect';
import Spinner from '../../components/Spinner/Spinner';

const parentMenuURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/parent/get/all`;
const parentMenuCountURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/parent/get/all/count`;
const sortUpURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/parent/sort/up`;
const sortDownURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/parent/sort/down`;

const parentMenuDeleteURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/parent/delete/`;

const modalTitle = "Do you want to delete this parent menu?";
const modalBody = "This row will be deleted in the database, do you want to proceed?";

const colData = [
  { "id": "ParentMenuID", "name": "Parent Menu ID" },
  { "id": "ParentMenuName", "name": "Parent Menu Name" },
  { "id": "ParentMenuSort", "name": "Parent Menu Sort" }
];

const idKey = "ParentMenuID";

function ParentMenus({ priv }) {

  // HOOKS DECLARATIONS AND VARIABLES

  const location = useLocation();

  const [parentMenuData, setParentMenuData] = useState([]);
  const [totalParentMenus, setTotalParentMenus] = useState(null);

  const shouldRefetch = useRef(true);

  const {
    searchParamQuery,
    entryProps,
    entryProps: {
      currentEntries
    },
    paginationProps,
    paginationProps: {
      currentPage
    },
    tableProps,
    BundledTable
  } = useBundledTable({ data: parentMenuData, dataCount: totalParentMenus });

  // to determine if initial fetch of data is done

  const fetchDepsCount = [currentEntries, currentPage, shouldRefetch.current];
  const fetchDepsMenus = [shouldRefetch.current];

  // also only loads by page and not sort since url is static
  const [dataCount, loadingCount] = useFetch(parentMenuCountURL, { customDeps: fetchDepsCount });

  const [dataParentMenus, loadingParentMenus] = useFetch(parentMenuURL + searchParamQuery, { customDeps: fetchDepsMenus });

  const [deleteParentMenu, deleteParentMenuResult] = useDelete(parentMenuDeleteURL);
  const [sortUp, sortUpResult] = usePost(sortUpURL);
  const [sortDown, sortDownResult] = usePost(sortDownURL);

  const confirmDelete = useRef();

  const {
    handleShow,
    handleClose,
    show,
    DialogElements
  } = useDialog();


  const {
    timerSuccessAlert,
    timerErrorAlert,
    passErrorMsg,
    AlertElements,
    clearErrorMsg,
    errorMsg,
    successMsg,
    errorTimerValue
  } = useAlert({ showLocationMsg: true });


  const isWriteable = priv === PRIVILEGES.readWrite;

  // FUNCTIONS AND EVENT HANDLERS

  const handleDelete = (parentMenuId) => {
    handleShow();
    confirmDelete.current = () => {
      deleteParentMenu(parentMenuId);
      handleClose();
    }
  }

  const checkFetchedData = async () => {
    if (dataParentMenus && dataCount) {
      if (dataCount.status === true) {
        let count = dataCount.data.count;

        if (dataParentMenus.status === true) {
          ReactDOM.unstable_batchedUpdates(() => {
            setTotalParentMenus(count);
            setParentMenuData(dataParentMenus.data);
          });

          if (!errorTimerValue) {
            clearErrorMsg();
          }

        } else {
          // resets everything when fetched is error
          ReactDOM.unstable_batchedUpdates(() => {
            setTotalParentMenus(null);
            setParentMenuData([]);
          });
          passErrorMsg(`${dataParentMenus.msg}`);
        }

      } else {
        passErrorMsg(`${dataCount.msg}`);

      }
    }
  }

  const postAfterCallback = (respData) => {
    if (respData.status) {
      timerSuccessAlert([respData.msg]);
    } else {
      timerErrorAlert([respData.msg]);
    }

    shouldRefetch.current = !shouldRefetch.current;
  }

  // LIFECYCLES

  useDidUpdateEffect(() => {

    checkFetchedData();
  }, [dataParentMenus, dataCount]);


  useDidUpdateEffect(() => {

    postAfterCallback(deleteParentMenuResult);

  }, [deleteParentMenuResult]);

  useDidUpdateEffect(() => {

    postAfterCallback(sortDownResult);

  }, [sortDownResult]);

  useDidUpdateEffect(() => {

    postAfterCallback(sortUpResult);

  }, [sortUpResult]);

  // UI
  const actionButtons = (parentMenuID) => {
    return (
      <>
        <Link to={`/parentmenus/form/${parentMenuID}${location.search}`} className="btn btn-icon-text btn-outline-secondary mr-3">
          {isWriteable ? "Edit" : "Read"} Parent Menu
          <i className={`mdi ${isWriteable ? "mdi-pencil" : "mdi-read"} btn-icon-append `}></i>
        </Link>


        {isWriteable &&
          <>
            <button onClick={() => handleDelete(parentMenuID)} className="btn btn-icon-text btn-outline-secondary mr-3">
              Delete
              <i className={`mdi mdi-delete btn-icon-append `}></i>
            </button>
            <button onClick={() => sortUp({ parentMenuID })} className="btn btn-icon-text btn-outline-secondary mr-3">
              Sort Up
              <i className={`mdi ${isWriteable ? "mdi-arrow-up-bold" : "mdi-read"} btn-icon-append `}></i>
            </button>

            <button onClick={() => sortDown({ parentMenuID })} className="btn btn-icon-text btn-outline-secondary mr-3">
              Sort Down
              <i className={`mdi ${isWriteable ? "mdi-arrow-down-bold" : "mdi-read"} btn-icon-append `}></i>
            </button>
          </>
        }
      </>
    )
  };

  const addButtons = () => {
    return (
      <>
        {isWriteable &&
          <>
            <Link to={`/parentmenus/form/add${location.search}`} className="btn btn-outline-secondary float-sm-right d-block">
              <i className="mdi mdi-account-plus"> </i>
              Add Parent Menu
            </Link>
          </>
        }

      </>
    )
  }

  return (

    <>
      <div>
        <div className="page-header">
          <h3 className="page-title"> Parent Menu Page</h3>
        </div>

        <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
        <div className="row" data-testid="ParentMenus" >
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title"> Parent Menu Table </h4>
                {!!loadingParentMenus && !!loadingCount && <Spinner />}
                <BundledTable
                  tableProps={tableProps}
                  entryProps={entryProps}
                  paginationProps={paginationProps}
                  colData={colData}
                  idKey={idKey}
                  actionButtons={actionButtons}
                  addButtons={addButtons}
                />


              </div>
            </div>
          </div>
        </div>
      </div>
      <DialogElements show={show} handleClose={handleClose} handleDelete={confirmDelete.current} modalTitle={modalTitle} modalBody={modalBody} />
    </>
  );
}

export default ParentMenus;