"use strict";
const SubPageService = require('../../services/SubPageService.js');

const express = require('express');
const router = express.Router();
const { checkSession, authorizeWriteRoute, authorizeReadRoute } = require('../../middlewares/routesauth.js');

/**
 * get pages based on the logged-in user role
 *
 */
router.get('/getSubPagesBySession', [checkSession], async function (req, res, next) {

    let userId = req.session.userData.userid;

    let resp = await SubPageService.getSubPagesBySession(userId);

    if (resp.status !== false) {

        res.json({ "status": true, "msg": "Successfully fetched pages", "data": resp.data });
    } else {

        res.json({ "status": false, "msg": "Unauthorized!" });
    }

});
module.exports = router;