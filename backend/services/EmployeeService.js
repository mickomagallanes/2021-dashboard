const EmployeeSalaryModel = require('../models/EmployeeSalaryModel.js');

"use strict";

class EmployeeService {

    constructor() {

    }

    /*************************** Parent Menu *************************************/
    /**
     * deleted employeeSalary rows in the database
     * @param {String} employeeSalaryID id of the menu
     */
    static async deleteEmployeeSalary(employeeSalaryID) {

        let ret = await EmployeeSalaryModel.deleteEmployee(employeeSalaryID);

        if (ret == false) {
            return { status: false }
        } else {
            return { status: true }
        }

    }

    /**
     * inserts new employeeSalary in the database
     * @param {Object} obj - An object.
     * @param {String} obj.employeeSalaryName name of the employeeSalary
     * @return {Object} result
     * @return {Number} result.insertId role id of last inserted
     */
    static async insertEmployeeSalary({ employeeSalaryName }) {

        const obj = {
            employeeSalaryName: employeeSalaryName
        }
        let ret = await EmployeeSalaryModel.insertEmployee(obj);

        if (ret === false) {
            return { status: false }
        } else {

            const obj2 = {
                employeeSalaryID: ret.insertId,
                EmployeeSalariesort: ret.insertId
            };

            let ret2 = await EmployeeSalaryModel.modifyEmployee(obj2);

            if (ret2 === false) {
                return { status: false }
            } else {
                return { status: true, data: ret.insertId }
            }

        }

    }

    /**
    * modify employeeSalary information to the database, doesn't have sort because its handled differently
    * @param {String} employeeSalaryID id of the employeeSalary
    * @param {Object} obj - An object.
    * @param {String} [obj.employeeSalaryName] name of the employeeSalary
    * @return {Object} result
    * @return {Number} result.insertId employeeSalary id of last inserted
    */
    static async modifyEmployeeSalary(employeeSalaryID, { employeeSalaryName }) {

        let obj = {
            employeeSalaryID: employeeSalaryID,
            employeeSalaryName: employeeSalaryName
        };

        let ret = await EmployeeSalaryModel.modifyEmployee(obj);
        if (ret == false) {
            return { status: false }
        } else {
            return { status: true, data: ret.insertId }
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
}


module.exports = EmployeeService;