const mysql_conn = require("./db.js");
const { PRIVILEGES } = require('../utils/constants.js');
const GettersModel = require("./GettersModel.js");

"use strict";

const tableName = "Menus";
const primaryKey = "MenuID";
const getterModel = new GettersModel(tableName, primaryKey);

class MenusModel {
    constructor() {

    }

    /**
  * inserts new menu in the database
  * @param {Object} obj - An object.
  * @param {String} obj.menuName name of the menu
  * @return {Object} result
  * @return {Number} result.insertId menu id of last inserted
  */
    static async insertMenu({ menuName }) {
        const stmt = `INSERT INTO Menus (MenuName) VALUES (?)`;
        try {
            const result = await mysql_conn.query(stmt, [menuName]);
            return result;

        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
     * modify menu information to the database
     * @param {Object} obj - An object.
     * @param {String} obj.menuID id of the menu
     * @param {String} [obj.menuName] name of the menu
     * @return {Object} result
     * @return {Number} result.insertId menu id of last inserted
     */
    static async modifyMenu({ menuID, menuName }) {
        let whereParams = [menuID];
        let setObj = {};
        let stmtWhere = ` WHERE MenuID = ?`

        if (menuName !== undefined) {
            setObj.menuName = menuName
        }

        try {
            const result = await mysql_conn.update("Menus", setObj, stmtWhere, whereParams);
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
            console.log(err);
            return false;
        }
    }

}

Object.setPrototypeOf(MenusModel, getterModel);
module.exports = MenusModel;