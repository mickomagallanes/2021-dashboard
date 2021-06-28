const MenuModel = require('../models/MenuModel.js');
const ParentMenuModel = require('../models/ParentMenuModel.js');

"use strict";

class MenusService {

    constructor() {

    }

    /**
     * inserts new parentmenu in the database
     * @param {Object} obj - An object.
     * @param {String} obj.parentMenuName name of the parent menu
     * @return {Object} result
     * @return {Number} result.insertId role id of last inserted
     */
    static async insertParentMenu({ parentMenuName }) {

        const obj = {
            parentMenuName: parentMenuName
        }
        let ret = await ParentMenuModel.insertParentMenu(obj);

        if (ret === false) {
            return { status: false }
        } else {

            const obj2 = {
                parentMenuID: ret.insertId,
                parentMenuSort: ret.insertId
            };

            let ret2 = await ParentMenuModel.modifyParentMenu(obj2);

            if (ret2 === false) {
                return { status: false }
            } else {
                return { status: true, data: ret.insertId }
            }

        }

    }

    /**
    * modify parent menu information to the database, doesn't have sort because its handled differently
    * @param {Object} obj - An object.
    * @param {String} obj.parentMenuID id of the parent menu
    * @param {String} [obj.parentMenuName] name of the parent menu
    * @return {Object} result
    * @return {Number} result.insertId parent menu id of last inserted
    */
    static async modifyParentMenu({ parentMenuID, parentMenuName }) {

        let obj = {
            parentMenuID: parentMenuID,
            parentMenuName: parentMenuName
        };

        let ret = await ParentMenuModel.modifyParentMenu(obj);
        if (ret == false) {
            return { status: false }
        } else {
            return { status: true, data: ret.insertId }
        }

    }

    /**
     *  get menu and parent menu based on logged-in user role
     * @param {Number} userId id of the user
     * @return {Array} result
     */
    static async getMenusByRole(userId) {
        let menuArr = await MenuModel.getMenusByRole(userId);

        if (menuArr.length) {
            return { status: true, data: menuArr }
        }
        return { status: false }

    }

    /**
     * get all parent menu rows
     * @param {Object} obj - An object.
     * @param {String} [obj.page] current page, must be greater than 0
     * @param {String} [obj.limit] limit count of rows, greater than 0
     * @return parentMenuArr all rows of parent menu
     */
    static async getAllParentMenus({ page, limit }) {

        if ((!!page && page > 0) && (!limit || !(limit > 0))) {
            return { status: false }
        } else if ((!!limit && limit > 0) && (!page || !(page > 0))) {
            return { status: false }
        }

        let isPaged = (!!page && page > 0) && (!!limit && limit > 0); // for pagination

        const startIndex = isPaged ? (page - 1) * limit : false;

        let parentMenuArr;
        if (startIndex === false) {
            parentMenuArr = await ParentMenuModel.getAllParentMenus();
        } else {
            parentMenuArr = await ParentMenuModel.getAllParentMenusPaged({ startIndex: startIndex, limit: limit });
        }

        if (parentMenuArr.length) {

            return { status: true, data: parentMenuArr }

        } else {
            return { status: false }
        }

    }

    /**
     * get parent menu info by parent menu id
     * @param {String} id parent menu id
     * @return one row of parent menu
     */
    static async getParentMenuById(id) {
        let ret = await ParentMenuModel.getParentMenuById(id);

        if (ret.length) {
            return { status: true, data: ret[0] }

        } else {
            return { status: false }
        }

    }

    /**
     * get total count of parent menu rows
     * @return count of all rows
     */
    static async getAllCount() {

        const parentMenuCount = await ParentMenuModel.getAllParentMenuCount();

        if (parentMenuCount.length) {
            return { status: true, data: parentMenuCount[0] }
        } else {
            return { status: false }
        }


    }

    /**
     *  get menu and parent menu based on logged-in user role
     * @param {Number} parentMenuID id of the user
     * @return {?} result
     */
    static async sortDownParentMenu(parentMenuID) {
        let result = await ParentMenuModel.sortDownParentMenu(parentMenuID);

        if (result !== false) {
            return { status: true }
        }
        return { status: false }

    }

    /**
     *  get menu and parent menu based on logged-in user role
     * @param {Number} parentMenuID id of the user
     * @return {?} result
     */
    static async sortUpParentMenu(parentMenuID) {
        let result = await ParentMenuModel.sortUpParentMenu(parentMenuID);

        if (result !== false) {
            return { status: true }
        }
        return { status: false }

    }
}


module.exports = MenusService;