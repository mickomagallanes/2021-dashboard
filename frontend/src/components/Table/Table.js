import React from 'react';
import './Table.css';
import { Link } from 'react-router-dom';
import { act } from "react-dom/test-utils";

/**
  * creates a table
  * @param {Function} actionButtons function to create action buttons for row, accepts id of row as param
  * @param {Array} data array data to be processed
  * @param {String} tblClass class css of table
  * @param {Array} colData column label matched to the data
  * @param {Boolean} [actionDisabled] is action disabled? Default: false
  */
class Table extends React.Component {

  render() {

    const idKey = this.props.idKey;

    return (

      <div className="table-responsive">
        <table data-testid="Table" className={`table ${this.props.tblClass}`}>
          <thead>
            <tr>
              {this.props.colData.map(x => <th key={`th${x.id}`}>{x.name}</th>)}
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
                <tr key={`tr${x[idKey]}`}>
                  {this.props.colData.map(y => <td key={`td${x[y.id]}${x[x[idKey]]}`}>{x[y.id]}</td>)}

                  {!this.props.actionDisabled &&
                    <td>
                      {this.props.actionButtons(x[idKey])}
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
