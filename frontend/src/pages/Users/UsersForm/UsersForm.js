import React from 'react';
import './UsersForm.css';
import axios from 'axios';
import { retryRequest } from "../../../helpers/utils";
import { Form } from 'react-bootstrap';
import Select from '../../../components/Select/Select';

const userURL = "http://localhost:3000/API/user/get/";
const roleURL = "http://localhost:3000/API/role/get/all";

class UsersForm extends React.Component {

  constructor() {
    super();
    this.state = {
      userData: [],
      roleData: [],
      selectedRole: null
    }

  }

  componentDidMount() {

    this.fetchUserData();
    this.fetchRoleData();
  }

  fetchUserData = async () => {
    const axiosConfig = {
      withCredentials: true,
      timeout: 10000
    }

    try {
      const resp = await axios.get(
        userURL + this.props.match.params.id,
        axiosConfig
      );

      if (resp.data.status === true) {
        this.setState({ userData: resp.data.data });
      }

    } catch (error) {
      retryRequest(this.fetchUserData);
    }
  }

  fetchRoleData = async () => {
    const axiosConfig = {
      withCredentials: true,
      timeout: 10000
    }

    try {
      const resp = await axios.get(
        roleURL,
        axiosConfig
      );

      if (resp.data.status === true) {
        this.setState({ roleData: resp.data.data });
      }

    } catch (error) {
      retryRequest(this.fetchUserData);
    }
  }

  handleRoleChange = (e) => {
    this.setState({ selectedRole: e.value });
  }

  // TODO: make animation transition on routing using Framer Motion
  // and use Unit Testing with Jest
  render() {

    return (
      <div className="d-flex align-items-center px-0">
        <div className="row w-100 mx-0">
          <div className="col-12 grid-margin stretch-card">
            <div className="card px-4 px-sm-5">
              <div className="card-body">
                <h4 className="card-title">Default form</h4>
                <p className="card-description"> Basic form layout </p>
                <form className="forms-sample">
                  <Form.Group>
                    <label htmlFor="exampleInputUsername1">Username</label>
                    <Form.Control type="text" className="form-control" id="exampleInputUsername1" placeholder="Username" />
                  </Form.Group>
                  <Form.Group>
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <Form.Control type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                  </Form.Group>

                  <label htmlFor="roleSelect">Role</label>
                  <Select
                    id="roleSelect"
                    defaultValue={this.state.selectedRole}
                    data={this.state.roleData}
                    handleChange={this.handleRoleChange}
                    idKey="RoleID"
                    valueKey="RoleName"></Select>

                  <div className="form-check">
                    <label className="form-check-label text-muted">
                      <input type="checkbox" className="form-check-input" />
                      <i className="input-helper"></i>
                      Remember me
                    </label>
                  </div>
                  <button type="submit" className="btn btn-primary mr-2">Submit</button>
                  <button className="btn btn-dark">Cancel</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>


      // this.state.data && this.state.data.map(x => <p key={x.id}>{x.rname} | {x.uname}</p>)
    );
  }

}

export default UsersForm;
