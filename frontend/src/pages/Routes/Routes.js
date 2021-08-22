import React, { useRef, useState } from 'react'
import ReactDOM from "react-dom";
import './Routes.css';
import { PRIVILEGES } from "../../helpers/constants"
import { Link, useLocation } from 'react-router-dom';
import useAlert from '../../components/useAlert';
import useFetch from '../../components/useFetch';
import useDidUpdateEffect from '../../components/useDidUpdateEffect';
import Spinner from '../../components/Spinner/Spinner';
import useDelete from '../../components/useDelete';
import useDialog from '../../components/useDialog';
import useBundledTable from '../../components/useBundledTable';

const routeURL = `${process.env.REACT_APP_BACKEND_HOST}/API/route/get/all`;
const routeCountURL = `${process.env.REACT_APP_BACKEND_HOST}/API/route/get/all/count`;

const routeDeleteURL = `${process.env.REACT_APP_BACKEND_HOST}/API/route/delete/`;
const routeBulkDeleteURL = `${process.env.REACT_APP_BACKEND_HOST}/API/route/delete/bulk`;

const colData = [
  { "id": "RouteID", "name": "Route ID" },
  { "id": "RouteName", "name": "Route Name" }
];

const idKey = "RouteID";

const modalTitle = "Do you want to delete this route?";
const modalBody = "This row will be deleted in the database, do you want to proceed?";

function Routes({ priv }) {

  // HOOKS DECLARATIONS AND VARIABLES

  const location = useLocation();

  const [routeData, setRouteData] = useState([]);
  const [totalRoutes, setTotalRoutes] = useState(null);

  const {
    searchParamQuery,
    entryProps,
    entryProps: {
      currentEntries
    },
    filterParam,
    paginationProps,
    paginationProps: {
      currentRoute
    },
    filteringProps,
    tableProps,
    bulkDeleteProps,
    bulkDeleteProps: {
      deleteBulkData,
      setCurrentDeleteRows
    },
    BundledTable
  } = useBundledTable({ data: routeData, dataCount: totalRoutes, bulkDeleteUrl: routeBulkDeleteURL });

  // to determine if initial fetch of data is done

  const [deleteRoute, deleteRouteResult] = useDelete(routeDeleteURL);

  const fetchDepsCount = [currentEntries, currentRoute, deleteRouteResult, deleteBulkData];
  const fetchDepsRoutes = [deleteRouteResult, deleteBulkData];

  const [dataCount, loadingCount] = useFetch(routeCountURL + `?${filterParam}`, { customDeps: fetchDepsCount });

  const [dataRoutes, loadingRoutes] = useFetch(routeURL + searchParamQuery, { customDeps: fetchDepsRoutes });

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


  const handleDelete = (routeId) => {
    handleShow();
    confirmDelete.current = () => {
      deleteRoute(routeId);
      setCurrentDeleteRows(prev => [...prev].filter(o => o !== routeId));
      handleClose();
    }
  }

  const checkFetchedData = async () => {
    if (dataRoutes && dataCount) {
      if (dataCount.status === true) {
        let count = dataCount.data.count;

        if (dataRoutes.status === true) {
          ReactDOM.unstable_batchedUpdates(() => {
            setTotalRoutes(count);
            setRouteData(dataRoutes.data);
          });

          if (!errorTimerValue) {
            clearErrorMsg();
          }

        } else {
          // resets everything when fetched is error
          ReactDOM.unstable_batchedUpdates(() => {
            setTotalRoutes(null);
            setRouteData([]);
          });
          passErrorMsg(`${dataRoutes.msg}`);
        }

      } else {
        passErrorMsg(`${dataCount.msg}`);

      }
    }
  }

  // LIFECYCLES

  useDidUpdateEffect(() => {

    checkFetchedData();
  }, [dataRoutes, dataCount]);


  useDidUpdateEffect(() => {

    if (deleteRouteResult.status) {
      timerSuccessAlert([deleteRouteResult.msg]);
    } else {
      timerErrorAlert([deleteRouteResult.msg]);
    }

  }, [deleteRouteResult]);

  useDidUpdateEffect(() => {

    if (deleteBulkData.status) {
      timerSuccessAlert([deleteBulkData.msg]);
    } else {
      timerErrorAlert([deleteBulkData.msg]);
    }

  }, [deleteBulkData]);



  // UI
  const actionButtons = (routeID) => {
    return (
      <>
        <Link to={`/routes/form/${routeID}${location.search}`} className="btn btn-icon-text btn-outline-secondary mr-3">
          {isWriteable ? "Edit" : "Read"} Route
          <i className={`mdi ${isWriteable ? "mdi-pencil" : "mdi-read"} btn-icon-append `}></i>
        </Link>

        {isWriteable && <button onClick={() => handleDelete(routeID)} className="btn btn-icon-text btn-outline-secondary mr-3">
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
            <Link to={`/routes/form/add${location.search}`} className="btn btn-outline-secondary float-sm-right d-block">
              <i className="mdi mdi-account-plus"> </i>
              Add Route
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
          <h3 className="page-title"> Routes</h3>
        </div>

        <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
        <div className="row" data-testid="Route" >
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title"> Route Table </h4>

                {(!!loadingRoutes || !!loadingCount) && <Spinner />}

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

export default Routes;