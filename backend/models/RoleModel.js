const mysql_conn = require("./db.js");

"use strict";

class RoleModel {

    constructor() {

    }

    /**
     * deleted role rows in the database
     * @param {String} roleID id of the menu
     */
    static async deleteRole(roleID) {

        try {
            const result = await mysql_conn.delete("Roles", "where RoleID=?", [roleID]);
            return result;

        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
    * inserts new role in the database
    * @param {Object} obj - An object.
    * @param {String} obj.rolename name of the role
    * @return {Object} result
    * @return {Number} result.insertId role id of last inserted
    */
    static async insertRole({ rolename }) {
        const stmt = `INSERT INTO Roles (RoleName) VALUES (?)`;
        try {
            const result = await mysql_conn.query(stmt, [rolename]);
            return result;

        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
     * modify role information to the database
     * @param {Object} obj - An object.
     * @param {String} obj.roleid id of the role
     * @param {String} [obj.rolename] name of the role
     * @return {Object} result
     * @return {Number} result.insertId role id of last inserted
     */

    static async modifyRole({ roleid, rolename }) {
        let whereParams = [roleid];
        let setObj = {};
        let stmtWhere = ` WHERE RoleID = ?`

        if (rolename !== undefined) {
            setObj.RoleName = rolename
        }

        try {
            const result = await mysql_conn.update("Roles", setObj, stmtWhere, whereParams);
            return result;

        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
     * get a row using by role id
     * @param {Number} id id of the role
     * @return {Array} result, length = 1
     */
    static async getRoleById(id) {
        const stmt = `SELECT 
                RoleID as rid,
                RoleName as rname
            FROM
                Roles
            WHERE
                CAST(RoleID AS CHAR) = ?;`;

        try {
            const result = await mysql_conn.query(stmt, [id]);
            return result;
        } catch (err) {
            console.error(err);
            return false;
        }
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
            console.error(err);
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
            console.error(err);
            return false;
        }
    }

}


module.exports = RoleModel;