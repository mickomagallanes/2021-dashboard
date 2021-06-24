"use strict";
const RouteRoleService = require('../../services/RouteRoleService.js');

const { checkSession, authorizeReadRoute } = require('../../middlewares/routesauth.js');
const express = require('express');
const router = express.Router();

/**
 * get all roles
 */
router.get('/get/left/:roleId', checkSession, async function (req, res, next) {

    const roleId = req.params.roleId;

    let result = await RouteRoleService.getAllRoutesLeftRole(roleId);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed fetching all rows" });
    } else {
        res.json({ "status": true, "msg": "Successfully fetched all rows", "data": result.data });
    }

});

/**
 * post route role data
 */
router.post('/post/data', checkSession, async function (req, res, next) {

    const routeRolesArr = req.body.routeRoles;

    let result = await RouteRoleService.postRouteRoleData(routeRolesArr);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed posting route roles data" });
    } else {
        res.json({ "status": true, "msg": "Successfully posted Route-Roles data" });
    }

});

module.exports = router;