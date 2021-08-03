import React, { useEffect, useReducer, useRef, useState } from 'react';
import ReactDOM from "react-dom";
import './UsersForm.css';
import { equalTo } from "../../../helpers/utils";
import TextFormField from '../../../components/FormFields/TextFormField/TextFormField'
import { Formik, Form, Field } from "formik";
import * as yup from 'yup';
import Spinner from '../../../components/Spinner/Spinner';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { PRIVILEGES, ERRORMSG } from "../../../helpers/constants";
import usePost, { usePostFormData } from '../../../components/usePost';
import useDidUpdateEffect from '../../../components/useDidUpdateEffect';
import useFetch from '../../../components/useFetch';
import usePut from '../../../components/usePut';
import { List } from 'immutable';
import useAlert from '../../../components/useAlert';
import SelectFormField from '../../../components/FormFields/SelectFormField/SelectFormField';

const userByIdURL = `${process.env.REACT_APP_BACKEND_HOST}/API/user/get/by/`;
const roleURL = `${process.env.REACT_APP_BACKEND_HOST}/API/role/get/all`;
const addUserURL = `${process.env.REACT_APP_BACKEND_HOST}/API/user/insert`;
const editUserURL = `${process.env.REACT_APP_BACKEND_HOST}/API/user/modify/`;
const uploadImgUserURL = `${process.env.REACT_APP_BACKEND_HOST}/API/user/upload/img`;
const imgSrcMainPath = `${process.env.REACT_APP_BACKEND_HOST}`;

yup.addMethod(yup.string, 'equalTo', equalTo);

const schemaAdd = yup.object().shape({
  username: yup.string().max(45, 'Must be 45 characters or less').required('Required'),
  // password: yup.string().min(12, 'Must be longer than 12'),
  // confirmPassword: yup.string().equalTo(yup.ref('password'), "Passwords don't match!")
});

const schemaEdit = yup.object().shape({
  username: yup.string().max(45, 'Must be 45 characters or less').required('Required'),
  // password: yup.string().min(12, 'Must be longer than 12').required('Required'),
  // confirmPassword: yup.string().equalTo(yup.ref('password'), "Passwords don't match!").required('Required')
});

const userReducer = (state, action) => {
  switch (action.type) {
    case 'changeUsername':
      return { ...state, username: action.payload };
    case 'changePassword':
      return { ...state, password: action.payload };
    case 'changeRoleID':
      return { ...state, roleID: action.payload };
    default:
      return state;
  }
}

const mapDispatch = dispatch => ({
  changeUsername: (payload) => dispatch({ type: 'changeUsername', payload: payload }),
  changePassword: (payload) => dispatch({ type: 'changePassword', payload: payload }),
  changeRoleID: (payload) => dispatch({ type: 'changeRoleID', payload: payload })

})

const userFormInitialState = {
  username: "",
  password: "",
  confirmPassword: "",
  roleID: "",
  userImg: ""
}

