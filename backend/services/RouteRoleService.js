const RouteRoleModel = require('../models/RouteRoleModel.js');

"use strict";

class RouteRoleService {

    constructor() {

    }

    /**
     * check if user role has privilege on the page
     * @param {Number} userId id of the user
     * @param {String} pagePath path of the page, eg: "/user"
     */
    static async getRoutePrivBySession(userId, pagePath) {
        let routeRoleObj = await RouteRoleModel.getRoutePrivByUser(userId, pagePath);

        if (routeRoleObj.length) {
            return { status: true, data: routeRoleObj[0].PrivilegeName }
        }
        return { status: false }
    }

    /**
    *  get pages based on logged-in user role
    * @param {Number} userId id of the user
    */
    static async getRoutesBySession(userId) {
        let pagesArr = await RouteRoleModel.getPagesByUser(userId);

        if (pagesArr.length) {
            return { status: true, data: pagesArr }
        }
        return { status: false }
    }

}


module.exports = RouteRoleService;