import React from 'react';
import './ParentMenusForm.css';
import axios from 'axios';
import { retryRequest } from "../../../helpers/utils";
import { Form, Alert } from 'react-bootstrap';
import Select from '../../../components/FormFields/Select/Select';
import { Formik } from 'formik';
import * as yup from 'yup';
import Spinner from '../../../components/Spinner/Spinner';
import { Link } from 'react-router-dom';
import { PRIVILEGES } from "../../../helpers/constants";

const parentMenuURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/parent/get/`;
const addParentMenuURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/parent/insert`;
const editParentMenuURL = `${process.env.REACT_APP_BACKEND_HOST}/API/menus/parent/modify`;

const axiosConfig = {
  withCredentials: true,
  timeout: 10000
}

function equalTo(ref, msg) {
  return this.test({
    name: 'equalTo',
    exclusive: false,
    message: msg,
    params: {
      reference: ref.path
    },
    test: function (value) {
      return value === this.resolve(ref)
    }
  })
};

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

export default class ParentMenuForm extends React.Component {

  constructor(props) {
    super();
    this.state = {
      parentMenuData: [],
      parentMenuName: "",
      errorMsg: [],
      // just to not connect the initialValues to main state parentMenuName to prevent forced reinitialize, used after backend fetch parentMenuData
      formikParentMenuName: ""
    }

    this.urlParam = props.match.params.id;

    // send back to parentmenus page when Privilege is Read and accessing add mode
    if (this.isAddMode() && props.priv === PRIVILEGES.read) {
      props.history.push('/parentmenus');
    }

    this.schema = yup.object().shape({
      parentMenuName: yup.string().max(30, 'Must be 30 characters or less').required('Required')
    });

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
      const parentMenuData = await fetchParentMenuData(this.urlParam);
      this.saveParentMenuData(parentMenuData);
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
        parentMenuData: parentMenuData.data,
        parentMenuName: parentMenuData.data.ParentMenuName,
        formikParentMenuName: parentMenuData.data.ParentMenuName
      });
    } else {
      // if no parent menu is found, like param as 'add', redirect back to history or parentmenu page

      this.props.history.push({
        pathname: '/parentmenus',
        errorMsg: ["Invalid URL Parameter"]
      });
    }
  }

  // submits form using add then returns insertId of parent menu for submit image to use
  submitFormAdd = async () => {
    const param = {
      "parentMenuName": this.state.parentMenuName
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
  submitFormEdit = async () => {
    const param = {
      "parentMenuID": this.urlParam,
      "parentMenuName": this.state.parentMenuName
    }
    console.log(param)
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

  handleChangeParentMenuName = async (e, formikProps) => {
    await this.setState({ parentMenuName: e.target.value }); // set first the state to update on formik validation
    this.clearErrorMsg();
    formikProps.handleChange(e);
  }

  handleSubmitForm = async () => {
    let submitResp;

    if (this.isAddMode()) {
      // save new parent menu id
      submitResp = await this.submitFormAdd();
    } else {
      submitResp = await this.submitFormEdit();
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
        <div className="row w-100 mx-0">
          <div className="col-lg-8 col-xlg-9 col-md-12">
            <div className="card px-4 px-sm-5">

              <div className="card-body">

                <h4 className="card-title">{this.isAddMode() ? 'Add' : 'Edit'} Parent Menu</h4>
                <div className="row mb-4">
                  <div className="col mt-3">
                    <Formik
                      initialValues={{
                        parentMenuName: this.state.formikParentMenuName
                      }}
                      validationSchema={this.schema}
                      enableReinitialize
                    >
                      {props => (
                        <Form className="forms-sample" onKeyPress={e => e.key === 'Enter' && this.handleSubmitForm()}>
                          {this.state.errorMsg.map((err) =>
                            <Alert
                              className="p-1"
                              variant="danger"
                              show={err}
                              transition={false}
                            >
                              {err}
                            </Alert>
                          )}

                          <div className="row">
                            <div className="col">
                              <Form.Group controlId="parentMenuName">
                                <Form.Label>Parent Menu name</Form.Label>
                                <Form.Control
                                  value={this.state.parentMenuName}
                                  type="text"
                                  name="parentMenuName"
                                  placeholder="parentMenuName"
                                  autoComplete="parentMenuName"
                                  onBlur={props.handleBlur}
                                  isInvalid={(props.errors.parentMenuName && props.touched.parentMenuName) || this.state.errorMsg.length}
                                  onChange={(e) => this.handleChangeParentMenuName(e, props)}
                                  disabled={this.props.priv === PRIVILEGES.read}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {this.state.errorMsg.length ? null : props.errors.parentMenuName}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </div>
                          </div>

                          <div className="mt-4">
                            {this.props.priv === PRIVILEGES.readWrite &&
                              <button type="button" className="btn btn-primary mr-2" onClick={this.handleSubmitForm}>Submit</button>}

                            {/* <button className="btn btn-dark">Cancel</button> */}
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

