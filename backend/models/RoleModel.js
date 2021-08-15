const mysql_conn = require("./db.js");
const DeleteModel = require("./DeleteModel.js");
const GettersModel = require("./GettersModel.js");

"use strict";

const tableName = "Roles";
const primaryKey = "RoleID";
const getterModel = new GettersModel(tableName, primaryKey);
const deleteModel = new DeleteModel(tableName, primaryKey);

class RoleModel {

    constructor() {

    }


    /**
    * inserts new role in the database
    * @param {Object} obj - An object.
    * @param {String} obj.rolename name of the role
    * @return {Object} result
    * @return {Number} result.insertId role id of last inserted
    */
    static async insertRole({ rolename }) {
        const stmt = `INSERT INTO Roles (RoleName) VALUES (?)`;
        try {
            const result = await mysql_conn.query(stmt, [rolename]);
            return result;

        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
     * modify role information to the database
     * @param {Object} obj - An object.
     * @param {String} obj.roleid id of the role
     * @param {String} [obj.rolename] name of the role
     * @return {Object} result
     * @return {Number} result.insertId role id of last inserted
     */

    static async modifyRole({ roleid, rolename }) {
        let whereParams = [roleid];
        let setObj = {};
        let stmtWhere = ` WHERE RoleID = ?`

        if (rolename !== undefined) {
            setObj.RoleName = rolename
        }

        try {
            const result = await mysql_conn.update("Roles", setObj, stmtWhere, whereParams);
            return result;

        } catch (err) {
            console.error(err);
            return false;
        }
    }

}


RoleModel.deleteModel = deleteModel;
RoleModel.getterModel = getterModel;

module.exports = RoleModel;