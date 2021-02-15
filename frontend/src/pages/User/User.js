import React from 'react'
import { ProgressBar } from 'react-bootstrap';
import './User.css';
import Table from '../../components/Table/Table';

class User extends React.Component {


  constructor() {
    super();
    this.state = {

    }
  }
  render() {
    return (
      <Table tblClass="table-bordered" thData={['Dorco', 'Blade', 'Sam', 'Aso']} />
    );
  }

}


export default User;
