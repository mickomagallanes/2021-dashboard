"use strict";
const PageService = require('../../services/PageService.js');

const utils = require('../../utils/session.js');
const express = require('express');
const router = express.Router();
const { checkSession, authorizeWriteRoute, authorizeReadRoute } = require('../../middlewares/routesauth.js');

/**
 * get pages based on the logged-in user role
 *
 */
router.get('/getPagesBySession', [checkSession], async function (req, res, next) {

    let userId = req.session.userData.userid;

    let resp = await PageService.getPagesBySession(userId);

    if (resp.status) {

        res.json({ "status": true, "msg": "Successfully fetched pages", "data": resp.data });
    } else {

        res.json({ "status": false, "msg": "Failed getting pages!" });
    }

});
module.exports = router;