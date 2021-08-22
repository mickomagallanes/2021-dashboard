import React, { useRef, useState } from 'react'
import ReactDOM from "react-dom";
import './EmployeeDepartments.css';
import { PRIVILEGES } from "../../helpers/constants"
import { Link, useLocation } from 'react-router-dom';
import useAlert from '../../components/useAlert';
import useFetch from '../../components/useFetch';
import useDidUpdateEffect from '../../components/useDidUpdateEffect';
import Spinner from '../../components/Spinner/Spinner';
import useDelete from '../../components/useDelete';
import useDialog from '../../components/useDialog';
import useBundledTable from '../../components/useBundledTable';

const employeeDepartmentURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/department/get/all`;
const employeeDepartmentCountURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/department/get/all/count`;

const employeeDepartmentDeleteURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/department/delete/`;
const employeeDepartmentBulkDeleteURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/department/delete/bulk`;

const colData = [
  { "id": "EmployeeDepartmentID", "name": "Employee Department ID" },
  { "id": "DepartmentName", "name": "Department Name" }
];

const idKey = "EmployeeDepartmentID";

const modalTitle = "Do you want to delete this Department?";
const modalBody = "This row will be deleted in the database, do you want to proceed?";

function EmployeeDepartments({ priv }) {

  // HOOKS DECLARATIONS AND VARIABLES

  const location = useLocation();

  const [employeeDepartmentData, setEmployeeDepartmentData] = useState([]);
  const [totalEmployeeDepartments, setTotalEmployeeDepartments] = useState(null);

  const {
    searchParamQuery,
    entryProps,
    entryProps: {
      currentEntries
    },
    filterParam,
    paginationProps,
    paginationProps: {
      currentEmployeeDepartment
    },
    filteringProps,
    tableProps,
    bulkDeleteProps,
    bulkDeleteProps: {
      deleteBulkData,
      setCurrentDeleteRows
    },
    BundledTable
  } = useBundledTable({ data: employeeDepartmentData, dataCount: totalEmployeeDepartments, bulkDeleteUrl: employeeDepartmentBulkDeleteURL });

  // to determine if initial fetch of data is done

  const [deleteEmployeeDepartment, deleteEmployeeDepartmentResult] = useDelete(employeeDepartmentDeleteURL);

  const fetchDepsCount = [currentEntries, currentEmployeeDepartment, deleteEmployeeDepartmentResult, deleteBulkData];
  const fetchDepsEmployeeDepartments = [deleteEmployeeDepartmentResult, deleteBulkData];

  const [dataCount, loadingCount] = useFetch(employeeDepartmentCountURL + `?${filterParam}`, { customDeps: fetchDepsCount });

  const [dataEmployeeDepartments, loadingEmployeeDepartments] = useFetch(employeeDepartmentURL + searchParamQuery, { customDeps: fetchDepsEmployeeDepartments });

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


  const handleDelete = (employeeDepartmentId) => {
    handleShow();
    confirmDelete.current = () => {
      deleteEmployeeDepartment(employeeDepartmentId);
      setCurrentDeleteRows(prev => [...prev].filter(o => o !== employeeDepartmentId));
      handleClose();
    }
  }

  const checkFetchedData = async () => {
    if (dataEmployeeDepartments && dataCount) {
      if (dataCount.status === true) {
        let count = dataCount.data.count;

        if (dataEmployeeDepartments.status === true) {
          ReactDOM.unstable_batchedUpdates(() => {
            setTotalEmployeeDepartments(count);
            setEmployeeDepartmentData(dataEmployeeDepartments.data);
          });

          if (!errorTimerValue) {
            clearErrorMsg();
          }

        } else {
          // resets everything when fetched is error
          ReactDOM.unstable_batchedUpdates(() => {
            setTotalEmployeeDepartments(null);
            setEmployeeDepartmentData([]);
          });
          passErrorMsg(`${dataEmployeeDepartments.msg}`);
        }

      } else {
        passErrorMsg(`${dataCount.msg}`);

      }
    }
  }

  // LIFECYCLES

  useDidUpdateEffect(() => {

    checkFetchedData();
  }, [dataEmployeeDepartments, dataCount]);


  useDidUpdateEffect(() => {

    if (deleteEmployeeDepartmentResult.status) {
      timerSuccessAlert([deleteEmployeeDepartmentResult.msg]);
    } else {
      timerErrorAlert([deleteEmployeeDepartmentResult.msg]);
    }

  }, [deleteEmployeeDepartmentResult]);

  useDidUpdateEffect(() => {

    if (deleteBulkData.status) {
      timerSuccessAlert([deleteBulkData.msg]);
    } else {
      timerErrorAlert([deleteBulkData.msg]);
    }

  }, [deleteBulkData]);

  // UI
  const actionButtons = (employeeDepartmentID) => {
    return (
      <>
        <Link to={`/employee/departments/form/${employeeDepartmentID}${location.search}`} className="btn btn-icon-text btn-outline-secondary mr-3">
          {isWriteable ? "Edit" : "Read"} Employee Department
          <i className={`mdi ${isWriteable ? "mdi-pencil" : "mdi-read"} btn-icon-append `}></i>
        </Link>

        {isWriteable && <button onClick={() => handleDelete(employeeDepartmentID)} className="btn btn-icon-text btn-outline-secondary mr-3">
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
            <Link to={`/employee/departments/form/add${location.search}`} className="btn btn-outline-secondary float-sm-right d-block">
              <i className="mdi mdi-account-plus"> </i>
              Add Employee Department
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
          <h3 className="page-title"> Employee Departments</h3>
        </div>

        <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
        <div className="row" data-testid="EmployeeDepartment" >
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title"> Employee Department Table </h4>

                {(!!loadingEmployeeDepartments || !!loadingCount) && <Spinner />}

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

export default EmployeeDepartments;