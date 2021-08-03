import React, { useEffect, useReducer } from 'react'
import ReactDOM from "react-dom";
import './PagesForm.css';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import useAlert from '../../../components/useAlert';
import useFetch from '../../../components/useFetch';
import useDidUpdateEffect from '../../../components/useDidUpdateEffect';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { PRIVILEGES, ERRORMSG } from "../../../helpers/constants";
import TextFormField from '../../../components/FormFields/TextFormField/TextFormField'
import { equalTo } from '../../../helpers/utils';
import usePost from '../../../components/usePost';
import Spinner from '../../../components/Spinner/Spinner';
import usePut from '../../../components/usePut';

const pageByIdURL = `${process.env.REACT_APP_BACKEND_HOST}/API/page/get/by/`;
const addPageURL = `${process.env.REACT_APP_BACKEND_HOST}/API/page/insert`;
const editPageURL = `${process.env.REACT_APP_BACKEND_HOST}/API/page/modify/`;

yup.addMethod(yup.string, 'equalTo', equalTo);

const schema = yup.object().shape({
  pageName: yup.string().max(30, 'Must be 30 characters or less').required('Required'),
  pagePath: yup.string().max(30, 'Must be 30 characters or less').required('Required')
});


const pageReducer = (state, action) => {
  switch (action.type) {
    case 'changePageName':
      return { ...state, pageName: action.payload };
    case 'changePagePath':
      return { ...state, pagePath: action.payload };
    default:
      return state;
  }
}

const mapDispatch = dispatch => ({
  changePageName: (payload) => dispatch({ type: 'changePageName', payload: payload }),
  changePagePath: (payload) => dispatch({ type: 'changePagePath', payload: payload })

})

const pageFormInitialState = {
  pageName: "",
  pagePath: ""
};

function PagesForm({ priv }) {

  // HOOKS DECLARATIONS AND VARIABLES
  const location = useLocation();

  const [pageFormData, dispatchPage] = useReducer(pageReducer, pageFormInitialState);
  const actionsPageData = mapDispatch(dispatchPage);

  const urlParamObj = useParams();
  const urlParam = urlParamObj.id;

  const [submitEdit, editData] = usePut(editPageURL + urlParam);
  const [submitAdd, addData] = usePost(addPageURL);

  const [dataPage, loadingPage] = useFetch(pageByIdURL + urlParam);

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
      "pageName": fields.pageName,
      "pagePath": fields.pagePath
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
        pathname: '/pages',
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
        pathname: '/pages',
        errorMsg: [ERRORMSG.noPrivilege],
        search: location.search
      });
    }
  }, [history, isAddMode, location.search, priv])

  useDidUpdateEffect(() => {

    if (!isAddMode) {

      if (dataPage.status) {
        const { data } = dataPage;

        ReactDOM.unstable_batchedUpdates(() => {
          actionsPageData.changePageName(data.PageName);
          actionsPageData.changePagePath(data.PagePath);
        });


      } else if (!dataPage.status) {
        passErrorMsg(`${dataPage.msg}`);
      }
    }

  }, [dataPage]);

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
          <Link className="btn btn-outline-light btn-icon-text btn-md" to={`/pages${location.search}`}>
            <i className="mdi mdi-keyboard-backspace btn-icon-prepend mdi-18px"></i>
            <span className="d-inline-block text-left">
              Back
            </span>
          </Link>

        </div>
        <div className="row w-100 mx-0" data-testid="PagesForm">
          <div className="col-lg-8 col-xlg-9 col-md-12">
            <div className="card px-4 px-sm-5">

              <div className="card-body">
                <h4 className="card-title">{isAddMode ? 'Add' : 'Edit'} Page</h4>
                <div className="row mb-4">
                  <div className="col mt-3">
                    <Formik
                      validationSchema={schema}
                      initialValues={pageFormData}
                      onSubmit={handleSubmitForm}
                      enableReinitialize
                    >
                      {() => (
                        <Form>
                          <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
                          {loadingPage ? <Spinner /> :
                            <>
                              <div>
                                <Field
                                  label="Page Name"
                                  type="text"
                                  name="pageName"
                                  placeholder="Page Name"
                                  disabled={!isWriteable}
                                  component={TextFormField}
                                />
                              </div>
                              <div>
                                <Field
                                  label="Page Path"
                                  type="text"
                                  name="pagePath"
                                  placeholder="Page Path"
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

export default PagesForm;