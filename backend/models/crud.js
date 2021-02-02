const mysql_conn = require("./db.js");

"use strict";

class CRUD {

    constructor(tblName) {
        this.tableName = tblName;
    }

    async getAll() {
        try {
            const result = await mysql_conn.rows("*", this.tableName);
            if (result.length != 0) {
                return result;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async getById(id, qfields = '*') {
        const stmt = `SELECT ${qfields} FROM ${this.tableName} WHERE id= ?`;
        try {
            const results = await mysql_conn.query(stmt, [id]);
            if (results.length != 0) {
                return results;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }

    }

    async getBy(value, colName, qfields = '*') {
        const stmt = `SELECT ${qfields} FROM ${this.tableName} WHERE ${colName}= ?`;
        try {
            const results = await mysql_conn.query(stmt, [value]);
            if (results.length != 0) {
                return results;
            }
        } catch (err) {
            console.log(err);
            return false;
        }

    }

    async deleteById(id) {
        try {
            await mysql_conn.delete(this.tableName, "where id=?", [id]);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }

    }

    async update(id, rec) {
        try {
            await mysql_conn.update(this.tableName, rec, "where id=?", [id]);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async insert(rec) {
        try {
            await mysql_conn.insert(this.tableName, rec);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

}


module.exports = CRUD;