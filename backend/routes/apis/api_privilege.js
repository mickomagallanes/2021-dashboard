"use strict";
const PrivilegeService = require('../../services/PrivilegeService.js');

const { checkSession, authorizeReadRoute } = require('../../middlewares/routesauth.js');
const express = require('express');
const router = express.Router();

/**
 * get all privileges
 */
router.get('/get/all', checkSession, async function (req, res, next) {

    let result = await PrivilegeService.getAllPrivileges();

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting all rows" });
    } else {
        res.json({ "status": true, "msg": "Successful getting all rows", "data": result.data });
    }

});

module.exports = router;