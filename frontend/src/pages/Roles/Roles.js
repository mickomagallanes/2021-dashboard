import React, { useRef, useState } from 'react'
import './Roles.css';
import { PRIVILEGES } from "../../helpers/constants"
import { Link } from 'react-router-dom';
import useBundledTable from '../../components/useBundledTable';
import useFetch from '../../components/useFetch';
import useAlert from '../../components/useAlert';
import Spinner from '../../components/Spinner/Spinner';
import useDidUpdateEffect from '../../components/useDidUpdateEffect';
import ReactDOM from "react-dom";
import useDelete from '../../components/useDelete';
import useDialog from '../../components/useDialog';

const roleURL = `${process.env.REACT_APP_BACKEND_HOST}/API/role/get/all`;
const roleDeleteURL = `${process.env.REACT_APP_BACKEND_HOST}/API/role/delete/`;

const colData = [
  { "id": "id", "name": "Role ID" },
  { "id": "rname", "name": "Role name" }
];

const modalTitle = "Do you want to delete this role?";
const modalBody = "This row will be deleted in the database, do you want to proceed?";

const idKey = "id";

function Roles({ priv }) {

  // HOOKS DECLARATIONS AND VARIABLES

  const [rolesData, setRolesData] = useState([]);

  const {
    searchParamQuery,
    entryProps,
    paginationProps,
    tableProps,
    BundledTable
  } = useBundledTable({ data: rolesData, isPaginated: false, isSorted: false });

  const [deleteRole, deleteRoleResult] = useDelete(roleDeleteURL);
  const confirmDelete = useRef();

  const fetchDepsRoles = [deleteRoleResult];

  const [dataFetchedRoles, loadingFetchedRoles] = useFetch(roleURL + searchParamQuery, { customDeps: fetchDepsRoles });

  const {
    handleShow,
    handleClose,
    show,
    DialogElements
  } = useDialog();


  const {
    passErrorMsg,
    timerSuccessAlert,
    timerErrorAlert,
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
      deleteRole(menuId);
      handleClose();
    }

  }

  const checkFetchedData = async () => {
    if (dataFetchedRoles) {
      if (dataFetchedRoles.status === true) {
        ReactDOM.unstable_batchedUpdates(() => {
          setRolesData(dataFetchedRoles.data);
        });

        if (!errorTimerValue) {
          clearErrorMsg();
        }

      } else {
        // resets everything when fetched is error
        ReactDOM.unstable_batchedUpdates(() => {
          setRolesData([]);
        });
        passErrorMsg(`${dataFetchedRoles.msg}`);
      }

    }
  }

  // LIFECYCLES

  useDidUpdateEffect(() => {

    checkFetchedData();
  }, [dataFetchedRoles]);


  useDidUpdateEffect(() => {

    if (deleteRoleResult.status) {
      timerSuccessAlert([deleteRoleResult.msg]);
    } else {
      timerErrorAlert([deleteRoleResult.msg]);
    }

  }, [deleteRoleResult]);

  // UI
  const actionButtons = (roleId) => {
    return (
      <>
        <Link to={`/roles/form/${roleId}`} className="btn btn-icon-text btn-outline-secondary mr-3">
          {isWriteable ? "Edit" : "Read"} Role
          <i className={`mdi ${isWriteable ? "mdi-pencil" : "mdi-read"} btn-icon-append `}></i>
        </Link>

        <Link to={`/routeroles/form/${roleId}`} className="btn btn-icon-text btn-outline-secondary mr-3">
          {isWriteable ? "Edit" : "Read"} Role-Routes Privileges
          <i className={`mdi ${isWriteable ? "mdi-pencil" : "mdi-read"} btn-icon-append `}></i>
        </Link>

        <Link to={`/pageroles/form/${roleId}`} className="btn btn-icon-text btn-outline-secondary mr-3">
          {isWriteable ? "Edit" : "Read"} Role-Pages Privileges
          <i className={`mdi ${isWriteable ? "mdi-pencil" : "mdi-read"} btn-icon-append `}></i>
        </Link>

        {isWriteable && <button onClick={() => handleDelete(roleId)} className="btn btn-icon-text btn-outline-secondary mr-3">
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
          <Link to="/roles/form/add" className="btn btn-outline-secondary float-sm-right d-block">
            <i className="mdi mdi-account-plus"> </i>
            Add Role
          </Link>
        }

      </>
    )
  }
  return (
    <>
      <div>
        <div className="page-header">
          <h3 className="page-title">Roles Page</h3>
        </div>

        <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
        <div className="row" data-testid="Roles" >
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title"> Roles Table </h4>
                {!!loadingFetchedRoles && <Spinner />}
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
export default Roles;