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

        res.json({ "status": true, "msg": "Successfully fetched salaries", "data": resp.data });
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

/******************************** EMPLOYEES ***************************************/

/**
 * get employees based on the logged-in user role
 *
 */
router.get('/get/by/session', [checkSession], async function (req, res, next) {

    let userId = req.session.userData.userid;

    let resp = await EmployeeService.getEmployeesBySession(userId);

    if (resp.status) {

        res.json({ "status": true, "msg": "Successfully fetched employees", "data": resp.data });
    } else {

        res.json({ "status": false, "msg": "Failed getting employees!" });
    }

});

/**
 * get count of all employee rows
 */
router.get('/get/all/count', [checkSession, authorizeReadRoute], async function (req, res, next) {

    let result = await EmployeeService.getAllEmployeeCount();

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting count" });
    } else {
        res.json({ "status": true, "msg": "Successful getting count", "data": result.data });
    }
});

/**
 * get all employee rows
 *
 */
router.get('/get/all', [checkSession, employeeGetAllSchema, authorizeReadRoute], async function (req, res, next) {

    let resp = await EmployeeService.getAllEmployees(req.query);

    if (resp.status !== false) {

        res.json({ "status": true, "msg": "Successfully fetched employees", "data": resp.data });
    } else {

        res.json({ "status": false, "msg": "Failed getting employees!" });
    }

});

/**
 * get employee row by employee id
 * @param {number} req.params.id id of employee
 */
router.get('/get/by/:id', [checkSession, authorizeReadRoute], async function (req, res, next) {

    let result = await EmployeeService.getEmployeeById(req.params.id);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting row by id" });
    } else {
        res.json({ "status": true, "msg": "Successful getting row by id", "data": result.data });
    }
});

// insert new employee by bulk: employee + menu + employeerole
// returns insertId of employee
router.post('/insert/bulk/by/session', [checkSession, employeeInsertBulkSchema, authorizeWriteRoute], async function (req, res, next) {
    let roleId = req.session.userData.roleid;

    // insert role information
    let result = await EmployeeService.insertEmployeeBulk(roleId, req.body);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed inserting employee" });
    } else {
        res.json({ "status": true, "msg": "Successful inserting employee", "id": result.data });
    }
});


// insert new employee
// returns insertId of employee
router.post('/insert', [checkSession, employeeInsertSchema, authorizeWriteRoute], async function (req, res, next) {

    // insert role information
    let result = await EmployeeService.insertEmployee(req.body);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed inserting employee by bulk" });
    } else {
        res.json({ "status": true, "msg": "Successful inserting employee by bulk", "id": result.data });
    }
});


// edit employee by bulk: employee + menu + employeerole
router.put('/modify/bulk/by/session/:id', [checkSession, employeeModifyBulkSchema, authorizeWriteRoute], async function (req, res, next) {

    let roleId = req.session.userData.roleid;
    let result = await EmployeeService.modifyEmployeeBulk(req.params.id, roleId, req.body);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed modification of employee by bulk" });
    } else {
        res.json({ "status": true, "msg": "Successful modification of employee by bulk", "id": result.data });
    }
});

// edit employee
router.put('/modify/:id', [checkSession, employeeModifySchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await EmployeeService.modifyEmployee(req.params.id, req.body);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed modification of employee" });
    } else {
        res.json({ "status": true, "msg": "Successful modification of employee", "id": result.data });
    }
});


// delete employee, also deletes children data
router.delete('/delete/:id', [checkSession, employeeDeleteSchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await EmployeeService.deleteEmployee(req.params.id);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed deleting employee" });
    } else {
        res.json({ "status": true, "msg": "Deleted employee successfully" });
    }
});

module.exports = router;