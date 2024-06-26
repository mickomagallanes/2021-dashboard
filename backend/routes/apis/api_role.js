"use strict";
const RoleService = require('../../services/RoleService.js');

const { checkSession, authorizeReadRoute, authorizeWriteRoute } = require('../../middlewares/routesauth.js');
const { roleInsertSchema, roleModifySchema, deleteGeneralSchema, getAllCountGeneralSchema } = require('../../middlewares/validator.js');
const express = require('express');
const router = express.Router();

/**
 * get all roles
 */
router.get('/get/all', checkSession, async function (req, res, next) {

    let result = await RoleService.getAllRoles();

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting all rows" });
    } else {
        res.json({ "status": true, "msg": "Successful getting all rows", "data": result.data });
    }

});

/**
 * get all role rows
 * @param {number} req.params.id id of role
 */
router.get('/get/by/:id', [checkSession, authorizeReadRoute], async function (req, res, next) {

    let result = await RoleService.getRoleById(req.params.id);
    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting row by id" });
    } else {
        res.json({ "status": true, "msg": "Successful getting row by id", "data": result.data });
    }
});

/**
 * get count of all role rows
 */
router.get('/get/all/count', [checkSession, getAllCountGeneralSchema, authorizeReadRoute], async function (req, res, next) {

    let result = await RoleService.getAllCount(req.query);
    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting count" });
    } else {
        res.json({ "status": true, "msg": "Successful getting count", "data": result.data });
    }
});

// insert new role
// returns insertId of role, for privilege insert purposes
router.post('/insert', [checkSession, roleInsertSchema, authorizeWriteRoute], async function (req, res, next) {

    // insert role information
    let result = await RoleService.insertRole(req.body);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed inserting" });
    } else {
        res.json({ "status": true, "msg": "Successful inserting", "id": result.data });
    }
});

// edit role
router.put('/modify/:id', [checkSession, roleModifySchema, authorizeWriteRoute], async function (req, res, next) {

    // edit role information
    let result = await RoleService.modifyRole(req.params.id, req.body);
    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed modification" });
    } else {
        res.json({ "status": true, "msg": "Successful modification", "id": result.data });
    }
});


// delete role, also deletes children data
router.delete('/delete/:id', [checkSession, deleteGeneralSchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await RoleService.deleteRole(req.params.id);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed deleting role" });
    } else {
        res.json({ "status": true, "msg": "Deleted role successfully" });
    }
});

module.exports = router;