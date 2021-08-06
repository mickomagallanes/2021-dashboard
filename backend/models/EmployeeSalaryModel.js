const mysql_conn = require("./db.js");
const GettersModel = require("./GettersModel.js");

"use strict";

const tableName = "EmployeeSalaries";
const primaryKey = "EmployeeSalaryID";
const secondaryTables = [{ id: "EmployeeID", name: "Employees", relation: " INNER JOIN " }];
const getterModel = new GettersModel(tableName, primaryKey, secondaryTables);

// LESSON: One model per table
class EmployeeSalaryModel {

    constructor() {

    }

    /**
     * deleted employeeSalary rows in the database
     * @param {String} employeeSalaryID id of the menu
     */
    static async deleteEmployeeSalary(employeeSalaryID) {

        try {
            const result = await mysql_conn.delete("EmployeeSalaries", "where EmployeeSalaryID=?", [employeeSalaryID]);
            return result;

        } catch (err) {
            console.log(err);
            return false;
        }
    }


    /**
     * inserts new employeeSalary in the database
     * @param {Object} obj - An object.
     * @param {String} obj.employeeSalaryName name of the employeeSalary
     * @return {Object} result
     * @return {Number} result.insertId employeeSalary id of last inserted
     */
    static async insertEmployeeSalary({ employeeSalaryName }) {
        const stmt = `INSERT INTO EmployeeSalaries (EmployeeSalaryName) VALUES (?)`;
        try {
            const result = await mysql_conn.query(stmt, [employeeSalaryName]);
            return result;

        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
     * modify employeeSalary information to the database
     * @param {Object} obj - An object.
     * @param {String} obj.employeeSalaryID id of the employeeSalary
     * @param {String} [obj.employeeSalaryName] name of the employeeSalary
     * @param {String} [obj.EmployeeSalariesort] sort value of the employeeSalary
     * @return {Object} result
     * @return {Number} result.insertId employeeSalary id of last inserted
     */
    static async modifyEmployeeSalary({ employeeSalaryID, employeeSalaryName, EmployeeSalariesort }) {
        let whereParams = [employeeSalaryID];
        let setObj = {};
        let stmtWhere = ` WHERE EmployeeSalaryID = ?`

        if (employeeSalaryName !== undefined) {
            setObj.EmployeeSalaryName = employeeSalaryName
        }

        if (EmployeeSalariesort !== undefined) {
            setObj.EmployeeSalariesort = EmployeeSalariesort
        }

        try {
            const result = await mysql_conn.update("EmployeeSalaries", setObj, stmtWhere, whereParams);
            return result;

        } catch (err) {
            console.log(err);
            return false;
        }
    }

}


Object.setPrototypeOf(EmployeeSalaryModel, getterModel);
module.exports = EmployeeSalaryModel;