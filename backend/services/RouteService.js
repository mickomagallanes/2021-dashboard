const RouteModel = require('../models/RouteModel.js');

"use strict";

class RouteService {

    constructor() {

    }

    /**
     * deleted route rows in the database
     * @param {String} routeID id of the route
     */
    static async deleteRoute(routeID) {

        let ret = await RouteModel.crud.deleteRow(routeID);

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
    static async deleteBulkRoute(idArray) {

        let ret = await RouteModel.crud.deleteBulkRows(idArray);

        if (ret == false) {
            return { status: false }
        } else {
            return { status: true }
        }

    }

    /**
     * inserts new route in the database
     * @param {Object} obj - An object.
     * @param {String} obj.routeName name of the  route
     * @param {String} obj.routePath path of route
     * @return {Object} result
     * @return {Number} result.insertId role id of last inserted
     */
    static async insertRoute({ routeName, routePath }) {
        let obj = {
            routeName: routeName,
            routePath: routePath
        };
        let ret = await RouteModel.insertRoute(obj);

        if (ret === false) {

            return { status: false }
        } else {
            return { status: true, data: ret.insertId }
        }

    }

    /**
    * modify route information to the database, doesn't have sort because its handled differently
    * @param {String} routeID id of the route
    * @param {Object} obj - An object.
    * @param {String} obj.routeName name of the route
    * @param {String} obj.routePath path of route
    * @return {Object} result
    * @return {Number} result.insertId route id of last inserted
    */
    static async modifyRoute(routeID, { routeName, routePath }) {

        let obj = {
            routeID: routeID,
            routeName: routeName,
            routePath: routePath
        };

        let ret = await RouteModel.modifyRoute(obj);

        if (ret == false) {
            return { status: false }
        } else {
            return { status: true, data: ret.insertId }
        }

    }

    /**
     * get all route rows
     * @param {Object} obj - An object.
     * @param {String} [obj.route] current page, must be greater than 0
     * @param {String} [obj.limit] limit count of rows, greater than 0
     * @param {String} [obj.sortBy] column used for sort
     * @param {String} [obj.order] ASC or DESC
     * @return routeArr all rows of route
     */
    static async getAllRoutes({ page, limit, sortBy, order, filter }) {

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

        let routeArr = await RouteModel.crud.getAll({
            startIndex: startIndex,
            limit: limit,
            sortBy: sortBy,
            order: order,
            filter: filter
        });

        if (routeArr) {

            return { status: true, data: routeArr }

        } else {
            return { status: false }
        }

    }

    /**
     * get route info by route id
     * @param {String} id route id
     * @return one row of route
     */
    static async getRouteById(id) {
        let ret = await RouteModel.crud.getById(id);

        if (ret.length) {
            return { status: true, data: ret[0] }

        } else {
            return { status: false }
        }

    }

    /**
     * get total count of route rows
     * @return count of all rows
     */
    static async getAllRouteCount({ filter }) {

        const routeCount = await RouteModel.crud.getAllCount({ filter });

        if (routeCount.length) {
            return { status: true, data: routeCount[0] }
        } else {
            return { status: false }
        }


    }

}


module.exports = RouteService;