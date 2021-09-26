const EmployeeSalaryModel = require('../models/EmployeeSalaryModel.js');
const EmployeeDepartmentModel = require('../models/EmployeeDepartmentModel.js');
const EmployeePositionModel = require('../models/EmployeePositionModel.js');
const EmployeeModel = require('../models/EmployeeModel.js');

"use strict";

class EmployeeService {

    constructor() {

    }

    /*************************** Employee Position *************************************/
    /**
     * deleted employeePosition rows in the database
     * @param {String} employeePositionID id of the employeePosition
     */
    static async deleteEmployeePosition(employeePositionID) {

        let ret = await EmployeePositionModel.deleteRow(employeePositionID);

        if (ret == false) {
            return { status: false }
        } else {
            return { status: true }
        }

    }

    /**
     * delete bulk id array
     * @param {Array} idArray array containing ids of row
     */
    static async deleteBulkEmployeePosition(idArray) {

        let ret = await EmployeePositionModel.deleteBulkRows(idArray);

        if (ret == false) {
            return { status: false }
        } else {
            return { status: true }
        }

    }

    /**
     * inserts new employeePosition in the database
     * @param {Object} obj - An object.
     * @param {String} obj.positionName name of the  employeePosition
     * @return {Object} result
     * @return {Number} result.insertId role id of last inserted
     */
    static async insertEmployeePosition({ positionName }) {
        let obj = {
            positionName: positionName
        };
        let ret = await EmployeePositionModel.insertEmployeePosition(obj);

        if (ret === false) {

            return { status: false }
        } else {
            return { status: true, data: ret.insertId }
        }

    }

    /**
    * modify employeePosition information to the database, doesn't have sort because its handled differently
    * @param {String} employeePositionID id of the employeePosition
    * @param {Object} obj - An object.
    * @param {String} obj.positionName name of the employeePosition
    * @return {Object} result
    * @return {Number} result.insertId employeePosition id of last inserted
    */
    static async modifyEmployeePosition(employeePositionID, { positionName }) {

        let obj = {
            employeePositionID: employeePositionID,
            positionName: positionName
        };

        let ret = await EmployeePositionModel.modifyEmployeePosition(obj);

        if (ret == false) {
            return { status: false }
        } else {
            return { status: true, data: ret.insertId }
        }

    }

    /**
     * get all employeePosition rows
     * @param {Object} obj - An object.
     * @param {String} [obj.employeePosition] current page, must be greater than 0
     * @param {String} [obj.limit] limit count of rows, greater than 0
     * @param {String} [obj.sortBy] column used for sort
     * @param {String} [obj.order] ASC or DESC
     * @return employeePositionArr all rows of employeePosition
     */
    static async getAllEmployeePositions({ page, limit, sortBy, order, filter }) {

        if ((!!page && page > 0) && (!limit || !(limit > 0))) {
            return { status: false }
        } else if ((!!limit && limit > 0) && (!page || !(page > 0))) {
            return { status: false }
        }

        let isPaged = (!!page && page > 0) && (!!limit && limit > 0); // for pagination

        const startIndex = isPaged ? (page - 1) * limit : false;

        if (sortBy) {
            if (order === "DESC") {
                order = "DESC";
            } else {
                order = "ASC";
            }
        }

        let employeePositionArr = await EmployeePositionModel.getAll({
            startIndex: startIndex,
            limit: limit,
            sortBy: sortBy,
            order: order,
            filter: filter
        });

        if (employeePositionArr) {

            return { status: true, data: employeePositionArr }

        } else {
            return { status: false }
        }

    }

    /**
     * get employeePosition info by employeePosition id
     * @param {String} id employeePosition id
     * @return one row of employeePosition
     */
    static async getEmployeePositionById(id) {
        let ret = await EmployeePositionModel.getById(id);

        if (ret.length) {
            return { status: true, data: ret[0] }

        } else {
            return { status: false }
        }

    }