function UsersForm({ priv }) {

  // HOOKS DECLARATIONS AND VARIABLES
  const location = useLocation();
  const [imgSrc, setImgSrc] = useState();

  const [userFormData, dispatchUser] = useReducer(userReducer, userFormInitialState);
  const actionsUserData = mapDispatch(dispatchUser);

  const urlParamObj = useParams();
  const urlParam = urlParamObj.id;

  const [submitEdit, editData] = usePut(editUserURL + urlParam);
  const [submitAdd, addData] = usePost(addUserURL);
  const [submitImage, imageData] = usePostFormData(uploadImgUserURL);

  const [dataUser, loadingUser] = useFetch(userByIdURL + urlParam);
  const [dataRoles, loadingRoles, extractedDataRoles] = useFetch(roleURL, { initialData: List([]) });

  const isAddMode = urlParam === "add";

  const history = useHistory();

  const isWriteable = priv === PRIVILEGES.readWrite;

  const { current: schema } = useRef(isAddMode ? schemaAdd : schemaEdit);

  const successRef = useRef([]);
  const formRef = useRef();

  const {
    passErrorMsg,
    AlertElements,
    errorMsg,
    successMsg
  } = useAlert();

  // FUNCTIONS AND EVENT HANDLERS

  const handleSubmitForm = async (fields) => {

    const param = {
      "username": fields.username,
      "password": fields.password,
      "roleid": fields.roleID,
    }

    if (isAddMode) {

      submitAdd(param);

    } else {
      submitEdit(param);
    }

  }

  const postSuccessCallback = (respData) => {

    if (respData.status === true) {
      successRef.current.push(respData.msg);

      history.push({
        pathname: '/users',
        successMsg: successRef.current,
        search: location.search
      });
    } else {
      passErrorMsg(`${respData.msg}`);
    }
  }

  const pushSuccessCallback = (respData) => {

    if (respData.status === true) {
      successRef.current.push(respData.msg);

    } else {
      passErrorMsg(`${respData.msg}`);
    }
  }

  const handleFileChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImgSrc(reader.result);
    };

    reader.readAsDataURL(e.target.files[0]);
  }

  // LIFECYCLES
  useEffect(() => {
    if (isAddMode && priv === PRIVILEGES.read) {
      history.push({
        pathname: '/users',
        errorMsg: [ERRORMSG.noPrivilege],
        search: location.search
      });
    }
  }, [history, isAddMode, location.search, priv])

  useDidUpdateEffect(() => {
    if (dataRoles) {

      if (dataRoles.status === true) {
        // set first option as default value if it has no value
        if (userFormData.roleID === null || userFormData.roleID === "") {
          actionsUserData.changeRoleID(dataRoles.data[0].id);
        }
      } else {
        passErrorMsg(`${dataRoles.msg}`);
      }


    }
  }, [dataRoles])

  useDidUpdateEffect(() => {

    if (!isAddMode) {

      if (dataUser.status) {
        const { data } = dataUser;

        ReactDOM.unstable_batchedUpdates(() => {
          setImgSrc(imgSrcMainPath + data.img)
          actionsUserData.changeUsername(data.uname);
          actionsUserData.changeRoleID(data.rid);
        });

      } else if (!dataUser.status) {
        passErrorMsg(`${dataUser.msg}`);
      }
    }

  }, [dataUser]);

  useDidUpdateEffect(() => {

    let currentObjData;

    if (isAddMode) {
      currentObjData = addData;
    } else {
      currentObjData = editData;
    }

    if (currentObjData.status && !!formRef.current.values.userImg) {
      const currentID = isAddMode ? currentObjData.id : urlParam;

      pushSuccessCallback(currentObjData);

      const formData = new FormData();
      formData.append("userImgUpload", formRef.current.values.userImg[0]);
      formData.append("id", currentID);
      submitImage(formData);
    } else {
      postSuccessCallback(currentObjData);
    }


  }, [addData, editData]);

  useDidUpdateEffect(() => {

    postSuccessCallback(imageData);

  }, [imageData]);

  // UI
  return (

    <>
      <div>
        <div className="page-header">
          <Link className="btn btn-outline-light btn-icon-text btn-md" to={`/users${location.search}`}>
            <i className="mdi mdi-keyboard-backspace btn-icon-prepend mdi-18px"></i>
            <span className="d-inline-block text-left">
              Back
            </span>
          </Link>

        </div>
        <Formik
          validationSchema={schema}
          initialValues={userFormData}
          onSubmit={handleSubmitForm}
          innerRef={formRef}
          enableReinitialize
        >
          {({ setFieldValue }) => (
            <Form>

              <div className="row w-100 mx-0" data-testid="UsersForm">
                <div className="col-lg-4 col-xlg-3 col-md-12">
                  <div className="row">
                    <div className="col">
                      <input name="userImg" type="file" disabled={!isWriteable} onChange={(event) => {
                        setFieldValue("userImg", Array.from(event.target.files));
                        handleFileChange(event);
                      }} className="form-control-file h-auto" />

                      <img className="img-fluid" src={imgSrc} alt="User Profile" name="userImgUpload" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-8 col-xlg-9 col-md-12">
                  <div className="card px-4 px-sm-5">

                    <div className="card-body">
                      <h4 className="card-title">{isAddMode ? 'Add' : 'Edit'} User</h4>
                      <div className="row mb-4">
                        <div className="col mt-3">


                          <AlertElements errorMsg={errorMsg} successMsg={successMsg} />
                          {loadingUser && loadingRoles ? <Spinner /> :
                            <>
                              <div>
                                <Field
                                  label="Username"
                                  type="text"
                                  name="username"
                                  placeholder="Username"
                                  disabled={!isWriteable}
                                  component={TextFormField}
                                />
                              </div>
                              <div>
                                <Field
                                  label="Password"
                                  type="password"
                                  name="password"
                                  placeholder="Password"
                                  disabled={!isWriteable}
                                  component={TextFormField}
                                />
                              </div>
                              <div>
                                <Field
                                  label="Confirm Password"
                                  type="password"
                                  placeholder="Confirm Password"
                                  name="confirmPassword"
                                  disabled={!isWriteable}
                                  component={TextFormField}
                                />
                              </div>
                              <div>
                                <Field
                                  label="Role"
                                  options={extractedDataRoles}
                                  idKey="id"
                                  valueKey="rname"
                                  name="roleID"
                                  disabled={!isWriteable}
                                  component={SelectFormField}
                                />
                              </div>
                              <div className="mt-3">
                                {isWriteable && <button type="submit" className="btn btn-primary mr-2">Submit</button>}
                              </div>
                            </>
                          }


                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}


export default UsersForm;