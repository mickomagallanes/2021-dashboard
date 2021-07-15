import React, { useEffect, useReducer } from 'react'
import ReactDOM from "react-dom";
import './SubPagesForm.css';
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
import SelectFormField from '../../../components/FormFields/SelectFormField/SelectFormField';

const subPageByIdURL = `${process.env.REACT_APP_BACKEND_HOST}/API/subpage/get/by/`;
const pageAllURL = `${process.env.REACT_APP_BACKEND_HOST}/API/page/get/all`;
const addSubPageURL = `${process.env.REACT_APP_BACKEND_HOST}/API/subpage/insert`;
const editSubPageURL = `${process.env.REACT_APP_BACKEND_HOST}/API/subpage/modify/`;

yup.addMethod(yup.string, 'equalTo', equalTo);

const schema = yup.object().shape({
  subPageName: yup.string().max(30, 'Must be 30 characters or less').required('Required'),
  subPagePath: yup.string().max(30, 'Must be 30 characters or less').required('Required')
});

const subPageReducer = (state, action) => {
  switch (action.type) {
    case 'changeSubPageName':
      return { ...state, subPageName: action.payload };
    case 'changeSubPagePath':
      return { ...state, subPagePath: action.payload };
    case 'changePageID':
      return { ...state, pageID: action.payload };
    default:
      return state;
  }
}

const mapDispatch = dispatch => ({
  changeSubPageName: (payload) => dispatch({ type: 'changeSubPageName', payload: payload }),
  changeSubPagePath: (payload) => dispatch({ type: 'changeSubPagePath', payload: payload }),
  changePageID: (payload) => dispatch({ type: 'changePageID', payload: payload })

})

const subPageFormInitialState = {
  subPageName: "",
  subPagePath: "",
  pageID: ""

};

function SubPagesForm({ priv }) {

  // HOOKS DECLARATIONS AND VARIABLES
  const location = useLocation();

  const [subPageFormData, dispatchSubPage] = useReducer(subPageReducer, subPageFormInitialState);
  const actionsSubPageData = mapDispatch(dispatchSubPage);

  const urlParamObj = useParams();
  const urlParam = urlParamObj.id;

  const [submitEdit, editData] = usePut(editSubPageURL + urlParam);
  const [submitAdd, addData] = usePost(addSubPageURL);

  const [dataSubPage, loadingSubPage] = useFetch(subPageByIdURL + urlParam);
  const [dataPages, loadingPages] = useFetch(pageAllURL);


  const isAddMode = urlParam === "add";

  const history = useHistory();

  const isWriteable = priv !== PRIVILEGES.readWrite;

  const {
    passErrorMsg,
    AlertElements,
    errorMsg,
    successMsg
  } = useAlert();

  // FUNCTIONS AND EVENT HANDLERS

  const handleSubmitForm = async (fields) => {

    const param = {
      "subPageName": fields.subPageName,
      "pageID": fields.pageID,
      "subPagePath": fields.subPagePath
    }

    if (isAddMode) {

      submitAdd(param);

    } else {
      submitEdit(param);
    }

  }

  const postSuccessCallback = (respData, successArr) => {

    if (respData.status === true) {
      successArr.push(respData.msg);

      history.push({
        pathname: '/subpages',
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
        pathname: '/subpages',
        errorMsg: [ERRORMSG.noPrivilege],
        search: location.search
      });
    }
  }, [history, isAddMode, location.search, priv])

  useDidUpdateEffect(() => {
    if (dataPages && dataPages.status === true) {

      // set first option as default value if it has no value
      if (subPageFormData.pageID === null || subPageFormData.pageID === "") {
        actionsSubPageData.changePageID(dataPages.data[0].PageID);
      }

    } else {
      passErrorMsg(`${dataPages.msg}`);
    }
  }, [dataPages])

  useDidUpdateEffect(() => {

    if (!isAddMode && dataSubPage.status) {

      if (dataSubPage.status) {
        const { data } = dataSubPage;

        ReactDOM.unstable_batchedUpdates(() => {
          actionsSubPageData.changeSubPageName(data.SubPageName);
          actionsSubPageData.changeSubPagePath(data.SubPagePath);
          actionsSubPageData.changePageID(data.PageID);
        });


      } else if (!dataSubPage.status) {
        passErrorMsg(`${dataSubPage.msg}`);
      }
    }

  }, [dataSubPage]);

  useDidUpdateEffect(() => {

    let successArr = [];

    // simplify this, it breaks DRY
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
          <Link className="btn btn-outline-light btn-icon-text btn-md" to={`/subPages${location.search}`}>
            <i className="mdi mdi-keyboard-backspace btn-icon-prepend mdi-18px"></i>
            <span className="d-inline-block text-left">
              Back
            </span>
          </Link>

        </div>
        <div className="row w-100 mx-0" data-testid="SubPagesForm">
          <div className="col-lg-8 col-xlg-9 col-md-12">
            <div className="card px-4 px-sm-5">

              <div className="card-body">
                <h4 className="card-title">{isAddMode ? 'Add' : 'Edit'} SubPage</h4>
                <div className="row mb-4">
                  <div className="col mt-3">
                    <Formik
                      validationSchema={schema}
                      initialValues={subPageFormData}
                      onSubmit={handleSubmitForm}
                      enableReinitialize
                    >
                      {() => (
                        <Form>
                          <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
                          {loadingSubPage && loadingPages ? <Spinner /> :
                            <>
                              <div>
                                <Field
                                  label="SubPage Name"
                                  type="text"
                                  name="subPageName"
                                  placeholder="SubPage Name"
                                  disabled={isWriteable}
                                  component={TextFormField}
                                />
                              </div>
                              <div>
                                <Field
                                  label="Subpage Path"
                                  type="text"
                                  name="subPagePath"
                                  placeholder="Subpage Path"
                                  disabled={isWriteable}
                                  component={TextFormField}
                                />
                              </div>
                              <div>
                                <Field
                                  label="Page"
                                  options={(dataPages && dataPages.data) || []}
                                  idKey="PageID"
                                  valueKey="PageName"
                                  name="pageID"
                                  component={SelectFormField}
                                  disabled={isWriteable}
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

export default SubPagesForm;