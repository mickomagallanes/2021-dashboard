

import React, { useState } from 'react';
import Pagination from './Pagination/Pagination';
import Table from './Table/Table';
import { useHistory, useLocation } from 'react-router-dom';
import ReactDOM from "react-dom";
import useDidUpdateEffect from './useDidUpdateEffect';

const initPageValue = 1;
const initEntryValue = 5;
const initSortValue = null;
const initOrderValue = null;
const initFilterValue = [];

URLSearchParams.prototype.toObject = function () {
    let _obj = {};
    const bracketToDots = function (str) {

        return str.split("[").join(".").split("]").join("");
        // .replace('[', '.').replace(']', '')
    }
    const parseDotNotation = function (str, val, obj) {

        let currentObj = obj,
            keys = str.split("."),
            i, l = Math.max(1, keys.length - 1),
            key;

        if (l === 1) {
            key = keys[0];
            currentObj[key] = val;
        } else {

            for (i = 0; i < l; ++i) {
                key = keys[i];
                if (i === 0) {
                    currentObj[key] = currentObj[key] || [];
                } else {
                    currentObj[key] = currentObj[key] || {};
                }

                currentObj = currentObj[key];
            }

            currentObj[keys[i]] = val;
        }
    }
    for (const [key, value] of this.entries()) {
        parseDotNotation(bracketToDots(key), value, _obj);
    }
    return _obj;
}

/**
 * Custom Hook to make Table + or Pagination + or Entry + or Sort functionality
 * @param {Array} data
 * @param {Number} [dataCount] total count row of data, determines if table will have entry
 * @param {Boolean} [isPaginated] default: true, determines if table will have pagination
 * @param {Boolean} [isSorted] default: true, determines if table will have sorting functionality
 * @param {Boolean} [enabledSearchParam] default: true. If true, pushes all parameters of table to history url
 * @returns obj
 * @returns obj.searchparamQuery added to the fetch url, contains page, entry, sortBy and order parameter
 * @returns obj.BundledTable the mixed Components of table and pagination
 * @returns obj.entryProps props for entry, returns differently by the isPaginated value
 * @returns obj.tableProps props for table, returns differently by the isSorted value
 * @returns obj.paginationProps props for pagination, returns differently by the isPaginated value
 */
function useBundledTable({
    data,
    dataCount,
    isPaginated = true,
    isSorted = true,
    enabledSearchParam = true,
    isFiltered = true
}) {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    // PAGINATION AND LIMIT ENTRY
    const pageParamsValue = searchParams.get('page');
    const entryParamsValue = searchParams.get('limit');
    const pageInitOptional = parseInt(pageParamsValue);
    const entryInitOptional = parseInt(entryParamsValue);

    const [currentPage, setCurrentPage] = useState(pageParamsValue ? pageInitOptional : initPageValue);
    const [currentEntries, setCurrentEntries] = useState(entryParamsValue ? entryInitOptional : initEntryValue);
    const [maxPage, setMaxPage] = useState(null);

    // SORT AND ORDER FUNCTIONALITY
    const sortByParamsValue = searchParams.get('sortBy');
    const orderParamsValue = searchParams.get('order');
    const [currentSortCol, setCurrentSortCol] = useState(sortByParamsValue ? sortByParamsValue : initSortValue);
    const [currentSortOrder, setCurrentSortOrder] = useState(orderParamsValue ? orderParamsValue : initOrderValue);

    // FILTER FUNCTIONALITY
    const allParamsAsObj = searchParams.toObject();
    const filterParamsValue = allParamsAsObj["filter"];

    const [currentFilter, setCurrentFilter] = useState(filterParamsValue ? filterParamsValue : initFilterValue);

    ///////////////////////////////////////
    const sortParam = (isSorted && currentSortCol && currentSortOrder) ? `&sortBy=${currentSortCol}&order=${currentSortOrder}` : "";
    const pageAndEntryParam = isPaginated ? `page=${currentPage}&limit=${currentEntries}` : "";
    const filterParam = isFiltered ? convertFilterToQueryParam() : "";

    const currSearch = `?${pageAndEntryParam}${sortParam}${filterParam}`;

    const history = useHistory();

    // FUNCTIONS

    function convertFilterToQueryParam() {
        let filterURL = "";

        for (let i = 0, n = currentFilter.length; i < n; i++) {
            filterURL += `&filter[${i}][id]=${currentFilter[i].id}&filter[${i}][value]=${currentFilter[i].value}`;
        }
        return filterURL;

    }

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
            entryOnChange: (e) => {
                ReactDOM.unstable_batchedUpdates(() => {
                    setCurrentEntries(e);
                    setCurrentPage(initPageValue);
                });

            }
        }
        : null;

    const paginationProps = isPaginated
        ? {
            currentPage,
            maxPage,
            paginationClick: setCurrentPage
        }
        : null;

    const filteringProps = isFiltered
        ? {
            currentFilter,
            handleFilter: (colName, filterVal) => {
                const tempArray = [...currentFilter];
                const filterIndex = tempArray.findIndex(o => o.id === colName);

                if (filterIndex !== -1) {
                    if (filterVal.length) {
                        tempArray[filterIndex] = { id: colName, value: filterVal };
                    } else {
                        tempArray.splice(filterIndex, 1);
                    }

                } else {
                    tempArray.push({ id: colName, value: filterVal })
                }

                setCurrentFilter(tempArray);
            }
        }
        : null;



    // LIFECYCLES
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
        if (enabledSearchParam && location.search !== currSearch) {
            history.push({
                search: currSearch
            })
        }

    }, [currentPage, currentEntries, currentSortCol, currentSortOrder, currentFilter]);

    return {
        searchParamQuery: currSearch,
        BundledTable,
        entryProps,
        tableProps,
        paginationProps,
        filteringProps
    }
}

// TODO: add filter input box on every header... new feature

function BundledTable({
    tableProps,
    entryProps,
    paginationProps,
    filteringProps,
    colData,
    idKey,
    actionButtons,
    addButtons
}) {

    const sortFunc = tableProps.handleSort ? tableProps.handleSort : null;
    const filterFunc = filteringProps && filteringProps.handleFilter ? filteringProps.handleFilter : null;
    const currentFilter = filteringProps && filteringProps.currentFilter ? filteringProps.currentFilter : null;

    return (
        <>
            <div className="row">
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
                filterFunc={filterFunc}
                currentFilter={currentFilter}
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