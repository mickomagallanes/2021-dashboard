import React, { useCallback, useEffect, useReducer, useRef } from 'react'
import ReactDOM from "react-dom";
import './MenusForm.css';
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
import SelectFormField from '../../../components/FormFields/SelectFormField/SelectFormField';
import FormikWithRef from '../../../components/FormikWithRef';
import { List } from 'immutable';

const menuByIdURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/get/by/`;
const parentMenuAllURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/parent/get/all`;
const pageAllURL = `${process.env.REACT_APP_BACKEND_HOST}/API/page/get/all`;
const addMenuURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/insert`;
const editMenuURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/modify/`;

const schema = yup.object().shape({
  menuName: yup.string().max(30, 'Must be 30 characters or less').required('Required')
});

const menuReducer = (state, action) => {
  switch (action.type) {
    case 'changeMenuName':
      return { ...state, menuName: action.payload };
    case 'changePageID':
      return { ...state, pageID: action.payload };
    case 'changeParentMenuID':
      return { ...state, parentMenuID: action.payload || "" }; // cant be null, so return blank instead, add if column is optional
    default:
      return state;
  }
}

const mapDispatch = dispatch => ({
  changeMenuName: (payload) => dispatch({ type: 'changeMenuName', payload: payload }),
  changePageID: (payload) => dispatch({ type: 'changePageID', payload: payload }),
  changeParentMenuID: (payload) => dispatch({ type: 'changeParentMenuID', payload: payload })
})

export const menuFormInitialState = {
  menuName: "",
  pageID: "",
  parentMenuID: ""
};

/**
 * MenusForm Component
 * @param {Object} obj
 * @param {String} obj.priv Privilege of logged-in user to MenusForm
 * @param {String} obj.pagePath path connecting sub page to page
 * @param {String} [obj.customMenuURL] replaces url of menu get by id, added if component is rendered as child from other form
 * @param {React useRef} [obj.parentFormRef] add ref for formik, so parent component can fetch the form value
 */
function MenusForm({ priv, pagePath, customMenuURL, parentFormRef }) {

  // TODO: make all static data useRef

  // if this component is used as child
  const { current: isRenderedAsChild } = useRef(customMenuURL !== undefined);
  const { current: menuURL } = useRef(isRenderedAsChild ? customMenuURL : menuByIdURL);

  // HOOKS DECLARATIONS AND VARIABLES
  const location = useLocation();

  const [menuFormData, dispatchMenu] = useReducer(menuReducer, menuFormInitialState);
  const actionsMenuData = mapDispatch(dispatchMenu);

  const urlParamObj = useParams();
  const urlParam = urlParamObj.id;

  const [submitEdit, editData] = usePut(editMenuURL + urlParam);
  const [submitAdd, addData] = usePost(addMenuURL);

  const [dataMenu, loadingMenu] = useFetch(menuURL + urlParam);
  const [dataParentMenus, loadingParentMenus, extractedDataParentMenus] = useFetch(parentMenuAllURL, { initialData: List([]) });
  const [dataPages, loadingPages, extractedDataPages] = useFetch(pageAllURL, { initialData: List([]) });

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
            <h5 className="card-title"> Menu </h5>
            {props.children}
          </>
          :
          <div className="row w-100 mx-0" data-testid="MenusForm">
            <div className="col-lg-8 col-xlg-9 col-md-12">
              <div className="card px-4 px-sm-5">

                <div className="card-body">
                  <h4 className="card-title">{isAddMode ? 'Add' : 'Edit'} Menu</h4>
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

    const param = {
      "menuName": fields.menuName,
      "pageID": fields.pageID,
      "parentMenuID": fields.parentMenuID ? parseInt(fields.parentMenuID) : null
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
    if (dataPages) {

      // set first option as default value if it has no value
      if (dataPages.status === true) {
        if (menuFormData.pageID === null || menuFormData.pageID === "") {
          actionsMenuData.changePageID(dataPages.data[0].PageID);
        }

      } else {
        passErrorMsg(`${dataPages.msg}`);
      }

    }
  }, [dataPages])


  useDidUpdateEffect(() => {
    if (!dataParentMenus.status) {
      passErrorMsg(`${dataParentMenus.msg}`);
    }

  }, [dataParentMenus])


  useDidUpdateEffect(() => {

    if (!isAddMode) {

      if (dataMenu.status) {
        const { data } = dataMenu;

        ReactDOM.unstable_batchedUpdates(() => {
          actionsMenuData.changeMenuName(data.MenuName);
          actionsMenuData.changeParentMenuID(data.ParentMenuID);
          actionsMenuData.changePageID(data.PageID);
        });


      } else if (!dataMenu.status && !isRenderedAsChild) {
        passErrorMsg(`${dataMenu.msg}`);
      }
    }

  }, [dataMenu]);


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
                initialValues={menuFormData}
                onSubmit={handleSubmitForm}
                formRef={parentFormRef}
                enableReinitialize
              >
                <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
                {loadingMenu && loadingPages && loadingParentMenus ? <Spinner /> :
                  <>
                    <div>
                      <Field
                        label="Menu Name"
                        type="text"
                        name="menuName"
                        placeholder="Menu Name"
                        disabled={!isWriteable}
                        component={TextFormField}
                      />
                    </div>
                    <div>
                      <Field
                        label="Parent Menu ID"
                        options={extractedDataParentMenus}
                        idKey="ParentMenuID"
                        valueKey="ParentMenuName"
                        name="parentMenuID"
                        component={SelectFormField}
                        allowDefaultNull={true}
                        disabled={!isWriteable}
                      />
                    </div>
                    {!isRenderedAsChild &&
                      <>
                        <div className="mt-3">
                          <Field
                            label="Page"
                            options={extractedDataPages}
                            idKey="PageID"
                            valueKey="PageName"
                            name="pageID"
                            component={SelectFormField}
                            disabled={!isWriteable}
                          />
                        </div>
                        <div className="mt-3">
                          {priv === PRIVILEGES.readWrite && <button type="submit" className="btn btn-primary mr-2">Submit</button>}
                        </div>
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

export default MenusForm;