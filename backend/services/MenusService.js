const MenusModel = require('../models/MenusModel.js');

"use strict";

class MenusService {

    constructor() {

    }

    /**
   *  get menu and parent menu based on logged-in user role
   * @param {Number} userId id of the user
   */
    static async getMenusByRole(userId) {
        let menuArr = await MenusModel.getMenusByRole(userId);

        if (menuArr.length) {
            return menuArr
        }
        return false
    }

}


module.exports = MenusService;