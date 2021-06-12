const SubPageModel = require('../models/SubPageModel.js');

"use strict";

class SubPageService {

    constructor() {

    }

    /**
   *  get pages based on logged-in user role
   * @param {Number} userId id of the current user logged in
   */
    static async getSubPagesBySession(userId) {
        let pagesArr = await SubPageModel.getSubPagesByUserId(userId);

        if (pagesArr.length) {
            return pagesArr
        }
        return false
    }

}


module.exports = SubPageService;