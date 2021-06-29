const mysql_conn = require("./db.js");

"use strict";

class MenusModel {

    constructor() {

    }

    /**
     * get menu and parent menu based on logged-in user role
     * @param {Number} userId id of the user
     * @return {Array} result
     */
    static async getMenusByRole(userId) {
        const stmt = `SELECT b.PagePath, c.MenuName, d.ParentMenuName FROM PageRoles as a 
        INNER JOIN Pages as b ON a.PageID = b.PageID INNER JOIN Menus as c ON b.PageID = c.PageID 
		LEFT JOIN ParentMenus as d ON c.ParentMenuID = d.ParentMenuID
		INNER JOIN Users as e ON a.RoleID = e.RoleID WHERE UserID = ?`;

        try {
            const result = await mysql_conn.query(stmt, [userId]);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
   * get count of all menu for pagination
   * @return {Array} result, length = 1
   */
    static async getAllMenuCount() {
        const stmt = `SELECT 
               count(MenuID) as count
            FROM
                Menus`;
        try {
            const result = await mysql_conn.query(stmt);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
     * get all menu rows
     * @return {Array} result
     */
    static async getAllMenus() {
        const stmt = `SELECT * from Menus`;

        try {
            const result = await mysql_conn.query(stmt);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
    * get a row using by menu id
    * @param {Number} id id of the menu
    * @return {Array} result, length = 1
    */
    static async getMenuById(id) {
        const stmt = `SELECT * from Menus
            WHERE
                CAST(MenuID AS CHAR) = ?;`;

        try {
            const result = await mysql_conn.query(stmt, [id]);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
        * get all menu rows
        * @param {Object} obj - An object.
        * @param {Number} obj.startIndex start of limit
        * @param {Number} obj.limit limit count
        * @return {Array} result
        */
    static async getAllMenusPaged({ startIndex, limit }) {

        const limitClause = ` LIMIT ${mysql_conn.pool.escape(startIndex)}, ${mysql_conn.pool.escape(Number.parseInt(limit))}`;

        const stmt = `SELECT * from Menus ${limitClause}`;
        try {
            const result = await mysql_conn.query(stmt);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}


module.exports = MenusModel;