"use strict";
const EmployeeService = require('../../services/EmployeeService.js');

const express = require('express');
const router = express.Router();
const { checkSession, authorizeWriteRoute, authorizeReadRoute } = require('../../middlewares/routesauth.js');
const {
    employeeSalaryGetAllSchema,
    employeeSalaryModifySchema,
    employeeSalaryInsertSchema,
    employeeSalaryDeleteSchema
} = require('../../middlewares/validator.js');

/******************************** EMPLOYEE SALARIES ***************************************/

// delete salary, also deletes children data
router.delete('/salary/delete/:id', [checkSession, employeeSalaryDeleteSchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await EmployeeService.deleteEmployeeSalary(req.params.id);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed deleting salary" });
    } else {
        res.json({ "status": true, "msg": "Deleted salary successfully" });
    }
});

// insert new employee salary
// returns insertId of employee salary
router.post('/salary/insert', [checkSession, employeeSalaryInsertSchema, authorizeWriteRoute], async function (req, res, next) {

    // insert role information
    let result = await EmployeeService.insertEmployeeSalary(req.body);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed inserting" });
    } else {
        res.json({ "status": true, "msg": "Successful inserting", "id": result.data });
    }
});

// edit salary salary
router.put('/salary/modify/:id', [checkSession, employeeSalaryModifySchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await EmployeeService.modifyEmployeeSalary(req.params.id, req.body);
    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed modification" });
    } else {
        res.json({ "status": true, "msg": "Successful modification", "id": result.data });
    }
});

/**
 * get all employee salary rows
 *
 */
router.get('/salary/get/all', [checkSession, employeeSalaryGetAllSchema, authorizeReadRoute], async function (req, res, next) {

    let resp = await EmployeeService.getAllEmployeeSalaries(req.query);

    if (resp.status !== false) {

        res.json({ "status": true, "msg": "Successfully fetched pages", "data": resp.data });
    } else {

        res.json({ "status": false, "msg": "Failed getting salaries!" });
    }

});

/**
 * get count of all employee salary rows
 */
router.get('/salary/get/all/count', [checkSession, authorizeReadRoute], async function (req, res, next) {
    let result = await EmployeeService.getAllEmployeeSalaryCount();
    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting count" });
    } else {
        res.json({ "status": true, "msg": "Successful getting count", "data": result.data });
    }
});

/**
 * get a row by employee salary id
 * @param {number} req.params.id id of employee salary
 */
router.get('/salary/get/by/:id', [checkSession, authorizeReadRoute], async function (req, res, next) {

    let result = await EmployeeService.getEmployeeSalaryById(req.params.id);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting row by id" });
    } else {
        res.json({ "status": true, "msg": "Successful getting row by id", "data": result.data });
    }
});

module.exports = router;