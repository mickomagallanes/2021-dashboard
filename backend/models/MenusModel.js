const mysql_conn = require("./db.js");

"use strict";

class MenusModel {

    constructor() {

    }

    /**
     * get menu and parent menu based on logged-in user role
     * @param {Number} userId id of the user
     */
    static async getMenusByRole(userId) {
        const stmt = `SELECT b.PagePath, c.MenuName, d.ParentMenuName FROM PageRoles as a INNER JOIN Pages as b ON a.PageID = b.PageID INNER JOIN Menu as c ON b.MenuID = c.MenuID 
		LEFT JOIN ParentMenu as d ON c.ParentMenuID = d.ParentMenuID
		INNER JOIN Users as e ON a.RoleID = e.RoleID WHERE UserID = ?`;

        try {
            const result = await mysql_conn.query(stmt, [userId]);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

}


module.exports = MenusModel;