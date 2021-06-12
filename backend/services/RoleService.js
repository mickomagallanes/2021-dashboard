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
        return roleArr;
    }

    /**
    * get all roles count
    */
    static async getAllCount() {
        let roleArr = await RoleModel.getAllCount();
        return roleArr;
    }

}


module.exports = RoleService;