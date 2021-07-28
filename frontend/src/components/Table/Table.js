import React, { useState } from 'react';
import styled from 'styled-components';
import './Table.css';
import ReactDOM from "react-dom";

const defaultOrder = "ASC";

function Table({
  actionButtons,
  data,
  tblClass = "",
  colData,
  actionDisabled,
  idKey,
  currentOrder,
  currentSortCol,
  sortFunc,
}) {

  const [order, setOrder] = useState(currentOrder ? currentOrder : defaultOrder);
  const [sortedCol, setSortedCol] = useState(currentSortCol ? currentSortCol : null);

  const handleSortClick = (colId) => {

    if (colId !== sortedCol) {
      ReactDOM.unstable_batchedUpdates(() => {
        setSortedCol(colId);
        setOrder(order);
        sortFunc(colId, order);
      });

    } else {
      setOrder(flipOrder(order));
      sortFunc(colId, flipOrder(order));
    }

  }

  const matchSortedCol = (colId) => {
    if (sortedCol === colId) {
      return true;
    } else {
      return false;
    }
  }

  const flipOrder = (orderFlipped) => {

    if (orderFlipped === "ASC") {
      return "DESC"
    } else {
      return "ASC"
    }
  }

  const sortIcon = (<>
    {order === "ASC" ? <i className="mdi mdi-arrow-up-bold"> </i> : <i className="mdi mdi-arrow-down-bold"> </i>}
  </>)

  return (

    <div className="table-responsive">
      <table data-testid="Table" className={`table ${tblClass}`}>
        <thead>
          <tr>
            {sortFunc
              ? colData.map(x => (

                <SortedTH key={`th${x.id}`} onClick={() => handleSortClick(x.id)}>
                  {x.name}
                  {
                    matchSortedCol(x.id)
                      ? sortIcon
                      : <i className="mdi mdi-sort"></i>}
                </SortedTH>

              ))
              : colData.map(x => <th key={`th${x.id}`}>{x.name}</th>)
            }

            {!actionDisabled && <th>Action/s</th>}

          </tr>
        </thead>
        <tbody>
          {!data.length &&
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
            !!data.length && data.map(x =>
              <tr key={`tr${x[idKey]}`}>

                {colData.map(y => <td key={`td${x[idKey]}-${y.id}`}>{x[y.id]}</td>)}

                {!actionDisabled &&
                  <td>{actionButtons(x[idKey])}</td>
                }
              </tr>
            )
          }

        </tbody>
      </table>

    </div>

  );
}

const SortedTH = styled.th`
    cursor: pointer;
 
`

export default Table;
