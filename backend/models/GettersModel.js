const mysql_conn = require("./db.js");
const { loopArr } = require('../utils/looping.js');

"use strict";

// class extension for page with Pagination, returns all getter functions needed
class GettersModel {

    /**
     * get count of all menu for pagination
     * @param {String} tableName name of the table on selected model
     * @param {String} primaryKey name of column of primary key
     * @param {Array of Objects} secondaryTables all related tables to the selected table, doesnt support tables that rely on another and another
     */
    constructor(tableName, primaryKey, secondaryTables = []) {
        this.tableName = tableName;
        this.primaryKey = primaryKey;
        this.secondaryTables = secondaryTables;

        this.isInit = false;
        this.isResolvedInit = false;
        this.currPromise = false;

        this.allTblStrFrom = `${this.tableName}`;
        this.allTblStrIn = `('${this.tableName}'`;
    }

    // executed on all functions that needed allTblStr
    async init() {
        let _self = this;
        if (!this.isInit) {
            this.isInit = true;

            this.currPromise = new Promise(async function (resolve, reject) {
                if (_self.isResolvedInit) {
                    resolve(true);

                } else {
                    await loopArr(_self.secondaryTables, (indx) => {
                        let secondTbl = _self.secondaryTables[indx].name;
                        let secondTblKey = _self.secondaryTables[indx].id;
                        let relationTbl = _self.secondaryTables[indx].relation;

                        _self.allTblStrFrom += ` ${relationTbl} ${secondTbl} ON ${_self.tableName}.${secondTblKey} = ${secondTbl}.${secondTblKey} `
                    });

                    await loopArr(_self.secondaryTables, (indx) => {
                        _self.allTblStrIn += `, '${_self.secondaryTables[indx].name}'`
                    })

                    _self.allTblStrIn += `)`;

                    _self.isResolvedInit = true;
                    resolve(true);
                }

            });
            return this.currPromise;
        } else {
            return _self.currPromise
        }


    }

    /**
     * get count of all menu for pagination
     * @return {Array} result, length = 1
     */
    async getAllCount({ filter = undefined }) {

        let filterStmt = "";

        if (filter && filter.length) {
            filterStmt = await this.filterColCheckAndStmt(filter);

            if (!filterStmt) {
                return false;
            }

        }

        const stmt = `SELECT 
                   count(1) as count
                FROM
                    ${this.allTblStrFrom} ${filterStmt}`;
        try {
            const result = await mysql_conn.query(stmt);
            return result;
        } catch (err) {
            console.error(err);
            return false;
        }


    }

    /**
     * get all rows
     * @param {Object} obj - An object.
     * @param {Number} obj.startIndex start of limit
     * @param {Number} obj.limit limit count
     * @param {Number} obj.sortBy column to be sorted
     * @param {Number} obj.order ASC or DESC
     * @param {Array} obj.filter filter arrays
     * @return {Array} result
     */
    async getAll({ startIndex, limit, sortBy, order, filter }) {

        await this.init();

        let sortStmt = "";
        if (sortBy) {
            let doesColExist = await this.searchColIfExist(sortBy);

            if (!doesColExist) {
                return false;
            } else {
                sortStmt = ` ORDER BY ${sortBy} ${order}`;
            }
        }

        let filterStmt = "";

        if (filter && filter.length) {
            filterStmt = await this.filterColCheckAndStmt(filter);

            if (!filterStmt) {
                return false;
            }

        }


        let limitClause = "";
        if (startIndex !== false) {
            limitClause = ` LIMIT ${mysql_conn.pool.escape(startIndex)}, ${mysql_conn.pool.escape(Number.parseInt(limit))}`;

        }

        const stmt = `SELECT * from ${this.allTblStrFrom} ${filterStmt} ${sortStmt} ${limitClause}`;

        try {
            const result = await mysql_conn.query(stmt);
            return result;
        } catch (err) {
            console.error(err);
            return false;
        }



    }

    /**
    * get a row using by id
    * @param {Number} id primary key column of table
    * @return {Array} result, length = 1
    */
    async getById(id) {
        const stmt = `SELECT * from ${this.tableName}
            WHERE
                CAST(${this.primaryKey} AS CHAR) = ?;`;

        try {
            const result = await mysql_conn.query(stmt, [id]);
            return result;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async searchColIfExist(column) {

        await this.init();

        try {

            const resultSort = await mysql_conn.query(`SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_NAME IN ${this.allTblStrIn}
                    AND COLUMN_NAME LIKE ?;`, column);

            if (resultSort.length) {
                return true;

            } else {
                return false
            }



        } catch (err) {
            console.error(err);
            return false;
        }


    }

    async filterColCheckAndStmt(columnArrObj) {

        await this.init();

        try {

            let likeStmt = "";
            let colArrNames = [];

            let filterStmt = " WHERE ";

            await loopArr(columnArrObj, (indx) => {
                if (indx === columnArrObj.length - 1) {
                    likeStmt += ` COLUMN_NAME LIKE ?`;
                    filterStmt += ` ${columnArrObj[indx].id} LIKE '${columnArrObj[indx].value}%' `;
                } else {
                    likeStmt += ` COLUMN_NAME LIKE ? OR `;
                    filterStmt += ` ${columnArrObj[indx].id} LIKE '${columnArrObj[indx].value}%' AND `;
                }
                colArrNames.push(columnArrObj[indx].id);

            })

            const resultSort = await mysql_conn.query(`SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_NAME IN ${this.allTblStrIn}
                   AND ${likeStmt};`, colArrNames);

            if (resultSort.length) {
                return filterStmt;

            } else {
                return false
            }

        } catch (err) {
            console.error(err);
            return false;
        }

    }
}


module.exports = GettersModel;