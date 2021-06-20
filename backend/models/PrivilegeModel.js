const mysql_conn = require("./db.js");

"use strict";

class PrivilegeModel {

    constructor() {

    }

    /**
     * get all privilege
     * @return {Array} result
     */
    static async getAllPrivileges() {
        const stmt = `SELECT * FROM Privileges`;

        try {
            const result = await mysql_conn.query(stmt);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

}


module.exports = PrivilegeModel;