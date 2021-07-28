import React, { useEffect, useReducer } from 'react';
import './ParentMenusForm.css';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import Spinner from '../../../components/Spinner/Spinner';
import { PRIVILEGES, ERRORMSG } from "../../../helpers/constants";
import TextFormField from '../../../components/FormFields/TextFormField/TextFormField'
import { equalTo } from '../../../helpers/utils';
import useDidUpdateEffect from '../../../components/useDidUpdateEffect';
import ReactDOM from "react-dom";
import usePost from '../../../components/usePost';
import usePut from '../../../components/usePut';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import useAlert from '../../../components/useAlert';
import useFetch from '../../../components/useFetch';

const parentMenuByIdURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/parent/get/by/`;
const addParentMenuURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/parent/insert`;
const editParentMenuURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/parent/modify/`;

yup.addMethod(yup.string, 'equalTo', equalTo);

const schema = yup.object().shape({
  parentMenuName: yup.string().max(30, 'Must be 30 characters or less').required('Required')
});

const parentMenuReducer = (state, action) => {
  switch (action.type) {
    case 'changeParentMenuName':
      return { ...state, parentMenuName: action.payload };
    default:
      return state;
  }
}

const mapDispatch = dispatch => ({
  changeParentMenuName: (payload) => dispatch({ type: 'changeParentMenuName', payload: payload })
})

const parentMenuFormInitialState = {
  parentMenuName: ""
};

function ParentMenuForm({ priv }) {

  // HOOKS DECLARATIONS AND VARIABLES
  const location = useLocation();

  const [parentMenuFormData, dispatchParentMenu] = useReducer(parentMenuReducer, parentMenuFormInitialState);
  const actionsParentMenuData = mapDispatch(dispatchParentMenu);

  const urlParamObj = useParams();
  const urlParam = urlParamObj.id;

  const [submitEdit, editData] = usePut(editParentMenuURL + urlParam);
  const [submitAdd, addData] = usePost(addParentMenuURL);

  const [dataParentMenu, loadingParentMenu] = useFetch(parentMenuByIdURL + urlParam);

  const isAddMode = urlParam === "add";

  const history = useHistory();

  const isWriteable = priv === PRIVILEGES.readWrite;

  const {
    passErrorMsg,
    AlertElements,
    errorMsg,
    successMsg
  } = useAlert();

  // FUNCTIONS AND EVENT HANDLERS

  const handleSubmitForm = async (fields) => {

    const param = {
      "parentMenuName": fields.parentMenuName
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
        pathname: '/parentMenus',
        successMsg: [successArr],
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
        pathname: '/parentMenus',
        errorMsg: [ERRORMSG.noPrivilege],
        search: location.search
      });
    }
  }, [history, isAddMode, location.search, priv])

  useDidUpdateEffect(() => {

    if (!isAddMode) {

      if (dataParentMenu.status) {
        const { data } = dataParentMenu;

        ReactDOM.unstable_batchedUpdates(() => {
          actionsParentMenuData.changeParentMenuName(data.ParentMenuName);
        });


      } else if (!dataParentMenu.status) {
        passErrorMsg(`${dataParentMenu.msg}`);
      }
    }

  }, [dataParentMenu]);

  useDidUpdateEffect(() => {

    let successArr = [];

    if (isAddMode) {
      postSuccessCallback(addData, successArr);

    } else {

      postSuccessCallback(editData, successArr);
    }

  }, [addData, editData]);

  // UI
  return (

    <>
      <div>
        <div className="page-header">
          <Link className="btn btn-outline-light btn-icon-text btn-md" to={`/parentMenus${location.search}`}>
            <i className="mdi mdi-keyboard-backspace btn-icon-prepend mdi-18px"></i>
            <span className="d-inline-block text-left">
              Back
            </span>
          </Link>

        </div>
        <div className="row w-100 mx-0" data-testid="ParentMenusForm">
          <div className="col-lg-8 col-xlg-9 col-md-12">
            <div className="card px-4 px-sm-5">

              <div className="card-body">
                <h4 className="card-title">{isAddMode ? 'Add' : 'Edit'} ParentMenu</h4>
                <div className="row mb-4">
                  <div className="col mt-3">
                    <Formik
                      validationSchema={schema}
                      initialValues={parentMenuFormData}
                      onSubmit={handleSubmitForm}
                      enableReinitialize
                    >
                      {() => (
                        <Form>
                          <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
                          {loadingParentMenu ? <Spinner /> :
                            <>
                              <div>
                                <Field
                                  label="ParentMenu Name"
                                  type="text"
                                  name="parentMenuName"
                                  placeholder="ParentMenu Name"
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

export default ParentMenuForm;