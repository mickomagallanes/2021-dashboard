const mysql_conn = require("./db.js");

"use strict";

class UserModel {

    constructor() {

    }

    /**
     * inserts username and password to the database
     * @param {Object} obj - An object.
     * @param {String} obj.username username of the user
     * @param {String} obj.password plain password of the user
     * @param {String} obj.roleId id from roles table if it is admin, etc
     * @return {Object} result
     * @return {Number} result.insertId user id of last inserted
     */

    static async insertUser({ username, password, roleId }) {
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
     * modify user information to the database
     * @param {Object} obj - An object.
     * @param {String} obj.userid id of the user
     * @param {String} [obj.username] username of the user
     * @param {String} [obj.roleid] id from roles table if it is admin, etc
     * @param {String} [obj.imagePath] image path of user profile
     * @param {String} [obj.password] plain password of the user
     * @return {Object} result
     * @return {Number} result.insertId user id of last inserted
     */

    static async modifyUser({ userid, username, roleid, imagePath, password }) {
        let whereParams = [userid];
        let setObj = {};
        let stmtWhere = ` WHERE UserID = ?`

        if (username !== undefined) {
            setObj.Username = username
        }

        if (roleid !== undefined) {
            setObj.RoleID = roleid;
        }

        if (password !== undefined) {
            setObj.Password = password;
        }

        if (imagePath !== undefined) {
            setObj.Image = imagePath;
        }

        try {
            const result = await mysql_conn.update("Users", setObj, stmtWhere, whereParams);
            return result;

        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
    * get count of all user for pagination
    * @return {Array} result, length = 1
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
     * @param {Object} obj - An object.
     * @return {Array} result
     */

    static async getAllUser() {

        const stmt = `SELECT 
               a.UserID as id,
               b.RoleName as rname,
               a.Username as uname
            FROM
                Users as a INNER JOIN Roles as b ON a.RoleID = b.RoleID ORDER BY id `;
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
    * @param {Object} obj - An object.
    * @param {Number} obj.startIndex start of limit
    * @param {Number} obj.limit limit count
    * @return {Array} result
    */
    static async getAllUserPaged({ startIndex, limit }) {

        const limitClause = ` LIMIT ${mysql_conn.pool.escape(startIndex)}, ${mysql_conn.pool.escape(Number.parseInt(limit))}`;

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
    * @return {Array} result, length = 1
    */
    static async getUserById(id) {
        const stmt = `SELECT 
                b.RoleID as rid,
                b.RoleName as rname,
                a.Username as uname,
                a.UserID as id,
                a.Image as img
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
     * @return {Array} result, length = 1
     */

    static async getByUsername(username) {
        const stmt = `SELECT 
               Password,
               RoleID,
               Username,
               UserID,
               Image
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