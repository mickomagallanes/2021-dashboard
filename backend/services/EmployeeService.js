const EmployeeSalaryModel = require('../models/EmployeeSalaryModel.js');
const EmployeeModel = require('../models/EmployeeModel.js');

"use strict";

class EmployeeService {

    constructor() {

    }

    /*************************** Employee Salaries *************************************/
    /**
     * deleted employeeSalary rows in the database
     * @param {String} employeeSalaryID id of the salary
     */
    static async deleteEmployeeSalary(employeeSalaryID) {

        let ret = await EmployeeSalaryModel.deleteEmployeeSalary(employeeSalaryID);

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
    static async getAllEmployeeSalaries({ page, limit, sortBy, order }) {

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

        let employeeSalaryArr;
        if (startIndex === false) {
            employeeSalaryArr = await EmployeeSalaryModel.getAll(sortBy, order);
        } else {
            employeeSalaryArr = await EmployeeSalaryModel.getAllPaged({ startIndex: startIndex, limit: limit, sortBy: sortBy, order: order });
        }

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
     * get total count of employeeSalary rows
     * @return count of all rows
     */
    static async getAllEmployeeSalaryCount() {

        const employeeSalaryCount = await EmployeeSalaryModel.getAllCount();

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

        let ret = await EmployeeModel.deleteEmployee(employeeID);

        if (ret == false) {
            return { status: false }
        } else {
            return { status: true }
        }

    }

    /**
     * inserts new employee in the database
     * @param {Object} obj - An object.
     * @param {String} obj.employeeName name of the employee
     * @return {Object} result
     * @return {Number} result.insertId role id of last inserted
     */
    static async insertEmployee({ employeeName }) {

        const obj = {
            employeeName: employeeName
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
    * @param {String} [obj.employeeName] name of the employee
    * @return {Object} result
    * @return {Number} result.insertId employee id of last inserted
    */
    static async modifyEmployee(employeeID, { employeeName }) {

        let obj = {
            employeeID: employeeID,
            employeeName: employeeName
        };

        let ret = await EmployeeModel.modifyEmployee(obj);
        if (ret == false) {
            return { status: false }
        } else {
            return { status: true }
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
    static async getAllEmployee({ page, limit, sortBy, order }) {

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

        let employeeArr;
        if (startIndex === false) {
            employeeArr = await EmployeeModel.getAll(sortBy, order);
        } else {
            employeeArr = await EmployeeModel.getAllPaged({ startIndex: startIndex, limit: limit, sortBy: sortBy, order: order });
        }

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
    static async getAllEmployeeCount() {

        const employeeCount = await EmployeeModel.getAllCount();

        if (employeeCount.length) {
            return { status: true, data: employeeCount[0] }
        } else {
            return { status: false }
        }


    }
}


module.exports = EmployeeService;