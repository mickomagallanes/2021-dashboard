const mysql_conn = require("./db.js");
const GettersModel = require("./GettersModel.js");

"use strict";

const tableName = "EmployeeSalaries";
const primaryKey = "EmployeeSalaryID";
const secondaryTables = [{ id: "EmployeeID", name: "Employees", relation: " INNER JOIN " }]; // TODO: add fields specifically for faster query
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
     * @param {String} obj.salary value of salary per month
     * @param {String} obj.startedDate start date of the salary of employee
     * @param {String} obj.untilDate end of salary enabled
     * @param {String} obj.employeeID primary key id of employee
     * @return {Object} result
     * @return {Number} result.insertId employeeSalary id of last inserted
     */
    static async insertEmployeeSalary({ salary, startedDate, untilDate, employeeID }) {
        const stmt = `INSERT INTO EmployeeSalaries (Salary, StartedDate, UntilDate, EmployeeID) VALUES (?, ?, ?, ?)`;
        try {
            const result = await mysql_conn.query(stmt, [salary, startedDate, untilDate, employeeID]);
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
     * @param {String} obj.salary value of salary per month
     * @param {String} obj.startedDate start date of the salary of employee
     * @param {String} obj.untilDate end of salary enabled
     * @param {String} obj.employeeID primary key id of employee
     * @return {Object} result
     * @return {Number} result.insertId employeeSalary id of last inserted
     */
    static async modifyEmployeeSalary({ employeeSalaryID, salary, startedDate, untilDate, employeeID }) {
        let whereParams = [employeeSalaryID];
        let setObj = {};
        let stmtWhere = ` WHERE EmployeeSalaryID = ?`

        if (salary !== undefined) {
            setObj.Salary = salary;
        }

        if (startedDate !== undefined) {
            setObj.StartedDate = startedDate;
        }

        if (untilDate !== undefined) {
            setObj.UntilDate = untilDate;
        }

        if (employeeID !== undefined) {
            setObj.EmployeeID = employeeID;
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