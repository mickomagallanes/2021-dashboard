const mysql_conn = require("./db.js");

"use strict";

// class extension for page with Pagination, returns all getter functions needed
class GettersModel {

    constructor(tableName, primaryKey) {
        this.tableName = tableName;
        this.primaryKey = primaryKey;
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

        // check if column exists, then proceed
        if (sortBy) {
            try {
                const resultSort = await mysql_conn.query(`SHOW COLUMNS FROM ${this.tableName} LIKE ?`, sortBy);
                if (resultSort.length) {
                    sortStmt = ` ORDER BY ${sortBy} ${order}`;
                }

            } catch (err) {
                console.log(err);
                return false;
            }
        }

        const stmt = `SELECT * from ${this.tableName} ${sortStmt}`;

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

    /**
        * get all rows
        * @param {Object} obj - An object.
        * @param {Number} obj.startIndex start of limit
        * @param {Number} obj.limit limit count
        * @return {Array} result
        */
    async getAllPaged({ startIndex, limit, sortBy, order }) {
        let sortStmt = "";

        // check if column exists, then proceed
        if (sortBy) {
            try {
                const resultSort = await mysql_conn.query(`SHOW COLUMNS FROM ${this.tableName} LIKE ?`, sortBy);
                if (resultSort.length) {
                    sortStmt = ` ORDER BY ${sortBy} ${order}`;
                }

            } catch (err) {
                console.log(err);
                return false;
            }
        }

        const limitClause = ` LIMIT ${mysql_conn.pool.escape(startIndex)}, ${mysql_conn.pool.escape(Number.parseInt(limit))}`;

        const stmt = `SELECT * from ${this.tableName} ${sortStmt} ${limitClause}`;
        try {
            const result = await mysql_conn.query(stmt);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

}


module.exports = GettersModel;