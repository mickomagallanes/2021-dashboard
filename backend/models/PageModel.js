const mysql_conn = require("./db.js");
const { PRIVILEGES } = require('../utils/constants.js');
const GettersModel = require("./GettersModel.js");

"use strict";

const tableName = "Pages";
const primaryKey = "PageID";
const getterModel = new GettersModel(tableName, primaryKey);

class PageModel {

    constructor() {

    }

    /**
       * inserts new page in the database
       * @param {Object} obj - An object.
       * @param {String} obj.pageName name of the page
       * @param {String} obj.pagePath path of page
       * @return {Object} result
       * @return {Number} result.insertId page id of last inserted
       */
    static async insertPage({ pageName, pagePath }) {
        const stmt = `INSERT INTO Pages (PageName, PagePath) VALUES (?, ?)`;
        try {
            const result = await mysql_conn.query(stmt, [pageName, pagePath]);
            return result;

        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
     * modify page information to the database
     * @param {Object} obj - An object.
     * @param {String} obj.pageID id of the page
     * @param {String} obj.pageName name of the page
     * @param {String} obj.pagePath path of page
     * @return {Object} result
     * @return {Number} result.insertId page id of last inserted
     */
    static async modifyPage({ pageID, pageName, pagePath }) {
        let whereParams = [pageID];
        let setObj = {};
        let stmtWhere = ` WHERE PageID = ?`

        if (pageName !== undefined) {
            setObj.PageName = pageName
        }

        if (pagePath !== undefined) {
            setObj.PagePath = pagePath
        }

        try {
            const result = await mysql_conn.update("Pages", setObj, stmtWhere, whereParams);
            return result;

        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
     * get pages based on logged-in user role
     * @param {Number} userId id of the user
     * @return {Array} result
     */
    static async getPagesByUser(userId) {
        const stmt = `SELECT b.PageID, b.PageName, b.PagePath FROM PageRoles as a INNER JOIN Pages as b ON a.PageID = b.PageID 
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


Object.setPrototypeOf(PageModel, getterModel);
module.exports = PageModel;