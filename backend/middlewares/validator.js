const Joi = require('joi')
    .extend(require('@joi/date')).extend(require('joi-phone-number'));


/**************** USER ****************/
function userInsertSchema(req, res, next) {

    const schema = Joi.object({
        username: Joi.string().max(45).required(),
        password: Joi.string().min(12).max(60).required(),
        roleid: Joi.number().required()
    });
    validateRequestBody(req, res, next, schema);
}

function userModifySchema(req, res, next) {

    const schemaBody = Joi.object({
        username: Joi.string().max(45).required(),
        password: Joi.string().min(12).max(60).allow('').optional(),
        roleid: Joi.number().required()
    });
    const schemaID = Joi.object({
        id: Joi.number().required()
    })

    const wholeSchema = Joi.object({
        params: schemaID,
        body: schemaBody
    }).unknown(true);
    validateRequest(req, res, next, wholeSchema);

}

function userLoginSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().max(45).required(),
        password: Joi.string().max(60).required(),
    });
    validateRequestBody(req, res, next, schema);
}

/**************** PAGE-ROLE ****************/
function pageRolePostSchema(req, res, next) {
    const pageRolesArr = Joi.object({
        pageRoles: Joi.array().items(
            Joi.object({
                PageID: Joi.number().required(),
                RoleID: Joi.number().required(),
                PrivilegeID: Joi.number().required()
            })
        )
    });

    validateRequestBody(req, res, next, pageRolesArr);
}

/**************** ROUTE-ROLE ****************/
function routeRolePostSchema(req, res, next) {

    const routeRolesArr = Joi.object({
        routeRoles: Joi.array().items(
            Joi.object({
                RouteID: Joi.number().required(),
                RoleID: Joi.number().required(),
                PrivilegeID: Joi.number().required()
            })
        )
    });

    validateRequestBody(req, res, next, routeRolesArr);
}


/**************** ROLE ****************/

function roleInsertSchema(req, res, next) {

    const schema = Joi.object({
        rolename: Joi.string().max(45).required()
    });
    validateRequestBody(req, res, next, schema);
}

function roleModifySchema(req, res, next) {

    const schemaBody = Joi.object({
        rolename: Joi.string().max(45).required()
    });

    const schemaID = Joi.object({
        id: Joi.number().required()
    })

    const wholeSchema = Joi.object({
        params: schemaID,
        body: schemaBody
    }).unknown(true);
    validateRequest(req, res, next, wholeSchema);
}

/*********** ROUTES ************/
function routeInsertSchema(req, res, next) {

    const schema = Joi.object({
        routeName: Joi.string().max(45).required(),
        routePath: Joi.string().max(30).required()
    });
    validateRequestBody(req, res, next, schema);
}

function routeModifySchema(req, res, next) {

    const schemaBody = Joi.object({
        routeName: Joi.string().max(45).required(),
        routePath: Joi.string().max(30).required()
    });
    const schemaID = Joi.object({
        id: Joi.number().required()
    })

    const wholeSchema = Joi.object({
        params: schemaID,
        body: schemaBody
    }).unknown(true);

    validateRequest(req, res, next, wholeSchema);
}

/**************** MENUS ****************/

/*********** 1. PARENT MENU ************/
function parentMenuSortSchema(req, res, next) {

    const schema = Joi.object({
        parentMenuID: Joi.number().required()
    });
    validateRequestBody(req, res, next, schema);
}

function parentMenuInsertSchema(req, res, next) {

    const schema = Joi.object({
        parentMenuName: Joi.string().max(30).required()
    });
    validateRequestBody(req, res, next, schema);
}

function parentMenuInsertBulkSchema(req, res, next) {

    const schema = Joi.object({
        data: Joi.array().items(
            Joi.object({
                ParentMenuName: Joi.string().max(30).required(),
                ParentMenuSort: Joi.number().required()
            })
        )

    });

    validateRequestBody(req, res, next, schema);
}

function parentMenuModifySchema(req, res, next) {

    const schemaBody = Joi.object({
        parentMenuName: Joi.string().max(30).required()

    });
    const schemaID = Joi.object({
        id: Joi.number().required()
    })

    const wholeSchema = Joi.object({
        params: schemaID,
        body: schemaBody
    }).unknown(true);
    validateRequest(req, res, next, wholeSchema);
}

/*********** 2. MENU ************/

