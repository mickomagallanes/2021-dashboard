const mysql_conn = require("./db.js");

"use strict";

// TODO: decide whether to store all page-role relations data in redux
// or just call auth API everytime a user visits a page
class PageRoleModel {

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


module.exports = PageRoleModel;