    /**
     * get total count of employeePosition rows
     * @return count of all rows
     */
    static async getAllEmployeePositionCount({ filter }) {

        const employeePositionCount = await EmployeePositionModel.getAllCount({ filter });

        if (employeePositionCount.length) {
            return { status: true, data: employeePositionCount[0] }
        } else {
            return { status: false }
        }


    }


    /*************************** Employee Department *************************************/

    /**
     * deleted employeeDepartment rows in the database
     * @param {String} employeeDepartmentID id of the employeeDepartment
     */
    static async deleteEmployeeDepartment(employeeDepartmentID) {

        let ret = await EmployeeDepartmentModel.deleteRow(employeeDepartmentID);

        if (ret == false) {
            return { status: false }
        } else {
            return { status: true }
        }

    }

    /**
     * delete bulk id array
     * @param {Array} idArray array containing ids of row
     */
    static async deleteBulkEmployeeDepartment(idArray) {

        let ret = await EmployeeDepartmentModel.deleteBulkRows(idArray);

        if (ret == false) {
            return { status: false }
        } else {
            return { status: true }
        }

    }

    /**
     * inserts new employeeDepartment in the database
     * @param {Object} obj - An object.
     * @param {String} obj.departmentName name of the  employeeDepartment
     * @return {Object} result
     * @return {Number} result.insertId role id of last inserted
     */
    static async insertEmployeeDepartment({ departmentName }) {
        let obj = {
            departmentName: departmentName
        };
        let ret = await EmployeeDepartmentModel.insertEmployeeDepartment(obj);

        if (ret === false) {

            return { status: false }
        } else {
            return { status: true, data: ret.insertId }
        }

    }

    /**
    * modify employeeDepartment information to the database, doesn't have sort because its handled differently
    * @param {String} employeeDepartmentID id of the employeeDepartment
    * @param {Object} obj - An object.
    * @param {String} obj.departmentName name of the employeeDepartment
    * @return {Object} result
    * @return {Number} result.insertId employeeDepartment id of last inserted
    */
    static async modifyEmployeeDepartment(employeeDepartmentID, { departmentName, employeeDepartmentPath }) {

        let obj = {
            employeeDepartmentID: employeeDepartmentID,
            departmentName: departmentName
        };

        let ret = await EmployeeDepartmentModel.modifyEmployeeDepartment(obj);

        if (ret == false) {
            return { status: false }
        } else {
            return { status: true, data: ret.insertId }
        }

    }

    /**
     * get all employeeDepartment rows
     * @param {Object} obj - An object.
     * @param {String} [obj.employeeDepartment] current page, must be greater than 0
     * @param {String} [obj.limit] limit count of rows, greater than 0
     * @param {String} [obj.sortBy] column used for sort
     * @param {String} [obj.order] ASC or DESC
     * @return employeeDepartmentArr all rows of employeeDepartment
     */
    static async getAllEmployeeDepartments({ page, limit, sortBy, order, filter }) {

        if ((!!page && page > 0) && (!limit || !(limit > 0))) {
            return { status: false }
        } else if ((!!limit && limit > 0) && (!page || !(page > 0))) {
            return { status: false }
        }

        let isPaged = (!!page && page > 0) && (!!limit && limit > 0); // for pagination

        const startIndex = isPaged ? (page - 1) * limit : false;

        if (sortBy) {
            if (order === "DESC") {
                order = "DESC";
            } else {
                order = "ASC";
            }
        }

        let employeeDepartmentArr = await EmployeeDepartmentModel.getAll({
            startIndex: startIndex,
            limit: limit,
            sortBy: sortBy,
            order: order,
            filter: filter
        });

        if (employeeDepartmentArr) {

            return { status: true, data: employeeDepartmentArr }

        } else {
            return { status: false }
        }

    }

    /**
     * get employeeDepartment info by employeeDepartment id
     * @param {String} id employeeDepartment id
     * @return one row of employeeDepartment
     */
    static async getEmployeeDepartmentById(id) {
        let ret = await EmployeeDepartmentModel.getById(id);

        if (ret.length) {
            return { status: true, data: ret[0] }

        } else {
            return { status: false }
        }

    }

