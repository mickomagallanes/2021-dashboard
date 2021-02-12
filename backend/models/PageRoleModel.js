const mysql_conn = require("./db.js");

"use strict";

// TODO: decide whether to store all page-role relations data in redux
// or just call auth API everytime a user visits a page
class PageRoleModel {

    constructor() {

    }

    /**
     * check if user role has privilege on the page
     * @param {Number} userId id of the user
     * @param {String} pagePath path of the page, eg: "/user"
     */

    static async getPageRole(userId, pagePath) {
        const stmt = `SELECT a.PageRolesID FROM PageRoles as a INNER JOIN Pages as b ON a.PageID = b.PageID 
        INNER JOIN Users as c ON a.RoleID = c.RoleID WHERE UserID = ? AND PagePath = ?;`;

        try {
            const result = await mysql_conn.query(stmt, [userId, pagePath]);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

}


module.exports = PageRoleModel;