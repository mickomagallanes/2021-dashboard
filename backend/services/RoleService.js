const RoleModel = require('../models/RoleModel.js');

"use strict";

class RoleService {

    constructor() {

    }

    /**
    * get all roles
    */
    static async getAllRoles() {
        let roleArr = await RoleModel.getAllRoles();
        if (roleArr.length) {
            return { status: true, data: roleArr }
        } else {
            return { status: false }
        }

    }

    /**
    * get all roles count
    */
    static async getAllCount() {
        let roleArr = await RoleModel.getAllCount();
        if (roleArr.length) {
            return { status: true, data: roleArr[0] }
        } else {
            return { status: false }
        }

    }

}


module.exports = RoleService;