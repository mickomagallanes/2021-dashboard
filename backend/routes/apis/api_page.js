"use strict";
const PageService = require('../../services/PageService.js');

const utils = require('../../utils/session.js');
const express = require('express');
const router = express.Router();
const { checkSession, authorizeWriteRoute, authorizeReadRoute } = require('../../middlewares/routesauth.js');
const {
    pageGetAllSchema,
    pageInsertSchema,
    pageModifySchema
} = require('../../middlewares/validator.js');

/**
 * get pages based on the logged-in user role
 *
 */
router.get('/get/by/session', [checkSession], async function (req, res, next) {

    let userId = req.session.userData.userid;

    let resp = await PageService.getPagesBySession(userId);

    if (resp.status) {

        res.json({ "status": true, "msg": "Successfully fetched pages", "data": resp.data });
    } else {

        res.json({ "status": false, "msg": "Failed getting pages!" });
    }

});

/**
 * get count of all page rows
 */
router.get('/get/all/count', [checkSession, authorizeReadRoute], async function (req, res, next) {

    let result = await PageService.getAllPageCount();

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting count" });
    } else {
        res.json({ "status": true, "msg": "Successful getting count", "data": result.data });
    }
});

/**
 * get all page rows
 *
 */
router.get('/get/all', [checkSession, pageGetAllSchema, authorizeReadRoute], async function (req, res, next) {

    let resp = await PageService.getAllPages(req.query);

    if (resp.status !== false) {

        res.json({ "status": true, "msg": "Successfully fetched pages", "data": resp.data });
    } else {

        res.json({ "status": false, "msg": "Failed getting pages!" });
    }

});

/**
 * get page row by page id
 * @param {number} req.params.id id of page
 */
router.get('/get/by/:id', [checkSession, authorizeReadRoute], async function (req, res, next) {

    let result = await PageService.getPageById(req.params.id);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting row by id" });
    } else {
        res.json({ "status": true, "msg": "Successful getting row by id", "data": result.data });
    }
});

// insert new page
// returns insertId of page
router.post('/insert', [checkSession, pageInsertSchema, authorizeWriteRoute], async function (req, res, next) {

    // insert role information
    let result = await PageService.insertPage(req.body);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed inserting" });
    } else {
        res.json({ "status": true, "msg": "Successful inserting", "id": result.data });
    }
});

// edit page
router.put('/modify/:id', [checkSession, pageModifySchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await PageService.modifyPage(req.params.id, req.body);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed modification" });
    } else {
        res.json({ "status": true, "msg": "Successful modification", "id": result.data });
    }
});


module.exports = router;