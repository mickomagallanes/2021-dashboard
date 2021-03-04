import React from 'react';
import './Table.css';
import Spinner from '../Spinner/Spinner';
import { Link } from 'react-router-dom';
class Table extends React.Component {

  render() {
    return (
      <div>
        <div className="page-header">
          <h3 className="page-title"> {this.props.title} Page</h3>
        </div>
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">{this.props.title} Table</h4>
                <div className="table-responsive">
                  <table className={`table ${this.props.tblClass}`}>
                    <thead>
                      <tr>
                        {this.props.colData.map(x => <th key={x.id}>{x.name}</th>)}
                        <th>Action/s</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        // data from database used for tr key
                        // td key used combination of data from db and hardcoded data
                        // e.g: "rname2" where "rname" is hardcoded id and "2" is the row id from db
                        !!this.props.data.length
                        && this.props.data.map(x =>
                          <tr key={x.id}>
                            {this.props.colData.map(y => <td key={y.id + x.id}>{x[y.id]}</td>)}

                            <td>
                              <Link to={`${this.props.urlRedirect}/${x.id}`} className="btn btn-icon-text btn-outline-secondary">
                                {this.props.isWriteable ? "Edit" : "Read"}
                                <i className={`mdi ${this.props.isWriteable ? "mdi-pencil" : "mdi-read"} btn-icon-append `}></i>
                              </Link>
                            </td>
                          </tr>
                        )
                      }

                    </tbody>
                  </table>
                  {!this.props.data.length && <Spinner />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default Table;
