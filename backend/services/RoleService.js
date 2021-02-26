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

}


module.exports = RoleService;