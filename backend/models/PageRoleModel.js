const mysql_conn = require("./db.js");

"use strict";

class PageRoleModel {

    constructor() {

    }

    /**
     * check if user role has privilege on the page
     * @param {Number} userId id of the user
     * @param {String} pagePath path of the page, eg: "/user"
     */

    static async getPageRole(userId, pagePath) {
        const stmt = `SELECT a.PageRolesID, a.Privilege FROM PageRoles as a INNER JOIN Pages as b ON a.PageID = b.PageID 
        INNER JOIN Users as c ON a.RoleID = c.RoleID WHERE UserID = ? AND PagePath = ?;`;

        try {
            const result = await mysql_conn.query(stmt, [userId, pagePath]);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
     * get pages based on logged-in user role
     * @param {Number} userId id of the user
     */
    static async getPagesByRole(userId) {
        const stmt = `SELECT a.PageRolesID, b.PageName, b.PagePath FROM PageRoles as a INNER JOIN Pages as b ON a.PageID = b.PageID 
                INNER JOIN Users as d ON a.RoleID = d.RoleID WHERE UserID = ?`;

        try {
            const result = await mysql_conn.query(stmt, [userId]);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

}


module.exports = PageRoleModel;