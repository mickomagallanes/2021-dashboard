const mysql_conn = require("./db.js");

"use strict";

class RouteRoleModel {

    constructor() {

    }

    /**
     * check if user role has privilege on the route api
     * @param {Number} userId id of the user
     * @param {String} routePath main original path of the route, eg: "/user", not: "/user/:id"
     */

    static async getRouteRole(userId, routePath) {
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