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

            return result;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
    * insert if RouteID + RoleID does not exist, update if it exists
    * @param {Array} valueArr format must be "[[route1, ...], [route2, ...]]"
    * @return {Number} result.insertId user id of last inserted
    */
    static async postRouteRoleData(valueArr) {
        const stmt = `INSERT INTO RouteRoles
                            (RouteID, RoleID, PrivilegeID)
                        VALUES
                            ? AS alias
                        ON DUPLICATE KEY UPDATE PrivilegeID = alias.PrivilegeID;`;
        try {
            const result = await mysql_conn.query(stmt, [valueArr]);
            return result;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
     * get all routes with optional role name if the row matched the role
     * @param {Number} roleId id of the role
     * @return {Array} result
     */
    static async getAllRoutesLeftRole(roleId) {
        const stmt = `SELECT 
                        a.RouteID, a.RouteName, a.RoutePath, c.RoleName, c.RoleID, d.PrivilegeName, d.PrivilegeID
                      FROM
                        Routes AS a
                            LEFT JOIN
                        (SELECT DISTINCT
                            PrivilegeID, RouteID, RoleID
                        FROM
                            RouteRoles
                        WHERE
                            RoleId = ?) AS b ON a.RouteID = b.RouteID
                            LEFT JOIN
                        Roles AS c ON b.RoleID = c.RoleID AND c.RoleID = ? 
                            LEFT JOIN Privileges as d ON b.PrivilegeID = d.PrivilegeID;`

        try {
            const result = await mysql_conn.query(stmt, [roleId, roleId]);

            return result;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

}


module.exports = RouteRoleModel;