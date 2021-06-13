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
    static async getPagePrivBySession(userId, pagePath) {
        let pageRoleObj = await PageRoleModel.getPagePrivByUser(userId, pagePath);

        if (pageRoleObj.length) {
            return { status: true, data: pageRoleObj[0].Privilege }
        }
        return { status: false }
    }

    /**
    *  get pages based on logged-in user role
    * @param {Number} userId id of the user
    */
    static async getPagesBySession(userId) {
        let pagesArr = await PageRoleModel.getPagesByUser(userId);

        if (pagesArr.length) {
            return { status: true, data: pagesArr }
        }
        return { status: false }
    }

}


module.exports = PageRoleService;