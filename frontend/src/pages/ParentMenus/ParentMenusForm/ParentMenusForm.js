import React from 'react';
import './ParentMenusForm.css';
import axios from 'axios';
import { Alert } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import Spinner from '../../../components/Spinner/Spinner';
import { Link } from 'react-router-dom';
import { PRIVILEGES, ERRORMSG } from "../../../helpers/constants";
import TextFormField from '../../../components/FormFields/TextFormField/TextFormField'
import * as currentModule from './ParentMenusForm'; // use currentmodule to call func outside class, for testing
import { axiosConfig, equalTo } from '../../../helpers/utils';

const parentMenuURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/parent/get/`;
const addParentMenuURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/parent/insert`;
const editParentMenuURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/parent/modify`;

export async function fetchParentMenuData(urlParam) {
  try {
    const resp = await axios.get(
      parentMenuURL + urlParam,
      axiosConfig
    );
    const { data } = resp;

    return data;
  } catch (error) {
    return { status: false, msg: error }
  }
}

yup.addMethod(yup.string, 'equalTo', equalTo);

const schema = yup.object().shape({
  parentMenuName: yup.string().max(30, 'Must be 30 characters or less').required('Required')
});

export default class ParentMenuForm extends React.Component {

  constructor(props) {
    super();
    this.state = {
      errorMsg: [],
      formData: {
        parentMenuName: ""
      },
      isLoading: true
    }

    this.urlParam = props.match.params.id;

    // send back to parentmenus page when Privilege is Read and accessing add mode
    if (this.isAddMode() && props.priv === PRIVILEGES.read) {
      props.history.push({
        pathname: '/parentmenus',
        errorMsg: [ERRORMSG.noPrivilege]
      });
    }

    this.handleSubmitForm = this.handleSubmitForm.bind(this);
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = () => {
      return;
    };
  }

  async componentDidMount() {
    // check if is on add mode
    if (!this.isAddMode()) {
      const parentMenuData = await currentModule.fetchParentMenuData(this.urlParam);

      this.saveParentMenuData(parentMenuData);
    } else {
      this.setState({ isLoading: false });
    }

  }

  isAddMode() {
    return this.urlParam === "add";
  }

  clearErrorMsg() {
    if (this.state.errorMsg.length) {
      this.setState({ errorMsg: [] });
    }
  }

  setErrorMsg(errorArr) {
    this.setState({ errorMsg: [errorArr] });
  }

  pushErrorMsg(errorArr) {
    this.setState({ errorMsg: [...this.state.errorMsg, errorArr] });
  }

  saveParentMenuData = async (parentMenuData) => {
    if (parentMenuData.status === true) {

      this.setState({
        formData: {
          parentMenuName: parentMenuData.data.ParentMenuName
        },
        isLoading: false
      });
    } else {

      this.setErrorMsg(`${parentMenuData.msg}`);
      this.setState({ isLoading: false });
    }
  }

  // submits form using add then returns insertId of parent menu for submit image to use
  submitFormAdd = async (fields) => {
    const param = {
      "parentMenuName": fields.parentMenuName
    }

    try {
      const resp = await axios.post(
        addParentMenuURL,
        param,
        axiosConfig
      );

      if (resp.data.status === true) {
        return resp;

      } else {
        this.setErrorMsg(resp.data.msg);

        return false;

      }

    } catch (error) {
      this.setErrorMsg(`${error}`);
      return false;
    }

  }

  // submits form using edit then returns insertId of parent menu for submit image to use
  submitFormEdit = async (fields) => {
    const param = {
      "parentMenuID": this.urlParam,
      "parentMenuName": fields.parentMenuName
    }

    try {
      const resp = await axios.put(
        editParentMenuURL,
        param,
        axiosConfig
      );

      if (resp.data.status === true) {
        return resp;

      } else {
        this.setErrorMsg(resp.data.msg);
        return false;
      }

    } catch (error) {
      this.setErrorMsg(`${error}`);
      return false;
    }

  }

  async handleSubmitForm(fields) {
    let submitResp;

    if (this.isAddMode()) {
      // save new parent menu id
      submitResp = await this.submitFormAdd(fields);
    } else {
      submitResp = await this.submitFormEdit(fields);
    }
    let successArr = [];

    if (submitResp !== false) {

      successArr.push(submitResp.data.msg);

      this.props.history.push({
        pathname: '/parentmenus',
        successMsg: successArr
      });

    }
  }

  // TODO: make animation transition on routing using Framer Motion
  // TODO: and use Unit Testing with Jest
  render() {

    if (!this.isAddMode() && this.state.isLoading) {
      return (<Spinner />)
    } else {
      return (
        <div>
          <div className="page-header">
            <Link className="btn btn-outline-light btn-icon-text btn-md" to="/parentmenus">
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

                  <h4 className="card-title">{this.isAddMode() ? 'Add' : 'Edit'} Parent Menu</h4>
                  <div className="row mb-4">
                    <div className="col mt-3">
                      <Formik
                        validationSchema={schema}
                        initialValues={this.state.formData}
                        onSubmit={this.handleSubmitForm}
                      >
                        {() => (
                          <Form>
                            {this.state.errorMsg.map((err) =>
                              <Alert
                                className="p-1"
                                variant="danger"
                                show={err}
                                transition={false}
                                key={err}
                              >
                                {err}
                              </Alert>
                            )}
                            <div>
                              <Field
                                label="Parent Menu Name"
                                type="text"
                                name="parentMenuName"
                                placeholder="Parent Menu Name"
                                disabled={this.props.priv !== PRIVILEGES.readWrite}
                                component={TextFormField}
                              />
                            </div>

                            <div className="mt-3">
                              {this.props.priv === PRIVILEGES.readWrite && <button type="submit" className="btn btn-primary mr-2">Submit</button>}
                            </div>

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

      );
    }
  }

}

