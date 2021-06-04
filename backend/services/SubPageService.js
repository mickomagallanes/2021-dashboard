const SubPageModel = require('../models/SubPageModel.js');

"use strict";

class SubPageService {

    constructor() {

    }

    /**
   *  get pages based on logged-in user role
   * @param {Number} userId id of the user
   */
    static async getSubPagesByRole(userId) {
        let pagesArr = await SubPageModel.getSubPagesByRole(userId);

        if (pagesArr.length) {
            return pagesArr
        }
        return false
    }

}


module.exports = SubPageService;