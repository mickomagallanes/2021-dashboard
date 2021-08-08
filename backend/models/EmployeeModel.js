const mysql_conn = require("./db.js");
const GettersModel = require("./GettersModel.js");

"use strict";

const tableName = "Employees";
const primaryKey = "EmployeeID";
const secondaryTables = [
    { id: "EmployeeDepartmentID", name: "EmployeeDepartments", relation: " INNER JOIN " },
    { id: "EmployeePositionID", name: "EmployeePositions", relation: " INNER JOIN " }
];
const getterModel = new GettersModel(tableName, primaryKey, secondaryTables);

// LESSON: One model per table
class EmployeeModel {

    constructor() {

    }

    /**
     * deleted employee rows in the database
     * @param {String} employeeID id of the menu
     */
    static async deleteEmployee(employeeID) {

        try {
            const result = await mysql_conn.delete("Employees", "where EmployeeID=?", [employeeID]);
            return result;

        } catch (err) {
            console.log(err);
            return false;
        }
    }


    /**
     * inserts new employee in the database
     * @param {Object} obj - An object.
     * @param {String} obj.employeeName name of the employee
     * @return {Object} result
     * @return {Number} result.insertId employee id of last inserted
     */
    static async insertEmployee({ employeeName }) {
        const stmt = `INSERT INTO Employees (EmployeeName) VALUES (?)`;
        try {
            const result = await mysql_conn.query(stmt, [employeeName]);
            return result;

        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
     * modify employee information to the database
     * @param {Object} obj - An object.
     * @param {String} obj.employeeID id of the employee
     * @param {String} [obj.employeeName] name of the employee
     * @param {String} [obj.Employeesort] sort value of the employee
     * @return {Object} result
     * @return {Number} result.insertId employee id of last inserted
     */
    static async modifyEmployee({ employeeID, employeeName, Employeesort }) {
        let whereParams = [employeeID];
        let setObj = {};
        let stmtWhere = ` WHERE EmployeeID = ?`

        if (employeeName !== undefined) {
            setObj.EmployeeName = employeeName
        }

        if (Employeesort !== undefined) {
            setObj.Employeesort = Employeesort
        }

        try {
            const result = await mysql_conn.update("Employees", setObj, stmtWhere, whereParams);
            return result;

        } catch (err) {
            console.log(err);
            return false;
        }
    }

}


Object.setPrototypeOf(EmployeeModel, getterModel);
module.exports = EmployeeModel;