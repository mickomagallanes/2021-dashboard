import React, { useEffect, useReducer, useRef } from 'react'
import ReactDOM from "react-dom";
import './EmployeesFormComplete.css';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import useAlert from '../../../components/useAlert';
import useFetch from '../../../components/useFetch';
import useDidUpdateEffect from '../../../components/useDidUpdateEffect';
import { Field } from 'formik';
import * as yup from 'yup';
import { PRIVILEGES, ERRORMSG } from "../../../helpers/constants";
import TextFormField from '../../../components/FormFields/TextFormField/TextFormField'
import usePost from '../../../components/usePost';
import Spinner from '../../../components/Spinner/Spinner';
import usePut from '../../../components/usePut';
import EmployeeSalariesForm from '../../EmployeeSalaries/EmployeeSalariesForm/EmployeeSalariesForm';
import FormikWithRef from '../../../components/FormikWithRef';
import { List } from 'immutable';
import DateFormField from '../../../components/FormFields/DateFormField/DateFormField';
import SelectFormField from '../../../components/FormFields/SelectFormField/SelectFormField';
import { formatDate } from '../../../helpers/utils';

const MemoEmployeeSalariesForm = React.memo(EmployeeSalariesForm);

const employeeByIdURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/get/by/`;
const employeeDepartmentAllURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/department/get/all`;
const employeePositionAllURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/position/get/all`;
const addEmployeeURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/insert/complete`;
const editEmployeeURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/modify/complete/`;

const employeeSalaryByIdURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/salary/get/by/employee/`;

const schema = yup.object().shape({
  employeeNo: yup.string().max(45, 'Must be 45 characters or less').required('Required'),
  firstName: yup.string().max(60, 'Must be 60 characters or less').required('Required'),
  middleName: yup.string().max(60, 'Must be 60 characters or less').required('Required'),
  lastName: yup.string().max(60, 'Must be 60 characters or less').required('Required'),
  contactNo: yup.number().min(0).max(9999999999, 'Must be a contact number').required('Required'),
  hireDate: yup.date().required('Required'),
  birthDate: yup.date().required('Required')
});

// TODO: learn SCRUM, agile, CI/CD, docker.
// TODO: finish portfolio then publish it as static
// TODO: create students
const employeeReducer = (state, action) => {
  switch (action.type) {
    case 'changeEmployeeNo':
      return { ...state, employeeNo: action.payload };
    case 'changeFirstName':
      return { ...state, firstName: action.payload };
    case 'changeMiddleName':
      return { ...state, middleName: action.payload };
    case 'changeLastName':
      return { ...state, lastName: action.payload };
    case 'changeSex':
      return { ...state, sex: action.payload };
    case 'changeContactNo':
      return { ...state, contactNo: action.payload };
    case 'changeHireDate':
      return { ...state, hireDate: action.payload };
    case 'changeBirthDate':
      return { ...state, birthDate: action.payload };
    case 'changeEmployeeDepartmentID':
      return { ...state, employeeDepartmentID: action.payload };
    case 'changeEmployeePositionID':
      return { ...state, employeePositionID: action.payload };
    default:
      return state;
  }
}

const mapDispatch = dispatch => ({
  changeEmployeeNo: (payload) => dispatch({ type: 'changeEmployeeNo', payload: payload }),
  changeFirstName: (payload) => dispatch({ type: 'changeFirstName', payload: payload }),
  changeMiddleName: (payload) => dispatch({ type: 'changeMiddleName', payload: payload }),
  changeLastName: (payload) => dispatch({ type: 'changeLastName', payload: payload }),
  changeSex: (payload) => dispatch({ type: 'changeSex', payload: payload }),
  changeContactNo: (payload) => dispatch({ type: 'changeContactNo', payload: payload }),
  changeHireDate: (payload) => dispatch({ type: 'changeHireDate', payload: payload }),
  changeBirthDate: (payload) => dispatch({ type: 'changeBirthDate', payload: payload }),
  changeEmployeeDepartmentID: (payload) => dispatch({ type: 'changeEmployeeDepartmentID', payload: payload }),
  changeEmployeePositionID: (payload) => dispatch({ type: 'changeEmployeePositionID', payload: payload })

})

const sexArray = [{ id: "F", value: "Female" }, { id: "M", value: "Male" }];

const employeeFormInitialState = {
  employeeNo: "",
  firstName: "",
  middleName: "",
  lastName: "",
  sex: "F",
  contactNo: "",
  hireDate: formatDate(false, "YYYY-MM-DD"),
  birthDate: formatDate(false, "YYYY-MM-DD"),
  employeePositionID: "",
  employeeDepartmentID: ""

};

