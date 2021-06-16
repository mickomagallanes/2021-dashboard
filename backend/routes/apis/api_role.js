"use strict";
const RoleService = require('../../services/RoleService.js');

const { checkSession, authorizeReadRoute } = require('../../middlewares/routesauth.js');
const express = require('express');
const router = express.Router();

/**
 * get all roles
 */
router.get('/get/all', checkSession, async function (req, res, next) {

    let result = await RoleService.getAllRoles();

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting all rows" });
    } else {
        res.json({ "status": true, "msg": "Successful getting all rows", "data": result.data });
    }

});

/**
 * get count of all role rows
 */
router.get('/get/all/count', [checkSession, authorizeReadRoute], async function (req, res, next) {

    let result = await RoleService.getAllCount();
    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting count" });
    } else {
        res.json({ "status": true, "msg": "Successful getting count", "data": result.data });
    }
});
module.exports = router;