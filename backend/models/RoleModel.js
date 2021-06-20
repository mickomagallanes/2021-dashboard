const mysql_conn = require("./db.js");

"use strict";

class RoleModel {

    constructor() {

    }

    /**
     * get all roles
     * @return {Array} result
     */
    static async getAllRoles() {
        const stmt = `SELECT RoleID as id, RoleName as rname FROM Roles`;
        try {
            const result = await mysql_conn.query(stmt);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
    * get count of all role for pagination
    * @return {Array} result, length = 1
    */
    static async getAllCount() {
        const stmt = `SELECT 
               count(RoleID) as count
            FROM
                Roles`;
        try {
            const result = await mysql_conn.query(stmt);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

}


module.exports = RoleModel;