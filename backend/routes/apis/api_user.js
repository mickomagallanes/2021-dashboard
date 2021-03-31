"use strict";
const UserService = require('../../services/UserService.js');

const utils = require('../../utils/session.js');
const { createSingleImageUpload } = require('../../utils/imageupload.js');
const { checkSession, authorizeWriteRoute, authorizeReadRoute } = require('../../middlewares/routesauth.js');
const { userInsertSchema, userLoginSchema, userGetAllSchema, userModifySchema } = require('../../middlewares/validator.js');
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

/**
 * get all user rows
 * @param {number} [req.query.page] page number
 * @param {number} [req.query.limit] row limit per page
 */
router.get('/get/all', [checkSession, userGetAllSchema, authorizeReadRoute], async function (req, res, next) {

    let result = await UserService.getAllUser(req.query);
    if (result === false) {
        res.sendStatus(403);
    } else {
        res.json({ "status": true, "data": result });
    }
});

/**
 * get all user rows
 * @param {number} req.params.id id of user
 */
router.get('/get/:id', [checkSession, authorizeReadRoute], async function (req, res, next) {
    let result = await UserService.getUserById(req.params.id);
    if (result === false) {
        res.json({ "status": false });
    } else {
        res.json({ "status": true, "data": result });
    }
});

/**
 * get  count of all user rows
 */
router.get('/get/all/count', [checkSession, authorizeReadRoute], async function (req, res, next) {

    let result = await UserService.getAllCount();
    if (result === false) {
        res.sendStatus(403);
    } else {
        res.json({ "status": true, "data": result });
    }
});

// insert new user, only handles text data and not image. 
// returns insertId of user, for image upload purpose
router.post('/insert', [checkSession, userInsertSchema, authorizeWriteRoute], async function (req, res, next) {

    // insert username, password and role id
    let result = await UserService.insertUser(req.body);

    if (result === false) {
        res.sendStatus(403);
    } else {
        res.json({ "status": true, "msg": "Success", "id": result.insertId });
    }
});

// edit user text data, doesn't handle the image
router.put('/modify', [checkSession, userModifySchema, authorizeWriteRoute], async function (req, res, next) {

    // insert username, password and role id
    let result = await UserService.modifyUser(req.body);
    if (result === false) {
        res.sendStatus(403);
    } else {
        res.json({ "status": true, "msg": "Success", "id": result.insertId });
    }
});

router.post('/login', userLoginSchema, async function (req, res, next) {

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

// check if user cookie exists
router.get('/cookie', async function (req, res, next) {

    if (req.session.userData) {

        res.json({ "status": true, "msg": "Cookie exists" });
    } else {
        utils.clearCookie(res);
        res.json({ "status": false, "msg": "Cookie does not exist" });

    }

});

//TODO: delete current image stored on user row if replaced by new


// accepts user id and the image within multipart form
// image name must be "userImgUpload"
router.post("/upload/img", [checkSession, authorizeWriteRoute, createSingleImageUpload("userImgUpload")], async function (req, res, next) {

    let fileName = req.file.filename;
    let result = await UserService.modifyUser({ "imagePath": fileName, "userid": req.body.id });

    if (result === false) {
        res.json({ "status": false, "msg": "Error on inserting user image filename occurred" });
    } else {
        let filePath = `/public/uploads/${fileName}`;

        res.json({ "status": true, "msg": "Success", "path": filePath });
    }

});

module.exports = router;