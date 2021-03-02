
const RouteRoleModel = require('../models/RouteRoleModel.js');
const utils = require('../utils/session.js');

function authorizeReadRoute(req, res, next) {
    let userId = req.session.userData.userid;

    let userPriv = RouteRoleModel.getRouteRole(userId, req.originalUrl);
    if (userPriv == "RW" || userPriv == "R") {

        next();
    } else {
        res.sendStatus(403);
        return;

    }

}

function authorizeWriteRoute(req, res, next) {
    let userId = req.session.userData.userid;

    let userPriv = RouteRoleModel.getRouteRole(userId, req.originalUrl);
    if (userPriv == "RW") {
        next();
    } else {
        res.sendStatus(403);
        return;

    }
}

function checkSession(req, res, next) {

    if (req.session.userData) {
        next();
    } else {
        utils.clearCookie(res);
        res.sendStatus(403);
        return;

    }

}
module.exports = {
    authorizeReadRoute,
    authorizeWriteRoute,
    checkSession
};