    /**
     * get total count of employeeDepartment rows
     * @return count of all rows
     */
    static async getAllEmployeeDepartmentCount({ filter }) {

        const employeeDepartmentCount = await EmployeeDepartmentModel.getAllCount({ filter });

        if (employeeDepartmentCount.length) {
            return { status: true, data: employeeDepartmentCount[0] }
        } else {
            return { status: false }
        }


    }
    /*************************** Employee Salaries *************************************/
    /**
     * deleted employeeSalary rows in the database
     * @param {String} employeeSalaryID id of the salary
     */
    static async deleteEmployeeSalary(employeeSalaryID) {

        let ret = await EmployeeSalaryModel.deleteRow(employeeSalaryID);

        if (ret == false) {
            return { status: false }
        } else {
            return { status: true }
        }

    }

    /**
     * delete bulk id array
     * @param {Array} idArray array containing ids of row
     */
    static async deleteBulkEmployeeSalary(idArray) {

        let ret = await EmployeeSalaryModel.deleteBulkRows(idArray);

        if (ret == false) {
            return { status: false }
        } else {
            return { status: true }
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
     * @return {Number} result.insertId role id of last inserted
     */
    static async insertEmployeeSalary({ salary, startedDate, untilDate, employeeID }) {

        const obj = {
            salary: salary,
            startedDate, startedDate,
            untilDate, untilDate,
            employeeID, employeeID
        }

        let ret = await EmployeeSalaryModel.insertEmployeeSalary(obj);

        if (ret === false) {
            return { status: false }
        } else {
            return { status: true, data: ret.insertId }

        }

    }

    /**
    * modify employeeSalary information to the database, doesn't have sort because its handled differently
    * @param {String} employeeSalaryID id of the employeeSalary
    * @param {Object} obj - An object.
    * @param {String} obj.salary value of salary per month
    * @param {String} obj.startedDate start date of the salary of employee
    * @param {String} obj.untilDate end of salary enabled
    * @param {String} obj.employeeID primary key id of employee
    * @return {Object} result
    * @return {Number} result.insertId employeeSalary id of last inserted
    */
    static async modifyEmployeeSalary(employeeSalaryID, { salary, startedDate, untilDate, employeeID }) {

        let obj = {
            employeeSalaryID: employeeSalaryID,
            salary: salary,
            startedDate, startedDate,
            untilDate, untilDate,
            employeeID, employeeID
        };

        let ret = await EmployeeSalaryModel.modifyEmployeeSalary(obj);
        if (ret == false) {
            return { status: false }
        } else {
            return { status: true }
        }

    }

    /**
     * get all employeeSalary rows
     * @param {Object} obj - An object.
     * @param {String} [obj.page] current page, must be greater than 0
     * @param {String} [obj.limit] limit count of rows, greater than 0
     * @param {String} [obj.sortBy] column used for sort
     * @param {String} [obj.order] ASC or DESC
     * @return employeeSalaryArr all rows of employeeSalary
     */
    static async getAllEmployeeSalaries({ page, limit, sortBy, order, filter }) {

        if ((!!page && page > 0) && (!limit || !(limit > 0))) {
            return { status: false }
        } else if ((!!limit && limit > 0) && (!page || !(page > 0))) {
            return { status: false }
        }

        if (sortBy) {
            if (order === "DESC") {
                order = "DESC";
            } else {
                order = "ASC";
            }
        }

        let isPaged = (!!page && page > 0) && (!!limit && limit > 0); // for pagination

        const startIndex = isPaged ? (page - 1) * limit : false;

        let employeeSalaryArr = await EmployeeSalaryModel.getAll({
            startIndex: startIndex,
            limit: limit,
            sortBy: sortBy,
            order: order,
            filter: filter
        });

        if (employeeSalaryArr) {

            return { status: true, data: employeeSalaryArr }

        } else {
            return { status: false }
        }

    }

    /**
     * get employeeSalary info by employeeSalary id
     * @param {String} id employeeSalary id
     * @return one row of employeeSalary
     */
    static async getEmployeeSalaryById(id) {
        let ret = await EmployeeSalaryModel.getById(id);

        if (ret.length) {
            return { status: true, data: ret[0] }

        } else {
            return { status: false }
        }

    }


    /**
     * get salary info by employee id
     * @param {String} id employee id
     * @return one row of salary
     */
    static async getEmployeeSalaryByEmployeeId(id) {
        let ret = await EmployeeSalaryModel.getSalaryByEmployeeId(id);

        if (ret.length) {
            return { status: true, data: ret[0] }

        } else {
            return { status: false }
        }

    }

    /**
     * get total count of employeeSalary rows
     * @return count of all rows
     */
    static async getAllEmployeeSalaryCount({ filter }) {

        const employeeSalaryCount = await EmployeeSalaryModel.getAllCount({ filter });

        if (employeeSalaryCount.length) {
            return { status: true, data: employeeSalaryCount[0] }
        } else {
            return { status: false }
        }


    }


    /*************************** Employee *************************************/
    /**
     * deleted employee rows in the database
     * @param {String} employeeID id of the employee
     */
    static async deleteEmployee(employeeID) {

        let ret = await EmployeeModel.deleteRow(employeeID);

        if (ret == false) {
            return { status: false }
        } else {
            return { status: true }
        }

    }

    /**
     * delete bulk id array
     * @param {Array} idArray array containing ids of row
     */
    static async deleteBulkEmployee(idArray) {

        let ret = await EmployeeModel.deleteBulkRows(idArray);

        if (ret == false) {
            return { status: false }
        } else {
            return { status: true }
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
     * @return {Number} result.insertId role id of last inserted
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

        const obj = {
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
        }
        let ret = await EmployeeModel.insertEmployee(obj);

        if (ret === false) {
            return { status: false }
        } else {
            return { status: true, data: ret.insertId }
        }

    }

    /**
    * modify employee information to the database, doesn't have sort because its handled differently
    * @param {String} employeeID id of the employee
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
    static async modifyEmployee(employeeID, {
        employeeNo,
        firstName,
        middleName,
        lastName,
        sex,
        contactNo,
        hireDate,
        birthDate,
        employeePositionID,
        employeeDepartmentID }) {

        let obj = {
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
        };

        let ret = await EmployeeModel.modifyEmployee(obj);
        if (ret == false) {
            return { status: false }
        } else {
            return { status: true }
        }

    }



    /**
    * inserts new employee in the database
    * @param {Object} obj - An object.
    * @param {Number} obj.salaryID salary id
    * @param {String} obj.employeeNo employee number
    * @param {String} obj.firstName first name of employee
    * @param {String} obj.middleName middle name of employee
    * @param {String} obj.lastName last name of employee
    * @param {Number} obj.sex sex of employee
    * @param {Number} obj.contactNo contact number of employee
    * @param {String} obj.hireDate hire date of employee
    * @param {String} obj.birthDate birthdate of employee
    * @param {Number} obj.employeePositionID employee position ID
    * @param {Number} obj.employeeDepartmentID employee department ID
    * @param {Number} obj.salary salary on employee salary table
    * @param {String} obj.startedDate started date of employee salary
    * @param {String} obj.untilDate until date of employee salary
    * @return {Object} result
    * @return {Number} result.insertId employee id of last inserted
    */
    static async insertEmployeeComplete({
        employeeNo,
        firstName,
        middleName,
        lastName,
        sex,
        contactNo,
        hireDate,
        birthDate,
        employeePositionID,
        employeeDepartmentID,
        salary,
        startedDate,
        untilDate
    }) {

        let objEmployee = {
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
        };

        let resultEmployee = await EmployeeModel.insertEmployee(objEmployee);
        let employeeID = resultEmployee.insertId;

        if (resultEmployee !== false) {
            let objSalary = {
                salary,
                startedDate,
                untilDate,
                employeeID
            };

            let resultFromSalary = await EmployeeSalaryModel.insertEmployeeSalary(objSalary);

            if (resultFromSalary === false) {

                return { status: false }
            } else {
                return { status: true, data: employeeID }
            }

        }

    }

    /**
    * modify employee information to the database, doesn't have sort because its handled differently
    * @param {Number} employeeID id of the salary
    * @param {Number} obj.salaryID salary id
    * @param {String} obj.employeeNo employee number
    * @param {String} obj.firstName first name of employee
    * @param {String} obj.middleName middle name of employee
    * @param {String} obj.lastName last name of employee
    * @param {Number} obj.sex sex of employee
    * @param {Number} obj.contactNo contact number of employee
    * @param {String} obj.hireDate hire date of employee
    * @param {String} obj.birthDate birthdate of employee
    * @param {Number} obj.employeePositionID employee position ID
    * @param {Number} obj.employeeDepartmentID employee department ID
    * @param {Number} obj.salary salary on employee salary table
    * @param {String} obj.startedDate started date of employee salary
    * @param {String} obj.untilDate until date of employee salary
    * @return {Object} result
    * @return {Number} result.insertId page id of last inserted
    */
    static async modifyEmployeeComplete(employeeID, {
        employeeSalaryID,
        employeeNo,
        firstName,
        middleName,
        lastName,
        sex,
        contactNo,
        hireDate,
        birthDate,
        employeePositionID,
        employeeDepartmentID,
        salary,
        startedDate,
        untilDate
    }) {

        let obj = {
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
        };

        let resultEmployee = await EmployeeModel.modifyEmployee(obj);

        if (resultEmployee !== false) {

            let objSalary = {
                salary,
                startedDate,
                untilDate,
                employeeID
            };

            let resultFromSalary;

            // if just in case the salary row doesn't exist yet, like getting deleted independently, then perform an add
            if (employeeSalaryID === undefined) {
                resultFromSalary = await EmployeeSalaryModel.insertEmployeeSalary(objSalary);

            } else {
                objSalary.employeeSalaryID = employeeSalaryID;
                resultFromSalary = await EmployeeSalaryModel.modifyEmployeeSalary(objSalary);
            }

            if (resultEmployee === false) {
                return { status: false }
            } else {
                return { status: true, data: resultEmployee.insertId }
            }

        }

    }

    /**
     * get all employee rows
     * @param {Object} obj - An object.
     * @param {String} [obj.page] current page, must be greater than 0
     * @param {String} [obj.limit] limit count of rows, greater than 0
     * @param {String} [obj.sortBy] column used for sort
     * @param {String} [obj.order] ASC or DESC
     * @return employeeArr all rows of employee
     */
    static async getAllEmployee({ page, limit, sortBy, order, filter }) {

        if ((!!page && page > 0) && (!limit || !(limit > 0))) {
            return { status: false }
        } else if ((!!limit && limit > 0) && (!page || !(page > 0))) {
            return { status: false }
        }

        if (sortBy) {
            if (order === "DESC") {
                order = "DESC";
            } else {
                order = "ASC";
            }
        }

        let isPaged = (!!page && page > 0) && (!!limit && limit > 0); // for pagination

        const startIndex = isPaged ? (page - 1) * limit : false;

        let employeeArr = await EmployeeModel.getAll({
            startIndex: startIndex,
            limit: limit,
            sortBy: sortBy,
            order: order,
            filter: filter
        });

        if (employeeArr) {

            return { status: true, data: employeeArr }

        } else {
            return { status: false }
        }

    }

    /**
     * get employee info by employee id
     * @param {String} id employee id
     * @return one row of employee
     */
    static async getEmployeeById(id) {
        let ret = await EmployeeModel.getById(id);

        if (ret.length) {
            return { status: true, data: ret[0] }

        } else {
            return { status: false }
        }

    }

    /**
     * get total count of employee rows
     * @return count of all rows
     */
    static async getAllEmployeeCount({ filter }) {

        const employeeCount = await EmployeeModel.getAllCount({ filter });

        if (employeeCount.length) {
            return { status: true, data: employeeCount[0] }
        } else {
            return { status: false }
        }


    }
}


module.exports = EmployeeService;