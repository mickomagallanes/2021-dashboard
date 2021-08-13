import React, { useEffect, useReducer, useRef } from 'react'
import ReactDOM from "react-dom";
import './EmployeePositionsForm.css';
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

const employeePositionByIdURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/position/get/by/`;
const addEmployeePositionURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/position/insert`;
const editEmployeePositionURL = `${process.env.REACT_APP_BACKEND_HOST}/API/employee/position/modify/`;

const schema = yup.object().shape({
  positionName: yup.string().max(45, 'Must be 45 characters or less').required('Required')
});


const employeePositionReducer = (state, action) => {
  switch (action.type) {
    case 'changePositionName':
      return { ...state, positionName: action.payload };
    default:
      return state;
  }
}

const mapDispatch = dispatch => ({
  changePositionName: (payload) => dispatch({ type: 'changePositionName', payload: payload })

})

const employeePositionFormInitialState = {
  positionName: ""
};

function EmployeePositionsForm({ priv, pagePath }) {

  // HOOKS DECLARATIONS AND VARIABLES
  const location = useLocation();

  const [employeePositionFormData, dispatchEmployeePosition] = useReducer(employeePositionReducer, employeePositionFormInitialState);
  const actionsEmployeePositionData = mapDispatch(dispatchEmployeePosition);

  const urlParamObj = useParams();
  const urlParam = urlParamObj.id;

  const [submitEdit, editData] = usePut(editEmployeePositionURL + urlParam);
  const [submitAdd, addData] = usePost(addEmployeePositionURL);

  const [dataEmployeePosition, loadingEmployeePosition] = useFetch(employeePositionByIdURL + urlParam);

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
      "positionName": fields.positionName
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

      if (dataEmployeePosition.status) {
        const { data } = dataEmployeePosition;

        ReactDOM.unstable_batchedUpdates(() => {
          actionsEmployeePositionData.changePositionName(data.PositionName);
        });


      } else if (!dataEmployeePosition.status) {
        passErrorMsg(`${dataEmployeePosition.msg}`);
      }
    }

  }, [dataEmployeePosition]);

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
        <div className="row w-100 mx-0" data-testid="EmployeePositionsForm">
          <div className="col-lg-8 col-xlg-9 col-md-12">
            <div className="card px-4 px-sm-5">

              <div className="card-body">
                <h4 className="card-title">{isAddMode ? 'Add' : 'Edit'} EmployeePosition</h4>
                <div className="row mb-4">
                  <div className="col mt-3">
                    <Formik
                      validationSchema={schema}
                      initialValues={employeePositionFormData}
                      onSubmit={handleSubmitForm}
                      enableReinitialize
                    >
                      {() => (
                        <Form>
                          <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
                          {loadingEmployeePosition ? <Spinner /> :
                            <>
                              <div>
                                <Field
                                  label="Employee Position Name"
                                  type="text"
                                  name="positionName"
                                  placeholder="Employee Position Name"
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

export default EmployeePositionsForm;