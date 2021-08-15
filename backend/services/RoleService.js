const RoleModel = require('../models/RoleModel.js');

"use strict";

class RoleService {

    constructor() {

    }

    /**
     * deleted role rows in the database
     * @param {String} roleID id of the menu
     */
    static async deleteRole(roleID) {

        let ret = await RoleModel.deleteModel.deleteRow(roleID);

        if (ret == false) {
            return { status: false }
        } else {
            return { status: true }
        }

    }

    /**
    * inserts new role in the database
    * @param {Object} obj - An object.
    * @param {String} obj.rolename name of the role
    * @return {Object} result
    * @return {Number} result.insertId user id of last inserted
    */
    static async insertRole({ rolename }) {

        const obj = {
            rolename: rolename
        }
        let ret = await RoleModel.insertRole(obj);

        if (ret === false) {
            return { status: false }
        } else {
            return { status: true, data: ret.insertId }
        }

    }

    /**
     * modify role information to the database
     * @param {String} roleid id of the role
     * @param {Object} obj - An object.
     * @param {String} [obj.rolename] name of the role
     * @return {Object} result
     * @return {Number} result.insertId user id of last inserted
     */

    static async modifyRole(roleid, { rolename }) {

        let obj = {
            roleid: roleid,
            rolename: rolename
        };

        let ret = await RoleModel.modifyRole(obj);
        if (ret == false) {
            return { status: false }
        } else {
            return { status: true, data: ret.insertId }
        }

    }

    /**
     * get role info by role if
     * @param {String} id role id
     * @return one row of role
     */

    static async getRoleById(id) {
        let ret = await RoleModel.getterModel.getById(id);

        if (ret.length) {
            return { status: true, data: ret[0] }

        } else {
            return { status: false }
        }

    }

    /**
    * get all roles
    */
    static async getAllRoles() {
        let roleArr = await RoleModel.getterModel.getAll();
        if (roleArr) {
            return { status: true, data: roleArr }
        } else {
            return { status: false }
        }

    }

    /**
    * get all roles count
    */
    static async getAllCount({ filter }) {
        let roleArr = await RoleModel.getterModel.getAllCount({ filter });
        if (roleArr.length) {
            return { status: true, data: roleArr[0] }
        } else {
            return { status: false }
        }

    }

}


module.exports = RoleService;