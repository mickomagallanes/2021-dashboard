"use strict";
const PageService = require('../../services/PageService.js');

const utils = require('../../utils/session.js');
const express = require('express');
const router = express.Router();
const { checkSession, authorizeWriteRoute, authorizeReadRoute } = require('../../middlewares/routesauth.js');
const {
    getAllGeneralSchema,
    pageInsertSchema,
    pageModifySchema,
    pageInsertCompleteSchema,
    pageModifyCompleteSchema,
    deleteGeneralSchema,
    getAllCountGeneralSchema,
    deleteBulkGeneralSchema,
    pageInsertBulkSchema
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
router.get('/get/all/count', [checkSession, getAllCountGeneralSchema, authorizeReadRoute], async function (req, res, next) {

    let result = await PageService.getAllPageCount(req.query);

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
router.get('/get/all', [checkSession, getAllGeneralSchema, authorizeReadRoute], async function (req, res, next) {

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

// insert new page by complete: page + menu + pagerole
// returns insertId of page
router.post('/insert/complete/by/session', [checkSession, pageInsertCompleteSchema, authorizeWriteRoute], async function (req, res, next) {
    let roleId = req.session.userData.roleid;

    // insert page and role information
    let result = await PageService.insertPageComplete(roleId, req.body);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed inserting page" });
    } else {
        res.json({ "status": true, "msg": "Successful inserting page", "id": result.data });
    }
});


// insert new page
// returns insertId of page
router.post('/insert', [checkSession, pageInsertSchema, authorizeWriteRoute], async function (req, res, next) {

    // insert page information
    let result = await PageService.insertPage(req.body);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed inserting page by complete" });
    } else {
        res.json({ "status": true, "msg": "Successful inserting page by complete", "id": result.data });
    }
});

// insert new page by bulk
router.post('/insert/bulk', [checkSession, pageInsertBulkSchema, authorizeWriteRoute], async function (req, res, next) {

    // insert page information
    let result = await PageService.insertBulkPage(req.body.data);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed inserting parent menus by bulk" });
    } else {
        res.json({ "status": true, "msg": "Successful inserting parent menus by bulk" });
    }
});

// edit page by complete: page + menu + pagerole
router.put('/modify/complete/by/session/:id', [checkSession, pageModifyCompleteSchema, authorizeWriteRoute], async function (req, res, next) {

    let roleId = req.session.userData.roleid;
    let result = await PageService.modifyPageComplete(req.params.id, roleId, req.body);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed modification of page complete" });
    } else {
        res.json({ "status": true, "msg": "Successful modification of page complete", "id": result.data });
    }
});

// edit page
router.put('/modify/:id', [checkSession, pageModifySchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await PageService.modifyPage(req.params.id, req.body);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed modification of page" });
    } else {
        res.json({ "status": true, "msg": "Successful modification of page", "id": result.data });
    }
});


// delete page, also deletes children data
router.delete('/delete/:id', [checkSession, deleteGeneralSchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await PageService.deletePage(req.params.id);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed deleting page" });
    } else {
        res.json({ "status": true, "msg": "Deleted page successfully" });
    }
});

router.post('/delete/bulk', [checkSession, deleteBulkGeneralSchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await PageService.deleteBulkPage(req.body.idArray);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed deleting bulk pages" });
    } else {
        res.json({ "status": true, "msg": "Deleted bulk pages successfully" });
    }
});

module.exports = router;