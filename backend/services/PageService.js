const MenusModel = require('../models/MenuModel.js');
const PageModel = require('../models/PageModel.js');
const PageRoleModel = require('../models/PageRoleModel.js');

"use strict";

class PageService {

    constructor() {

    }

    /**
     * deleted page rows in the database
     * @param {String} pageID id of the page
     */
    static async deletePage(pageID) {

        let ret = await PageModel.deleteModel.deleteRow(pageID);

        if (ret == false) {
            return { status: false }
        } else {
            return { status: true }
        }

    }

    /**
    * delete bulk id array
    * @param {Array} idArray array containing ids of row
    */
    static async deleteBulkPage(idArray) {

        let ret = await PageModel.deleteModel.deleteBulkRows(idArray);

        if (ret == false) {
            return { status: false }
        } else {
            return { status: true }
        }

    }

    /**
     * inserts new page in the database
     * @param {String} roleID role id
     * @param {Object} obj - An object.
     * @param {String} obj.pageName name of the  page
     * @param {String} obj.pagePath path of page
     * @param {String} obj.privID privilege ID
     * @param {String} obj.menuName name of the menu
     * @param {Number} obj.pageMenuId id of parent menu
     * @return {Object} result
     * @return {Number} result.insertId role id of last inserted
     */
    static async insertPageBulk(roleID, { pageName, pagePath, privID, menuName, parentMenuID }) {
        let objPage = {
            pageName: pageName,
            pagePath: pagePath
        };

        let resultPage = await PageModel.insertPage(objPage);
        let pageID = resultPage.insertId;

        if (resultPage !== false) {
            let objMenu = {
                menuName: menuName,
                parentMenuID: parentMenuID,
                pageID: pageID
            };

            let resultFromMenu = await MenusModel.insertMenu(objMenu);

            if (resultFromMenu !== false) {
                let arrPageRole = [[pageID, roleID, privID]];

                let resultFromPageRole = await PageRoleModel.postPageRoleData(arrPageRole);

                if (resultFromPageRole === false) {

                    return { status: false }
                } else {
                    return { status: true, data: pageID }
                }
            }
        }

    }

    /**
    * modify page information to the database, doesn't have sort because its handled differently
    * @param {String} pageID id of the page
    * @param {String} roleID role id
    * @param {Object} obj - An object.
    * @param {String} obj.menuID id of menu
    * @param {String} obj.pageName name of the page
    * @param {String} obj.pagePath path of page
    * @param {String} obj.privID privilege ID
    * @param {String} obj.menuName name of the menu
    * @param {Number} obj.parentMenuID id of parent menu
    * @return {Object} result
    * @return {Number} result.insertId page id of last inserted
    */
    static async modifyPageBulk(pageID, roleID, { menuID, pageName, pagePath, privID, menuName, parentMenuID }) {

        let obj = {
            pageID: pageID,
            pageName: pageName,
            pagePath: pagePath
        };

        let resultPage = await PageModel.modifyPage(obj);

        if (resultPage !== false) {
            let objMenu = {
                menuName: menuName,
                parentMenuID: parentMenuID,
                pageID: pageID
            };

            let resultFromMenu;

            // if just in case the menu row doesn't exist yet, like getting deleted independently, then perform an add
            if (menuID === undefined) {
                resultFromMenu = await MenusModel.insertMenu(objMenu);

            } else {
                objMenu.menuID = menuID;
                resultFromMenu = await MenusModel.modifyMenu(objMenu);

            }

            if (resultFromMenu !== false) {
                let arrPageRole = [[pageID, roleID, privID]];

                let resultFromPageRole = await PageRoleModel.postPageRoleData(arrPageRole);

                if (resultFromPageRole === false) {

                    return { status: false }
                } else {
                    return { status: true, data: resultPage.insertId }
                }
            }
        }

    }

    /**
   * inserts new page in the database
   * @param {Object} obj - An object.
   * @param {String} obj.pageName name of the  page
   * @param {String} obj.pagePath path of page
   * @return {Object} result
   * @return {Number} result.insertId role id of last inserted
   */
    static async insertPage({ pageName, pagePath }) {
        let obj = {
            pageName: pageName,
            pagePath: pagePath
        };
        let ret = await PageModel.insertPage(obj);

        if (ret === false) {

            return { status: false }
        } else {
            return { status: true, data: ret.insertId }
        }

    }

    /**
    * modify page information to the database, doesn't have sort because its handled differently
    * @param {String} pageID id of the page
    * @param {Object} obj - An object.
    * @param {String} obj.pageName name of the page
    * @param {String} obj.pagePath path of page
    * @return {Object} result
    * @return {Number} result.insertId page id of last inserted
    */
    static async modifyPage(pageID, { pageName, pagePath }) {

        let obj = {
            pageID: pageID,
            pageName: pageName,
            pagePath: pagePath
        };

        let ret = await PageModel.modifyPage(obj);

        if (ret == false) {
            return { status: false }
        } else {
            return { status: true, data: ret.insertId }
        }

    }

    /**
    *  get pages based on logged-in user role
    * @param {Number} userId id of the user
    */
    static async getPagesBySession(userId) {
        let pagesArr = await PageModel.getPagesByUser(userId);

        if (pagesArr) {
            return { status: true, data: pagesArr }
        }
        return { status: false }
    }


    /**
     * get all page rows
     * @param {Object} obj - An object.
     * @param {String} [obj.page] current page, must be greater than 0
     * @param {String} [obj.limit] limit count of rows, greater than 0
     * @param {String} [obj.sortBy] column used for sort
     * @param {String} [obj.order] ASC or DESC
     * @return pageArr all rows of page
     */
    static async getAllPages({ page, limit, sortBy, order, filter }) {

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

        let pageArr = await PageModel.getterModel.getAll({
            startIndex: startIndex,
            limit: limit,
            sortBy: sortBy,
            order: order,
            filter: filter
        });

        if (pageArr) {

            return { status: true, data: pageArr }

        } else {
            return { status: false }
        }

    }

    /**
     * get page info by page id
     * @param {String} id page id
     * @return one row of page
     */
    static async getPageById(id) {
        let ret = await PageModel.getterModel.getById(id);

        if (ret.length) {
            return { status: true, data: ret[0] }

        } else {
            return { status: false }
        }

    }

    /**
     * get total count of page rows
     * @return count of all rows
     */
    static async getAllPageCount({ filter }) {

        const pageCount = await PageModel.getterModel.getAllCount({ filter });

        if (pageCount.length) {
            return { status: true, data: pageCount[0] }
        } else {
            return { status: false }
        }


    }

}


module.exports = PageService;