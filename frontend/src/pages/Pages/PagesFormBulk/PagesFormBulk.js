import React, { useCallback, useEffect, useReducer, useRef } from 'react'
import ReactDOM from "react-dom";
import './PagesFormBulk.css';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import useAlert from '../../../components/useAlert';
import useFetch from '../../../components/useFetch';
import useDidUpdateEffect from '../../../components/useDidUpdateEffect';
import { Field } from 'formik';
import * as yup from 'yup';
import { PRIVILEGES, ERRORMSG } from "../../../helpers/constants";
import TextFormField from '../../../components/FormFields/TextFormField/TextFormField'
import { equalTo } from '../../../helpers/utils';
import usePost from '../../../components/usePost';
import Spinner from '../../../components/Spinner/Spinner';
import usePut from '../../../components/usePut';
import MenusForm from '../../Menus/MenusForm/MenusForm';
import { List } from 'immutable';
import styled from 'styled-components';
import FormikWithRef from '../../../components/FormikWithRef';

const MemoMenusForm = React.memo(MenusForm);

const pageByIdURL = `${process.env.REACT_APP_BACKEND_HOST}/API/page/get/by/`;
const addPageURL = `${process.env.REACT_APP_BACKEND_HOST}/API/page/insert/bulk/by/session`;
const editPageURL = `${process.env.REACT_APP_BACKEND_HOST}/API/page/modify/bulk/by/session/`;
const privUrl = `${process.env.REACT_APP_BACKEND_HOST}/API/privilege/get/all`;
const pagesRoleUrl = `${process.env.REACT_APP_BACKEND_HOST}/API/pagerole/get/by/session/and/page/`;

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
    case 'changePrivID':
      return { ...state, privID: action.payload };
    default:
      return state;
  }
}

const mapDispatch = dispatch => ({
  changePageName: (payload) => dispatch({ type: 'changePageName', payload: payload }),
  changePagePath: (payload) => dispatch({ type: 'changePagePath', payload: payload }),
  changePrivID: (payload) => dispatch({ type: 'changePrivID', payload: payload })
})

const pageFormInitialState = {
  pageName: "",
  pagePath: "",
  privID: ""
};


const menuByIdURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/get/by/page/`;

function PagesFormBulk({ priv }) {

  // HOOKS DECLARATIONS AND VARIABLES
  const location = useLocation();

  const [pageFormData, dispatchPage] = useReducer(pageReducer, pageFormInitialState);
  const actionsPageData = mapDispatch(dispatchPage);

  const urlParamObj = useParams();
  const urlParam = urlParamObj.id;

  const [submitEdit, editData] = usePut(editPageURL + urlParam);
  const [submitAdd, addData] = usePost(addPageURL);

  const [dataPage, loadingPage] = useFetch(pageByIdURL + urlParam);
  const [dataPageRole, loadingPageRole] = useFetch(pagesRoleUrl + urlParam);
  const [dataPriv, loadingDataPriv, extractedDataPriv] = useFetch(privUrl, { initialData: List([]) });

  const [dataMenu, loadingDataMenu] = useFetch(menuByIdURL + urlParam);

  const menuFormInitState = useRef(null);

  const { current: isAddMode } = useRef(urlParam === "add");

  const history = useHistory();

  const { current: isWriteable } = useRef(priv === PRIVILEGES.readWrite);

  // Then inside the component body
  const formRef = useRef();

  // const menuFormRef = useRef();
  const menuFormRef = useCallback(node => {

    if (node === null) {
      // DOM node referenced by ref has been unmounted

    } else {
      const { values } = node;

      menuFormInitState.current = {
        menuName: values.menuName,
        pageID: values.pageID,
        parentMenuID: values.parentMenuID
      };

      // DOM node referenced by ref has changed and exists
    }
  }, []); // adjust deps();

  const {
    passErrorMsg,
    AlertElements,
    errorMsg,
    successMsg
  } = useAlert();

  // FUNCTIONS AND EVENT HANDLERS


  const handlePageForm = async () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  }

  const handleSubmit = async (fields) => {

    const menuObj = menuFormInitState.current;

    const param = {
      "menuName": menuObj.menuName,
      "parentMenuID": menuObj.parentMenuID ? parseInt(menuObj.parentMenuID) : null,
      "pageName": fields.pageName,
      "pagePath": fields.pagePath,
      "privID": parseInt(fields.privID)
    }

    if (isAddMode) {

      submitAdd(param);

    } else {

      if (dataMenu.status) {
        param.menuID = dataMenu.data.MenuID;
      }

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

    if (!isAddMode) {

      if (dataPageRole.status) {
        const { data } = dataPageRole;

        ReactDOM.unstable_batchedUpdates(() => {
          actionsPageData.changePrivID(`${data[0].PrivilegeID}`);
        });

      } else if (!dataPageRole.status) {
        passErrorMsg(`${dataPageRole.msg}`);
      }
    }

  }, [dataPageRole]);

  useDidUpdateEffect(() => {

    if (isAddMode) {
      // set default value of page role from priv data if add mode, set first index of array
      actionsPageData.changePrivID(`${dataPriv.data[0].PrivilegeID}`);
    }

  }, [dataPriv]);


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

                    <FormikWithRef
                      validationSchema={schema}
                      initialValues={pageFormData}
                      onSubmit={handleSubmit}
                      formRef={formRef}
                      enableReinitialize
                    >
                      <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
                      {loadingPage && loadingDataPriv && loadingPageRole ? <Spinner /> :
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

                          <div className="mt-5">
                            <h5 className="card-title"> Role of Logged-in User to Page</h5>
                            {extractedDataPriv.map(priv => {

                              return (
                                <React.Fragment key={`privFrag${priv.PrivilegeID}`}>
                                  <StyledLabel key={`privLabel${priv.PrivilegeID}`} htmlFor={`priv${priv.PrivilegeID}`}>
                                    <Field
                                      type="radio"
                                      value={`${priv.PrivilegeID}`}
                                      id={`priv${priv.PrivilegeID}`}
                                      key={`priv${priv.PrivilegeID}`}
                                      name="privID"
                                      disabled={!isWriteable}
                                    />
                                    {priv.PrivilegeName}
                                  </StyledLabel>
                                </React.Fragment>
                              )
                            })}

                          </div>
                        </>
                      }

                    </FormikWithRef>
                    {!isAddMode && loadingDataMenu ? <Spinner /> : <div className="mt-5">
                      <MemoMenusForm parentFormRef={menuFormRef} priv={priv} customMenuURL={menuByIdURL} parentMemoData={menuFormInitState.current} />
                    </div>}


                    <div className="mt-3">
                      {priv === PRIVILEGES.readWrite && <button onClick={handlePageForm} type="button" className="btn btn-primary mr-2">Submit</button>}
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

const StyledLabel = styled.label`
    cursor: pointer;
    margin: 0px 50px 0px 0px;
`

export default PagesFormBulk;