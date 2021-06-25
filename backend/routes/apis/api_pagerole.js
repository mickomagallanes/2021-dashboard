"use strict";
const PageRoleService = require('../../services/PageRoleService.js');

const utils = require('../../utils/session.js');
const express = require('express');
const router = express.Router();
const { checkSession, authorizeWriteRoute, authorizeReadRoute } = require('../../middlewares/routesauth.js');

/**
 * check if user is authorized to access frontend page
 * @param {String} req.body.pagepath path of frontend page
 */
router.post('/authorize', [checkSession], async function (req, res, next) {

    let userId = req.session.userData.userid;
    let pagePath = req.body.pagepath;

    let resp = await PageRoleService.getPagePrivBySession(userId, pagePath);

    if (resp.status) {

        res.json({ "status": true, "msg": "User is authorized", "data": resp.data });
    } else {

        res.json({ "status": false, "msg": "Unauthorized!" });
    }


});

/**
 * get all roles
 */
router.get('/get/left/:roleId', [checkSession, authorizeReadRoute], async function (req, res, next) {

    const roleId = req.params.roleId;

    let result = await PageRoleService.getAllPagesLeftRole(roleId);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed fetching all rows" });
    } else {
        res.json({ "status": true, "msg": "Successfully fetched all rows", "data": result.data });
    }

});

/**
 * post page role data
 */
router.post('/post/data', [checkSession, authorizeWriteRoute], async function (req, res, next) {

    const pageRolesArr = req.body.pageRoles;

    let result = await PageRoleService.postPageRoleData(pageRolesArr);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed posting page roles data" });
    } else {
        res.json({ "status": true, "msg": "Successfully posted Page-Roles data" });
    }

});

module.exports = router;