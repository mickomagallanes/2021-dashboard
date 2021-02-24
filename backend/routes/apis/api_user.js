"use strict";
const UserService = require('../../services/UserService.js');

const utils = require('../../utils/session.js');
const { userInsertSchema, userLoginSchema } = require('../../middlewares/validator.js');
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

router.get('/get/:id', async function (req, res, next) {
    let result = await UserService.getUserById(req.params.id);
    if (result === false) {
        res.sendStatus(403);
    } else {
        res.json({ "status": true, "data": result });
    }
});

router.post('/insert', userInsertSchema, async function (req, res, next) {

    // insert username, password and role id
    let result = await UserService.insertUser(req.body);
    if (result === false) {
        res.sendStatus(403);
    } else {
        res.json({ "status": true, "msg": "Success" });
    }
});

router.post('/login', userLoginSchema, async function (req, res, next) {

    // console.log(req.signedCookies['connect.sid']);
    // console.log(req.sessionID + " sessionID");
    // console.log(req.session.userData);
    if (req.session.userData) {

        res.json({ "status": false, "msg": "Already logged in!" });
    } else {
        utils.clearCookie(res);

        // check if user credentials are true
        let result = await UserService.loginUser(req.body);

        if (result.status === false) {
            res.json({ "status": false, "msg": "Credentials is incorrect" });
        } else {
            req.session.userData = result.data;

            res.json({ "status": true, "msg": "Login successful" });
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