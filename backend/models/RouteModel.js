const mysql_conn = require("./db.js");
const { PRIVILEGES } = require('../utils/constants.js');
const GettersModel = require("./GettersModel.js");

"use strict";

const tableName = "Routes";
const primaryKey = "RouteID";
const getterModel = new GettersModel(tableName, primaryKey);

class RouteModel {

    constructor() {

    }

    /**
      * deleted route rows in the database
      * @param {String} routeID id of the route
      */
    static async deleteRoute(routeID) {

        try {
            const result = await mysql_conn.delete("Routes", "where RouteID=?", [routeID]);
            return result;

        } catch (err) {
            console.error(err);
            return false;
        }
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


Object.setPrototypeOf(RouteModel, getterModel);
module.exports = RouteModel;