function menuInsertSchema(req, res, next) {

    const schema = Joi.object({
        menuName: Joi.string().max(30).required(),
        pageID: Joi.number().required(),
        parentMenuID: Joi.alternatives().try(Joi.number().required(), Joi.string().allow(null).required()),
    });
    validateRequestBody(req, res, next, schema);
}

function menuInsertBulkSchema(req, res, next) {

    const schema = Joi.object({
        data: Joi.array().items(
            Joi.object({
                MenuName: Joi.string().max(30).required(),
                PageID: Joi.number().required(),
                ParentMenuID: Joi.alternatives().try(Joi.number().required(), Joi.string().allow(null).required()),
            })
        )

    });

    validateRequestBody(req, res, next, schema);
}

function menuModifySchema(req, res, next) {

    const schemaBody = Joi.object({
        menuName: Joi.string().max(30).required(),
        pageID: Joi.number().required(),
        parentMenuID: Joi.alternatives().try(Joi.number().required(), Joi.string().allow(null).required()),
    });

    const schemaID = Joi.object({
        id: Joi.number().required()
    })

    const wholeSchema = Joi.object({
        params: schemaID,
        body: schemaBody
    }).unknown(true);
    validateRequest(req, res, next, wholeSchema);
}

/**************** PAGE ****************/

function pageInsertSchema(req, res, next) {

    const schema = Joi.object({
        pageName: Joi.string().max(30).required(),
        pagePath: Joi.string().max(30).required()
    });
    validateRequestBody(req, res, next, schema);
}

function pageInsertBulkSchema(req, res, next) {

    const schema = Joi.object({
        data: Joi.array().items(
            Joi.object({
                PageName: Joi.string().max(30).required(),
                PagePath: Joi.string().max(30).required()
            })
        )

    });

    validateRequestBody(req, res, next, schema);
}

function pageModifySchema(req, res, next) {

    const schemaBody = Joi.object({
        pageName: Joi.string().max(30).required(),
        pagePath: Joi.string().max(30).required()
    });

    const schemaID = Joi.object({
        id: Joi.number().required()
    })

    const wholeSchema = Joi.object({
        params: schemaID,
        body: schemaBody
    }).unknown(true);

    validateRequest(req, res, next, wholeSchema);

}

function pageInsertCompleteSchema(req, res, next) {

    const schema = Joi.object({
        pageName: Joi.string().max(30).required(),
        pagePath: Joi.string().max(30).required(),
        privID: Joi.number().required(),
        menuName: Joi.string().max(30).required(),
        parentMenuID: Joi.alternatives().try(Joi.number().required(), Joi.string().allow(null).required())
    });
    validateRequestBody(req, res, next, schema);
}

function pageModifyCompleteSchema(req, res, next) {

    const schemaBody = Joi.object({
        pageName: Joi.string().max(30).required(),
        pagePath: Joi.string().max(30).required(),
        privID: Joi.number().required(),
        menuName: Joi.string().max(30).required(),
        menuID: Joi.number(),
        parentMenuID: Joi.alternatives().try(Joi.number().required(), Joi.string().allow(null).required())
    });

    const schemaID = Joi.object({
        id: Joi.number().required()
    })

    const wholeSchema = Joi.object({
        params: schemaID,
        body: schemaBody
    }).unknown(true);

    validateRequest(req, res, next, wholeSchema);

}

/**************** SUB PAGE ****************/

function subPageInsertSchema(req, res, next) {

    const schema = Joi.object({
        subPageName: Joi.string().max(30).required(),
        subPagePath: Joi.string().max(30).required(),
        pageID: Joi.number().required()
    });
    validateRequestBody(req, res, next, schema);
}

function subPageModifySchema(req, res, next) {

    const schemaBody = Joi.object({
        subPageName: Joi.string().max(30).required(),
        subPagePath: Joi.string().max(30).required(),
        pageID: Joi.number().required()
    });

    const schemaID = Joi.object({
        id: Joi.number().required()
    })

    const wholeSchema = Joi.object({
        params: schemaID,
        body: schemaBody
    }).unknown(true);

    validateRequest(req, res, next, wholeSchema);

}

/**************** EMPLOYEES ****************/

/*********** 1. Employee ************/

function employeeInsertSchema(req, res, next) {

    const schema = Joi.object({
        employeeNo: Joi.string().max(45).required(),
        firstName: Joi.string().max(60).required(),
        middleName: Joi.string().max(60).required(),
        lastName: Joi.string().max(60).required(),
        sex: Joi.string().valid('F', 'M').required(),
        contactNo: Joi.string().phoneNumber({ defaultCountry: 'PH' }).max(60).required(),
        hireDate: Joi.date().format('YYYY-MM-DD').required(),
        birthDate: Joi.date().format('YYYY-MM-DD').required(),
        employeePositionID: Joi.number().required(),
        employeeDepartmentID: Joi.number().required()
    });
    validateRequestBody(req, res, next, schema);
}

