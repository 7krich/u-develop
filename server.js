// import mysql2
const mysql = require('mysql2');
// import express
const express = require('express');

// designate port & app
const PORT = process.env.PORT || 3001;
const app = express();

// express middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

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

// query database to test connection by returning all data in candidates table
// query method exectues callback with resulting rows matching the query
db.query(`SELECT * FROM candidates`, (err, rows) => {
    // display each row as an object
    console.log(rows);
})

// default response for any other request not supported by the app (not found)
// catch all for endpoints not supported
// always use last so it doens't override subsequent routes
app.use((req, res) => {
    res.status(404).end();
});

// start express.js server & notify in command line
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});