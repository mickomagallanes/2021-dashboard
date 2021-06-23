const Joi = require('joi');

/**************** USER ****************/
function userInsertSchema(req, res, next) {

    const schema = Joi.object({
        username: Joi.string().max(45).required(),
        password: Joi.string().min(12).required(),
        roleid: Joi.alternatives().try(Joi.number().required(), Joi.string().required())
    });
    validateRequestBody(req, res, next, schema);
}

function userModifySchema(req, res, next) {

    const schema = Joi.object({
        username: Joi.string().max(45).required(),
        password: Joi.string().min(12).allow('').optional(),
        roleid: Joi.alternatives().try(Joi.number().required(), Joi.string().required()),
        userid: Joi.alternatives().try(Joi.number().required(), Joi.string().required())
    });
    validateRequestBody(req, res, next, schema);
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
    });
    validateRequestQuery(req, res, next, schema);
}

/**************** ROLE ****************/

function roleInsertSchema(req, res, next) {

    const schema = Joi.object({
        rolename: Joi.string().max(45).required()
    });
    validateRequestBody(req, res, next, schema);
}

function roleModifySchema(req, res, next) {

    const schema = Joi.object({
        rolename: Joi.string().max(45).required(),
        roleid: Joi.alternatives().try(Joi.number().required(), Joi.string().required())
    });
    validateRequestBody(req, res, next, schema);
}

// TODO: continue JOI
function validateRequestBody(req, res, next, schema) {
    const options = {
        abortEarly: false // include all errors
    };
    const { error } = schema.validate(req.body, options);

    if (error) {
        res.json({ "status": false, "msg": error.details[0].message });
    } else {
        next();
    }
}

function validateRequestQuery(req, res, next, schema) {
    const options = {
        abortEarly: false // include all errors
    };
    const { error } = schema.validate(req.query, options);

    if (error) {
        res.json({ "status": false, "msg": error.details[0].message });
    } else {
        next();
    }
}

function validateRequestParams(req, res, next, schema) {
    const options = {
        abortEarly: false // include all errors
    };
    const { error } = schema.validate(req.params, options);

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
    roleInsertSchema,
    roleModifySchema
}