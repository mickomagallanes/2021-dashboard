"use strict";
const MenusService = require('../../services/MenusService.js');

const express = require('express');
const router = express.Router();
const { checkSession, authorizeWriteRoute, authorizeReadRoute } = require('../../middlewares/routesauth.js');
const {
    parentMenuInsertSchema,
    parentMenuModifySchema,
    getAllGeneralSchema,
    menuInsertSchema,
    menuModifySchema,
    parentMenuSortSchema,
    getAllCountGeneralSchema,
    deleteGeneralSchema,
    deleteBulkGeneralSchema,
    menuInsertBulkSchema
} = require('../../middlewares/validator.js');

/******************************** Menu ***************************************/

// insert new menu
// returns insertId of menu
router.post('/insert/bulk', [checkSession, menuInsertBulkSchema, authorizeWriteRoute], async function (req, res, next) {

    // insert role information
    let result = await MenusService.insertBulkMenu(req.body.data);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed inserting menus by bulk" });
    } else {
        res.json({ "status": true, "msg": "Successful inserting menus by bulk", "id": result.data });
    }
});

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
 * get menus based on the logged-in user role
 *
 */
router.get('/get/by/role', [checkSession], async function (req, res, next) {

    let userId = req.session.userData.userid;

    let resp = await MenusService.getMenusByRole(userId);

    if (resp.status !== false) {

        res.json({ "status": true, "msg": "Successfully fetched menus", "data": resp.data });
    } else {

        res.json({ "status": false, "msg": "Failed getting menus!" });
    }

});


/**
 * get count of all menu rows
 */
router.get('/get/all/count', [checkSession, getAllCountGeneralSchema, authorizeReadRoute], async function (req, res, next) {

    let result = await MenusService.getAllMenuCount(req.query);

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
router.get('/get/all', [checkSession, getAllGeneralSchema, authorizeReadRoute], async function (req, res, next) {

    let resp = await MenusService.getAllMenus(req.query);

    if (resp.status !== false) {

        res.json({ "status": true, "msg": "Successfully fetched menus", "data": resp.data });
    } else {

        res.json({ "status": false, "msg": "Failed getting menus!" });
    }

});


/**
 * get menu row by page id
 * @param {number} req.params.id id of page
 */
router.get('/get/by/page/:id', [checkSession, authorizeReadRoute], async function (req, res, next) {

    let result = await MenusService.getMenuByPageId(req.params.id);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting row by page id" });
    } else {
        res.json({ "status": true, "msg": "Successful getting row by page id", "data": result.data });
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

// delete menu, also deletes children data
router.delete('/delete/:id', [checkSession, deleteGeneralSchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await MenusService.deleteMenu(req.params.id);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed deleting menu" });
    } else {
        res.json({ "status": true, "msg": "Deleted menu successfully" });
    }
});

router.post('/delete/bulk', [checkSession, deleteBulkGeneralSchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await MenusService.deleteBulkMenu(req.body.idArray);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed deleting bulk menus" });
    } else {
        res.json({ "status": true, "msg": "Deleted bulk menus successfully" });
    }
});


/*************************** Parent Menu *************************************/
// delete menu, also deletes children data
router.delete('/parent/delete/:id', [checkSession, deleteGeneralSchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await MenusService.deleteParentMenu(req.params.id);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed deleting menu" });
    } else {
        res.json({ "status": true, "msg": "Deleted menu successfully" });
    }
});

router.post('/parent/delete/bulk', [checkSession, deleteBulkGeneralSchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await MenusService.deleteBulkParentMenu(req.body.idArray);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed deleting bulk parent menu" });
    } else {
        res.json({ "status": true, "msg": "Deleted bulk parent menu successfully" });
    }
});


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
router.get('/parent/get/all', [checkSession, getAllGeneralSchema, authorizeReadRoute], async function (req, res, next) {

    let resp = await MenusService.getAllParentMenus(req.query);

    if (resp.status !== false) {

        res.json({ "status": true, "msg": "Successfully fetched parent menus", "data": resp.data });
    } else {

        res.json({ "status": false, "msg": "Failed getting parent menus!" });
    }

});

/**
 * get count of all parent menu rows
 */
router.get('/parent/get/all/count', [checkSession, getAllCountGeneralSchema, authorizeReadRoute], async function (req, res, next) {
    let result = await MenusService.getAllParentMenuCount(req.query);
    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting count" });
    } else {
        res.json({ "status": true, "msg": "Successful getting count", "data": result.data });
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
router.post('/parent/sort/up', [checkSession, parentMenuSortSchema, authorizeWriteRoute], async function (req, res, next) {
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
router.post('/parent/sort/down', [checkSession, parentMenuSortSchema, authorizeWriteRoute], async function (req, res, next) {

    let parentMenuID = req.body.parentMenuID;

    let resp = await MenusService.sortDownParentMenu(parentMenuID);

    if (resp.status !== false) {

        res.json({ "status": true, "msg": "Successfully sorted down parent menu" });
    } else {

        res.json({ "status": false, "msg": "Failed sorting down!" });
    }

});

module.exports = router;