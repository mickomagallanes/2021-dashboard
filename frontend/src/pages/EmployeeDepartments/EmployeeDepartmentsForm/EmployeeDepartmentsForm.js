import React, { useEffect, useReducer, useRef } from 'react'
import ReactDOM from "react-dom";
import './EmployeeDepartmentsForm.css';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import useAlert from '../../../components/useAlert';
import useFetch from '../../../components/useFetch';
import useDidUpdateEffect from '../../../components/useDidUpdateEffect';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { PRIVILEGES, ERRORMSG } from "../../../helpers/constants";
import TextFormField from '../../../components/FormFields/TextFormField/TextFormField'
import usePost from '../../../components/usePost';
import Spinner from '../../../components/Spinner/Spinner';
import usePut from '../../../components/usePut';

const employeeDepartmentByIdURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/department/get/by/`;
const addEmployeeDepartmentURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/department/insert`;
const editEmployeeDepartmentURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/department/modify/`;

const schema = yup.object().shape({
  departmentName: yup.string().max(45, 'Must be 45 characters or less').required('Required')
});


const employeeDepartmentReducer = (state, action) => {
  switch (action.type) {
    case 'changeDepartmentName':
      return { ...state, departmentName: action.payload };
    default:
      return state;
  }
}

const mapDispatch = dispatch => ({
  changeDepartmentName: (payload) => dispatch({ type: 'changeDepartmentName', payload: payload })

})

const employeeDepartmentFormInitialState = {
  departmentName: ""
};

function EmployeeDepartmentsForm({ priv, pagePath }) {

  // HOOKS DECLARATIONS AND VARIABLES
  const location = useLocation();

  const [employeeDepartmentFormData, dispatchEmployeeDepartment] = useReducer(employeeDepartmentReducer, employeeDepartmentFormInitialState);
  const actionsEmployeeDepartmentData = mapDispatch(dispatchEmployeeDepartment);

  const urlParamObj = useParams();
  const urlParam = urlParamObj.id;

  const [submitEdit, editData] = usePut(editEmployeeDepartmentURL + urlParam);
  const [submitAdd, addData] = usePost(addEmployeeDepartmentURL);

  const [dataEmployeeDepartment, loadingEmployeeDepartment] = useFetch(employeeDepartmentByIdURL + urlParam);

  const { current: isAddMode } = useRef(urlParam === "add");

  const history = useHistory();

  const { current: isWriteable } = useRef(priv === PRIVILEGES.readWrite);

  const {
    passErrorMsg,
    AlertElements,
    errorMsg,
    successMsg
  } = useAlert();

  // FUNCTIONS AND EVENT HANDLERS

  const handleSubmitForm = async (fields) => {

    const param = {
      "departmentName": fields.departmentName
    }

    if (isAddMode) {

      submitAdd(param);

    } else {
      submitEdit(param);
    }

  }

  const postSuccessCallback = (respData) => {
    let successArr = [];

    if (respData.status === true) {
      successArr.push(respData.msg);

      history.push({
        pathname: pagePath,
        successMsg: successArr,
        search: location.search
      });
    } else {
      passErrorMsg(`${respData.msg}`);
    }
  }

  // LIFECYCLES
  useEffect(() => {
    if (isAddMode && priv === PRIVILEGES.read) {
      history.push({
        pathname: pagePath,
        errorMsg: [ERRORMSG.noPrivilege],
        search: location.search
      });
    }
  }, [history, isAddMode, location.search, pagePath, priv])

  useDidUpdateEffect(() => {

    if (!isAddMode) {

      if (dataEmployeeDepartment.status) {
        const { data } = dataEmployeeDepartment;

        ReactDOM.unstable_batchedUpdates(() => {
          actionsEmployeeDepartmentData.changeDepartmentName(data.DepartmentName);
        });


      } else if (!dataEmployeeDepartment.status) {
        passErrorMsg(`${dataEmployeeDepartment.msg}`);
      }
    }

  }, [dataEmployeeDepartment]);

  useDidUpdateEffect(() => {

    if (isAddMode) {
      postSuccessCallback(addData);

    } else {

      postSuccessCallback(editData);
    }

  }, [addData, editData]);

  // UI
  return (

    <>
      <div>
        <div className="page-header">
          <Link className="btn btn-outline-light btn-icon-text btn-md" to={`${pagePath}${location.search}`}>
            <i className="mdi mdi-keyboard-backspace btn-icon-prepend mdi-18px"></i>
            <span className="d-inline-block text-left">
              Back
            </span>
          </Link>

        </div>
        <div className="row w-100 mx-0" data-testid="EmployeeDepartmentsForm">
          <div className="col-lg-8 col-xlg-9 col-md-12">
            <div className="card px-4 px-sm-5">

              <div className="card-body">
                <h4 className="card-title">{isAddMode ? 'Add' : 'Edit'} EmployeeDepartment</h4>
                <div className="row mb-4">
                  <div className="col mt-3">
                    <Formik
                      validationSchema={schema}
                      initialValues={employeeDepartmentFormData}
                      onSubmit={handleSubmitForm}
                      enableReinitialize
                    >
                      {() => (
                        <Form>
                          <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
                          {loadingEmployeeDepartment ? <Spinner /> :
                            <>
                              <div>
                                <Field
                                  label="Employee Department Name"
                                  type="text"
                                  name="departmentName"
                                  placeholder="Employee Department Name"
                                  disabled={!isWriteable}
                                  component={TextFormField}
                                />
                              </div>

                              <div className="mt-3">
                                {priv === PRIVILEGES.readWrite && <button type="submit" className="btn btn-primary mr-2">Submit</button>}
                              </div>
                            </>
                          }
                        </Form>
                      )}
                    </Formik>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployeeDepartmentsForm;