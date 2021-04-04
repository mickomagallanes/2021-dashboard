const UserModel = require('../models/UserModel.js');
const bcrypt = require('bcrypt');

"use strict";

class UserService {

    constructor() {

    }

    /**
     * get all user data
     * @return all rows of users
     */

    static async getAllUser({ page, limit }) {
        let isPaged = !!page && !!limit;
        const startIndex = isPaged ? (page - 1) * limit : false;

        const userData = await UserModel.getAllUser(startIndex, limit);

        if (isPaged) {
            const userCount = await UserModel.getAllUserCount();
            return { "count": userCount[0].count, "users": userData };
        } else {
            return userData;
        }
    }

    /**
     * get all user data
     * @return one row of user
     */

    static async getUserById(id) {
        let ret = await UserModel.getUserById(id);

        if (ret.length) {
            ret[0].img = `/uploads/${ret[0].img}`;
            return ret[0];
        } else {
            return false;
        }

    }

    /**
    * get total count of user rows
    * @return count of all rows
    */

    static async getAllCount() {

        const userCount = await UserModel.getAllUserCount();
        return userCount[0];

    }

    /**
      * inserts username and password to the database
      * @param {String} username username of the user
      * @param {String} password plain password of the user
      * @param {String} roleid id from roles table if it is admin, etc
      */

    static async insertUser({ username, password, roleid }) {
        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        let ret = await UserModel.insertUser(username, hashedPassword, roleid);

        return ret;
    }

    /**
      * modify user data
      * @param {String} userid id of the user
      * @param {String} username username of the user
      * @param {String} password plain password of the user
      * @param {String} roleid id from roles table if it is admin, etc
      */

    static async modifyUser({ userid, username, password, roleid, imagePath }) {
        let ret;
        if (password !== undefined && password.length) {
            const saltRounds = 10;

            const hashedPassword = await bcrypt.hash(password, saltRounds);
            ret = await UserModel.modifyUser(userid, username, roleid, imagePath, hashedPassword);

        } else {
            ret = await UserModel.modifyUser(userid, username, roleid, imagePath);

        }

        return ret;
    }

    /**
     * inserts username and password to the database
     * @param {String} username username of the user
     * @param {String} password plain password of the user
     */

    static async loginUser({ username, password }) {
        let userObj = await UserModel.getByUsername(username);
        if (userObj.length) {
            const result = await bcrypt.compare(password, userObj[0].Password);
            if (result) {
                let userData = {
                    "uname": userObj[0].Username,
                    "userid": userObj[0].UserID
                }

                return { status: true, data: userData }
            }
        }

        return { status: false, data: undefined }
    }


}


module.exports = UserService;