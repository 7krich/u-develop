// import mysql2
const mysql = require('mysql2');

// connect to database (mysql)
const db = mysql.createConnection(
    {
        host: 'localhost',
        // my sql username
        user: 'root',
        password: 'krich',
        database: 'election'
    },
    console.log('Connected to the election database.')
);

// since this functionality was separated it needs to be exported
module.exports = db;