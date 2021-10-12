const mysql_conn = require("./db.js");
const { PRIVILEGES } = require('../utils/constants.js');
const CRUDModel = require("./CRUDModel.js");

"use strict";

const tableName = "Routes";
const primaryKey = "RouteID";

const crudModel = new CRUDModel(tableName, primaryKey)

class RouteModel {

    constructor() {

    }

    /**
       * inserts new route in the database
       * @param {Object} obj - An object.
       * @param {String} obj.routeName name of the route
       * @param {String} obj.routePath path of route
       * @return {Object} result
       * @return {Number} result.insertId route id of last inserted
       */
    static async insertRoute({ routeName, routePath }) {
        const stmt = `INSERT INTO Routes (RouteName, RoutePath) VALUES (?, ?)`;
        try {
            const result = await mysql_conn.query(stmt, [routeName, routePath]);
            return result;

        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
     * modify route information to the database
     * @param {Object} obj - An object.
     * @param {String} obj.routeID id of the route
     * @param {String} obj.routeName name of the route
     * @param {String} obj.routePath path of route
     * @return {Object} result
     * @return {Number} result.insertId route id of last inserted
     */
    static async modifyRoute({ routeID, routeName, routePath }) {
        let whereParams = [routeID];
        let setObj = {};
        let stmtWhere = ` WHERE RouteID = ?`

        if (routeName !== undefined) {
            setObj.RouteName = routeName
        }

        if (routePath !== undefined) {
            setObj.RoutePath = routePath
        }

        try {
            const result = await mysql_conn.update("Routes", setObj, stmtWhere, whereParams);
            return result;

        } catch (err) {
            console.error(err);
            return false;
        }
    }

}

RouteModel.crud = crudModel;

module.exports = RouteModel;