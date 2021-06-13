const mysql_conn = require("./db.js");

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
        const stmt = `SELECT a.PageRolesID, b.PageName, b.PagePath, c.SubPageName, c.SubPagePath FROM PageRoles as a 
        INNER JOIN Pages as b ON a.PageID = b.PageID INNER JOIN SubPages as c ON b.PageID = c.PageID
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


module.exports = SubPageModel;