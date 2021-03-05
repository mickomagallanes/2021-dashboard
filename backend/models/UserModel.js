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
        const stmt = `INSERT INTO Users (Username, Password, RoleID) VALUES (?, ?, ?)`;
        try {
            const result = await mysql_conn.query(stmt, [username, password, roleId]);
            return result;

        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
     * inserts username and password to the database
     * @param {String} userid id of the user
     * @param {String} username username of the user
     * @param {String} password plain password of the user
     * @param {String} roleid id from roles table if it is admin, etc
     */

    static async modifyUser(userid, username, password, roleid) {
        const stmt = `UPDATE Users SET Username = ?, Password = ?, RoleID = ? WHERE UserID = ?`;

        try {
            const result = await mysql_conn.query(stmt, [username, password, roleid, userid]);
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
     * @param {Number} [limit] limit count
     */

    static async getAllUser(startIndex, limit) {

        const limitClause = startIndex !== false ? ` LIMIT ${mysql_conn.pool.escape(startIndex)}, ${mysql_conn.pool.escape(Number.parseInt(limit))}` : "";

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