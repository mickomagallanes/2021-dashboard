const mysql_conn = require("./db.js");
const { PRIVILEGES } = require('../utils/constants.js');

"use strict";

const tableName = "SubPages";
const primaryKey = "SubPageID";
const secondaryTables = [{ id: "PageID", name: "Pages", relation: " INNER JOIN " }];

class SubPageModel extends CRUDModel {

    constructor() {
        super(tableName, primaryKey, secondaryTables)
    }

    /**
     * inserts new subPage in the database
     * @param {Object} obj - An object.
     * @param {String} obj.subPageName name of the subPage
     * @param {String} obj.subPagePath path of subpage
     * @param {String} obj.pageID id of page, foreign key
     * @return {Object} result
     * @return {Number} result.insertId subPage id of last inserted
     */
    static async insertSubPage({ subPageName, subPagePath, pageID }) {
        const stmt = `INSERT INTO SubPages (SubPageName, SubPagePath, PageID) VALUES (?, ?, ?)`;
        try {
            const result = await mysql_conn.query(stmt, [subPageName, subPagePath, pageID]);
            return result;

        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
     * modify subPage information to the database
     * @param {Object} obj - An object.
     * @param {String} obj.subPageID id of the subPage
     * @param {String} obj.subPageName name of the subPage
     * @param {String} obj.subPagePath path of subpage
     * @param {String} obj.pageID id of page, foreign key
     * @return {Object} result
     * @return {Number} result.insertId subPage id of last inserted
     */
    static async modifySubPage({ subPageID, subPageName, subPagePath, pageID }) {
        let whereParams = [subPageID];
        let setObj = {};
        let stmtWhere = ` WHERE SubPageID = ?`

        if (subPageName !== undefined) {
            setObj.SubPageName = subPageName
        }

        if (pageID !== undefined) {
            setObj.PageID = pageID
        }

        if (subPagePath !== undefined) {
            setObj.SubPagePath = subPagePath
        }

        try {
            const result = await mysql_conn.update("SubPages", setObj, stmtWhere, whereParams);
            return result;

        } catch (err) {
            console.error(err);
            return false;
        }
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
            console.error(err);
            return false;
        }
    }

}

module.exports = SubPageModel;