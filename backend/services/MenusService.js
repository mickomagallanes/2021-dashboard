const MenuModel = require('../models/MenuModel.js');
const ParentMenuModel = require('../models/ParentMenuModel.js');

"use strict";

class MenusService {

    constructor() {

    }

    /******************************** Menu ***************************************/

    /**
     * deleted menu rows in the database
     * @param {String} menuID id of the menu
     */
    static async deleteMenu(menuID) {

        let ret = await MenuModel.deleteMenu(menuID);

        if (ret == false) {
            return { status: false }
        } else {
            return { status: true }
        }

    }

    /**
     * inserts new menu in the database
     * @param {Object} obj - An object.
     * @param {String} obj.menuName name of the  menu
     * @param {String} obj.pageID id of page, foreign key
     * @param {String} obj.parentMenuID id of parent menu, foreign key
     * @return {Object} result
     * @return {Number} result.insertId role id of last inserted
     */
    static async insertMenu({ menuName, pageID, parentMenuID }) {
        let obj = {
            menuName: menuName,
            pageID: pageID,
            parentMenuID: parentMenuID === "null" ? null : parentMenuID
        };
        let ret = await MenuModel.insertMenu(obj);

        if (ret === false) {

            return { status: false }
        } else {
            return { status: true, data: ret.insertId }
        }

    }

    /**
    * modify menu information to the database, doesn't have sort because its handled differently
    * @param {String} menuID id of the menu
    * @param {Object} obj - An object.
    * @param {String} obj.menuName name of the menu
    * @param {String} obj.pageID id of page, foreign key
    * @param {String} obj.parentMenuID id of parent menu, foreign key
    * @return {Object} result
    * @return {Number} result.insertId menu id of last inserted
    */
    static async modifyMenu(menuID, { menuName, pageID, parentMenuID }) {

        let obj = {
            menuID: menuID,
            menuName: menuName,
            pageID: pageID,
            parentMenuID: parentMenuID === "null" ? null : parentMenuID
        };

        let ret = await MenuModel.modifyMenu(obj);
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
     * get all menu rows
     * @param {Object} obj - An object.
     * @param {String} [obj.page] current page, must be greater than 0
     * @param {String} [obj.limit] limit count of rows, greater than 0
     * @param {String} [obj.sortBy] column used for sort
     * @param {String} [obj.order] ASC or DESC
     * @return menuArr all rows of menu
     */
    static async getAllMenus({ page, limit, sortBy, order, filter }) {

        if ((!!page && page > 0) && (!limit || !(limit > 0))) {
            return { status: false }
        } else if ((!!limit && limit > 0) && (!page || !(page > 0))) {
            return { status: false }
        }

        let isPaged = (!!page && page > 0) && (!!limit && limit > 0); // for pagination

        const startIndex = isPaged ? (page - 1) * limit : false;

        if (sortBy) {
            if (order === "DESC") {
                order = "DESC";
            } else {
                order = "ASC";
            }
        }

        let menuArr = await MenuModel.getAll({
            startIndex,
            limit,
            sortBy,
            order,
            filter
        });

        if (menuArr) {

            return { status: true, data: menuArr }

        } else {
            return { status: false }
        }

    }

    /**
     * get menu info by menu id
     * @param {String} id menu id
     * @return one row of menu
     */
    static async getMenuById(id) {
        let ret = await MenuModel.getById(id);

        if (ret.length) {
            return { status: true, data: ret[0] }

        } else {
            return { status: false }
        }

    }

    /**
     * get menu info by page id
     * @param {String} id page id
     * @return one row of menu
     */
    static async getMenuByPageId(id) {
        let ret = await MenuModel.getMenuByPageId(id);

        if (ret.length) {
            return { status: true, data: ret[0] }

        } else {
            return { status: false }
        }

    }

    /**
     * get total count of menu rows
     * @return count of all rows
     */
    static async getAllMenuCount({ filter }) {

        const menuCount = await MenuModel.getAllCount({ filter });

        if (menuCount.length) {
            return { status: true, data: menuCount[0] }
        } else {
            return { status: false }
        }


    }

    /*************************** Parent Menu *************************************/
    /**
     * deleted parent menu rows in the database
     * @param {String} parentMenuID id of the menu
     */
    static async deleteParentMenu(parentMenuID) {

        let ret = await ParentMenuModel.deleteParentMenu(parentMenuID);

        if (ret == false) {
            return { status: false }
        } else {
            return { status: true }
        }

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
    * @param {String} parentMenuID id of the parent menu
    * @param {Object} obj - An object.
    * @param {String} [obj.parentMenuName] name of the parent menu
    * @return {Object} result
    * @return {Number} result.insertId parent menu id of last inserted
    */
    static async modifyParentMenu(parentMenuID, { parentMenuName }) {

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
     * get all parent menu rows
     * @param {Object} obj - An object.
     * @param {String} [obj.page] current page, must be greater than 0
     * @param {String} [obj.limit] limit count of rows, greater than 0
     * @param {String} [obj.sortBy] column used for sort
     * @param {String} [obj.order] ASC or DESC
     * @return parentMenuArr all rows of parent menu
     */
    static async getAllParentMenus({ page, limit, sortBy, order, filter }) {

        if ((!!page && page > 0) && (!limit || !(limit > 0))) {
            return { status: false }
        } else if ((!!limit && limit > 0) && (!page || !(page > 0))) {
            return { status: false }
        }

        if (sortBy) {
            if (order === "DESC") {
                order = "DESC";
            } else {
                order = "ASC";
            }
        }

        let isPaged = (!!page && page > 0) && (!!limit && limit > 0); // for pagination

        const startIndex = isPaged ? (page - 1) * limit : false;

        let parentMenuArr = await ParentMenuModel.getAll({
            startIndex: startIndex,
            limit: limit,
            sortBy: sortBy,
            order: order,
            filter: filter
        });

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
        let ret = await ParentMenuModel.getById(id);

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
    static async getAllParentMenuCount({ filter }) {

        const parentMenuCount = await ParentMenuModel.getAllCount({ filter });

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