"use strict";
const SubPageService = require('../../services/SubPageService.js');

const express = require('express');
const router = express.Router();
const { checkSession, authorizeWriteRoute, authorizeReadRoute } = require('../../middlewares/routesauth.js');
const {
    subPageGetAllSchema,
    subPageInsertSchema,
    subPageModifySchema,
    subPageDeleteSchema
} = require('../../middlewares/validator.js');

/**
 * get pages based on the logged-in user role
 *
 */
router.get('/get/by/session', [checkSession], async function (req, res, next) {

    let userId = req.session.userData.userid;

    let resp = await SubPageService.getSubPagesBySession(userId);

    if (resp.status !== false) {

        res.json({ "status": true, "msg": "Successfully fetched subpages", "data": resp.data });
    } else {

        res.json({ "status": false, "msg": "Failed getting subpages!" });
    }

});

// insert new sub page
// returns insertId of subPage
router.post('/insert', [checkSession, subPageInsertSchema, authorizeWriteRoute], async function (req, res, next) {

    // insert role information
    let result = await SubPageService.insertSubPage(req.body);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed inserting" });
    } else {
        res.json({ "status": true, "msg": "Successful inserting", "id": result.data });
    }
});

// edit subPage
router.put('/modify/:id', [checkSession, subPageModifySchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await SubPageService.modifySubPage(req.params.id, req.body);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed modification" });
    } else {
        res.json({ "status": true, "msg": "Successful modification", "id": result.data });
    }
});

/**
 * get count of all subPage rows
 */
router.get('/get/all/count', [checkSession, authorizeReadRoute], async function (req, res, next) {

    let result = await SubPageService.getAllSubPageCount();

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting count" });
    } else {
        res.json({ "status": true, "msg": "Successful getting count", "data": result.data });
    }
});

/**
 * get all subPage rows
 *
 */
router.get('/get/all', [checkSession, subPageGetAllSchema, authorizeReadRoute], async function (req, res, next) {

    let resp = await SubPageService.getAllSubPages(req.query);

    if (resp.status !== false) {

        res.json({ "status": true, "msg": "Successfully fetched pages", "data": resp.data });
    } else {

        res.json({ "status": false, "msg": "Failed getting subPages!" });
    }

});

/**
 * get subPage row by subPage id
 * @param {number} req.params.id id of subPage
 */
router.get('/get/by/:id', [checkSession, authorizeReadRoute], async function (req, res, next) {

    let result = await SubPageService.getSubPageById(req.params.id);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting row by id" });
    } else {
        res.json({ "status": true, "msg": "Successful getting row by id", "data": result.data });
    }
});

// delete menu, also deletes children data
router.delete('/delete/:id', [checkSession, subPageDeleteSchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await SubPageService.deleteSubPage(req.params.id);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed deleting sub page" });
    } else {
        res.json({ "status": true, "msg": "Deleted sub page successfully" });
    }
});

module.exports = router;