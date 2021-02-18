import React from 'react';
import './UsersForm.css';
import axios from 'axios';
import { retryRequest } from "../../../helpers/utils";

const userURL = "http://localhost:3000/API/user/get/";

class UsersForm extends React.Component {

  constructor() {
    super();
    this.state = {
      data: false
    }
  }

  componentDidMount() {

    this.fetchData();
  }

  fetchData = async () => {
    const axiosConfig = {
      timeout: 10000
    }

    try {
      const resp = await axios.get(
        userURL + this.props.match.params.id,
        axiosConfig
      );

      if (resp.data.status === true) {
        this.setState({ data: resp.data.data });
      }

    } catch (error) {
      retryRequest(this.fetchData);
    }
  }

  // TODO: make animation transition on routing using Framer Motion
  // and use Unit Testing with Jest
  render() {

    return (
      this.state.data && this.state.data.map(x => <p key={x.id}>{x.rname} | {x.uname}</p>)
    );
  }

}

export default UsersForm;
