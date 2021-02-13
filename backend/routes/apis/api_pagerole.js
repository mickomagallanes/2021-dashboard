"use strict";
const PageRoleService = require('../../services/PageRoleService.js');

const express = require('express');
const router = express.Router();

router.post('/authorize', async function (req, res, next) {
    // TODO: get user roleid and check if the page allows the role
    if (req.signedCookies['connect.sid'] && req.signedCookies['connect.sid'] === req.sessionID) {
        let userId = req.session.userData.userid;
        let pagePath = req.body.pagepath;

        let resp = await PageRoleService.getPageRole(userId, pagePath);

        if (resp.status) {
            console.log("success")
            res.json({ "status": true, "msg": "User is authorized" });
        } else {
            console.log("fail 1")
            res.json({ "status": false, "msg": "Unauthorized!" });
        }

    } else {
        console.log("fail 2")
        res.clearCookie('connect.sid');
        res.json({ "status": false, "msg": "Unauthorized!" });
    }

});
module.exports = router;