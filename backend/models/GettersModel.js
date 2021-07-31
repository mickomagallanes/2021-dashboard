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
        this.secondaryTables = secondaryTables
    }

    /**
     * get count of all menu for pagination
     * @return {Array} result, length = 1
     */
    async getAllCount() {
        const stmt = `SELECT 
               count(1) as count
            FROM
                ${this.tableName}`;
        try {
            const result = await mysql_conn.query(stmt);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
     * get all menu rows
     * @return {Array} result
     */
    async getAll(sortBy = undefined, order = undefined) {
        let sortStmt = "";
        if (sortBy) {
            sortStmt = await this.searchColIfExist(sortBy, order);

            if (!sortStmt) {
                return false;
            }
        }

        const currTbl = this.tableName;
        let tblStmt = `${currTbl}`;

        await loopArr(this.secondaryTables, (indx) => {
            let secondTbl = this.secondaryTables[indx].name;
            let secondTblKey = this.secondaryTables[indx].id;

            tblStmt += ` INNER JOIN ${secondTbl} ON ${currTbl}.${secondTblKey} = ${secondTbl}.${secondTblKey} `
        })

        const stmt = `SELECT * from ${tblStmt} ${sortStmt}`;

        try {
            const result = await mysql_conn.query(stmt);
            return result;
        } catch (err) {
            console.log(err);
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
       * @return {Array} result
       */
    async getAllPaged({ startIndex, limit, sortBy, order }) {
        let sortStmt = "";
        if (sortBy) {
            sortStmt = await this.searchColIfExist(sortBy, order);
            if (!sortStmt) {
                return false;
            }
        }

        const currTbl = this.tableName;
        let tblStmt = `${currTbl}`;

        await loopArr(this.secondaryTables, (indx) => {
            let secondTbl = this.secondaryTables[indx].name;
            let secondTblKey = this.secondaryTables[indx].id;

            tblStmt += ` INNER JOIN ${secondTbl} ON ${currTbl}.${secondTblKey} = ${secondTbl}.${secondTblKey} `
        })

        const limitClause = ` LIMIT ${mysql_conn.pool.escape(startIndex)}, ${mysql_conn.pool.escape(Number.parseInt(limit))}`;

        const stmt = `SELECT * from ${tblStmt} ${sortStmt} ${limitClause}`;
        try {
            const result = await mysql_conn.query(stmt);
            return result;
        } catch (err) {
            console.log(err);
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
            console.log(err);
            return false;
        }
    }

    async searchColIfExist(sortBy, order) {
        try {
            let allTbl = `('${this.tableName}'`;
            await loopArr(this.secondaryTables, (indx) => {
                allTbl += `, '${this.secondaryTables[indx].name}'`
            })

            allTbl += `)`;

            const resultSort = await mysql_conn.query(`SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME IN ${allTbl}
                AND COLUMN_NAME LIKE ?;`, sortBy);

            if (resultSort.length) {
                return ` ORDER BY ${sortBy} ${order}`;
            }

        } catch (err) {
            console.log(err);
            return false;
        }
    }
}


module.exports = GettersModel;