function employeeModifySchema(req, res, next) {

    const schemaBody = Joi.object({
        employeeNo: Joi.string().max(45).required(),
        firstName: Joi.string().max(60).required(),
        middleName: Joi.string().max(60).required(),
        lastName: Joi.string().max(60).required(),
        sex: Joi.string().valid('F', 'M').required(),
        contactNo: Joi.string().phoneNumber({ defaultCountry: 'PH' }).max(60).required(),
        hireDate: Joi.date().format('YYYY-MM-DD').required(),
        birthDate: Joi.date().format('YYYY-MM-DD').required(),
        employeePositionID: Joi.number().required(),
        employeeDepartmentID: Joi.number().required()
    });

    const schemaID = Joi.object({
        id: Joi.number().required()
    })

    const wholeSchema = Joi.object({
        params: schemaID,
        body: schemaBody
    }).unknown(true);
    validateRequest(req, res, next, wholeSchema);
}

function employeeInsertCompleteSchema(req, res, next) {

    const schema = Joi.object({
        employeeNo: Joi.string().max(45).required(),
        firstName: Joi.string().max(60).required(),
        middleName: Joi.string().max(60).required(),
        lastName: Joi.string().max(60).required(),
        sex: Joi.string().valid('F', 'M').required(),
        contactNo: Joi.string().phoneNumber({ defaultCountry: 'PH' }).max(60).required(),
        hireDate: Joi.date().format('YYYY-MM-DD').required(),
        birthDate: Joi.date().format('YYYY-MM-DD').required(),
        employeePositionID: Joi.number().required(),
        employeeDepartmentID: Joi.number().required(),
        salary: Joi.number().min(0).max(1000000 * 1000000).required(),
        startedDate: Joi.date().format('YYYY-MM-DD').required(),
        untilDate: Joi.alternatives().try(Joi.date().format('YYYY-MM-DD').required(), Joi.string().allow(null).required())
    });
    validateRequestBody(req, res, next, schema);
}

function employeeModifyCompleteSchema(req, res, next) {

    const schemaBody = Joi.object({
        employeeSalaryID: Joi.number(),
        employeeNo: Joi.string().max(45).required(),
        firstName: Joi.string().max(60).required(),
        middleName: Joi.string().max(60).required(),
        lastName: Joi.string().max(60).required(),
        sex: Joi.string().valid('F', 'M').required(),
        contactNo: Joi.string().phoneNumber({ defaultCountry: 'PH' }).max(60).required(),
        hireDate: Joi.date().format('YYYY-MM-DD').required(),
        birthDate: Joi.date().format('YYYY-MM-DD').required(),
        employeePositionID: Joi.number().required(),
        employeeDepartmentID: Joi.number().required(),
        salary: Joi.number().min(0).max(1000000 * 1000000).required(),
        startedDate: Joi.date().format('YYYY-MM-DD').required(),
        untilDate: Joi.alternatives().try(Joi.date().format('YYYY-MM-DD').required(), Joi.string().allow(null).required())
    });

    const schemaID = Joi.object({
        id: Joi.number().required()
    })

    const wholeSchema = Joi.object({
        params: schemaID,
        body: schemaBody
    }).unknown(true);

    validateRequest(req, res, next, wholeSchema);

}

/*********** 2. Employee Salary************/

function employeeSalaryInsertSchema(req, res, next) {

    const schema = Joi.object({
        salary: Joi.number().min(0).max(1000000 * 1000000).required(),
        startedDate: Joi.date().format('YYYY-MM-DD').required(),
        untilDate: Joi.alternatives().try(Joi.date().format('YYYY-MM-DD').required(), Joi.string().allow(null).required()),
        employeeID: Joi.number().required()
    });
    validateRequestBody(req, res, next, schema);
}

function employeeSalaryModifySchema(req, res, next) {

    const schemaBody = Joi.object({
        salary: Joi.number().min(0).max(1000000 * 1000000).required(),
        startedDate: Joi.date().format('YYYY-MM-DD').required(),
        untilDate: Joi.alternatives().try(Joi.date().format('YYYY-MM-DD').required(), Joi.string().allow(null).required()),
        employeeID: Joi.number().required()
    });

    const schemaID = Joi.object({
        id: Joi.number().required()
    })

    const wholeSchema = Joi.object({
        params: schemaID,
        body: schemaBody
    }).unknown(true);
    validateRequest(req, res, next, wholeSchema);
}

