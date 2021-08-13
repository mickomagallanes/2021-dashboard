import React, { useEffect, useReducer, useRef } from 'react'
import ReactDOM from "react-dom";
import './RoutesForm.css';
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

const routeByIdURL = `${process.env.REACT_APP_BACKEND_HOST}/API/route/get/by/`;
const addRouteURL = `${process.env.REACT_APP_BACKEND_HOST}/API/route/insert`;
const editRouteURL = `${process.env.REACT_APP_BACKEND_HOST}/API/route/modify/`;

const schema = yup.object().shape({
  routeName: yup.string().max(30, 'Must be 30 characters or less').required('Required'),
  routePath: yup.string().max(30, 'Must be 30 characters or less').required('Required')
});


const routeReducer = (state, action) => {
  switch (action.type) {
    case 'changeRouteName':
      return { ...state, routeName: action.payload };
    case 'changeRoutePath':
      return { ...state, routePath: action.payload };
    default:
      return state;
  }
}

const mapDispatch = dispatch => ({
  changeRouteName: (payload) => dispatch({ type: 'changeRouteName', payload: payload }),
  changeRoutePath: (payload) => dispatch({ type: 'changeRoutePath', payload: payload })

})

const routeFormInitialState = {
  routeName: "",
  routePath: ""
};

function RoutesForm({ priv, pagePath }) {

  // HOOKS DECLARATIONS AND VARIABLES
  const location = useLocation();

  const [routeFormData, dispatchRoute] = useReducer(routeReducer, routeFormInitialState);
  const actionsRouteData = mapDispatch(dispatchRoute);

  const urlParamObj = useParams();
  const urlParam = urlParamObj.id;

  const [submitEdit, editData] = usePut(editRouteURL + urlParam);
  const [submitAdd, addData] = usePost(addRouteURL);

  const [dataRoute, loadingRoute] = useFetch(routeByIdURL + urlParam);

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
      "routeName": fields.routeName,
      "routePath": fields.routePath
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

      if (dataRoute.status) {
        const { data } = dataRoute;

        ReactDOM.unstable_batchedUpdates(() => {
          actionsRouteData.changeRouteName(data.RouteName);
          actionsRouteData.changeRoutePath(data.RoutePath);
        });


      } else if (!dataRoute.status) {
        passErrorMsg(`${dataRoute.msg}`);
      }
    }

  }, [dataRoute]);

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
        <div className="row w-100 mx-0" data-testid="RoutesForm">
          <div className="col-lg-8 col-xlg-9 col-md-12">
            <div className="card px-4 px-sm-5">

              <div className="card-body">
                <h4 className="card-title">{isAddMode ? 'Add' : 'Edit'} Route</h4>
                <div className="row mb-4">
                  <div className="col mt-3">
                    <Formik
                      validationSchema={schema}
                      initialValues={routeFormData}
                      onSubmit={handleSubmitForm}
                      enableReinitialize
                    >
                      {() => (
                        <Form>
                          <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
                          {loadingRoute ? <Spinner /> :
                            <>
                              <div>
                                <Field
                                  label="Route Name"
                                  type="text"
                                  name="routeName"
                                  placeholder="Route Name"
                                  disabled={!isWriteable}
                                  component={TextFormField}
                                />
                              </div>
                              <div>
                                <Field
                                  label="Route Path"
                                  type="text"
                                  name="routePath"
                                  placeholder="Route Path"
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

export default RoutesForm;