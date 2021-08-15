"use strict";
const EmployeeService = require('../../services/EmployeeService.js');

const express = require('express');
const router = express.Router();
const { checkSession, authorizeWriteRoute, authorizeReadRoute } = require('../../middlewares/routesauth.js');
const {
    getAllGeneralSchema,
    employeeSalaryModifySchema,
    employeeSalaryInsertSchema,
    employeeModifySchema,
    employeeInsertSchema,
    employeePositionModifySchema,
    employeePositionInsertSchema,
    deleteGeneralSchema,
    employeeDepartmentModifySchema,
    employeeDepartmentInsertSchema,
    getAllCountGeneralSchema
} = require('../../middlewares/validator.js');



/******************************** EMPLOYEE POSITIONS ***************************************/

// delete position, also deletes children data
router.delete('/position/delete/:id', [checkSession, deleteGeneralSchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await EmployeeService.deleteEmployeePosition(req.params.id);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed deleting position" });
    } else {
        res.json({ "status": true, "msg": "Deleted position successfully" });
    }
});

// insert new employee position
// returns insertId of employee position
router.post('/position/insert', [checkSession, employeePositionInsertSchema, authorizeWriteRoute], async function (req, res, next) {

    // insert role information
    let result = await EmployeeService.insertEmployeePosition(req.body);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed inserting" });
    } else {
        res.json({ "status": true, "msg": "Successful inserting", "id": result.data });
    }
});

// edit position position
router.put('/position/modify/:id', [checkSession, employeePositionModifySchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await EmployeeService.modifyEmployeePosition(req.params.id, req.body);
    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed modification" });
    } else {
        res.json({ "status": true, "msg": "Successful modification" });
    }
});

/**
 * get all employee position rows
 *
 */
router.get('/position/get/all', [checkSession, getAllGeneralSchema, authorizeReadRoute], async function (req, res, next) {

    let resp = await EmployeeService.getAllEmployeePositions(req.query);

    if (resp.status !== false) {

        res.json({ "status": true, "msg": "Successfully fetched positions", "data": resp.data });
    } else {

        res.json({ "status": false, "msg": "Failed getting positions!" });
    }

});

/**
 * get count of all employee position rows
 */
router.get('/position/get/all/count', [checkSession, getAllCountGeneralSchema, authorizeReadRoute], async function (req, res, next) {
    let result = await EmployeeService.getAllEmployeePositionCount(req.query);
    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting count" });
    } else {
        res.json({ "status": true, "msg": "Successful getting count", "data": result.data });
    }
});

/**
 * get a row by employee position id
 * @param {number} req.params.id id of employee position
 */
router.get('/position/get/by/:id', [checkSession, authorizeReadRoute], async function (req, res, next) {

    let result = await EmployeeService.getEmployeePositionById(req.params.id);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting row by id" });
    } else {
        res.json({ "status": true, "msg": "Successful getting row by id", "data": result.data });
    }
});



/******************************** EMPLOYEE DEPARTMENTS ***************************************/

// delete department, also deletes children data
router.delete('/department/delete/:id', [checkSession, deleteGeneralSchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await EmployeeService.deleteEmployeeDepartment(req.params.id);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed deleting department" });
    } else {
        res.json({ "status": true, "msg": "Deleted department successfully" });
    }
});

// insert new employee department
// returns insertId of employee department
router.post('/department/insert', [checkSession, employeeDepartmentInsertSchema, authorizeWriteRoute], async function (req, res, next) {

    // insert role information
    let result = await EmployeeService.insertEmployeeDepartment(req.body);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed inserting" });
    } else {
        res.json({ "status": true, "msg": "Successful inserting", "id": result.data });
    }
});

// edit department department
router.put('/department/modify/:id', [checkSession, employeeDepartmentModifySchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await EmployeeService.modifyEmployeeDepartment(req.params.id, req.body);
    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed modification" });
    } else {
        res.json({ "status": true, "msg": "Successful modification" });
    }
});

/**
 * get all employee department rows
 *
 */
router.get('/department/get/all', [checkSession, getAllGeneralSchema, authorizeReadRoute], async function (req, res, next) {

    let resp = await EmployeeService.getAllEmployeeDepartments(req.query);

    if (resp.status !== false) {

        res.json({ "status": true, "msg": "Successfully fetched departments", "data": resp.data });
    } else {

        res.json({ "status": false, "msg": "Failed getting departments!" });
    }

});

/**
 * get count of all employee department rows
 */
router.get('/department/get/all/count', [checkSession, getAllCountGeneralSchema, authorizeReadRoute], async function (req, res, next) {
    let result = await EmployeeService.getAllEmployeeDepartmentCount(req.query);
    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting count" });
    } else {
        res.json({ "status": true, "msg": "Successful getting count", "data": result.data });
    }
});

/**
 * get a row by employee department id
 * @param {number} req.params.id id of employee department
 */
router.get('/department/get/by/:id', [checkSession, authorizeReadRoute], async function (req, res, next) {

    let result = await EmployeeService.getEmployeeDepartmentById(req.params.id);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed getting row by id" });
    } else {
        res.json({ "status": true, "msg": "Successful getting row by id", "data": result.data });
    }
});

/******************************** EMPLOYEE SALARIES ***************************************/

// delete salary, also deletes children data
router.delete('/salary/delete/:id', [checkSession, deleteGeneralSchema, authorizeWriteRoute], async function (req, res, next) {
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
        res.json({ "status": true, "msg": "Successful modification" });
    }
});

/**
 * get all employee salary rows
 *
 */
router.get('/salary/get/all', [checkSession, getAllGeneralSchema, authorizeReadRoute], async function (req, res, next) {

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
router.get('/salary/get/all/count', [checkSession, getAllCountGeneralSchema, authorizeReadRoute], async function (req, res, next) {
    let result = await EmployeeService.getAllEmployeeSalaryCount(req.query);
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
router.get('/get/all/count', [checkSession, getAllCountGeneralSchema, authorizeReadRoute], async function (req, res, next) {

    let result = await EmployeeService.getAllEmployeeCount(req.query);

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
router.get('/get/all', [checkSession, getAllGeneralSchema, authorizeReadRoute], async function (req, res, next) {

    let resp = await EmployeeService.getAllEmployee(req.query);

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

// insert new employee
// returns insertId of employee
router.post('/insert', [checkSession, employeeInsertSchema, authorizeWriteRoute], async function (req, res, next) {

    // insert role information
    let result = await EmployeeService.insertEmployee(req.body);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed inserting employee" });
    } else {
        res.json({ "status": true, "msg": "Successful inserting employee", "id": result.data });
    }
});

// edit employee
router.put('/modify/:id', [checkSession, employeeModifySchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await EmployeeService.modifyEmployee(req.params.id, req.body);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed modification of employee" });
    } else {
        res.json({ "status": true, "msg": "Successful modification of employee" });
    }
});


// delete employee, also deletes children data
router.delete('/delete/:id', [checkSession, deleteGeneralSchema, authorizeWriteRoute], async function (req, res, next) {
    let result = await EmployeeService.deleteEmployee(req.params.id);

    if (result.status === false) {
        res.json({ "status": false, "msg": "Failed deleting employee" });
    } else {
        res.json({ "status": true, "msg": "Deleted employee successfully" });
    }
});

module.exports = router;