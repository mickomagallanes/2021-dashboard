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

        const currTbl = this.tableName;
        let tblStmt = `${currTbl}`;
        // TODO: memoize this, so it doesn't have to loop everytime
        await loopArr(this.secondaryTables, (indx) => {
            let secondTbl = this.secondaryTables[indx].name;
            let secondTblKey = this.secondaryTables[indx].id;
            let relationTbl = this.secondaryTables[indx].relation;

            tblStmt += ` ${relationTbl} ${secondTbl} ON ${currTbl}.${secondTblKey} = ${secondTbl}.${secondTblKey} `
        })


        const stmt = `SELECT 
               count(1) as count
            FROM
                ${tblStmt} ${filterStmt}`;
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

        const currTbl = this.tableName;
        let tblStmt = `${currTbl}`;

        await loopArr(this.secondaryTables, (indx) => {
            let secondTbl = this.secondaryTables[indx].name;
            let secondTblKey = this.secondaryTables[indx].id;
            let relationTbl = this.secondaryTables[indx].relation;

            tblStmt += ` ${relationTbl} ${secondTbl} ON ${currTbl}.${secondTblKey} = ${secondTbl}.${secondTblKey} `
        })

        let limitClause = "";
        if (startIndex !== false) {
            limitClause = ` LIMIT ${mysql_conn.pool.escape(startIndex)}, ${mysql_conn.pool.escape(Number.parseInt(limit))}`;

        }

        const stmt = `SELECT * from ${tblStmt} ${filterStmt} ${sortStmt} ${limitClause}`;

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
        try {
            // TODO: memoize this, so it doesn't have to loop everytime
            let allTbl = `('${this.tableName}'`;
            await loopArr(this.secondaryTables, (indx) => {
                allTbl += `, '${this.secondaryTables[indx].name}'`
            })
            allTbl += `)`;

            const resultSort = await mysql_conn.query(`SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME IN ${allTbl}
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
        try {

            // TODO: memoize this, so it doesn't have to loop everytime
            let allTbl = `('${this.tableName}'`;
            await loopArr(this.secondaryTables, (indx) => {
                allTbl += `, '${this.secondaryTables[indx].name}'`
            })
            allTbl += `)`;

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
            WHERE TABLE_NAME IN ${allTbl}
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