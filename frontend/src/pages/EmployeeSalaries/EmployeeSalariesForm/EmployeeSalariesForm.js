import React, { useCallback, useEffect, useReducer, useRef } from 'react'
import ReactDOM from "react-dom";
import './EmployeeSalariesForm.css';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import useAlert from '../../../components/useAlert';
import useFetch from '../../../components/useFetch';
import useDidUpdateEffect from '../../../components/useDidUpdateEffect';
import { Field } from 'formik';
import * as yup from 'yup';
import { PRIVILEGES, ERRORMSG } from "../../../helpers/constants";
import TextFormField from '../../../components/FormFields/TextFormField/TextFormField'
import { formatDate } from '../../../helpers/utils';
import usePost from '../../../components/usePost';
import Spinner from '../../../components/Spinner/Spinner';
import usePut from '../../../components/usePut';
import SelectFormField from '../../../components/FormFields/SelectFormField/SelectFormField';
import FormikWithRef from '../../../components/FormikWithRef';
import { List } from 'immutable';
import DateFormField from '../../../components/FormFields/DateFormField/DateFormField';

const employeeSalaryByIdURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/salary/get/by/`;
const employeeAllURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/get/all`;
const addEmployeeSalaryURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/salary/insert`;
const editEmployeeSalaryURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/salary/modify/`;

const schema = yup.object().shape({
  salary: yup.number().max(1000000000000, 'Must be below 1,000,000,000,000').required('Required').positive().integer(),
  startedDate: yup.date().required('Required')
});

const employeeSalaryReducer = (state, action) => {
  switch (action.type) {
    case 'changeSalary':
      return { ...state, salary: action.payload };
    case 'changeEmployeeID':
      return { ...state, employeeID: action.payload };
    case 'changeStartedDate':
      return { ...state, startedDate: action.payload };
    case 'changeUntilDate':
      return { ...state, untilDate: action.payload || "" }; // cant be null, so return blank instead
    default:
      return state;
  }
}

const mapDispatch = dispatch => ({
  changeSalary: (payload) => dispatch({ type: 'changeSalary', payload: payload }),
  changeEmployeeID: (payload) => dispatch({ type: 'changeEmployeeID', payload: payload }),
  changeStartedDate: (payload) => dispatch({ type: 'changeStartedDate', payload: payload }),
  changeUntilDate: (payload) => dispatch({ type: 'changeUntilDate', payload: payload })
})

export const employeeSalaryFormInitialState = {
  salary: "",
  employeeID: "",
  startedDate: formatDate(false, "YYYY-MM-DD"),
  untilDate: null
};

const idKeySelect = "EmployeeID";
const valueKeySelect = ["EmployeeNo", "FirstName", "LastName"];

/**
 * EmployeeSalariesForm Component
 * @param {Object} obj
 * @param {String} obj.priv Privilege of logged-in user to EmployeeSalariesForm
 * @param {String} [obj.customEmployeeSalaryURL] replaces url of employeeSalary get by id, added if component is rendered as child from other form
 * @param {React useRef} [obj.parentFormRef] add ref for formik, so parent component can fetch the form value
 */
