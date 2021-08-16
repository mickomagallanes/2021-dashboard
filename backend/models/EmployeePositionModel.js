const mysql_conn = require("./db.js");
const { PRIVILEGES } = require('../utils/constants.js');
const GettersModel = require("./GettersModel.js");
const DeleteModel = require("./DeleteModel.js");

"use strict";

const tableName = "EmployeePositions";
const primaryKey = "EmployeePositionID";
const getterModel = new GettersModel(tableName, primaryKey);
const deleteModel = new DeleteModel(tableName, primaryKey);

class EmployeePositionModel {

    constructor() {

    }

    /**
       * inserts new employeePosition in the database
       * @param {Object} obj - An object.
       * @param {String} obj.positionName name of the employeePosition
       * @return {Object} result
       * @return {Number} result.insertId employeePosition id of last inserted
       */
    static async insertEmployeePosition({ positionName }) {
        const stmt = `INSERT INTO EmployeePositions (PositionName) VALUES (?)`;
        try {
            const result = await mysql_conn.query(stmt, [positionName]);
            return result;

        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
     * modify employeePosition information to the database
     * @param {Object} obj - An object.
     * @param {String} obj.employeePositionID id of the employeePosition
     * @param {String} obj.positionName name of the employeePosition
     * @return {Object} result
     * @return {Number} result.insertId employeePosition id of last inserted
     */
    static async modifyEmployeePosition({ employeePositionID, positionName }) {
        let whereParams = [employeePositionID];
        let setObj = {};
        let stmtWhere = ` WHERE EmployeePositionID = ?`

        if (positionName !== undefined) {
            setObj.PositionName = positionName
        }

        try {
            const result = await mysql_conn.update("EmployeePositions", setObj, stmtWhere, whereParams);
            return result;

        } catch (err) {
            console.error(err);
            return false;
        }
    }

}

EmployeePositionModel.deleteModel = deleteModel;
EmployeePositionModel.getterModel = getterModel;

module.exports = EmployeePositionModel;