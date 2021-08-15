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

const modalTitle = "Do you want to delete this sub page?";
const modalBody = "This row will be deleted in the database, do you want to proceed?";

const subPageURL = `${process.env.REACT_APP_BACKEND_HOST}/API/subpage/get/all`;
const subPageCountURL = `${process.env.REACT_APP_BACKEND_HOST}/API/subpage/get/all/count`;
const subPageDeleteURL = `${process.env.REACT_APP_BACKEND_HOST}/API/subpage/delete/`;
const subPageBulkDeleteURL = `${process.env.REACT_APP_BACKEND_HOST}/API/subpage/delete/bulk`;

const colData = [
  { "id": "SubPageID", "name": "SubPage ID" },
  { "id": "SubPageName", "name": "SubPage Name" },
  { "id": "PageName", "name": "Page Name" },
];

const idKey = "SubPageID";

// TODO: apply all deletion checkbox functions, and the reset when after delete checkbox
function SubPages({ priv }) {

  // HOOKS DECLARATIONS AND VARIABLES

  const location = useLocation();

  const [subPageData, setSubPageData] = useState([]);
  const [totalSubPages, setTotalSubPages] = useState(null);

  const {
    searchParamQuery,
    entryProps,
    entryProps: {
      currentEntries
    },
    filterParam,
    paginationProps,
    paginationProps: {
      currentPage
    },
    tableProps,
    filteringProps,
    bulkDeleteProps,
    bulkDeleteProps: {
      deleteBulkData,
      setCurrentDeleteRows
    },
    BundledTable
  } = useBundledTable({ data: subPageData, dataCount: totalSubPages, bulkDeleteUrl: subPageBulkDeleteURL });

  const [deleteSubPage, deleteSubPageResult] = useDelete(subPageDeleteURL);

  // to determine if initial fetch of data is done

  const fetchDepsCount = [currentEntries, currentPage, deleteSubPageResult, deleteBulkData];
  const fetchDepsSubPages = [deleteSubPageResult, deleteBulkData];

  const [dataCount, loadingCount] = useFetch(subPageCountURL + `?${filterParam}`, { customDeps: fetchDepsCount });

  const [dataSubPages, loadingSubPages] = useFetch(subPageURL + searchParamQuery, { customDeps: fetchDepsSubPages });

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

  const handleDelete = (subPageId) => {
    handleShow();
    confirmDelete.current = () => {
      deleteSubPage(subPageId);
      setCurrentDeleteRows(prev => [...prev].filter(o => o !== subPageId));
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
          // resets everything when fetched is error
          ReactDOM.unstable_batchedUpdates(() => {
            setTotalSubPages(null);
            setSubPageData([]);
          });
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

    if (deleteSubPageResult.status) {
      timerSuccessAlert([deleteSubPageResult.msg]);
    } else {
      timerErrorAlert([deleteSubPageResult.msg]);
    }

  }, [deleteSubPageResult]);

  useDidUpdateEffect(() => {

    if (deleteBulkData.status) {
      timerSuccessAlert([deleteBulkData.msg]);
    } else {
      timerErrorAlert([deleteBulkData.msg]);
    }

  }, [deleteBulkData]);

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
                {!!loadingSubPages && !!loadingCount && <Spinner />}

                <BundledTable
                  tableProps={tableProps}
                  entryProps={entryProps}
                  paginationProps={paginationProps}
                  colData={colData}
                  idKey={idKey}
                  actionButtons={actionButtons}
                  addButtons={addButtons}
                  filteringProps={filteringProps}
                  bulkDeleteProps={bulkDeleteProps}
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


export default SubPages;