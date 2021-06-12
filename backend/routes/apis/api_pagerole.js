"use strict";
const PageRoleService = require('../../services/PageRoleService.js');

const utils = require('../../utils/session.js');
const express = require('express');
const router = express.Router();
const { checkSession, authorizeWriteRoute, authorizeReadRoute } = require('../../middlewares/routesauth.js');

/**
 * check if user is authorized to access frontend page
 * @param {String} req.body.pagepath path of frontend page
 */
router.post('/authorize', [checkSession], async function (req, res, next) {

    let userId = req.session.userData.userid;
    let pagePath = req.body.pagepath;

    let resp = await PageRoleService.getPagePrivBySession(userId, pagePath);

    if (resp.status) {

        res.json({ "status": true, "msg": "User is authorized", "priv": resp.priv });
    } else {

        res.json({ "status": false, "msg": "Unauthorized!" });
    }


});

/**
 * get pages based on the logged-in user role
 *
 */
router.get('/getPagesBySession', [checkSession], async function (req, res, next) {

    let userId = req.session.userData.userid;

    let resp = await PageRoleService.getPagesBySession(userId);

    if (resp !== false) {

        res.json({ "status": true, "msg": "Successfully fetched pages", "data": resp });
    } else {

        res.json({ "status": false, "msg": "Unauthorized!" });
    }

});
module.exports = router;