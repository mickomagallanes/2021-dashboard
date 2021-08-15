const mysql_conn = require("./db.js");
const DeleteModel = require("./DeleteModel.js");
const GettersModel = require("./GettersModel.js");

"use strict";

const tableName = "Employees";
const primaryKey = "EmployeeID";
const secondaryTables = [
    { id: "EmployeeDepartmentID", name: "EmployeeDepartments", relation: " INNER JOIN " },
    { id: "EmployeePositionID", name: "EmployeePositions", relation: " INNER JOIN " }

];
const getterModel = new GettersModel(tableName, primaryKey, secondaryTables);
const deleteModel = new DeleteModel(tableName, primaryKey);

// LESSON: One model per table
class EmployeeModel {

    constructor() {

    }

    static async getByIdJoinSalary(id) {

        const stmt = `SELECT * from Employees a LEFT JOIN EmployeeSalaries b ON 
        a.EmployeeID = b.EmployeeID AND 
        b.EmployeeSalaryID IN 
        (SELECT MAX(EmployeeSalaryID) FROM EmployeeSalaries WHERE EmployeeID = a.EmployeeID
         AND StartedDate <= CURDATE() AND (UntilDate > CURDATE() OR ISNULL(UntilDate)))
            WHERE
                CAST(a.EmployeeID AS CHAR) = ?;`;

        try {
            const result = await mysql_conn.query(stmt, [id]);
            return result;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
     * inserts new employee in the database
     * @param {Object} obj - An object.
     * @param {String} obj.employeeNo employee identification number
     * @param {String} obj.firstName first name of the employee
     * @param {String} obj.middleName middle name of the employee
     * @param {String} obj.lastName last name of the employee
     * @param {String} obj.sex sex of the employee (m or f)
     * @param {Number} obj.contactNo contact number of the employee
     * @param {Date} obj.hireDate hire of the employee
     * @param {Date} obj.birthDate birthdate of the employee
     * @param {Number} obj.employeePositionID position id of the employee
     * @param {Number} obj.employeeDepartmentID department id of the employee
     * @return {Object} result
     * @return {Number} result.insertId employee id of last inserted
     */
    static async insertEmployee({
        employeeNo,
        firstName,
        middleName,
        lastName,
        sex,
        contactNo,
        hireDate,
        birthDate,
        employeePositionID,
        employeeDepartmentID
    }) {
        const stmt = `INSERT INTO Employees (
            EmployeeNo,
            FirstName,
            MiddleName,
            LastName,
            Sex,
            ContactNo,
            HireDate,
            BirthDate,
            EmployeePositionID,
            EmployeeDepartmentID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        try {
            const result = await mysql_conn.query(stmt, [
                employeeNo,
                firstName,
                middleName,
                lastName,
                sex,
                contactNo,
                hireDate,
                birthDate,
                employeePositionID,
                employeeDepartmentID
            ]);
            return result;

        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
     * modify employee information to the database
     * @param {Object} obj - An object.
     * @param {String} obj.employeeID id of the employee
     * @param {String} obj.employeeNo employee identification number
     * @param {String} obj.firstName first name of the employee
     * @param {String} obj.middleName middle name of the employee
     * @param {String} obj.lastName last name of the employee
     * @param {String} obj.sex sex of the employee (m or f)
     * @param {Number} obj.contactNo contact number of the employee
     * @param {Date} obj.hireDate hire of the employee
     * @param {Date} obj.birthDate birthdate of the employee
     * @param {Number} obj.employeePositionID position id of the employee
     * @param {Number} obj.employeeDepartmentID department id of the employee
     * @return {Object} result
     * @return {Number} result.insertId employee id of last inserted
     */
    static async modifyEmployee({
        employeeID,
        employeeNo,
        firstName,
        middleName,
        lastName,
        sex,
        contactNo,
        hireDate,
        birthDate,
        employeePositionID,
        employeeDepartmentID
    }) {

        let whereParams = [employeeID];
        let setObj = {};
        let stmtWhere = ` WHERE EmployeeID = ?`

        if (employeeNo !== undefined) {
            setObj.EmployeeNo = employeeNo;
        }

        if (firstName !== undefined) {
            setObj.FirstName = firstName;
        }

        if (middleName !== undefined) {
            setObj.MiddleName = middleName;
        }

        if (lastName !== undefined) {
            setObj.LastName = lastName;
        }
        if (sex !== undefined) {
            setObj.Sex = sex;
        }

        if (contactNo !== undefined) {
            setObj.ContactNo = contactNo;
        }

        if (hireDate !== undefined) {
            setObj.HireDate = hireDate;
        }

        if (birthDate !== undefined) {
            setObj.BirthDate = birthDate;
        }

        if (employeePositionID !== undefined) {
            setObj.EmployeePositionID = employeePositionID;
        }

        if (employeeDepartmentID !== undefined) {
            setObj.EmployeeDepartmentID = employeeDepartmentID;
        }

        try {
            const result = await mysql_conn.update("Employees", setObj, stmtWhere, whereParams);
            return result;

        } catch (err) {
            console.error(err);
            return false;
        }
    }

}

EmployeeModel.deleteModel = deleteModel;
EmployeeModel.getterModel = getterModel;
module.exports = EmployeeModel;