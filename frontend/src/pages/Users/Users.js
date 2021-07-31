import React, { useRef, useState } from 'react'
import ReactDOM from "react-dom";
import './Users.css';
import { Link, useLocation } from 'react-router-dom';
import { PRIVILEGES } from "../../helpers/constants";

import useAlert from '../../components/useAlert';
import useFetch from '../../components/useFetch';
import useDidUpdateEffect from '../../components/useDidUpdateEffect';
import Spinner from '../../components/Spinner/Spinner';
import useBundledTable from '../../components/useBundledTable';
import useDialog from '../../components/useDialog';
import useDelete from '../../components/useDelete';

const userURL = `${process.env.REACT_APP_BACKEND_HOST}/API/user/get/all`;
const userCountURL = `${process.env.REACT_APP_BACKEND_HOST}/API/user/get/all/count`;

// TODO: show what user was deleted, apply to all tables
const userDeleteURL = `${process.env.REACT_APP_BACKEND_HOST}/API/user/delete/`;

const modalTitle = "Do you want to delete this user?";
const modalBody = "This row will be deleted in the database, do you want to proceed?";

const colData = [
  { "id": "UserID", "name": "User ID" },
  { "id": "Username", "name": "User Name" },
  { "id": "RoleName", "name": "Role Name" },
];

const idKey = "UserID";

function Users({ priv }) {

  // HOOKS DECLARATIONS AND VARIABLES

  const location = useLocation();

  const [userData, setUserData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(null);

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
  } = useBundledTable({ data: userData, dataCount: totalUsers });

  // to determine if initial fetch of data is done
  const [deleteUser, deleteUserResult] = useDelete(userDeleteURL);

  const fetchDepsCount = [currentEntries, currentPage, deleteUserResult];
  const fetchDepsUsers = [deleteUserResult];

  // also only loads by page and not sort since url is static
  const [dataCount, loadingCount] = useFetch(userCountURL, { customDeps: fetchDepsCount });

  const [dataUsers, loadingUsers] = useFetch(userURL + searchParamQuery, { customDeps: fetchDepsUsers });

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

  const handleDelete = (userId) => {
    handleShow();
    confirmDelete.current = () => {
      deleteUser(userId);
      handleClose();
    }

  }

  const checkFetchedData = async () => {
    if (dataUsers && dataCount) {
      if (dataCount.status === true) {
        let count = dataCount.data.count;

        if (dataUsers.status === true) {
          ReactDOM.unstable_batchedUpdates(() => {
            setTotalUsers(count);
            setUserData(dataUsers.data);
          });

          if (!errorTimerValue) {
            clearErrorMsg();
          }

        } else {
          // resets everything when fetched is error
          ReactDOM.unstable_batchedUpdates(() => {
            setTotalUsers(null);
            setUserData([]);
          });
          passErrorMsg(`${dataUsers.msg}`);
        }

      } else {
        passErrorMsg(`${dataCount.msg}`);

      }
    }
  }

  // LIFECYCLES

  useDidUpdateEffect(() => {

    checkFetchedData();
  }, [dataUsers, dataCount]);


  useDidUpdateEffect(() => {

    if (deleteUserResult.status) {
      timerSuccessAlert([deleteUserResult.msg]);
    } else {
      timerErrorAlert([deleteUserResult.msg]);
    }

  }, [deleteUserResult]);


  // UI
  const actionButtons = (userID) => {
    return (
      <>
        <Link to={`/users/form/${userID}${location.search}`} className="btn btn-icon-text btn-outline-secondary mr-3">
          {isWriteable ? "Edit" : "Read"} User
          <i className={`mdi ${isWriteable ? "mdi-pencil" : "mdi-read"} btn-icon-append `}></i>
        </Link>

        {isWriteable && <button onClick={() => handleDelete(userID)} className="btn btn-icon-text btn-outline-secondary mr-3">
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
            <Link to={`/users/form/add${location.search}`} className="btn btn-outline-secondary float-sm-right d-block">
              <i className="mdi mdi-account-plus"> </i>
              Add User
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
          <h3 className="page-title"> Users Page</h3>
        </div>

        <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
        <div className="row" data-testid="User" >
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title"> Users Table </h4>
                {!!loadingUsers && !!loadingCount && <Spinner />}
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

export default Users;
