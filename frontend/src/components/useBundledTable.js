

import React, { useState } from 'react';
import Pagination from './Pagination/Pagination';
import Table from './Table/Table';
import { useHistory, useLocation } from 'react-router-dom';
import ReactDOM from "react-dom";
import useDidUpdateEffect from './useDidUpdateEffect';

/**
 * Custom Hook to make Table + or Pagination + or Entry + or Sort functionality
 * @param {Array} data
 * @param {Number} [dataCount] total count row of data, determines if table will have entry
 * @param {Boolean} [isPaginated] default: true, determines if table will have pagination
 * @param {Boolean} [isSorted] default: true, determines if table will have sorting functionality
 * @returns obj
 * @returns obj.searchparamQuery added to the fetch url, contains page, entry, sortBy and order parameter
 * @returns obj.BundledTable the mixed Components of table and pagination
 * @returns obj.entryProps props for entry, returns differently by the isPaginated value
 * @returns obj.tableProps props for table, returns differently by the isSorted value
 * @returns obj.paginationProps props for pagination, returns differently by the isPaginated value
 */
function useBundledTable({ data, dataCount, isPaginated = true, isSorted = true }) {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const pageParams = searchParams.get('page');
    const entryParams = searchParams.get('entry');
    const pageInitOptional = parseInt(pageParams);
    const entryInitOptional = parseInt(entryParams);

    const [currentPage, setCurrentPage] = useState(pageParams ? pageInitOptional : 1);
    const [currentEntries, setCurrentEntries] = useState(entryParams ? entryInitOptional : 5);

    const sortByParams = searchParams.get('sortBy');
    const orderParams = searchParams.get('order');
    const [currentSortCol, setCurrentSortCol] = useState(sortByParams ? sortByParams : null);
    const [currentSortOrder, setCurrentSortOrder] = useState(orderParams ? orderParams : null);

    const [maxPage, setMaxPage] = useState(null);

    const sortParam = isSorted ? `&sortBy=${currentSortCol}&order=${currentSortOrder}` : "";
    const pageAndEntryParam = isPaginated ? `page=${currentPage}&limit=${currentEntries}` : "";

    const currSearch = `?${pageAndEntryParam}${sortParam}`;

    const tableProps = isSorted
        ? {
            currentSortOrder,
            currentSortCol,
            data,
            handleSort: (colId, order) => {
                ReactDOM.unstable_batchedUpdates(() => {
                    setCurrentSortCol(colId);
                    setCurrentSortOrder(order);
                });
            }
        }
        : {
            data
        };

    const entryProps = isPaginated
        ? {
            totalDataRows: dataCount,
            currentEntries,
            entryOnChange: (e) => setCurrentEntries(e)
        }
        : null;

    const paginationProps = isPaginated
        ? {
            currentPage,
            maxPage,
            paginationClick: setCurrentPage
        }
        : null;

    const history = useHistory();


    useDidUpdateEffect(() => {

        if (isPaginated) {
            const newMaxPage = Math.ceil(dataCount / currentEntries);

            // if state.currentPage is higher than the maxPage, for instance when
            // state.currentEntries is changed with higher state.currentPage
            if (currentPage > newMaxPage) {
                setCurrentPage(1); // triggers fetch again

                return;
            }
            ReactDOM.unstable_batchedUpdates(() => {
                setMaxPage(newMaxPage);

            });
        }


    }, [data, dataCount]);

    useDidUpdateEffect(() => {

        if (location.search !== currSearch) {
            history.push({
                search: currSearch
            })
        }

    }, [currentPage, currentEntries, currentSortCol, currentSortOrder]);

    return {
        searchParamQuery: currSearch,
        BundledTable,
        entryProps,
        tableProps,
        paginationProps
    }
}


function BundledTable({
    tableProps,
    entryProps,
    paginationProps,
    colData,
    idKey,
    actionButtons,
    addButtons
}) {

    const sortFunc = tableProps.handleSort ? (colId, order) => { tableProps.handleSort(colId, order) } : null
    return (
        <>
            <div className="row mb-4">
                {!!entryProps && <div className="col mt-3">
                    <span className="float-sm-left d-block mt-1 mt-sm-0 text-center">
                        Show
                        <input
                            id="inputEntry"
                            className="form-control ml-2 mr-2"
                            value={entryProps.currentEntries}
                            onChange={(e) => { entryProps.entryOnChange(e.target.value) }}
                            type="text" style={style.inputEntry}
                        />
                        of {entryProps.totalDataRows} entries
                    </span>
                </div>
                }
                {!!paginationProps &&
                    <div className="col-lg-6 mt-3">
                        <Pagination currentPage={paginationProps.currentPage} maxPage={paginationProps.maxPage} onClick={paginationProps.paginationClick} />
                    </div>
                }
                <div className="col mt-3">
                    {addButtons()}

                </div>
            </div>
            <Table
                data={tableProps.data}
                colData={colData}
                idKey={idKey}
                actionButtons={actionButtons}
                sortFunc={sortFunc}
                currentOrder={tableProps.currentSortOrder}
                currentSortCol={tableProps.currentSortCol}
            />

        </>
    );
}

const style = {
    inputEntry: {
        'maxWidth': '4rem',
        'width': 'auto',
        'display': 'inline-block'
    }
}

export default useBundledTable;