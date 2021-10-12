const mysql_conn = require("./db.js");
const { PRIVILEGES } = require('../utils/constants.js');
const { loopArr } = require("../utils/looping.js");
const CRUDModel = require("./CRUDModel.js");

"use strict";

const tableName = "Menus";
const primaryKey = "MenuID";
const secondaryTables = [
    { id: "ParentMenuID", name: "ParentMenus", relation: " LEFT JOIN " },
    { id: "PageID", name: "Pages", relation: " INNER JOIN " }
];

const crudModel = new CRUDModel(tableName, primaryKey, secondaryTables)

class MenusModel {
    constructor() {

    }

    /**
    * get a row using by page id
    * @param {Number} id id of page
    * @return {Array} result, length = 1
    */
    static async getMenuByPageId(id) {
        const stmt = `SELECT * from Menus
            WHERE
                CAST(PageID AS CHAR) = ?;`;

        try {
            const result = await mysql_conn.query(stmt, [id]);
            return result;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
    * inserts new menu in the database
    * @param {Array of Objects} dataArr contains the insert row for menu
    */
    static async insertBulkMenu(dataArr) {
        let valuesClause = ` `
        const valuesArray = [];

        await loopArr(dataArr, (indx) => {

            valuesArray.push(dataArr[indx]["MenuName"], dataArr[indx]["PageID"], dataArr[indx]["ParentMenuID"]);

            if (indx === 0) {
                valuesClause += `( ?, ?, ? )`;
            } else {
                valuesClause += ` , ( ?, ?, ? )`;
            }

        });

        const stmt = `INSERT INTO Menus
                    (MenuName, PageID, ParentMenuID)
                    VALUES ${valuesClause} `;

        try {
            const result = await mysql_conn.query(stmt, valuesArray);
            return result;

        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
     * inserts new menu in the database
     * @param {Object} obj - An object.
     * @param {String} obj.menuName name of the menu
     * @param {String} obj.pageID id of page, foreign key
     * @param {String} obj.parentMenuID id of parent menu, foreign key
     * @return {Object} result
     * @return {Number} result.insertId menu id of last inserted
     */
    static async insertMenu({ menuName, pageID, parentMenuID }) {
        const stmt = `INSERT INTO Menus (MenuName, PageID, parentMenuID) VALUES (?, ?, ?)`;
        try {
            const result = await mysql_conn.query(stmt, [menuName, pageID, parentMenuID]);
            return result;

        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
     * modify menu information to the database
     * @param {Object} obj - An object.
     * @param {String} obj.menuID id of the menu
     * @param {String} obj.menuName name of the menu
     * @param {String} obj.pageID id of page, foreign key
     * @param {String} obj.parentMenuID id of parent menu, foreign key
     * @return {Object} result
     * @return {Number} result.insertId menu id of last inserted
     */
    static async modifyMenu({ menuID, menuName, pageID, parentMenuID }) {
        let whereParams = [menuID];
        let setObj = {};
        let stmtWhere = ` WHERE MenuID = ?`

        if (menuName !== undefined) {
            setObj.MenuName = menuName
        }

        if (pageID !== undefined) {
            setObj.PageID = pageID
        }

        if (parentMenuID !== undefined) {
            setObj.ParentMenuID = parentMenuID
        }

        try {
            const result = await mysql_conn.update("Menus", setObj, stmtWhere, whereParams);

            return result;


        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
     * get menu and parent menu based on logged-in user role
     * @param {Number} userId id of the user
     * @return {Array} result
     */
    static async getMenusByRole(userId) {
        const stmt = `SELECT b.PagePath, c.MenuID, c.MenuName, d.ParentMenuName, d.ParentMenuID FROM PageRoles as a 
        INNER JOIN Pages as b ON a.PageID = b.PageID INNER JOIN Menus as c ON b.PageID = c.PageID 
		LEFT JOIN ParentMenus as d ON c.ParentMenuID = d.ParentMenuID
		INNER JOIN Users as e ON a.RoleID = e.RoleID 
        INNER JOIN Privileges as f ON a.PrivilegeID = f.PrivilegeID WHERE (f.PrivilegeName = ? OR f.PrivilegeName = ?) 
        AND UserID = ? ORDER BY d.ParentMenuSort;`;

        try {
            const result = await mysql_conn.query(stmt, [PRIVILEGES.readWrite, PRIVILEGES.read, userId]);
            return result;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

}

MenusModel.crud = crudModel;

module.exports = MenusModel;