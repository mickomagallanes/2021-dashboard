const mysql_conn = require("./db.js");
const { loopArr } = require('../utils/looping.js');

"use strict";

// class extension for page with Deletion, returns all delete functions needed
class DeleteModel {

    /**
     * get count of all menu for pagination
     * @param {String} tableName name of the table on selected model
     * @param {String} primaryKey name of column of primary key
     */
    constructor(tableName, primaryKey) {
        this.tableName = tableName;
        this.primaryKey = primaryKey;

    }

    /**
    * deleted rows in the database
    * @param {String} id id of the row
    */
    async deleteRow(id) {

        try {
            const result = await mysql_conn.delete(this.tableName, `where ${this.primaryKey}=?`, [id]);
            return result;

        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
     * delete bulk id array
     * @param {Array} idArray array containing ids of row
     */
    async deleteBulkRows(idArray) {
        let whereClause = ` WHERE ${this.primaryKey} IN ( `

        await loopArr(idArray, (indx) => {
            if (indx === 0) {
                whereClause += ` ? `;
            } else {
                whereClause += ` , ? `;
            }
        });

        whereClause += `)`;

        try {
            const result = await mysql_conn.delete(this.tableName, whereClause, idArray);
            return result;

        } catch (err) {
            console.error(err);
            return false;
        }
    }
}


module.exports = DeleteModel;