function EmployeesFormComplete({ priv, pagePath }) {

  // HOOKS DECLARATIONS AND VARIABLES
  const location = useLocation();

  const [employeeFormData, dispatchEmployee] = useReducer(employeeReducer, employeeFormInitialState);
  const actionsEmployeeData = mapDispatch(dispatchEmployee);

  const urlParamObj = useParams();
  const urlParam = urlParamObj.id;

  const [submitEdit, editData] = usePut(editEmployeeURL + urlParam);
  const [submitAdd, addData] = usePost(addEmployeeURL);

  const [dataEmployee, loadingEmployee] = useFetch(employeeByIdURL + urlParam);

  const [dataDepartments, loadingDepartments, extractedDataDepartments] = useFetch(employeeDepartmentAllURL, { initialData: List([]) });
  const [dataPositions, loadingPositions, extractedDataPositions] = useFetch(employeePositionAllURL, { initialData: List([]) });

  const [dataEmployeeSalary, loadingDataEmployeeSalary] = useFetch(employeeSalaryByIdURL + urlParam);

  const { current: isAddMode } = useRef(urlParam === "add");

  const history = useHistory();

  const { current: isWriteable } = useRef(priv === PRIVILEGES.readWrite);

  // Then inside the component body
  const formRef = useRef();

  const employeeSalaryFormRef = useRef();

  const {
    passErrorMsg,
    AlertElements,
    errorMsg,
    successMsg
  } = useAlert();

  // FUNCTIONS AND EVENT HANDLERS


  const handleEmployeeForm = async () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  }

  const handleSubmit = async (fields) => {

    const employeeSalaryObj = employeeSalaryFormRef.current.values;

    const param = {
      "salary": employeeSalaryObj.salary,
      "startedDate": formatDate(employeeSalaryObj.startedDate, "YYYY-MM-DD"),
      "untilDate": employeeSalaryObj.untilDate == null ? null : formatDate(employeeSalaryObj.untilDate, "YYYY-MM-DD"),
      "employeeNo": fields.employeeNo,
      "firstName": fields.firstName,
      "middleName": fields.middleName,
      "lastName": fields.lastName,
      "sex": fields.sex,
      "contactNo": fields.contactNo,
      "hireDate": formatDate(fields.hireDate, "YYYY-MM-DD"),
      "birthDate": formatDate(fields.birthDate, "YYYY-MM-DD"),
      "employeePositionID": fields.employeePositionID,
      "employeeDepartmentID": fields.employeeDepartmentID
    }

    if (isAddMode) {

      submitAdd(param);

    } else {

      if (dataEmployeeSalary.status) {
        param.employeeSalaryID = dataEmployeeSalary.data.EmployeeSalaryID;
      }

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

      if (dataEmployee.status) {
        const { data } = dataEmployee;

        ReactDOM.unstable_batchedUpdates(() => {
          actionsEmployeeData.changeEmployeeNo(data.EmployeeNo);
          actionsEmployeeData.changeFirstName(data.FirstName);
          actionsEmployeeData.changeMiddleName(data.MiddleName);
          actionsEmployeeData.changeLastName(data.LastName);
          actionsEmployeeData.changeSex(data.Sex);
          actionsEmployeeData.changeContactNo(data.ContactNo);
          actionsEmployeeData.changeHireDate(data.HireDate);
          actionsEmployeeData.changeBirthDate(data.BirthDate);
          actionsEmployeeData.changeEmployeeDepartmentID(data.EmployeeDepartmentID);
          actionsEmployeeData.changeEmployeePositionID(data.EmployeePositionID);

        });

      } else if (!dataEmployee.status) {
        passErrorMsg(`${dataEmployee.msg}`);
      }
    }

  }, [dataEmployee]);

  useDidUpdateEffect(() => {

    if (isAddMode) {
      postSuccessCallback(addData);

    } else {

      postSuccessCallback(editData);
    }

  }, [addData, editData]);

  useDidUpdateEffect(() => {

    if (dataDepartments) {

      if (dataDepartments.status === true) {

        // set first option as default value if it has no value
        if (employeeFormData.employeeDepartmentID === null || employeeFormData.employeeDepartmentID === "") {
          actionsEmployeeData.changeEmployeeDepartmentID(dataDepartments.data[0].EmployeeDepartmentID);
        }
      } else {
        passErrorMsg(`${dataDepartments.msg}`);
      }


    }
  }, [dataDepartments])

  useDidUpdateEffect(() => {
    if (dataPositions) {

      if (dataPositions.status === true) {

        // set first option as default value if it has no value
        if (employeeFormData.employeePositionID === null || employeeFormData.employeePositionID === "") {
          actionsEmployeeData.changeEmployeePositionID(dataPositions.data[0].EmployeePositionID);
        }
      } else {
        passErrorMsg(`${dataPositions.msg}`);
      }


    }
  }, [dataPositions])

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
        <div className="row w-100 mx-0" data-testid="EmployeesForm">
          <div className="col-lg-8 col-xlg-9 col-md-12">
            <div className="card px-4 px-sm-5">

              <div className="card-body">
                <h4 className="card-title">{isAddMode ? 'Add' : 'Edit'} Employee</h4>
                <div className="row mb-4">
                  <div className="col mt-3">

                    <FormikWithRef
                      validationSchema={schema}
                      initialValues={employeeFormData}
                      onSubmit={handleSubmit}
                      formRef={formRef}
                      enableReinitialize
                    >

                      {({ setFieldValue }) => (
                        <>
                          <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
                          {loadingEmployee && loadingDepartments && loadingPositions ? <Spinner /> :
                            <>
                              <div>
                                <Field
                                  label="Employee Number"
                                  type="text"
                                  name="employeeNo"
                                  placeholder="Employee Number"
                                  disabled={!isWriteable}
                                  component={TextFormField}
                                />
                              </div>
                              <div>
                                <Field
                                  label="First Name"
                                  type="text"
                                  name="firstName"
                                  placeholder="First Name"
                                  disabled={!isWriteable}
                                  component={TextFormField}
                                />
                              </div>
                              <div>
                                <Field
                                  label="Middle Name"
                                  type="text"
                                  name="middleName"
                                  placeholder="Middle Name"
                                  disabled={!isWriteable}
                                  component={TextFormField}
                                />
                              </div>
                              <div>
                                <Field
                                  label="Last Name"
                                  type="text"
                                  name="lastName"
                                  placeholder="Last Name"
                                  disabled={!isWriteable}
                                  component={TextFormField}
                                />
                              </div>
                              <div className="mb-3">
                                <label className="d-block"> Sex </label>
                                {sexArray.map(obj => {

                                  return (
                                    <React.Fragment key={`sexFrag${obj.id}`}>
                                      <label key={`sexLabel${obj.id}`} htmlFor={`sex${obj.id}`} className="mr-4">
                                        <Field
                                          type="radio"
                                          value={`${obj.id}`}
                                          id={`sex${obj.id}`}
                                          key={`sex${obj.id}`}
                                          name="sex"
                                          disabled={!isWriteable}
                                        />
                                        {obj.value}
                                      </label>
                                    </React.Fragment>
                                  )
                                })}

                              </div>
                              <div>
                                <Field
                                  label="Contact Number"
                                  type="tel"
                                  name="contactNo"
                                  placeholder="Contact Number"
                                  disabled={!isWriteable}
                                  component={TextFormField}
                                  required
                                />
                              </div>
                              <div>
                                <Field
                                  label="Hire Date"
                                  name="hireDate"
                                  setStartDate={(value) => setFieldValue("hireDate", value)}
                                  disabled={!isWriteable}
                                  component={DateFormField}
                                />
                              </div>
                              <div>
                                <Field
                                  label="Birth Date"
                                  name="birthDate"
                                  setStartDate={(value) => setFieldValue("birthDate", value)}
                                  disabled={!isWriteable}
                                  component={DateFormField}
                                />
                              </div>
                              <div>
                                <Field
                                  label="Position"
                                  options={extractedDataPositions}
                                  idKey="EmployeePositionID"
                                  valueKey="PositionName"
                                  name="employeePositionID"
                                  component={SelectFormField}
                                  disabled={!isWriteable}
                                />
                              </div>
                              <div>
                                <Field
                                  label="Department"
                                  options={extractedDataDepartments}
                                  idKey="EmployeeDepartmentID"
                                  valueKey="DepartmentName"
                                  name="employeeDepartmentID"
                                  component={SelectFormField}
                                  disabled={!isWriteable}
                                />
                              </div>

                            </>
                          }
                        </>
                      )}
                    </FormikWithRef>

                    {!isAddMode && loadingDataEmployeeSalary ? <Spinner /> : <div className="mt-5">
                      <MemoEmployeeSalariesForm parentFormRef={employeeSalaryFormRef} priv={priv} customEmployeeSalaryURL={employeeSalaryByIdURL} />
                    </div>}


                    <div className="mt-3">
                      {priv === PRIVILEGES.readWrite && <button onClick={handleEmployeeForm} type="button" className="btn btn-primary mr-2">Submit</button>}
                    </div>
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

export default EmployeesFormComplete;