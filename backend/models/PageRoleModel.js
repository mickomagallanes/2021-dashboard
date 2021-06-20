const mysql_conn = require("./db.js");

"use strict";

class PageRoleModel {

    constructor() {

    }

    /**
     * get privilege of user on an specified page path
     * @param {Number} userId id of the user
     * @param {String} pagePath path of the page, eg: "/user"
     * @return {Array} result, length = 1
     */

    static async getPagePrivByUser(userId, pagePath) {
        const stmt = `SELECT a.PageRolesID, d.PrivilegeName FROM PageRoles as a INNER JOIN Pages as b ON a.PageID = b.PageID 
        INNER JOIN Users as c ON a.RoleID = c.RoleID INNER JOIN Privileges as d ON a.PrivilegeID = d.PrivilegeID 
         WHERE UserID = ? AND PagePath = ?;`;

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