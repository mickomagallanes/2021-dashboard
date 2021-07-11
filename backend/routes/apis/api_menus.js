"use strict";
const MenusService = require('../../services/MenusService.js');

const express = require('express');
const router = express.Router();
const { checkSession, authorizeWriteRoute, authorizeReadRoute } = require('../../middlewares/routesauth.js');
const {
    parentMenuInsertSchema,
    parentMenuModifySchema,
    parentMenuGetAllSchema,
    menuGetAllSchema,
    menuInsertSchema,
    menuModifySchema
} = require('../../middlewares/validator.js');

/******************************** Menu ***************************************/

// insert new menu
// returns insertId of menu
router.post('/insert', [checkSession, menuInsertSchema, authorizeWriteRoute], async function (req, res, next) {

    // insert role information
    let result = await MenusService.insertMenu(req.body);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed inserting" });
    } else {
        res.json({ "status": true, "msg": "Successful inserting", "id": result.data });
    }
});

// edit menu
router.put('/modify/:id', [checkSession, menuModifySchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await MenusService.modifyMenu(req.params.id, req.body);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed modification" });
    } else {
        res.json({ "status": true, "msg": "Successful modification", "id": result.data });
    }
});


/**
 * get pages based on the logged-in user role
 *
 */
router.get('/get/by/role', [checkSession], async function (req, res, next) {

    let userId = req.session.userData.userid;

    let resp = await MenusService.getMenusByRole(userId);

    if (resp.status !== false) {

        res.json({ "status": true, "msg": "Successfully fetched pages", "data": resp.data });
    } else {

        res.json({ "status": false, "msg": "Failed getting menus!" });
    }

});


/**
 * get count of all menu rows
 */
router.get('/get/all/count', [checkSession, authorizeReadRoute], async function (req, res, next) {

    let result = await MenusService.getAllMenuCount();

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting count" });
    } else {
        res.json({ "status": true, "msg": "Successful getting count", "data": result.data });
    }
});

/**
 * get all menu rows
 *
 */
router.get('/get/all', [checkSession, menuGetAllSchema, authorizeReadRoute], async function (req, res, next) {

    let resp = await MenusService.getAllMenus(req.query);

    if (resp.status !== false) {

        res.json({ "status": true, "msg": "Successfully fetched pages", "data": resp.data });
    } else {

        res.json({ "status": false, "msg": "Failed getting menus!" });
    }

});

/**
 * get all menu rows
 *
 */
router.get('/get/all/and/count', [checkSession, menuGetAllSchema, authorizeReadRoute], async function (req, res, next) {

    let resp = await MenusService.getAllMenusAndCount(req.query);

    if (resp.status !== false) {

        res.json({ "status": true, "msg": "Successfully fetched pages", "data": resp.data });
    } else {

        res.json({ "status": false, "msg": "Failed getting menus!" });
    }

});

/**
 * get menu row by menu id
 * @param {number} req.params.id id of menu
 */
router.get('/get/by/:id', [checkSession, authorizeReadRoute], async function (req, res, next) {

    let result = await MenusService.getMenuById(req.params.id);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting row by id" });
    } else {
        res.json({ "status": true, "msg": "Successful getting row by id", "data": result.data });
    }
});
/*************************** Parent Menu *************************************/
// insert new parent menu
// returns insertId of parent menu
router.post('/parent/insert', [checkSession, parentMenuInsertSchema, authorizeWriteRoute], async function (req, res, next) {

    // insert role information
    let result = await MenusService.insertParentMenu(req.body);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed inserting" });
    } else {
        res.json({ "status": true, "msg": "Successful inserting", "id": result.data });
    }
});

// edit parent menu
router.put('/parent/modify/:id', [checkSession, parentMenuModifySchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await MenusService.modifyParentMenu(req.params.id, req.body);
    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed modification" });
    } else {
        res.json({ "status": true, "msg": "Successful modification", "id": result.data });
    }
});

/**
 * get all parent menu rows
 *
 */
router.get('/parent/get/all', [checkSession, parentMenuGetAllSchema, authorizeReadRoute], async function (req, res, next) {

    let resp = await MenusService.getAllParentMenus(req.query);

    if (resp.status !== false) {

        res.json({ "status": true, "msg": "Successfully fetched pages", "data": resp.data });
    } else {

        res.json({ "status": false, "msg": "Failed getting menus!" });
    }

});

/**
 * get a row by parent menu id
 * @param {number} req.params.id id of parent menu
 */
router.get('/parent/get/by/:id', [checkSession, authorizeReadRoute], async function (req, res, next) {

    let result = await MenusService.getParentMenuById(req.params.id);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting row by id" });
    } else {
        res.json({ "status": true, "msg": "Successful getting row by id", "data": result.data });
    }
});

/**
 * sort up parent menu
 *
 */
router.post('/parent/sort/up', [checkSession, authorizeWriteRoute], async function (req, res, next) {
    let parentMenuID = req.body.parentMenuID;

    let resp = await MenusService.sortUpParentMenu(parentMenuID);

    if (resp.status !== false) {

        res.json({ "status": true, "msg": "Successfully sorted up parent menu" });
    } else {

        res.json({ "status": false, "msg": "Failed sorting up!" });
    }

});

/**
 * sort down parent menu
 *
 */
router.post('/parent/sort/down', [checkSession, authorizeWriteRoute], async function (req, res, next) {

    let parentMenuID = req.body.parentMenuID;

    let resp = await MenusService.sortDownParentMenu(parentMenuID);

    if (resp.status !== false) {

        res.json({ "status": true, "msg": "Successfully sorted down parent menu" });
    } else {

        res.json({ "status": false, "msg": "Failed sorting down!" });
    }

});
module.exports = router;