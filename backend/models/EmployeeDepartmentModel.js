const mysql_conn = require("./db.js");
const { PRIVILEGES } = require('../utils/constants.js');
const GettersModel = require("./GettersModel.js");

"use strict";

const tableName = "EmployeeDepartments";
const primaryKey = "EmployeeDepartmentID";
const getterModel = new GettersModel(tableName, primaryKey);

class EmployeeDepartmentModel {

    constructor() {

    }

    /**
      * deleted employeeDepartment rows in the database
      * @param {String} employeeDepartmentID id of the employeeDepartment
      */
    static async deleteEmployeeDepartment(employeeDepartmentID) {

        try {
            const result = await mysql_conn.delete("EmployeeDepartments", "where EmployeeDepartmentID=?", [employeeDepartmentID]);
            return result;

        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
       * inserts new employeeDepartment in the database
       * @param {Object} obj - An object.
       * @param {String} obj.departmentName name of the department
       * @return {Object} result
       * @return {Number} result.insertId employeeDepartment id of last inserted
       */
    static async insertEmployeeDepartment({ departmentName }) {
        const stmt = `INSERT INTO EmployeeDepartments (DepartmentName) VALUES (?)`;
        try {
            const result = await mysql_conn.query(stmt, [departmentName]);
            return result;

        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
     * modify employeeDepartment information to the database
     * @param {Object} obj - An object.
     * @param {String} obj.employeeDepartmentID id of the employeeDepartment
     * @param {String} obj.departmentName name of the employeeDepartment
     * @return {Object} result
     * @return {Number} result.insertId employeeDepartment id of last inserted
     */
    static async modifyEmployeeDepartment({ employeeDepartmentID, departmentName }) {
        let whereParams = [employeeDepartmentID];
        let setObj = {};
        let stmtWhere = ` WHERE EmployeeDepartmentID = ?`

        if (departmentName !== undefined) {
            setObj.DepartmentName = departmentName
        }

        try {
            const result = await mysql_conn.update("EmployeeDepartments", setObj, stmtWhere, whereParams);
            return result;

        } catch (err) {
            console.error(err);
            return false;
        }
    }

}


Object.setPrototypeOf(EmployeeDepartmentModel, getterModel);
module.exports = EmployeeDepartmentModel;