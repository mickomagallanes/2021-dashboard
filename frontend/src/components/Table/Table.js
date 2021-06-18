import React from 'react';
import './Table.css';
import { Link } from 'react-router-dom';
import { act } from "react-dom/test-utils";

/**
  * creates a table
  * @param {String} urlRedirect the ink of form edit/read
  * @param {Boolean} isWriteable is read or write privilege. True for RW. False for R
  * @param {Array} data array data to be processed
  * @param {String} tblClass class css of table
  * @param {Array} colData column label matched to the data
  * @param {Boolean} [actionDisabled] is action disabled? Default: false
  */
class Table extends React.Component {

  render() {

    return (

      <div className="table-responsive">
        <table data-testid="Table" className={`table ${this.props.tblClass}`}>
          <thead>
            <tr>
              {this.props.colData.map(x => <th key={x.id}>{x.name}</th>)}
              {!this.props.actionDisabled && <th>Action/s</th>}

            </tr>
          </thead>
          <tbody>
            {!this.props.data.length &&
              <tr>
                <td>
                  <p>Table is empty!</p>
                </td>
              </tr>
            }
            {
              // data from database used for tr key
              // td key used combination of data from db and hardcoded data
              // e.g: "rname2" where "rname" is hardcoded id and "2" is the row id from db
              !!this.props.data.length && this.props.data.map(x =>
                <tr key={x.id}>
                  {this.props.colData.map(y => <td key={y.id + x.id}>{x[y.id]}</td>)}

                  {!this.props.actionDisabled &&
                    <td>
                      <Link to={`${this.props.urlRedirect}/${x.id}`} className="btn btn-icon-text btn-outline-secondary">
                        {this.props.isWriteable ? "Edit" : "Read"}
                        <i className={`mdi ${this.props.isWriteable ? "mdi-pencil" : "mdi-read"} btn-icon-append `}></i>
                      </Link>
                    </td>
                  }
                </tr>
              )
            }

          </tbody>
        </table>

      </div>

    );
  }

}

export default Table;
