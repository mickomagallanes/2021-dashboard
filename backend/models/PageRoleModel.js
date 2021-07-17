const mysql_conn = require("./db.js");
const { PRIVILEGES } = require('../utils/constants.js');

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
         WHERE UserID = ? AND PagePath = ? AND (d.PrivilegeName = ? OR d.PrivilegeName = ?);`;

        try {
            const result = await mysql_conn.query(stmt, [userId, pagePath, PRIVILEGES.readWrite, PRIVILEGES.read]);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
     * get row by page id and user id
     * @param {Number} pageId id of the page
     * @param {Number} userId id of the user
     * @return {Array} result, length = 1
     */
    static async getRowByUserAndPage(pageId, userId) {
        const stmt = `SELECT 
        a.PageID,
        c.RoleName,
        c.RoleID,
        d.PrivilegeName,
        d.PrivilegeID
    FROM
        Pages AS a
            LEFT JOIN
        PageRoles AS b ON a.PageID = b.PageID
            LEFT JOIN
        Roles AS c ON b.RoleID = c.RoleID
            LEFT JOIN
        Users as e ON e.RoleID = c.RoleID 
            LEFT JOIN
        Privileges AS d ON b.PrivilegeID = d.PrivilegeID WHERE a.PageID = ? AND e.UserID = ?;`;

        try {
            const result = await mysql_conn.query(stmt, [pageId, userId]);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
    * insert if PageID + RoleID does not exist, update if it exists
    * @param {Array} valueArr format must be "[[page1, ...], [page2, ...]]"
    * @return {Number} result.insertId user id of last inserted
    */
    static async postPageRoleData(valueArr) {
        const stmt = `INSERT INTO PageRoles
                            (PageID, RoleID, PrivilegeID)
                        VALUES
                            ? AS alias
                        ON DUPLICATE KEY UPDATE PrivilegeID = alias.PrivilegeID;`;
        try {
            const result = await mysql_conn.query(stmt, [valueArr]);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
     * get all pages with optional role name if the row matched the role
     * @param {Number} roleId id of the role
     * @return {Array} result
     */
    static async getAllPagesLeftRole(roleId) {
        const stmt = `SELECT 
                        a.PageID, a.PageName, a.PagePath, c.RoleName, c.RoleID, d.PrivilegeName, d.PrivilegeID
                      FROM
                        Pages AS a
                            LEFT JOIN
                        (SELECT DISTINCT
                            PrivilegeID, PageID, RoleID
                        FROM
                            PageRoles
                        WHERE
                            RoleId = ?) AS b ON a.PageID = b.PageID
                            LEFT JOIN
                        Roles AS c ON b.RoleID = c.RoleID AND c.RoleID = ? 
                            LEFT JOIN Privileges as d ON b.PrivilegeID = d.PrivilegeID;`

        try {
            const result = await mysql_conn.query(stmt, [roleId, roleId]);

            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

}


module.exports = PageRoleModel;