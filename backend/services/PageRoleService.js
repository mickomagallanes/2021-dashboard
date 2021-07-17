const PageRoleModel = require('../models/PageRoleModel.js');
const { mapArr } = require('../utils/looping.js');

"use strict";

class PageRoleService {

    constructor() {

    }

    /**
     * check if user role has privilege on the page
     * @param {Number} userId id of the user
     * @param {Array} pagePath path of the page, eg: "/user"
     */
    static async getPagePrivByUser(userId, pagePath) {
        let pageRoleObj = await PageRoleModel.getPagePrivByUser(userId, pagePath);

        if (pageRoleObj.length) {
            return { status: true, data: pageRoleObj[0].PrivilegeName }
        }
        return { status: false }
    }

    /**
   * get all page with optional role name if the row matched the role
   * @param {Number} roleId id of the role
   */
    static async getAllPagesLeftRole(roleId) {
        let pagesArr = await PageRoleModel.getAllPagesLeftRole(roleId);

        if (pagesArr.length) {
            return { status: true, data: pagesArr }
        }
        return { status: false }
    }

    /**
     * get a row using page id and user id
     * @param {Number} pageId id of the page
     * @param {Number} userId id of the user
     */
    static async getRowByUserAndPage(pageId, userId) {
        let pagesArr = await PageRoleModel.getRowByUserAndPage(pageId, userId);

        if (pagesArr.length) {
            return { status: true, data: pagesArr }
        }
        return { status: false }
    }

    /**
     * insert if PageID + RoleID does not exist, update if it exists
     * @param {Array} pageRolesArr
     */
    static async postPageRoleData(pageRolesArr) {
        let valueArr;

        try {
            valueArr = await mapArr(pageRolesArr, e => { return [e.PageID, e.RoleID, e.PrivilegeID] });
        } catch (err) {
            return { status: true }
        }

        let result = await PageRoleModel.postPageRoleData(valueArr);

        if (result !== false) {
            return { status: true }
        }
        return { status: false }
    }

}


module.exports = PageRoleService;