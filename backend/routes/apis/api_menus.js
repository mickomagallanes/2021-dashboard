"use strict";
const MenusService = require('../../services/MenusService.js');

const express = require('express');
const router = express.Router();
const { checkSession, authorizeWriteRoute, authorizeReadRoute } = require('../../middlewares/routesauth.js');

/**
 * get pages based on the logged-in user role
 *
 */
router.get('/getMenusByRole', [checkSession], async function (req, res, next) {

    let userId = req.session.userData.userid;

    let resp = await MenusService.getMenusByRole(userId);

    if (resp.status !== false) {

        res.json({ "status": true, "msg": "Successfully fetched pages", "data": resp.data });
    } else {

        res.json({ "status": false, "msg": "Unauthorized!" });
    }

});
module.exports = router;