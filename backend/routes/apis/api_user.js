"use strict";
const UserService = require('../../services/UserService.js');

const express = require('express');
const router = express.Router();

router.post('/insert', async function (req, res, next) {

    let body = req.body, uname = body.username, pwd = body.password, role = body.roleid;

    // insert username, password and role id
    let result = await UserService.insertUser(uname, pwd, role);
    if (result === false) {
        res.sendStatus(403);
    } else {
        res.json({ status: 1 });
    }
});

router.post('/login', async function (req, res, next) {
    console.log(req.signedCookies['connect.sid']);
    console.log(req.sessionID + " sessionID");
    console.log(req.session.userData);
    if (req.signedCookies['connect.sid'] && req.signedCookies['connect.sid'] === req.sessionID) {
        console.log("failed");
        res.json({ "status": false, "msg": "Already logged in!" });
    } else {
        console.log("success");
        res.clearCookie('connect.sid');

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
    if (req.signedCookies['connect.sid'] && req.signedCookies['connect.sid'] === req.sessionID) {
        res.json({ "status": true, "msg": "Cookie exists" });
    } else {
        res.clearCookie('connect.sid');
        res.json({ "status": false, "msg": "Cookie does not exist" });

    }

});

module.exports = router;