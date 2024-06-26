const RouteRoleModel = require('../models/RouteRoleModel.js');
const { mapArr } = require('../utils/looping.js');

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
     * get all routes with optional role name if the row matched the role
     * @param {Number} roleId id of the role
     */
    static async getAllRoutesLeftRole(roleId) {
        let routesArr = await RouteRoleModel.getAllRoutesLeftRole(roleId);

        if (routesArr) {
            return { status: true, data: routesArr }
        }
        return { status: false }
    }

    /**
     * insert if RouteID + RoleID does not exist, update if it exists
     * @param {Array} routeRolesArr
     */
    static async postRouteRoleData(routeRolesArr) {
        let valueArr;

        try {
            valueArr = await mapArr(routeRolesArr, e => { return [e.RouteID, e.RoleID, e.PrivilegeID] });
        } catch (err) {
            return { status: true }
        }


        let result = await RouteRoleModel.postRouteRoleData(valueArr);

        if (result !== false) {
            return { status: true }
        }
        return { status: false }
    }

}


module.exports = RouteRoleService;