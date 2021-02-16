import React from 'react';
import './Table.css';
import Spinner from '../Spinner/Spinner';
class Table extends React.Component {

  constructor() {
    super();

  }

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
                      </tr>
                    </thead>
                    <tbody>
                      {
                        // data from database used for tr key
                        // td key used combination of data from db and hardcoded data
                        // e.g: "rname2" where "rname" is hardcoded id and "2" is the row id from db
                        this.props.data !== false
                        && this.props.data.map(x =>
                          <tr key={x.id}>
                            {this.props.colData.map(y => <td key={y.id + x.id}>{x[y.id]}</td>)}
                          </tr>
                        )
                      }
                    </tbody>
                  </table>
                  {this.props.data === false && <Spinner />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }

}

export default Table;
