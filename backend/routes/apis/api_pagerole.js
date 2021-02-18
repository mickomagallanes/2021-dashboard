"use strict";
const PageRoleService = require('../../services/PageRoleService.js');

const utils = require('../../utils/session.js');
const express = require('express');
const router = express.Router();

router.post('/authorize', async function (req, res, next) {

    if (req.session.userData) {
        let userId = req.session.userData.userid;
        let pagePath = req.body.pagepath;

        let resp = await PageRoleService.getPageRole(userId, pagePath);

        if (resp.status) {

            res.json({ "status": true, "msg": "User is authorized", "priv": resp.priv });
        } else {

            res.json({ "status": false, "msg": "Unauthorized!" });
        }

    } else {

        utils.clearCookie(res);
        res.json({ "status": false, "msg": "Unauthorized!" });
    }

});
module.exports = router;