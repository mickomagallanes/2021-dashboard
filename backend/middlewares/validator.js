const Joi = require('joi');

/**************** USER ****************/
function userInsertSchema(req, res, next) {

    const schema = Joi.object({
        username: Joi.string().max(45).required(),
        password: Joi.string().min(12).required(),
        roleid: Joi.number().required()
    });
    validateRequestBody(req, res, next, schema);
}

function userModifySchema(req, res, next) {

    const schemaBody = Joi.object({
        username: Joi.string().max(45).required(),
        password: Joi.string().min(12).allow('').optional(),
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
        password: Joi.string().required(),
    });
    validateRequestBody(req, res, next, schema);
}

function userGetAllSchema(req, res, next) {
    const schema = Joi.object({
        page: Joi.number().integer(),
        limit: Joi.number().integer().min(5).max(100),
        sortBy: Joi.string().max(30),
        order: Joi.string().min(3).max(4),
    });
    validateRequestQuery(req, res, next, schema);
}

function userDeleteSchema(req, res, next) {

    const schema = Joi.object({
        id: Joi.number().required()
    });
    validateRequestParams(req, res, next, schema);
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

function roleDeleteSchema(req, res, next) {

    const schema = Joi.object({
        id: Joi.number().required()
    });
    validateRequestParams(req, res, next, schema);
}

/**************** MENUS ****************/

/*********** 1. PARENT MENU ************/
function parentMenuSortSchema(req, res, next) {

    const schema = Joi.object({
        parentMenuID: Joi.number().required()
    });
    validateRequestBody(req, res, next, schema);
}

function parentMenuDeleteSchema(req, res, next) {

    const schema = Joi.object({
        id: Joi.number().required()
    });
    validateRequestParams(req, res, next, schema);
}

function parentMenuInsertSchema(req, res, next) {

    const schema = Joi.object({
        parentMenuName: Joi.string().max(30).required()
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

function parentMenuGetAllSchema(req, res, next) {
    const schema = Joi.object({
        page: Joi.number().integer(),
        limit: Joi.number().integer().min(5).max(100),
        sortBy: Joi.string().max(30),
        order: Joi.string().min(3).max(4),
    });
    validateRequestQuery(req, res, next, schema);
}

/*********** 2. MENU ************/

function menuDeleteSchema(req, res, next) {

    const schema = Joi.object({
        id: Joi.number().required()
    });
    validateRequestParams(req, res, next, schema);
}

function menuInsertSchema(req, res, next) {

    const schema = Joi.object({
        menuName: Joi.string().max(30).required(),
        pageID: Joi.number().required(),
        parentMenuID: Joi.alternatives().try(Joi.number().required(), Joi.string().allow(null).required()),
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

function menuGetAllSchema(req, res, next) {
    const schema = Joi.object({
        page: Joi.number().integer(),
        limit: Joi.number().integer().min(5).max(100),
        sortBy: Joi.string().max(30),
        order: Joi.string().min(3).max(4),
    });
    validateRequestQuery(req, res, next, schema);
}

/**************** PAGE ****************/
function pageDeleteSchema(req, res, next) {

    const schema = Joi.object({
        id: Joi.number().required()
    });
    validateRequestParams(req, res, next, schema);
}

function pageInsertSchema(req, res, next) {

    const schema = Joi.object({
        pageName: Joi.string().max(30).required(),
        pagePath: Joi.string().max(30).required()
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

function pageInsertBulkSchema(req, res, next) {

    const schema = Joi.object({
        pageName: Joi.string().max(30).required(),
        pagePath: Joi.string().max(30).required(),
        privID: Joi.number().required(),
        menuName: Joi.string().max(30).required(),
        parentMenuID: Joi.alternatives().try(Joi.number().required(), Joi.string().allow(null).required())
    });
    validateRequestBody(req, res, next, schema);
}

function pageModifyBulkSchema(req, res, next) {

    const schemaBody = Joi.object({
        pageName: Joi.string().max(30).required(),
        pagePath: Joi.string().max(30).required(),
        privID: Joi.number().required(),
        menuName: Joi.string().max(30).required(),
        menuID: Joi.number().required(),
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

function pageGetAllSchema(req, res, next) {
    const schema = Joi.object({
        page: Joi.number().integer(),
        limit: Joi.number().integer().min(5).max(100),
        sortBy: Joi.string().max(30),
        order: Joi.string().min(3).max(4),
    });
    validateRequestQuery(req, res, next, schema);
}

/**************** SUB PAGE ****************/
function subPageDeleteSchema(req, res, next) {

    const schema = Joi.object({
        id: Joi.number().required()
    });
    validateRequestParams(req, res, next, schema);
}

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

function subPageGetAllSchema(req, res, next) {
    const schema = Joi.object({
        page: Joi.number().integer(),
        limit: Joi.number().integer().min(5).max(100),
        sortBy: Joi.string().max(30),
        order: Joi.string().min(3).max(4),
    });
    validateRequestQuery(req, res, next, schema);
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
    userGetAllSchema,
    userModifySchema,
    userDeleteSchema,
    routeRolePostSchema,
    pageRolePostSchema,
    roleInsertSchema,
    roleModifySchema,
    roleDeleteSchema,
    parentMenuInsertSchema,
    parentMenuModifySchema,
    parentMenuGetAllSchema,
    parentMenuDeleteSchema,
    parentMenuSortSchema,
    menuGetAllSchema,
    menuInsertSchema,
    menuModifySchema,
    menuDeleteSchema,
    pageGetAllSchema,
    pageInsertSchema,
    pageInsertBulkSchema,
    pageModifyBulkSchema,
    pageModifySchema,
    pageDeleteSchema,
    subPageGetAllSchema,
    subPageInsertSchema,
    subPageModifySchema,
    subPageDeleteSchema
}