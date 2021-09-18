
const RouteRoleModel = require('../models/RouteRoleModel.js');
const utils = require('../utils/session.js');

/**
 * read if user has read privilege on the route path
 */
async function authorizeReadRoute(req, res, next) {
    const userId = req.session.userData.userid;

    const resp = await RouteRoleModel.getRoutePrivByUser(userId, req.baseUrl);
    if (resp.length) {
        const { PrivilegeName } = resp[0];

        if (PrivilegeName == "RW" || PrivilegeName == "R") {

            next();
        } else {
            res.sendStatus(403);
            return;

        }
    } else {
        res.sendStatus(403);
        return;

    }


}

/**
 * read if user has write privilege on the route path
 */
async function authorizeWriteRoute(req, res, next) {
    const userId = req.session.userData.userid;

    let resp = await RouteRoleModel.getRoutePrivByUser(userId, req.baseUrl);

    if (resp.length) {
        const { PrivilegeName } = resp[0];

        if (PrivilegeName == "RW") {
            next();
        } else {
            res.sendStatus(403);
            return;

        }
    } else {
        res.sendStatus(403);
        return;

    }
}

/**
 * check if user has valid session, if not then clear cookie
 */
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
