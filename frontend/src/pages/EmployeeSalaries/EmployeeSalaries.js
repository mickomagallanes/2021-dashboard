import React, { useRef, useState } from 'react'
import './EmployeeSalaries.css';
import ReactDOM from "react-dom";
import { PRIVILEGES } from "../../helpers/constants"
import { Link, useLocation } from 'react-router-dom';
import useBundledTable from '../../components/useBundledTable';
import useFetch from '../../components/useFetch';
import useDelete from '../../components/useDelete';
import useDialog from '../../components/useDialog';
import useAlert from '../../components/useAlert';
import useDidUpdateEffect from '../../components/useDidUpdateEffect';
import Spinner from '../../components/Spinner/Spinner';

const employeeSalaryURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/salary/get/all`;
const employeeSalaryCountURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/salary/get/all/count`;

const employeeSalaryDeleteURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/salary/delete/`;

const modalTitle = "Do you want to delete this employee salary?";
const modalBody = "This row will be deleted in the database, do you want to proceed?";

const colData = [
  { "id": "EmployeeSalaryID", "name": "Employee Salary ID" },
  { "id": "Salary", "name": "Salary" },
  { "id": "EmployeeID", "name": "Employee ID" },
  { "id": "StartedDate", "name": "Started Date" },
  { "id": "UntilDate", "name": "Until Date" },
];

const idKey = "EmployeeSalaryID";

// TODO: employeedepartment and positions, then employee 
function EmployeesSalaries({ priv }) {

  // HOOKS DECLARATIONS AND VARIABLES

  const location = useLocation();

  const [employeeSalaryData, setEmployeeSalaryData] = useState([]);
  const [totalEmployeeSalaries, setTotalEmployeeSalaries] = useState(null);

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
    filteringProps,
    BundledTable
  } = useBundledTable({ data: employeeSalaryData, dataCount: totalEmployeeSalaries });

  const [deleteEmployeeSalary, deleteEmployeeSalaryResult] = useDelete(employeeSalaryDeleteURL);

  // to determine if initial fetch of data is done

  const fetchDepsCount = [currentEntries, currentPage, deleteEmployeeSalaryResult];
  const fetchDepsEmployee = [deleteEmployeeSalaryResult];

  const [dataCount, loadingCount] = useFetch(employeeSalaryCountURL + searchParamQuery, { customDeps: fetchDepsCount });

  const [dataEmployeeSalaries, loadingEmployeeSalaries] = useFetch(employeeSalaryURL + searchParamQuery, { customDeps: fetchDepsEmployee });

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

  const handleDelete = (employeeSalaryId) => {
    handleShow();
    confirmDelete.current = () => {
      deleteEmployeeSalary(employeeSalaryId);
      handleClose();
    }
  }

  const checkFetchedData = async () => {
    if (dataEmployeeSalaries && dataCount) {
      if (dataCount.status === true) {
        let count = dataCount.data.count;

        if (dataEmployeeSalaries.status === true) {
          ReactDOM.unstable_batchedUpdates(() => {
            setTotalEmployeeSalaries(count);
            setEmployeeSalaryData(dataEmployeeSalaries.data);
          });

          if (!errorTimerValue) {
            clearErrorMsg();
          }

        } else {
          // resets everything when fetched is error
          ReactDOM.unstable_batchedUpdates(() => {
            setTotalEmployeeSalaries(null);
            setEmployeeSalaryData([]);
          });
          passErrorMsg(`${dataEmployeeSalaries.msg}`);
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

  }

  // LIFECYCLES

  useDidUpdateEffect(() => {

    checkFetchedData();
  }, [dataEmployeeSalaries, dataCount]);


  useDidUpdateEffect(() => {

    postAfterCallback(deleteEmployeeSalaryResult);

  }, [deleteEmployeeSalaryResult]);

  // UI
  const actionButtons = (employeeSalaryID) => {
    return (
      <>
        <Link to={`/employee/salary/form/${employeeSalaryID}${location.search}`} className="btn btn-icon-text btn-outline-secondary mr-3">
          {isWriteable ? "Edit" : "Read"} Employee Salary
          <i className={`mdi ${isWriteable ? "mdi-pencil" : "mdi-read"} btn-icon-append `}></i>
        </Link>


        {isWriteable &&
          <>
            <button onClick={() => handleDelete(employeeSalaryID)} className="btn btn-icon-text btn-outline-secondary mr-3">
              Delete
              <i className={`mdi mdi-delete btn-icon-append `}></i>
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
            <Link to={`/employee/salary/form/add${location.search}`} className="btn btn-outline-secondary float-sm-right d-block">
              <i className="mdi mdi-account-plus"> </i>
              Add Employee Salary
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
          <h3 className="page-title"> Employee Salary Page</h3>
        </div>

        <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
        <div className="row" data-testid="EmployeeSalaries" >
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title"> Employee Salary Table </h4>
                {!!loadingEmployeeSalaries && !!loadingCount && <Spinner />}
                <BundledTable
                  tableProps={tableProps}
                  entryProps={entryProps}
                  paginationProps={paginationProps}
                  colData={colData}
                  idKey={idKey}
                  actionButtons={actionButtons}
                  addButtons={addButtons}
                  filteringProps={filteringProps}
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

export default EmployeesSalaries;