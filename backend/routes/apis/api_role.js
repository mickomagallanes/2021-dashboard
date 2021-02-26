"use strict";
const RoleService = require('../../services/RoleService.js');

const { checkSession } = require('../../middlewares/routesauth.js');
const express = require('express');
const router = express.Router();


router.get('/get/all', checkSession, async function (req, res, next) {

    let result = await RoleService.getAllRoles();

    if (result === false) {
        res.sendStatus(403);
    } else {
        res.json({ "status": true, "data": result });
    }



});
module.exports = router;