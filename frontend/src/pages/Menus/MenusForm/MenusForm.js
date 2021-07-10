import React, { useEffect, useReducer } from 'react'
import './MenusForm.css';
import { Link, useHistory, useParams } from 'react-router-dom';
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

const menuURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/get/`;
const addMenuURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/insert`;
const editMenuURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/modify/`;

yup.addMethod(yup.string, 'equalTo', equalTo);

const schema = yup.object().shape({
  menuName: yup.string().max(30, 'Must be 30 characters or less').required('Required')
});

// TODO: not rerendering when action.payload saved
const menuReducer = (state, action) => {
  switch (action.type) {
    case 'changeMenuName':
      return { menuName: action.payload };
    default:
      return state;
  }
}

const mapDispatch = dispatch => ({
  changeMenuName: (payload) => dispatch({ type: 'changeMenuName', payload: payload })
})

const menuFormInitialState = {
  menuName: ""
};

function MenusForm({ priv }) {

  // HOOKS DECLARATIONS AND VARIABLES

  const [menuFormData, dispatchMenu] = useReducer(menuReducer, menuFormInitialState);
  const actionsMenuData = mapDispatch(dispatchMenu);

  const urlParamObj = useParams();

  const urlParam = urlParamObj.id;

  const [submitEdit, editData] = usePut(editMenuURL + urlParam);
  const [submitAdd, addData] = usePost(addMenuURL);

  const [dataMenus, loadingMenus] = useFetch(menuURL + urlParam);

  const isAddMode = urlParam === "add";

  const history = useHistory();

  const {
    passErrorMsg,
    AlertElements,
    errorMsg,
    successMsg
  } = useAlert();

  // FUNCTIONS AND EVENT HANDLERS

  const handleSubmitForm = async (fields) => {

    if (isAddMode) {
      const param = {
        "menuName": fields.menuName
      }
      // save new menu id
      submitAdd(param);

    } else {
      const param = {
        "menuName": fields.menuName
      }
      submitEdit(param);
    }

  }

  const postSuccessCallback = (respData, successArr) => {

    if (respData.status === true) {
      successArr.push(respData.msg);

      history.push({
        pathname: '/menus',
        successMsg: [successArr]
      });
    } else {
      passErrorMsg(`${respData.msg}`);
    }
  }

  // LIFECYCLES
  useEffect(() => {
    if (isAddMode && priv === PRIVILEGES.read) {
      history.push({
        pathname: '/menus',
        errorMsg: [ERRORMSG.noPrivilege]
      });
    }
  }, [history, isAddMode, priv])

  useDidUpdateEffect(() => {

    if (!isAddMode && dataMenus.status) {

      if (dataMenus.status) {
        actionsMenuData.changeMenuName(dataMenus.data.MenuName);
      } else if (!dataMenus.status) {
        passErrorMsg(`${dataMenus.msg}`);
      }
    }

  }, [dataMenus]);

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
          <Link className="btn btn-outline-light btn-icon-text btn-md" to="/menus">
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
                <h4 className="card-title">{isAddMode ? 'Add' : 'Edit'} Menu</h4>
                <div className="row mb-4">
                  <div className="col mt-3">
                    <Formik
                      validationSchema={schema}
                      initialValues={menuFormData}
                      onSubmit={handleSubmitForm}
                      enableReinitialize
                    >
                      {() => (
                        <Form>
                          <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
                          {loadingMenus ? <Spinner /> :
                            <>
                              <div>
                                <Field
                                  label="Menu Name"
                                  type="text"
                                  name="menuName"
                                  placeholder="Menu Name"
                                  disabled={priv !== PRIVILEGES.readWrite}
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

export default MenusForm;