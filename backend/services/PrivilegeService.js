const RoleModel = require('../models/RoleModel.js');

"use strict";

class PrivilegeService {

    constructor() {

    }

    /**
    * get all privileges
    */
    static async getAllPrivileges() {
        let privArr = await RoleModel.getAllPrivileges();
        if (privArr.length) {
            return { status: true, data: privArr }
        } else {
            return { status: false }
        }

    }


}


module.exports = PrivilegeService;