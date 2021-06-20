const PageModel = require('../models/PageModel.js');

"use strict";

class PageService {

    constructor() {

    }

    /**
    *  get pages based on logged-in user role
    * @param {Number} userId id of the user
    */
    static async getPagesBySession(userId) {
        let pagesArr = await PageModel.getPagesByUser(userId);

        if (pagesArr.length) {
            return { status: true, data: pagesArr }
        }
        return { status: false }
    }

}


module.exports = PageService;