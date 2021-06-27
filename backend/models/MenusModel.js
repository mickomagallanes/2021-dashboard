const mysql_conn = require("./db.js");

"use strict";

class MenusModel {

    constructor() {

    }

    /**
    * inserts new parent menu in the database
    * @param {Object} obj - An object.
    * @param {String} obj.parentMenuName name of the parent menu
    * @return {Object} result
    * @return {Number} result.insertId parent menu id of last inserted
    */
    static async insertParentMenu({ parentMenuName }) {
        const stmt = `INSERT INTO ParentMenus (ParentMenuName) VALUES (?)`;
        try {
            const result = await mysql_conn.query(stmt, [parentMenuName]);
            return result;

        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
     * modify parent menu information to the database
     * @param {Object} obj - An object.
     * @param {String} obj.parentMenuId id of the parent menu
     * @param {String} [obj.parentMenuName] name of the parent menu
     * @param {String} [obj.parentMenuSort] sort value of the parent menu
     * @return {Object} result
     * @return {Number} result.insertId parent menu id of last inserted
     */
    static async modifyParentMenu({ parentMenuId, parentMenuName, parentMenuSort }) {
        let whereParams = [parentMenuId];
        let setObj = {};
        let stmtWhere = ` WHERE ParentMenuID = ?`

        if (parentMenuName !== undefined) {
            setObj.ParentMenuName = parentMenuName
        }

        if (parentMenuSort !== undefined) {
            setObj.ParentMenuSort = parentMenuSort
        }

        try {
            const result = await mysql_conn.update("ParentMenus", setObj, stmtWhere, whereParams);
            return result;

        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
     * get menu and parent menu based on logged-in user role
     * @param {Number} userId id of the user
     * @return {Array} result
     */
    static async getMenusByRole(userId) {
        const stmt = `SELECT b.PagePath, c.MenuName, d.ParentMenuName FROM PageRoles as a 
        INNER JOIN Pages as b ON a.PageID = b.PageID INNER JOIN Menus as c ON b.MenuID = c.MenuID 
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
    * get count of all user for pagination
    * @return {Array} result, length = 1
    */
    static async getAllParentMenuCount() {
        const stmt = `SELECT 
               count(ParentMenuID) as count
            FROM
                ParentMenus`;
        try {
            const result = await mysql_conn.query(stmt);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
     * get all parent menu rows
     * @return {Array} result
     */
    static async getAllParentMenus() {
        const stmt = `SELECT * from ParentMenus ORDER BY ParentMenuSort ASC`;

        try {
            const result = await mysql_conn.query(stmt);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
    * get a row using by parent menu id
    * @param {Number} id id of the parent menu
    * @return {Array} result, length = 1
    */
    static async getParentMenuById(id) {
        const stmt = `SELECT * from ParentMenus
            WHERE
                CAST(a.ParentMenuID AS CHAR) = ?;`;

        try {
            const result = await mysql_conn.query(stmt, [id]);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
        * get all parent menu rows
        * @param {Object} obj - An object.
        * @param {Number} obj.startIndex start of limit
        * @param {Number} obj.limit limit count
        * @return {Array} result
        */
    static async getAllParentMenusPaged({ startIndex, limit }) {

        const limitClause = ` LIMIT ${mysql_conn.pool.escape(startIndex)}, ${mysql_conn.pool.escape(Number.parseInt(limit))}`;

        const stmt = `SELECT * from ParentMenus ORDER BY ParentMenuSort ASC ${limitClause}`;
        try {
            const result = await mysql_conn.query(stmt);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
     * change value of sort to down of parent menu
     * @return ?
     */
    static async sortDownParentMenu(id) {
        try {
            const stmt = `UPDATE ParentMenus AS pm1
                                    JOIN
                                ParentMenus AS pm2 ON (pm1.ParentMenuID = ?
                                    AND pm2.ParentMenuID = (SELECT a.ParentMenuID FROM (SELECT 
                                        ParentMenuID
                                    FROM
                                        ParentMenus
                                    WHERE
                                        ParentMenuSort = (SELECT 
                                                MIN(ParentMenuSort)
                                            FROM
                                                ParentMenus
                                            WHERE
                                                ParentMenuSort > (SELECT 
                                                        ParentMenuSort
                                                    FROM
                                                        ParentMenus
                                                    WHERE
                                                        ParentMenuID = ?))) as a)) 
                            SET 
                                pm1.ParentMenuSort = pm2.ParentMenuSort,
                                pm2.ParentMenuSort = pm1.ParentMenuSort;`;

            const results = await mysql_conn.query(stmt, [id, id]);

            return results;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
     * change value of sort to up of parent menu
     * @return ?
     */
    static async sortUpParentMenu(id) {
        try {
            const stmt = `UPDATE ParentMenus AS pm1
                                JOIN
                            ParentMenus AS pm2 ON (pm1.ParentMenuID = ?
                                AND pm2.ParentMenuID = (SELECT a.ParentMenuID FROM (SELECT 
                                    ParentMenuID
                                FROM
                                    ParentMenus
                                WHERE
                                    ParentMenuSort = (SELECT 
                                            MAX(ParentMenuSort)
                                        FROM
                                            ParentMenus
                                        WHERE
                                            ParentMenuSort < (SELECT 
                                                    ParentMenuSort
                                                FROM
                                                    ParentMenus
                                                WHERE
                                                    ParentMenuID = ?))) as a)) 
                        SET 
                            pm1.ParentMenuSort = pm2.ParentMenuSort,
                            pm2.ParentMenuSort = pm1.ParentMenuSort;`;

            const results = await mysql_conn.query(stmt, [id, id]);

            return results;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

}


module.exports = MenusModel;