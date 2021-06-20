const mysql_conn = require("./db.js");

"use strict";

class RouteRoleModel {

    constructor() {

    }

    /**
     * get privilege of user on an specified route path
     * @param {Number} userId id of the user
     * @param {String} routePath main original path of the route, eg: "/user", not: "/user/:id"
     * @return {Array} result, length = 1
     */

    static async getRoutePrivByUser(userId, routePath) {
        const stmt = `SELECT a.RouteRolesID, d.PrivilegeName FROM RouteRoles as a INNER JOIN Routes as b ON a.RouteID = b.RouteID 
        INNER JOIN Users as c ON a.RoleID = c.RoleID INNER JOIN Privileges as d ON a.PrivilegeID = d.PrivilegeID 
        WHERE UserID = ? AND RoutePath = ?;`;

        try {
            const result = await mysql_conn.query(stmt, [userId, routePath]);
            console.log(result)
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    static async postRouteRoleData() {
        const stmt = `INSERT INTO RouteRoles
                        (RouteID, RoleID, Privilege)
                    VALUES
                        (3, 1, "RW"),
                        (3, 2, "R")
                    ON DUPLICATE KEY UPDATE Privilege = "RW"`
    }

}


module.exports = RouteRoleModel;