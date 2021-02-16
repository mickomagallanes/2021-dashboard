"use strict";
const UserService = require('../../services/UserService.js');

const utils = require('../../utils/session.js');
const express = require('express');
const router = express.Router();

router.get('/get/all', async function (req, res, next) {

    let result = await UserService.getAllUser();
    if (result === false) {
        res.sendStatus(403);
    } else {
        res.json({ "status": true, "data": result });
    }
});

router.post('/insert', async function (req, res, next) {

    let body = req.body, uname = body.username, pwd = body.password, role = body.roleid;

    // insert username, password and role id
    let result = await UserService.insertUser(uname, pwd, role);
    if (result === false) {
        res.sendStatus(403);
    } else {
        res.json({ "status": true, "msg": "Success" });
    }
});

router.post('/login', async function (req, res, next) {

    // console.log(req.signedCookies['connect.sid']);
    // console.log(req.sessionID + " sessionID");
    // console.log(req.session.userData);
    if (req.session.userData) {

        res.json({ "status": false, "msg": "Already logged in!" });
    } else {
        utils.clearCookie(res);
        let body = req.body, uname = body.username, pwd = body.password;

        // check if user credentials are true
        let result = await UserService.loginUser(uname, pwd);

        if (result.status === false) {
            res.json({ "status": false, "msg": "Credentials is incorrect" });
        } else {
            req.session.userData = result.data;

            res.json({ "status": true, "msg": "Login successful", "redirect": "/" });
        }
    }

});

router.get('/cookie', async function (req, res, next) {

    if (req.session.userData) {
        res.json({ "status": true, "msg": "Cookie exists" });
    } else {
        utils.clearCookie(res);
        res.json({ "status": false, "msg": "Cookie does not exist" });

    }

});

module.exports = router;