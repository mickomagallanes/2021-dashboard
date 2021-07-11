const mysql_conn = require("./db.js");
const GettersModel = require("./GettersModel.js");

"use strict";

const tableName = "ParentMenus";
const primaryKey = "ParentMenuID";
const sortCol = "ParentMenuSort";
const getterModel = new GettersModel(tableName, primaryKey, sortCol);

// LESSON: One model per table
class ParentMenuModel {

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
     * @param {String} obj.parentMenuID id of the parent menu
     * @param {String} [obj.parentMenuName] name of the parent menu
     * @param {String} [obj.parentMenuSort] sort value of the parent menu
     * @return {Object} result
     * @return {Number} result.insertId parent menu id of last inserted
     */
    static async modifyParentMenu({ parentMenuID, parentMenuName, parentMenuSort }) {
        let whereParams = [parentMenuID];
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


Object.setPrototypeOf(ParentMenuModel, getterModel);
module.exports = ParentMenuModel;