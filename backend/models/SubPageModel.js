const mysql_conn = require("./db.js");
const { PRIVILEGES } = require('../utils/constants.js');

"use strict";

class SubPageModel {

    constructor() {

    }

    /**
     * get pages based on logged-in user role
     * @param {Number} userId id of the user
     * @return {Array} result
     */
    static async getSubPagesByUserId(userId) {
        const stmt = `SELECT a.PageRolesID, c.SubPageID, b.PageName, b.PagePath, c.SubPageName, c.SubPagePath FROM PageRoles as a 
        INNER JOIN Pages as b ON a.PageID = b.PageID INNER JOIN SubPages as c ON b.PageID = c.PageID
		INNER JOIN Users as d ON a.RoleID = d.RoleID 
        INNER JOIN Privileges as f ON a.PrivilegeID = f.PrivilegeID WHERE (f.PrivilegeName = ? OR f.PrivilegeName = ?) 
        AND UserID = ?;`;

        try {
            const result = await mysql_conn.query(stmt, [PRIVILEGES.readWrite, PRIVILEGES.read, userId]);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

}


module.exports = SubPageModel;