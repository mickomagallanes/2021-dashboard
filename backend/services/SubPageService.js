const SubPageModel = require('../models/SubPageModel.js');

"use strict";

class SubPageService {

    constructor() {

    }

    /**
     *  get pages based on logged-in user role
     * @param {Number} userId id of the current user logged in
     */
    static async getSubPagesBySession(userId) {
        let pagesArr = await SubPageModel.getSubPagesByUserId(userId);

        if (pagesArr.length) {
            return { status: true, data: pagesArr }
        }
        return { status: false }
    }


    /**
     * inserts new subPage in the database
     * @param {Object} obj - An object.
     * @param {String} obj.subPageName name of the  subPage
     * @param {String} obj.subPagePath path of subpage
     * @param {String} obj.pageID id of page, foreign key
     * @return {Object} result
     * @return {Number} result.insertId role id of last inserted
     */
    static async insertSubPage({ subPageName, subPagePath, pageID }) {
        let obj = {
            subPageName: subPageName,
            subPagePath: subPagePath,
            pageID: pageID

        };
        let ret = await SubPageModel.insertSubPage(obj);

        if (ret === false) {

            return { status: false }
        } else {
            return { status: true, data: ret.insertId }
        }

    }

    /**
    * modify subPage information to the database, doesn't have sort because its handled differently
    * @param {String} subPageID id of the subPage
    * @param {Object} obj - An object.
    * @param {String} obj.subPageName name of the subPage
    * @param {String} obj.subPagePath path of subpage
    * @param {String} obj.pageID id of page, foreign key
    * @return {Object} result
    * @return {Number} result.insertId subPage id of last inserted
    */
    static async modifySubPage(subPageID, { subPageName, subPagePath, pageID }) {

        let obj = {
            subPageID: subPageID,
            subPageName: subPageName,
            subPagePath: subPagePath,
            pageID: pageID
        };

        let ret = await SubPageModel.modifySubPage(obj);
        if (ret == false) {
            return { status: false }
        } else {
            return { status: true, data: ret.insertId }
        }

    }

    /**
     * get all subPage rows
     * @param {Object} obj - An object.
     * @param {String} [obj.page] current page, must be greater than 0
     * @param {String} [obj.limit] limit count of rows, greater than 0
     * @return subPageArr all rows of subPage
     */
    static async getAllSubPages({ page, limit }) {

        if ((!!page && page > 0) && (!limit || !(limit > 0))) {
            return { status: false }
        } else if ((!!limit && limit > 0) && (!page || !(page > 0))) {
            return { status: false }
        }

        let isPaged = (!!page && page > 0) && (!!limit && limit > 0); // for pagination

        const startIndex = isPaged ? (page - 1) * limit : false;

        let subPageArr;
        if (startIndex === false) {
            subPageArr = await SubPageModel.getAll();
        } else {
            subPageArr = await SubPageModel.getAllPaged({ startIndex: startIndex, limit: limit });
        }

        if (subPageArr.length) {

            return { status: true, data: subPageArr }

        } else {
            return { status: false }
        }

    }

    /**
     * get subPage info by subPage id
     * @param {String} id subPage id
     * @return one row of subPage
     */
    static async getSubPageById(id) {
        let ret = await SubPageModel.getById(id);

        if (ret.length) {
            return { status: true, data: ret[0] }

        } else {
            return { status: false }
        }

    }

    /**
     * get total count of subPage rows
     * @return count of all rows
     */
    static async getAllSubPageCount() {

        const subPageCount = await SubPageModel.getAllCount();

        if (subPageCount.length) {
            return { status: true, data: subPageCount[0] }
        } else {
            return { status: false }
        }


    }


}


module.exports = SubPageService;