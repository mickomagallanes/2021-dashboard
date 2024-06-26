import React, { useRef, useState } from 'react'
import ReactDOM from "react-dom";
import './Pages.css';
import { PRIVILEGES } from "../../helpers/constants"
import { Link, useLocation } from 'react-router-dom';
import useAlert from '../../components/useAlert';
import useFetch from '../../components/useFetch';
import useDidUpdateEffect from '../../components/useDidUpdateEffect';
import Spinner from '../../components/Spinner/Spinner';
import useDelete from '../../components/useDelete';
import useDialog from '../../components/useDialog';
import useBundledTable from '../../components/useBundledTable';
import useCsv from '../../components/useCsv';

const pageURL = `${process.env.REACT_APP_BACKEND_HOST}/API/page/get/all`;
const pageCountURL = `${process.env.REACT_APP_BACKEND_HOST}/API/page/get/all/count`;

const pageDeleteURL = `${process.env.REACT_APP_BACKEND_HOST}/API/page/delete/`;
const pageBulkDeleteURL = `${process.env.REACT_APP_BACKEND_HOST}/API/page/delete/bulk`;

const pageInsertBulkURL = `${process.env.REACT_APP_BACKEND_HOST}/API/page/insert/bulk`;

const colData = [
  { "id": "PageID", "name": "Page ID" },
  { "id": "PageName", "name": "Page Name" }
];

const csvHeader = [
  { "key": "PageID", "label": "Page ID" },
  { "key": "PageName", "label": "Page Name" },
  { "key": "PagePath", "label": "Page Path" }
];

const idKey = "PageID";

const modalTitle = "Do you want to delete this page?";
const modalBody = "This row will be deleted in the database, do you want to proceed?";

function Pages({ priv }) {

  // HOOKS DECLARATIONS AND VARIABLES

  const location = useLocation();

  const [pageData, setPageData] = useState([]);
  const [totalPages, setTotalPages] = useState(null);

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
  } = useBundledTable({ data: pageData, dataCount: totalPages, bulkDeleteUrl: pageBulkDeleteURL });

  const {
    exportCsvFunc,
    importCsvFunc,
    ImportElem,
    ExportElem,
    isLoadingExport,
    isLoadingImport,
    importCsvFuncResp
  } = useCsv({
    exportURL: pageURL,
    importURL: pageInsertBulkURL,
    csvHeader,
    csvName: "Pages.csv"
  })


  // to determine if initial fetch of data is done

  const [deletePage, deletePageResult] = useDelete(pageDeleteURL);

  const fetchDepsCount = [currentEntries, currentPage, deletePageResult, deleteBulkData, importCsvFuncResp];
  const fetchDepsPages = [deletePageResult, deleteBulkData, importCsvFuncResp];

  const [dataCount, loadingCount] = useFetch(pageCountURL + `?${filterParam}`, { customDeps: fetchDepsCount });

  const [dataPages, loadingPages] = useFetch(pageURL + searchParamQuery, { customDeps: fetchDepsPages });

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

  const handleDelete = (pageId) => {
    handleShow();
    confirmDelete.current = () => {
      deletePage(pageId);
      setCurrentDeleteRows(prev => [...prev].filter(o => o !== pageId));
      handleClose();
    }
  }

  const checkFetchedData = async () => {
    if (dataPages && dataCount) {
      if (dataCount.status === true) {
        let count = dataCount.data.count;

        if (dataPages.status === true) {
          ReactDOM.unstable_batchedUpdates(() => {
            setTotalPages(count);
            setPageData(dataPages.data);
          });

          if (!errorTimerValue) {
            clearErrorMsg();
          }

        } else {
          // resets everything when fetched is error
          ReactDOM.unstable_batchedUpdates(() => {
            setTotalPages(null);
            setPageData([]);
          });
          passErrorMsg(`${dataPages.msg}`);
        }

      } else {
        passErrorMsg(`${dataCount.msg}`);

      }
    }
  }

  // LIFECYCLES

  useDidUpdateEffect(() => {

    checkFetchedData();
  }, [dataPages, dataCount]);

  useDidUpdateEffect(() => {

    if (importCsvFuncResp.status) {
      timerSuccessAlert([importCsvFuncResp.msg]);
    } else {
      timerErrorAlert([importCsvFuncResp.msg]);
    }

  }, [importCsvFuncResp]);


  useDidUpdateEffect(() => {

    if (deletePageResult.status) {
      timerSuccessAlert([deletePageResult.msg]);
    } else {
      timerErrorAlert([deletePageResult.msg]);
    }

  }, [deletePageResult]);

  useDidUpdateEffect(() => {

    if (deleteBulkData.status) {
      timerSuccessAlert([deleteBulkData.msg]);
    } else {
      timerErrorAlert([deleteBulkData.msg]);
    }

  }, [deleteBulkData]);


  // UI
  const actionButtons = (pageID) => {
    return (
      <>
        <Link to={`/pages/form/${pageID}${location.search}`} className="btn btn-icon-text btn-outline-secondary mr-3">
          {isWriteable ? "Edit" : "Read"} Page
          <i className={`mdi ${isWriteable ? "mdi-pencil" : "mdi-read"} btn-icon-append `}></i>
        </Link>

        <Link to={`/pages/complete/form/${pageID}${location.search}`} className="btn btn-icon-text btn-outline-secondary mr-3">
          {isWriteable ? "Edit" : "Read"} Page (Complete)
          <i className={`mdi ${isWriteable ? "mdi-pencil" : "mdi-read"} btn-icon-append `}></i>
        </Link>

        {isWriteable && <button onClick={() => handleDelete(pageID)} className="btn btn-icon-text btn-outline-secondary mr-3">
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
            <div className="row justify-content-center">
              <div className="col-8">
                <Link to={`/pages/form/add${location.search}`} className="btn btn-outline-secondary float-sm-right d-block mb-2">
                  <i className="mdi mdi-account-plus"> </i>
                  Add Page
                </Link>
              </div>

              <div className="col-8">
                <Link to={`/pages/complete/form/add${location.search}`} className="btn btn-outline-secondary float-sm-right d-block">
                  <i className="mdi mdi-account-plus"> </i>
                  Add Page (Complete)
                </Link>

              </div>
            </div>
          </>
        }

      </>
    )
  }

  return (

    <>
      <div>
        <div className="page-header">
          <h3 className="page-title"> Pages</h3>
        </div>

        <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
        <div className="row" data-testid="Page" >
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">

                <div className="row">
                  <div className="col-12 col-sm-8 col-md-8 col-lg-10 col-xl-10">
                    <h4 className="card-title"> Page Table </h4>
                  </div>
                  <div className="col-12 col-sm-4 col-md-4 col-lg-2 col-xl-2 text-center">
                    <ExportElem exportCsvFunc={exportCsvFunc} />
                    <ImportElem importCsvFunc={importCsvFunc} />

                  </div>
                </div>

                {(!!loadingPages || !!loadingCount || !!isLoadingExport || !!isLoadingImport) && <Spinner />}

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

export default Pages;