const Joi = require('joi');

function userInsertSchema(req, res, next) {

    const schema = Joi.object({
        username: Joi.string().max(45).required(),
        password: Joi.string().min(12).required(),
        roleid: Joi.alternatives().try(Joi.number().max(1).required(), Joi.string().max(1).required())
    });
    validateRequest(req, res, next, schema);
}

function userLoginSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().max(45).required(),
        password: Joi.string().required(),
    });
    validateRequest(req, res, next, schema);
}

// TODO: continue JOI
function validateRequest(req, res, next, schema) {
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

module.exports = {
    userInsertSchema,
    userLoginSchema
}