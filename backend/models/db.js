const mysql = require('mysql');
class mysql_conn {

    constructor() { }

    // ===================================================================
    // query with parameters, 
    // if there is ? in sql command, parameters must be specified in array
    static query(cmd, param = []) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function (err, connection) {
                if (err) {
                    reject(err);
                } else {
                    connection.query(cmd, param, (err, rows) => {

                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
                }
            });
        });

    }


    // ===================================================================
    // rows , 
    // query and return rows
    // if there is ? in sql command, parameters must be specified in array
    static rows(qfields = "", tablename = "", wheres = "", where_values = []) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function (err, connection) {
                if (err) {
                    reject(err)
                } else {
                    // create select command
                    let stmt = `SELECT ${qfields} FROM ${tablename} ${wheres};`;
                    connection.query(stmt, where_values, (err, rows) => {

                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    })
                }
            })
        });

    }

    // ===================================================================
    // insert , 
    // query and return rows
    // if there is ? in sql command, parameters must be specified in array
    static insert(tablename = "", datas = {}) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function (err, connection) {
                if (err) {
                    reject(err)
                } else {
                    // seperate the array
                    let columns = "";
                    let prep_values = "";
                    let values = [];
                    for (let key in datas) {
                        columns += (columns == "") ? "" : ", ";
                        columns += key;
                        prep_values += (prep_values == "") ? "" : ", ";
                        prep_values += "?";
                        values.push(datas[key]);
                    }
                    let sql_str = `INSERT INTO ${tablename}(${columns}) VALUES(${prep_values}) ;`;
                    connection.query(sql_str, values, (err, rows) => {

                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    })
                }
            })
        });

    }

    // ===================================================================
    // delete , 
    // query and return rows
    // if there is ? in sql command, parameters must be specified in array
    static delete(tablename = "", wheres = "", where_values = []) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function (err, connection) {
                if (err) {
                    reject(err)
                } else {
                    let stmt = `DELETE FROM ${tablename} ${wheres}`;
                    connection.query(stmt, where_values, (err, rows) => {

                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    })
                }
            })
        });

    }

    // ===================================================================
    // update , 
    // query and return rows
    // if there is ? in sql command, parameters must be specified in array
    static update(tablename = "", datas = {}, wheres = "", where_values = []) {
        try {
            return new Promise((resolve, reject) => {
                this.pool.getConnection(function (err, connection) {
                    if (err) {
                        reject(err);
                    } else {
                        // seperate the array
                        let columns = "";
                        let values = [];
                        for (let key in datas) {
                            columns += (columns == "") ? "" : ", ";
                            columns += `${key}=?`;
                            values.push(datas[key]);
                        }
                        where_values.forEach(function (item, index) {
                            values.push(item);
                        });

                        let sql_str = `UPDATE ${tablename} SET ${columns} ${wheres} ;`;
                        //console.log(sql_str);
                        //console.log(values);
                        connection.query(sql_str, values, (err, rows) => {

                            if (err) {
                                reject(err);
                            } else {
                                resolve(rows);
                            }
                            connection.release();
                        });
                    }
                });
            });

        } catch (e) {
            throw new RangeError(e.message);
        }

    }


    static isexist(cmd, param = []) {
        try {
            return new Promise((resolve, reject) => {
                this.pool.getConnection(function (err, connection) {
                    if (err) {
                        reject(err);
                    } else {
                        connection.query(cmd, param, (err, rows) => {

                            if (err) {
                                reject(err);
                            } else {
                                resolve(rows.length >= 1);
                            }
                            connection.release();
                        });
                    }
                });
            });

        } catch (e) {
            throw new RangeError(e.message);
        }
    }

    // ===================================================================
    // ending
    static close() {
        this.pool.end(function (err) {
            // all connections in the pool have ended
        });
    }


}
if (process.env.DB_HOST) {
    mysql_conn.pool = mysql.createPool({
        connectionLimit: 20,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASS
    });
} else if (process.env.CLOUD_SQL_CONNECTION_NAME) {
    mysql_conn.pool = mysql.createPool({
        connectionLimit: 20,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASS,
        socketPath: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
    });
}


module.exports = mysql_conn;