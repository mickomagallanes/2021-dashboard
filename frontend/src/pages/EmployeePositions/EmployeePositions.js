import React, { useRef, useState } from 'react'
import ReactDOM from "react-dom";
import './EmployeePositions.css';
import { PRIVILEGES } from "../../helpers/constants"
import { Link, useLocation } from 'react-router-dom';
import useAlert from '../../components/useAlert';
import useFetch from '../../components/useFetch';
import useDidUpdateEffect from '../../components/useDidUpdateEffect';
import Spinner from '../../components/Spinner/Spinner';
import useDelete from '../../components/useDelete';
import useDialog from '../../components/useDialog';
import useBundledTable from '../../components/useBundledTable';

const employeePositionURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/position/get/all`;
const employeePositionCountURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/position/get/all/count`;

const employeePositionDeleteURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/position/delete/`;
const employeePositionBulkDeleteURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/position/delete/bulk`;

const colData = [
  { "id": "EmployeePositionID", "name": "Employee Position ID" },
  { "id": "PositionName", "name": "Position Name" }
];

const idKey = "EmployeePositionID";

const modalTitle = "Do you want to delete this Position?";
const modalBody = "This row will be deleted in the database, do you want to proceed?";

function EmployeePositions({ priv }) {

  // HOOKS DECLARATIONS AND VARIABLES

  const location = useLocation();

  const [employeePositionData, setEmployeePositionData] = useState([]);
  const [totalEmployeePositions, setTotalEmployeePositions] = useState(null);

  const {
    searchParamQuery,
    entryProps,
    entryProps: {
      currentEntries
    },
    filterParam,
    paginationProps,
    paginationProps: {
      currentEmployeePosition
    },
    filteringProps,
    tableProps,
    bulkDeleteProps,
    bulkDeleteProps: {
      deleteBulkData,
      setCurrentDeleteRows
    },
    BundledTable
  } = useBundledTable({ data: employeePositionData, dataCount: totalEmployeePositions, bulkDeleteUrl: employeePositionBulkDeleteURL });

  // to determine if initial fetch of data is done

  const [deleteEmployeePosition, deleteEmployeePositionResult] = useDelete(employeePositionDeleteURL);

  const fetchDepsCount = [currentEntries, currentEmployeePosition, deleteEmployeePositionResult, deleteBulkData];
  const fetchDepsEmployeePositions = [deleteEmployeePositionResult, deleteBulkData];

  const [dataCount, loadingCount] = useFetch(employeePositionCountURL + `?${filterParam}`, { customDeps: fetchDepsCount });

  const [dataEmployeePositions, loadingEmployeePositions] = useFetch(employeePositionURL + searchParamQuery, { customDeps: fetchDepsEmployeePositions });

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


  const handleDelete = (employeePositionId) => {
    handleShow();
    confirmDelete.current = () => {
      deleteEmployeePosition(employeePositionId);
      setCurrentDeleteRows(prev => [...prev].filter(o => o !== employeePositionId));
      handleClose();
    }
  }

  const checkFetchedData = async () => {
    if (dataEmployeePositions && dataCount) {
      if (dataCount.status === true) {
        let count = dataCount.data.count;

        if (dataEmployeePositions.status === true) {
          ReactDOM.unstable_batchedUpdates(() => {
            setTotalEmployeePositions(count);
            setEmployeePositionData(dataEmployeePositions.data);
          });

          if (!errorTimerValue) {
            clearErrorMsg();
          }

        } else {
          // resets everything when fetched is error
          ReactDOM.unstable_batchedUpdates(() => {
            setTotalEmployeePositions(null);
            setEmployeePositionData([]);
          });
          passErrorMsg(`${dataEmployeePositions.msg}`);
        }

      } else {
        passErrorMsg(`${dataCount.msg}`);

      }
    }
  }

  // LIFECYCLES

  useDidUpdateEffect(() => {

    checkFetchedData();
  }, [dataEmployeePositions, dataCount]);


  useDidUpdateEffect(() => {

    if (deleteEmployeePositionResult.status) {
      timerSuccessAlert([deleteEmployeePositionResult.msg]);
    } else {
      timerErrorAlert([deleteEmployeePositionResult.msg]);
    }

  }, [deleteEmployeePositionResult]);

  useDidUpdateEffect(() => {

    if (deleteBulkData.status) {
      timerSuccessAlert([deleteBulkData.msg]);
    } else {
      timerErrorAlert([deleteBulkData.msg]);
    }

  }, [deleteBulkData]);


  // UI
  const actionButtons = (employeePositionID) => {
    return (
      <>
        <Link to={`/employee/positions/form/${employeePositionID}${location.search}`} className="btn btn-icon-text btn-outline-secondary mr-3">
          {isWriteable ? "Edit" : "Read"} Employee Position
          <i className={`mdi ${isWriteable ? "mdi-pencil" : "mdi-read"} btn-icon-append `}></i>
        </Link>

        {isWriteable && <button onClick={() => handleDelete(employeePositionID)} className="btn btn-icon-text btn-outline-secondary mr-3">
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
            <Link to={`/employee/positions/form/add${location.search}`} className="btn btn-outline-secondary float-sm-right d-block">
              <i className="mdi mdi-account-plus"> </i>
              Add Employee Position
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
          <h3 className="page-title"> Employee Positions</h3>
        </div>

        <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
        <div className="row" data-testid="EmployeePosition" >
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title"> Employee Position Table </h4>

                {!!loadingEmployeePositions && !!loadingCount && <Spinner />}

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

export default EmployeePositions;