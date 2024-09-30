const mysql = require('mysql2');

const config_mysql = {
    user: "admin",
    password: "admin",
    host: "localhost",
    database: "clashOfStudents",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(config_mysql);

function query(sql, params, callback) {
    pool.query(sql, params, (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
}

function getConnection(callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, connection);
    });
}

module.exports = {
    query,
    getConnection
};