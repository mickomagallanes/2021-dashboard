import React, { useRef, useState } from 'react'
import ReactDOM from "react-dom";
import './Menus.css';
import { PRIVILEGES } from "../../helpers/constants"
import { Link, useLocation } from 'react-router-dom';
import useAlert from '../../components/useAlert';
import useFetch from '../../components/useFetch';
import useDidUpdateEffect from '../../components/useDidUpdateEffect';
import Spinner from '../../components/Spinner/Spinner';
import useBundledTable from '../../components/useBundledTable';
import useDialog from '../../components/useDialog';
import useDelete from '../../components/useDelete';
import useCsv from '../../components/useCsv';

const menuURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/get/all`;
const menuCountURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/get/all/count`;

const menuDeleteURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/delete/`;
const menuBulkDeleteURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/delete/bulk`;

const menuInsertBulkURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/insert/bulk`;

const modalTitle = "Do you want to delete this menu?";
const modalBody = "This row will be deleted in the database, do you want to proceed?";

const colData = [
  { "id": "MenuID", "name": "Menu ID" },
  { "id": "ParentMenuName", "name": "Parent Menu Name" },
  { "id": "PageName", "name": "Page Name" },
  { "id": "MenuName", "name": "Menu Name" }
];

const csvHeader = [
  { "key": "MenuID", "label": "Menu ID" },
  { "key": "MenuName", "label": "Menu Name" },
  { "key": "ParentMenuName", "label": "Parent Menu Name" },
  { "key": "PageName", "label": "Page Name" }
];

const idKey = "MenuID";

function Menus({ priv }) {

  // HOOKS DECLARATIONS AND VARIABLES

  const location = useLocation();

  const [menuData, setMenuData] = useState([]);
  const [totalMenus, setTotalMenus] = useState(null);

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
    filteringProps,
    bulkDeleteProps,
    bulkDeleteProps: {
      deleteBulkData,
      setCurrentDeleteRows
    },
    tableProps,
    BundledTable
  } = useBundledTable({ data: menuData, dataCount: totalMenus, bulkDeleteUrl: menuBulkDeleteURL });

  const {
    exportCsvFunc,
    importCsvFunc,
    ImportElem,
    ExportElem,
    isLoadingExport,
    isLoadingImport,
    importCsvFuncResp
  } = useCsv({
    exportURL: menuURL,
    importURL: menuInsertBulkURL,
    csvHeader,
    csvName: "Menus.csv"
  })

  // to determine if initial fetch of data is done
  const [deleteMenu, deleteMenuResult] = useDelete(menuDeleteURL);

  const fetchDepsCount = [currentEntries, currentPage, deleteMenuResult, deleteBulkData, importCsvFuncResp];
  const fetchDepsMenus = [deleteMenuResult, deleteBulkData, importCsvFuncResp];

  const [dataCount, loadingCount] = useFetch(menuCountURL + `?${filterParam}`, { customDeps: fetchDepsCount });

  const [dataMenus, loadingMenus] = useFetch(menuURL + searchParamQuery, { customDeps: fetchDepsMenus });

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

  const handleDelete = (menuId) => {
    handleShow();
    confirmDelete.current = () => {
      deleteMenu(menuId);
      setCurrentDeleteRows(prev => [...prev].filter(o => o !== menuId));
      handleClose();
    }

  }

  const checkFetchedData = async () => {
    if (dataMenus && dataCount) {
      if (dataCount.status === true) {
        let count = dataCount.data.count;

        if (dataMenus.status === true) {
          ReactDOM.unstable_batchedUpdates(() => {
            setTotalMenus(count);
            setMenuData(dataMenus.data);
          });

          if (!errorTimerValue) {
            clearErrorMsg();
          }

        } else {
          // resets everything when fetched is error
          ReactDOM.unstable_batchedUpdates(() => {
            setTotalMenus(null);
            setMenuData([]);
          });
          passErrorMsg(`${dataMenus.msg}`);
        }

      } else {
        passErrorMsg(`${dataCount.msg}`);

      }
    }
  }

  // LIFECYCLES

  useDidUpdateEffect(() => {

    checkFetchedData();
  }, [dataMenus, dataCount]);

  useDidUpdateEffect(() => {

    if (importCsvFuncResp.status) {
      timerSuccessAlert([importCsvFuncResp.msg]);
    } else {
      timerErrorAlert([importCsvFuncResp.msg]);
    }

  }, [importCsvFuncResp]);


  useDidUpdateEffect(() => {

    if (deleteMenuResult.status) {
      timerSuccessAlert([deleteMenuResult.msg]);
    } else {
      timerErrorAlert([deleteMenuResult.msg]);
    }

  }, [deleteMenuResult]);

  useDidUpdateEffect(() => {

    if (deleteBulkData.status) {
      timerSuccessAlert([deleteBulkData.msg]);
    } else {
      timerErrorAlert([deleteBulkData.msg]);
    }

  }, [deleteBulkData]);

  // UI
  const actionButtons = (menuID) => {
    return (
      <>
        <Link to={`/menus/form/${menuID}${location.search}`} className="btn btn-icon-text btn-outline-secondary mr-3">
          {isWriteable ? "Edit" : "Read"} Menu
          <i className={`mdi ${isWriteable ? "mdi-pencil" : "mdi-read"} btn-icon-append `}></i>
        </Link>

        {isWriteable && <button onClick={() => handleDelete(menuID)} className="btn btn-icon-text btn-outline-secondary mr-3">
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
            <Link to={`/menus/form/add${location.search}`} className="btn btn-outline-secondary float-sm-right d-block">
              <i className="mdi mdi-account-plus"> </i>
              Add Menu
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
          <h3 className="page-title"> Menus Page</h3>
        </div>

        <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
        <div className="row" data-testid="Menu" >
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-sm-8 col-md-8 col-lg-10 col-xl-10">
                    <h4 className="card-title"> Menus Table
                    </h4>
                  </div>
                  <div className="col-12 col-sm-4 col-md-4 col-lg-2 col-xl-2 text-center">
                    <ExportElem exportCsvFunc={exportCsvFunc} />
                    <ImportElem importCsvFunc={importCsvFunc} />

                  </div>
                </div>

                {(!!loadingMenus || !!loadingCount || !!isLoadingExport || !!isLoadingImport) && <Spinner />}

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

export default Menus;