function EmployeeSalariesForm({ priv, customEmployeeSalaryURL, parentFormRef, pagePath }) {

  // if this component is used as child
  const { current: isRenderedAsChild } = useRef(customEmployeeSalaryURL !== undefined);
  // const isRenderedAsChild = customEmployeeSalaryURL !== undefined;
  // const employeeSalaryURL = isRenderedAsChild ? customEmployeeSalaryURL : employeeSalaryByIdURL;
  const { current: employeeSalaryURL } = useRef(isRenderedAsChild ? customEmployeeSalaryURL : employeeSalaryByIdURL);

  // HOOKS DECLARATIONS AND VARIABLES
  const location = useLocation();

  const [employeeSalaryFormData, dispatchEmployeeSalary] = useReducer(employeeSalaryReducer, employeeSalaryFormInitialState);
  const actionsEmployeeSalaryData = mapDispatch(dispatchEmployeeSalary);

  const urlParamObj = useParams();
  const urlParam = urlParamObj.id;

  const [submitEdit, editData] = usePut(editEmployeeSalaryURL + urlParam);
  const [submitAdd, addData] = usePost(addEmployeeSalaryURL);

  const [dataEmployeeSalary, loadingEmployeeSalary] = useFetch(employeeSalaryURL + urlParam);
  const [dataEmployees, loadingEmployees, extractedDataEmployees] = useFetch(employeeAllURL, { initialData: List([]) });

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

  const WrapperTable = useCallback((props) => {

    return (
      <>
        {isRenderedAsChild
          ?
          <>
            <h5 className="card-title"> Employee Salary </h5>
            {props.children}
          </>
          :
          <div className="row w-100 mx-0" data-testid="EmployeeSalariesForm">
            <div className="col-lg-8 col-xlg-9 col-md-12">
              <div className="card px-4 px-sm-5">

                <div className="card-body">
                  <h4 className="card-title">{isAddMode ? 'Add' : 'Edit'} Employee Salary</h4>
                  {props.children}
                </div>
              </div>
            </div>
          </div>
        }

      </>

    )
  }, [isAddMode, isRenderedAsChild])

  const handleSubmitForm = async (fields) => {
    console.log(fields)
    const param = {
      "salary": fields.salary,
      "employeeID": fields.employeeID,
      "startedDate": formatDate(fields.startedDate, "YYYY-MM-DD"),
      "untilDate": fields.untilDate === null ? null : formatDate(fields.untilDate, "YYYY-MM-DD")
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
    if (dataEmployees) {

      // set first option as default value if it has no value
      if (dataEmployees.status === true) {
        if (employeeSalaryFormData.employeeID === null || employeeSalaryFormData.employeeID === "") {
          actionsEmployeeSalaryData.changeEmployeeID(dataEmployees.data[0].EmployeeID);
        }

      } else {
        passErrorMsg(`${dataEmployees.msg}`);
      }

    }
  }, [dataEmployees])

  useDidUpdateEffect(() => {

    if (!isAddMode) {

      if (dataEmployeeSalary.status) {
        const { data } = dataEmployeeSalary;

        ReactDOM.unstable_batchedUpdates(() => {
          actionsEmployeeSalaryData.changeSalary(data.Salary);
          actionsEmployeeSalaryData.changeStartedDate(data.StartedDate);
          actionsEmployeeSalaryData.changeUntilDate(data.UntilDate);
          actionsEmployeeSalaryData.changeEmployeeID(data.EmployeeID);
        });


      } else if (!dataEmployeeSalary.status) {
        passErrorMsg(`${dataEmployeeSalary.msg}`);
      }
    }

  }, [dataEmployeeSalary]);


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
        {!isRenderedAsChild &&
          <div className="page-header">
            <Link className="btn btn-outline-light btn-icon-text btn-md" to={`${pagePath}${location.search}`}>
              <i className="mdi mdi-keyboard-backspace btn-icon-prepend mdi-18px"></i>
              <span className="d-inline-block text-left">
                Back
              </span>
            </Link>

          </div>
        }

        <WrapperTable>

          <div className="row mb-4">
            <div className="col mt-3">
              <FormikWithRef
                validationSchema={schema}
                initialValues={employeeSalaryFormData}
                onSubmit={handleSubmitForm}
                formRef={parentFormRef}
                enableReinitialize
              >
                {({ setFieldValue }) =>
                  <>
                    <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
                    {
                      loadingEmployeeSalary && loadingEmployees ? <Spinner /> :
                        <>
                          <div>
                            <Field
                              label="Employee Salary"
                              type="number"
                              name="salary"
                              placeholder="Employee Salary"
                              disabled={!isWriteable}
                              component={TextFormField}
                            />
                          </div>
                          <div>
                            <Field
                              label="Started Date"
                              name="startedDate"
                              setStartDate={(value) => setFieldValue("startedDate", value)}
                              disabled={!isWriteable}
                              component={DateFormField}
                            />
                          </div>

                          <div>
                            <Field
                              label="Until Date"
                              name="untilDate"
                              setStartDate={(value) => setFieldValue("untilDate", value)}
                              disabled={!isWriteable}
                              component={DateFormField}
                            />
                          </div>
                          {!isRenderedAsChild &&
                            <>
                              <div className="mt-3">
                                <Field
                                  label="Employee"
                                  options={extractedDataEmployees}
                                  idKey={idKeySelect}
                                  valueKey={valueKeySelect}
                                  name="employeeID"
                                  component={SelectFormField}
                                  disabled={!isWriteable}
                                />
                              </div>
                              <div className="mt-3">
                                {priv === PRIVILEGES.readWrite &&
                                  <button type="submit" className="btn btn-primary mr-2">Submit</button>
                                }
                              </div>
                            </>
                          }
                        </>
                    }
                  </>
                }

              </FormikWithRef>

            </div>
          </div>
        </WrapperTable>
      </div>

    </>
  );
}

export default EmployeeSalariesForm;