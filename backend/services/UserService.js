const UserModel = require('../models/UserModel.js');
const bcrypt = require('bcrypt');
const fs = require('fs');

"use strict";

class UserService {

    constructor() {

    }

    /**
     * deleted user rows in the database
     * @param {String} userID id of the user
     */
    static async deleteUser(userID) {

        let ret = await UserModel.crud.deleteRow(userID);

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
    static async deleteBulkUser(idArray) {

        let ret = await UserModel.crud.deleteBulkRows(idArray);

        if (ret == false) {
            return { status: false }
        } else {
            return { status: true }
        }

    }

    /**
     * get all user data
     * @param {Object} obj - An object.
     * @param {String} [obj.page] current page, must be greater than 0
     * @param {String} [obj.limit] limit count of rows, greater than 0
     * @param {String} [obj.sortBy] column used for sort
     * @param {String} [obj.order] ASC or DESC
     * @return all rows of users
     */

    static async getAllUser({ page, limit, sortBy, order, filter }) {
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

        let userData = await UserModel.crud.getAll({
            startIndex: startIndex,
            limit: limit,
            sortBy: sortBy,
            order: order,
            filter: filter
        });

        if (userData) {

            return { status: true, data: userData }

        } else {
            return { status: false }
        }
    }

    /**
     * get user info by user id
     * @param {String} id user id
     * @return one row of user
     */

    static async getUserById(id) {
        let ret = await UserModel.getUserById(id);

        if (ret.length) {
            ret[0].img = `/uploads/${ret[0].img}`;
            return { status: true, data: ret[0] }

        } else {
            return { status: false }
        }

    }

    /**
    * get total count of user rows
    * @return count of all rows
    */

    static async getAllCount({ filter }) {

        const userCount = await UserModel.crud.getAllCount({ filter });
        if (userCount.length) {
            return { status: true, data: userCount[0] }
        } else {
            return { status: false }
        }


    }

    /**
      * inserts username and password to the database
      * @param {Object} obj - An object.
      * @param {String} obj.username username of the user
      * @param {String} obj.password plain password of the user
      * @param {String} obj.roleid id from roles table if it is admin, etc
      */

    static async insertUser({ username, password, roleid }) {
        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const obj = {
            username: username,
            password: hashedPassword,
            roleId: roleid
        }
        let ret = await UserModel.insertUser(obj);

        if (ret === false) {
            return { status: false }
        } else {
            return { status: true, data: ret.insertId }
        }

    }

    /**
      * modify user data
      * @param {String} userid id of the user
      * @param {Object} obj - An object.
      * @param {String} obj.username username of the user
      * @param {String} obj.password plain password of the user
      * @param {String} obj.roleid id from roles table if it is admin, etc
      */

    static async modifyUser(userid, { username, password, roleid, imagePath }) {
        let ret;
        if (password !== undefined && password.length) {
            const saltRounds = 10;


            const hashedPassword = await bcrypt.hash(password, saltRounds);
            let obj = {
                userid: userid,
                username: username,
                roleid: roleid,
                imagePath: imagePath,
                password: hashedPassword

            };

            ret = await UserModel.modifyUser(obj);

        } else {
            let obj = {
                userid: userid,
                username: username,
                roleid: roleid,
                imagePath: imagePath
            };

            ret = await UserModel.modifyUser(obj);
        }

        if (ret == false) {
            return { status: false }
        } else {
            return { status: true }
        }

    }

    /**
     * inserts username and password to the database
     * @param {Object} obj - An object.
     * @param {String} obj.username username of the user
     * @param {String} obj.password plain password of the user
     */

    static async loginUser({ username, password }) {
        let userObj = await UserModel.getByUsername(username);
        if (userObj.length) {
            const result = await bcrypt.compare(password, userObj[0].Password);
            if (result) {
                let userData = {
                    "uname": userObj[0].Username,
                    "userid": userObj[0].UserID,
                    "uimage": `/uploads/${userObj[0].Image}`,
                    "roleid": userObj[0].RoleID
                }

                return { status: true, data: userData }
            } else {
                return { status: false }
            }
        } else {
            return { status: false }
        }


    }


    /**
     * insert an image filename to the user row
     * @param {Object} obj - An object.
     * @param {String} obj.userId id of the user
     * @param {String} obj.fileName filename of the image uploaded
     */
    static async insertImg({ userId, fileName }) {

        // delete current img stored, to free space
        let currentImgObj = await this.getUserById(userId);

        if (currentImgObj.img) {
            fs.unlink("public" + currentImgObj.img, function (err) {
                if (err) return console.error(err);

            });
        }

        let result = await UserService.modifyUser(userId, { "imagePath": fileName });
        return result;
    }

}


module.exports = UserService;