"use strict";
const RouteService = require('../../services/RouteService.js');

const express = require('express');
const router = express.Router();
const { checkSession, authorizeWriteRoute, authorizeReadRoute } = require('../../middlewares/routesauth.js');
const {
    routeInsertSchema,
    routeModifySchema,
    getAllGeneralSchema,
    deleteGeneralSchema,
    getAllCountGeneralSchema,
    deleteBulkGeneralSchema
} = require('../../middlewares/validator.js');

/*************************** Routes *************************************/
// delete route, also deletes children data
router.delete('/delete/:id', [checkSession, deleteGeneralSchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await RouteService.deleteRoute(req.params.id);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed deleting route" });
    } else {
        res.json({ "status": true, "msg": "Deleted route successfully" });
    }
});

router.post('/delete/bulk', [checkSession, deleteBulkGeneralSchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await RouteService.deleteBulkRoute(req.body.idArray);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed deleting bulk routes" });
    } else {
        res.json({ "status": true, "msg": "Deleted bulk routes successfully" });
    }
});


// insert new route
// returns insertId of route
router.post('/insert', [checkSession, routeInsertSchema, authorizeWriteRoute], async function (req, res, next) {

    // insert role information
    let result = await RouteService.insertRoute(req.body);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed inserting" });
    } else {
        res.json({ "status": true, "msg": "Successful inserting", "id": result.data });
    }
});

// edit route
router.put('/modify/:id', [checkSession, routeModifySchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await RouteService.modifyRoute(req.params.id, req.body);
    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed modification" });
    } else {
        res.json({ "status": true, "msg": "Successful modification" });
    }
});

/**
 * get all route rows
 *
 */
router.get('/get/all', [checkSession, getAllGeneralSchema, authorizeReadRoute], async function (req, res, next) {

    let resp = await RouteService.getAllRoutes(req.query);

    if (resp.status !== false) {

        res.json({ "status": true, "msg": "Successfully fetched routes", "data": resp.data });
    } else {

        res.json({ "status": false, "msg": "Failed getting routes!" });
    }

});

/**
 * get count of all route rows
 */
router.get('/get/all/count', [checkSession, getAllCountGeneralSchema, authorizeReadRoute], async function (req, res, next) {
    let result = await RouteService.getAllRouteCount(req.query);
    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting count" });
    } else {
        res.json({ "status": true, "msg": "Successful getting count", "data": result.data });
    }
});

/**
 * get a row by route id
 * @param {number} req.params.id id of route
 */
router.get('/get/by/:id', [checkSession, authorizeReadRoute], async function (req, res, next) {

    let result = await RouteService.getRouteById(req.params.id);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting row by id" });
    } else {
        res.json({ "status": true, "msg": "Successful getting row by id", "data": result.data });
    }
});

module.exports = router;