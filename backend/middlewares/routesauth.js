
const RouteRoleModel = require('../models/RouteRoleModel.js');
const utils = require('../utils/session.js');

async function authorizeReadRoute(req, res, next) {
    const userId = req.session.userData.userid;

    const resp = await RouteRoleModel.getRouteRole(userId, req.baseUrl);

    const { Privilege } = resp[0];

    if (Privilege == "RW" || Privilege == "R") {

        next();
    } else {
        res.sendStatus(403);
        return;

    }

}

async function authorizeWriteRoute(req, res, next) {
    const userId = req.session.userData.userid;

    let resp = await RouteRoleModel.getRouteRole(userId, req.baseUrl);

    const { Privilege } = resp[0];

    if (Privilege == "RW") {
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
