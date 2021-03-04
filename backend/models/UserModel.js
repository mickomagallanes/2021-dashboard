const mysql_conn = require("./db.js");

"use strict";

class UserModel {

    constructor() {

    }

    /**
     * inserts username and password to the database
     * @param {String} username username of the user
     * @param {String} password plain password of the user
     * @param {String} roleId id from roles table if it is admin, etc
     */

    static async insertUser(username, password, roleId) {

        try {
            const result = await mysql_conn.insert("Users", {
                Username: username,
                Password: password,
                RoleID: roleId
            });
            return result;

        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
    * get count of all user for pagination
    */

    static async getAllUserCount() {
        const stmt = `SELECT 
               count(UserID) as count
            FROM
                Users as a INNER JOIN Roles as b ON a.RoleID = b.RoleID`;
        try {
            const result = await mysql_conn.query(stmt);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
     * get all user data from database
     * @param {Number} [startIndex] start of limit
     * @param {Number} [endIndex] end of limit
     */

    static async getAllUser(startIndex = null, endIndex = null) {
        const limitClause = startIndex !== false && !!endIndex !== false ? ` LIMIT ${mysql_conn.pool.escape(startIndex)}, ${mysql_conn.pool.escape(endIndex)}` : "";

        const stmt = `SELECT 
               a.UserID as id,
               b.RoleName as rname,
               a.Username as uname
            FROM
                Users as a INNER JOIN Roles as b ON a.RoleID = b.RoleID ORDER BY id ${limitClause}`;
        try {
            const result = await mysql_conn.query(stmt);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
    * get a row using by user id
    * @param {Number} id id of the user
    */

    static async getUserById(id) {
        const stmt = `SELECT 
                b.RoleID as rid,
                b.RoleName as rname,
                a.Username as uname,
                a.UserID as id
            FROM
                Users as a INNER JOIN Roles as b ON a.RoleID = b.RoleID
            WHERE
                CAST(a.UserID AS CHAR) = ?;`;

        try {
            const result = await mysql_conn.query(stmt, [id]);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
     * get row by username
     * @param {String} username username of the user
     */

    static async getByUsername(username) {
        const stmt = `SELECT 
               Password,
               RoleID,
               Username,
               UserID
            FROM
                Users
            WHERE
                Username = ?;`;

        try {
            const result = await mysql_conn.query(stmt, [username]);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

}


module.exports = UserModel;