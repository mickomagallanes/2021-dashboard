import React, { useRef, useState } from 'react'
import ReactDOM from "react-dom";
import './SubPages.css';
import { PRIVILEGES } from "../../helpers/constants"
import { Link, useLocation } from 'react-router-dom';
import useAlert from '../../components/useAlert';
import useFetch from '../../components/useFetch';
import useDidUpdateEffect from '../../components/useDidUpdateEffect';
import Spinner from '../../components/Spinner/Spinner';
import useBundledTable from '../../components/useBundledTable';
import useDelete from '../../components/useDelete';
import useDialog from '../../components/useDialog';

const modalTitle = "Do you want to delete this page?";
const modalBody = "This row will be deleted in the database, do you want to proceed?";

const subPageURL = `${process.env.REACT_APP_BACKEND_HOST}/API/subpage/get/all`;
const subPageCountURL = `${process.env.REACT_APP_BACKEND_HOST}/API/subpage/get/all/count`;
const subPageDeleteURL = `${process.env.REACT_APP_BACKEND_HOST}/API/subpage/delete/`;

const colData = [
  { "id": "SubPageID", "name": "SubPage ID" },
  { "id": "SubPageName", "name": "SubPage Name" }
];

const idKey = "SubPageID";

function SubPages({ priv }) {

  // HOOKS DECLARATIONS AND VARIABLES

  const location = useLocation();

  const [subPageData, setSubPageData] = useState([]);
  const [totalSubPages, setTotalSubPages] = useState(null);

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
  } = useBundledTable({ data: subPageData, dataCount: totalSubPages });

  // to determine if initial fetch of data is done

  const fetchDepsCount = [currentEntries, currentPage, shouldRefetch.current];
  const fetchDepsSubPages = [shouldRefetch.current];

  // also only loads by page and not sort since url is static
  const [dataCount, loadingCount] = useFetch(subPageCountURL, { customDeps: fetchDepsCount });

  const [dataSubPages, loadingSubPages] = useFetch(subPageURL + searchParamQuery, { customDeps: fetchDepsSubPages });

  const [deleteSubPage, deleteSubPageResult] = useDelete(subPageDeleteURL);

  const confirmDelete = useRef();

  const {
    handleShow,
    handleClose,
    show,
    DialogElements
  } = useDialog();


  const {
    timerSuccessAlert,
    passErrorMsg,
    AlertElements,
    clearErrorMsg,
    errorMsg,
    successMsg,
    errorTimerValue
  } = useAlert({ showLocationMsg: true });


  const isWriteable = priv === PRIVILEGES.readWrite;

  // FUNCTIONS AND EVENT HANDLERS

  const handleDelete = (pageId) => {
    handleShow();
    confirmDelete.current = () => {
      deleteSubPage(pageId);
      handleClose();
    }

  }

  const checkFetchedData = async () => {
    if (dataSubPages && dataCount) {
      if (dataCount.status === true) {
        let count = dataCount.data.count;

        if (dataSubPages.status === true) {
          ReactDOM.unstable_batchedUpdates(() => {
            setTotalSubPages(count);
            setSubPageData(dataSubPages.data);
          });

          if (!errorTimerValue) {
            clearErrorMsg();
          }

        } else {
          passErrorMsg(`${dataSubPages.msg}`);
        }

      } else {
        passErrorMsg(`${dataCount.msg}`);

      }
    }
  }

  // LIFECYCLES

  useDidUpdateEffect(() => {

    checkFetchedData();
  }, [dataSubPages, dataCount]);

  useDidUpdateEffect(() => {

    timerSuccessAlert([deleteSubPageResult.msg]);
    shouldRefetch.current = !shouldRefetch.current;
  }, [deleteSubPageResult]);


  // UI
  const actionButtons = (subPageID) => {
    return (
      <>
        <Link to={`/subpages/form/${subPageID}${location.search}`} className="btn btn-icon-text btn-outline-secondary mr-3">
          {isWriteable ? "Edit" : "Read"} SubPage
          <i className={`mdi ${isWriteable ? "mdi-pencil" : "mdi-read"} btn-icon-append `}></i>
        </Link>

        {isWriteable && <button onClick={() => handleDelete(subPageID)} className="btn btn-icon-text btn-outline-secondary mr-3">
          Delete
          <i className={`mdi mdi-delete btn-icon-append `}></i>
        </button>}
      </>
    )
  };

  const addButtons = () => {
    return (
      <>
        {isWriteable &&
          <>
            <Link to={`/subpages/form/add${location.search}`} className="btn btn-outline-secondary float-sm-right d-block">
              <i className="mdi mdi-account-plus"> </i>
              Add SubPage
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
          <h3 className="page-title"> SubPage Page</h3>
        </div>

        <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
        <div className="row" data-testid="SubPage" >
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title"> SubPage Table </h4>
                {loadingSubPages && loadingCount ? <Spinner /> :
                  <BundledTable
                    tableProps={tableProps}
                    entryProps={entryProps}
                    paginationProps={paginationProps}
                    colData={colData}
                    idKey={idKey}
                    actionButtons={actionButtons}
                    addButtons={addButtons}
                  />
                }

              </div>
            </div>
          </div>
        </div>
      </div>
      <DialogElements show={show} handleClose={handleClose} handleDelete={confirmDelete.current} modalTitle={modalTitle} modalBody={modalBody} />
    </>
  );
}


export default SubPages;