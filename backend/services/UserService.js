const UserModel = require('../models/UserModel.js');
const bcrypt = require('bcrypt');

"use strict";

class UserService {

    constructor() {

    }

    /**
      * inserts username and password to the database
      * @param {String} username username of the user
      * @param {String} password plain password of the user
      * @param {String} roleId id from roles table if it is admin, etc
      */

    static async insertUser(username, password, roleId) {
        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        let ret = await UserModel.insertUser(username, hashedPassword, roleId);

        return ret;
    }

    /**
     * inserts username and password to the database
     * @param {String} username username of the user
     * @param {String} password plain password of the user
     */

    static async loginUser(username, password) {
        let userObj = await UserModel.getByUsername(username);
        if (userObj.length) {
            const result = await bcrypt.compare(password, userObj[0].Password);
            if (result) {
                let userData = {
                    "uname": userObj[0].Username,
                    "userid": userObj[0].UserID,
                    "roleid": userObj[0].RoleID
                }

                return { status: true, data: userData }
            }
        }

        return { status: false, data: undefined }
    }


}


module.exports = UserService;