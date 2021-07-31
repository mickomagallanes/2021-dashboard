"use strict";
const UserService = require('../../services/UserService.js');

const utils = require('../../utils/session.js');
const { createSingleImageUpload } = require('../../utils/imageupload.js');
const { checkSession, authorizeWriteRoute, authorizeReadRoute } = require('../../middlewares/routesauth.js');
const { userInsertSchema, userLoginSchema, userGetAllSchema, userModifySchema, userDeleteSchema } = require('../../middlewares/validator.js');
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

/**
 * get all user rows
 */
router.get('/get/all', [checkSession, userGetAllSchema, authorizeReadRoute], async function (req, res, next) {

    let result = await UserService.getAllUser(req.query);
    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting all rows" });
    } else {
        res.json({ "status": true, "msg": "Successful getting all rows", "data": result.data });
    }
});

/**
 * get all user rows
 * @param {number} req.params.id id of user
 */
router.get('/get/by/:id', [checkSession, authorizeReadRoute], async function (req, res, next) {
    let result = await UserService.getUserById(req.params.id);
    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting row by id" });
    } else {
        res.json({ "status": true, "msg": "Successful getting row by id", "data": result.data });
    }
});

/**
 * get  count of all user rows
 */
router.get('/get/all/count', [checkSession, authorizeReadRoute], async function (req, res, next) {

    let result = await UserService.getAllCount();
    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting count" });
    } else {
        res.json({ "status": true, "msg": "Successful getting count", "data": result.data });
    }
});

// delete user, also deletes children data
router.delete('/delete/:id', [checkSession, userDeleteSchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await UserService.deleteUser(req.params.id);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed deleting user" });
    } else {
        res.json({ "status": true, "msg": "Deleted user successfully" });
    }
});

// insert new user, only handles text data and not image. 
// returns insertId of user, for image upload purpose
router.post('/insert', [checkSession, userInsertSchema, authorizeWriteRoute], async function (req, res, next) {

    // insert username, password and role id
    let result = await UserService.insertUser(req.body);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed inserting" });
    } else {
        res.json({ "status": true, "msg": "Successful inserting", "id": result.data });
    }
});

// edit user text data, doesn't handle the image
router.put('/modify/:id', [checkSession, userModifySchema, authorizeWriteRoute], async function (req, res, next) {

    // edit user infos
    let result = await UserService.modifyUser(req.params.id, req.body);
    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed modification" });
    } else {
        res.json({ "status": true, "msg": "Successful modification", "id": result.data });
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

            res.json({ "status": true, "msg": "Login successful", "data": result.data });
        }
    }

});

router.post('/logout', async function (req, res, next) {
    if (req.session.userData) {
        req.session.destroy();
        utils.clearCookie(res);
        res.json({ "status": true, "msg": "Successfully Logged out" });
    } else {
        res.json({ "status": false, "msg": "Already logged out" });
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

// accepts user id and the image within multipart form
// image name must be "userImgUpload"
router.post("/upload/img", [checkSession, authorizeWriteRoute, createSingleImageUpload("userImgUpload")], async function (req, res, next) {

    let fileName = req.file.filename;
    let userId = req.body.id;

    let result = await UserService.insertImg({ fileName: fileName, userId: userId });

    if (result.status === false) {
        res.json({ "status": false, "msg": "Error on inserting user image filename occurred" });
    } else {
        let filePath = `/public/uploads/${fileName}`;

        res.json({ "status": true, "msg": "Successfully inserted user image", "data": filePath });
    }

});

module.exports = router;