const mysql_conn = require("./db.js");

"use strict";

class RouteRoleModel {

    constructor() {

    }

    /**
     * get a row of routeRole based on the current user id
     * @param {Number} userId id of the user
     * @param {String} routePath main original path of the route, eg: "/user", not: "/user/:id"
     * @return {Array} result
     */

    static async getRoutePrivByUser(userId, routePath) {
        const stmt = `SELECT a.RouteRolesID, a.Privilege FROM RouteRoles as a INNER JOIN Routes as b ON a.RouteID = b.RouteID 
        INNER JOIN Users as c ON a.RoleID = c.RoleID WHERE UserID = ? AND RoutePath = ?;`;

        try {
            const result = await mysql_conn.query(stmt, [userId, routePath]);
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

}


module.exports = RouteRoleModel;