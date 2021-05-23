const PageRoleModel = require('../models/PageRoleModel.js');

"use strict";

class PageRoleService {

    constructor() {

    }

    /**
     * check if user role has privilege on the page
     * @param {Number} userId id of the user
     * @param {String} pagePath path of the page, eg: "/user"
     */
    static async getPageRole(userId, pagePath) {
        let pageRoleObj = await PageRoleModel.getPageRole(userId, pagePath);

        if (pageRoleObj.length) {
            return { status: true, priv: pageRoleObj[0].Privilege }
        }
        return { status: false }
    }

    /**
    *  get pages based on logged-in user role
    * @param {Number} userId id of the user
    */
    static async getPagesByRole(userId) {
        let pagesArr = await PageRoleModel.getPagesByRole(userId);

        if (pagesArr.length) {
            return pagesArr
        }
        return false
    }

}


module.exports = PageRoleService;