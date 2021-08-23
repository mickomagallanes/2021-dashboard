import React, { useRef, useState } from 'react'
import ReactDOM from "react-dom";
import './Employees.css';
import { PRIVILEGES } from "../../helpers/constants"
import { Link, useLocation } from 'react-router-dom';
import useAlert from '../../components/useAlert';
import useFetch from '../../components/useFetch';
import useDidUpdateEffect from '../../components/useDidUpdateEffect';
import Spinner from '../../components/Spinner/Spinner';
import useBundledTable from '../../components/useBundledTable';
import useDelete from '../../components/useDelete';
import useDialog from '../../components/useDialog';

const modalTitle = "Do you want to delete this employee?";
const modalBody = "This row will be deleted in the database, do you want to proceed?";

const employeeURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/get/all`;
const employeeCountURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/get/all/count`;
const employeeDeleteURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/delete/`;
const employeeBulkDeleteURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/delete/bulk`;

const colData = [
  { "id": "EmployeeID", "name": "Employee ID" },
  { "id": "EmployeeNo", "name": "Employee Number" },
  { "id": "FirstName", "name": "First Name" },
  { "id": "LastName", "name": "Last Name" },
  { "id": "DepartmentName", "name": "Department Name" },
  { "id": "PositionName", "name": "Position Name" }
];

const idKey = "EmployeeID";

function Employees({ priv }) {

  // HOOKS DECLARATIONS AND VARIABLES

  const location = useLocation();

  const [employeeData, setEmployeeData] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(null);

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
  } = useBundledTable({ data: employeeData, dataCount: totalEmployees, bulkDeleteUrl: employeeBulkDeleteURL });

  const [deleteEmployee, deleteEmployeeResult] = useDelete(employeeDeleteURL);

  // to determine if initial fetch of data is done

  const fetchDepsCount = [currentEntries, currentPage, deleteEmployeeResult, deleteBulkData];
  const fetchDepsEmployees = [deleteEmployeeResult, deleteBulkData];

  const [dataCount, loadingCount] = useFetch(employeeCountURL + `?${filterParam}`, { customDeps: fetchDepsCount });

  const [dataEmployees, loadingEmployees] = useFetch(employeeURL + searchParamQuery, { customDeps: fetchDepsEmployees });

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

  const handleDelete = (employeeId) => {
    handleShow();
    confirmDelete.current = () => {
      deleteEmployee(employeeId);
      setCurrentDeleteRows(prev => [...prev].filter(o => o !== employeeId));
      handleClose();
    }

  }

  const checkFetchedData = async () => {
    if (dataEmployees && dataCount) {
      if (dataCount.status === true) {
        let count = dataCount.data.count;

        if (dataEmployees.status === true) {
          ReactDOM.unstable_batchedUpdates(() => {
            setTotalEmployees(count);
            setEmployeeData(dataEmployees.data);
          });

          if (!errorTimerValue) {
            clearErrorMsg();
          }

        } else {
          // resets everything when fetched is error
          ReactDOM.unstable_batchedUpdates(() => {
            setTotalEmployees(null);
            setEmployeeData([]);
          });
          passErrorMsg(`${dataEmployees.msg}`);
        }

      } else {
        passErrorMsg(`${dataCount.msg}`);

      }
    }
  }

  // LIFECYCLES

  useDidUpdateEffect(() => {

    checkFetchedData();
  }, [dataEmployees, dataCount]);

  useDidUpdateEffect(() => {

    if (deleteEmployeeResult.status) {
      timerSuccessAlert([deleteEmployeeResult.msg]);
    } else {
      timerErrorAlert([deleteEmployeeResult.msg]);
    }

  }, [deleteEmployeeResult]);


  useDidUpdateEffect(() => {

    if (deleteBulkData.status) {
      timerSuccessAlert([deleteBulkData.msg]);
    } else {
      timerErrorAlert([deleteBulkData.msg]);
    }

  }, [deleteBulkData]);

  // UI
  const actionButtons = (employeeID) => {
    return (
      <>
        <Link to={`/employees/form/${employeeID}${location.search}`} className="btn btn-icon-text btn-outline-secondary mr-3">
          {isWriteable ? "Edit" : "Read"} Employee
          <i className={`mdi ${isWriteable ? "mdi-pencil" : "mdi-read"} btn-icon-append `}></i>
        </Link>

        <Link to={`/employees/complete/form/${employeeID}${location.search}`} className="btn btn-icon-text btn-outline-secondary mr-3">
          {isWriteable ? "Edit" : "Read"} Employee (Complete)
          <i className={`mdi ${isWriteable ? "mdi-pencil" : "mdi-read"} btn-icon-append `}></i>
        </Link>

        {isWriteable && <button onClick={() => handleDelete(employeeID)} className="btn btn-icon-text btn-outline-secondary mr-3">
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

                <Link to={`/employees/form/add${location.search}`} className="btn btn-outline-secondary d-block mb-2">
                  <i className="mdi mdi-account-plus"> </i>
                  Add Employee
                </Link>
              </div>

              <div className="col-8">
                <Link to={`/employees/complete/form/add${location.search}`} className="btn btn-outline-secondary d-block">
                  <i className="mdi mdi-account-plus"> </i>
                  Add Employee (Complete)
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
          <h3 className="page-title"> Employees</h3>
        </div>

        <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
        <div className="row" data-testid="Employee" >
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title"> Employee Table </h4>
                {(!!loadingEmployees || !!loadingCount) && <Spinner />}
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


export default Employees;