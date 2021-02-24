// TODO: create authorization for API
const RouteRoleModel = require('../models/RouteRoleModel.js');

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
module.exports = {
    authorizeReadRoute,
    authorizeWriteRoute
};
