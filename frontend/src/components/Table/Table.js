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
  filterFunc,
  currentFilter
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

  const SortTH = filterFunc ? SortedTHNoBorder : SortedTH;

  // TODO: delete bulk by checkbox each row
  return (

    <div className="table-responsive">
      <table data-testid="Table" className={`table ${tblClass}`}>
        <thead>
          <tr>
            {sortFunc
              ? colData.map(x => (

                <SortTH key={`th${x.id}`} onClick={() => handleSortClick(x.id)}>
                  {x.name}
                  {
                    matchSortedCol(x.id)
                      ? sortIcon
                      : <i className="mdi mdi-sort"></i>}
                </SortTH>

              ))
              : colData.map(x => <THNoBorder key={`th${x.id}`}>{x.name}</THNoBorder>)
            }

            {!actionDisabled && <THNoBorder>Action/s</THNoBorder>}

          </tr>

          {filterFunc &&
            <tr>
              {colData.map(x => {
                const matchedFilterObj = currentFilter.find(o => o.id === x.id);
                const filterVal = matchedFilterObj !== undefined ? matchedFilterObj.value : "";

                return (
                  <FilterTH key={`th2${x.id}`}>
                    <input className="form-control" placeholder="Filter" value={filterVal} onChange={(e) => filterFunc(x.id, e.target.value)}></input>
                  </FilterTH>

                )
              })}
            </tr>
          }
        </thead>
        <tbody>
          {!data.length &&
            <tr>
              <td colSpan={colData.length + 1}>
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

    </div >

  );
}

const SortedTH = styled.th`
  cursor: pointer;

`

const SortedTHNoBorder = styled.th`
 &&& {
  cursor: pointer;
  border: 0px;
 }
`

const THNoBorder = styled.th`
&&& {
 border: 0px;
}
`
const FilterTH = styled.td`
 &&& {
  border: 0px;
  padding-top: 0px;
  
 }
 

`

export default Table;
