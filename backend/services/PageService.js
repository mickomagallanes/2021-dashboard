const PageModel = require('../models/PageModel.js');

"use strict";

class PageService {

    constructor() {

    }

    /**
    *  get pages based on logged-in user role
    * @param {Number} userId id of the user
    */
    static async getPagesBySession(userId) {
        let pagesArr = await PageModel.getPagesByUser(userId);

        if (pagesArr.length) {
            return { status: true, data: pagesArr }
        }
        return { status: false }
    }


    /**
     * get all page rows
     * @param {Object} obj - An object.
     * @param {String} [obj.page] current page, must be greater than 0
     * @param {String} [obj.limit] limit count of rows, greater than 0
     * @return pageArr all rows of page
     */
    static async getAllPages({ page, limit }) {

        if ((!!page && page > 0) && (!limit || !(limit > 0))) {
            return { status: false }
        } else if ((!!limit && limit > 0) && (!page || !(page > 0))) {
            return { status: false }
        }

        let isPaged = (!!page && page > 0) && (!!limit && limit > 0); // for pagination

        const startIndex = isPaged ? (page - 1) * limit : false;

        let pageArr;
        if (startIndex === false) {
            pageArr = await PageModel.getAll();
        } else {
            pageArr = await PageModel.getAllPaged({ startIndex: startIndex, limit: limit });
        }

        if (pageArr.length) {

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
        let ret = await PageModel.getById(id);

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
    static async getAllPageCount() {

        const pageCount = await PageModel.getAllCount();

        if (pageCount.length) {
            return { status: true, data: pageCount[0] }
        } else {
            return { status: false }
        }


    }

}


module.exports = PageService;