/*********** 3. Employee Department************/

function employeeDepartmentInsertSchema(req, res, next) {

    const schema = Joi.object({
        departmentName: Joi.string().max(45).required()
    });
    validateRequestBody(req, res, next, schema);
}

function employeeDepartmentModifySchema(req, res, next) {

    const schemaBody = Joi.object({
        departmentName: Joi.string().max(45).required()
    });
    const schemaID = Joi.object({
        id: Joi.number().required()
    })

    const wholeSchema = Joi.object({
        params: schemaID,
        body: schemaBody
    }).unknown(true);

    validateRequest(req, res, next, wholeSchema);
}



/*********** 4. Employee Position************/

function employeePositionInsertSchema(req, res, next) {

    const schema = Joi.object({
        positionName: Joi.string().max(45).required()
    });
    validateRequestBody(req, res, next, schema);
}

function employeePositionModifySchema(req, res, next) {

    const schemaBody = Joi.object({
        positionName: Joi.string().max(45).required()
    });
    const schemaID = Joi.object({
        id: Joi.number().required()
    })

    const wholeSchema = Joi.object({
        params: schemaID,
        body: schemaBody
    }).unknown(true);

    validateRequest(req, res, next, wholeSchema);
}


/**************** GENERAL ****************/
function validateRequestBody(req, res, next, schema) {
    validate(req.body, res, next, schema)
}

function validateRequestQuery(req, res, next, schema) {
    validate(req.query, res, next, schema)
}

function validateRequestParams(req, res, next, schema) {
    validate(req.params, res, next, schema)
}

function validateRequest(req, res, next, schema) {
    validate(req, res, next, schema)
}

function getAllCountGeneralSchema(req, res, next) {
    const schema = Joi.object({
        filter: Joi.array().items(
            Joi.object({
                id: Joi.string().required(),
                value: Joi.string().required()
            })
        )

    });
    validateRequestQuery(req, res, next, schema);
}

function getAllGeneralSchema(req, res, next) {
    const schema = Joi.object({
        page: Joi.number().integer(),
        limit: Joi.number().integer().min(5).max(100),
        sortBy: Joi.string().max(30),
        order: Joi.string().min(3).max(4),
        filter: Joi.array().items(
            Joi.object({
                id: Joi.string().required(),
                value: Joi.string().required()
            })
        )

    });
    validateRequestQuery(req, res, next, schema);
}

function deleteGeneralSchema(req, res, next) {

    const schema = Joi.object({
        id: Joi.number().required()
    });
    validateRequestParams(req, res, next, schema);
}

function deleteBulkGeneralSchema(req, res, next) {

    const schema = Joi.object({
        idArray: Joi.array().items(
            Joi.number()
        )
    })
    validateRequestBody(req, res, next, schema);
}

function validate(req, res, next, schema) {
    const options = {
        abortEarly: false // include all errors
    };
    const { error } = schema.validate(req, options);

    if (error) {

        res.json({ "status": false, "msg": error.details[0].message });
    } else {
        next();
    }
}
module.exports = {
    userInsertSchema,
    userLoginSchema,
    userModifySchema,
    routeRolePostSchema,
    pageRolePostSchema,
    roleInsertSchema,
    roleModifySchema,
    routeInsertSchema,
    routeModifySchema,
    parentMenuInsertSchema,
    parentMenuInsertBulkSchema,
    parentMenuModifySchema,
    parentMenuSortSchema,
    menuInsertSchema,
    menuInsertBulkSchema,
    menuModifySchema,
    pageInsertSchema,
    pageInsertBulkSchema,
    pageInsertCompleteSchema,
    pageModifyCompleteSchema,
    pageModifySchema,
    subPageInsertSchema,
    subPageModifySchema,
    employeeModifySchema,
    employeeInsertSchema,
    employeeInsertCompleteSchema,
    employeeModifyCompleteSchema,
    employeeSalaryModifySchema,
    employeeSalaryInsertSchema,
    employeePositionModifySchema,
    employeePositionInsertSchema,
    employeeDepartmentModifySchema,
    employeeDepartmentInsertSchema,
    getAllCountGeneralSchema,
    getAllGeneralSchema,
    deleteBulkGeneralSchema,
    deleteGeneralSchema
}