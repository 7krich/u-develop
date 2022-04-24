// import mysql2
const mysql = require('mysql2');
// import express
const express = require('express');
const res = require('express/lib/response');

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
// Get all candidates
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            // exit databse once error is encountered
            return;
        }

        // display rows as an object in browser and tell user get request was sucess
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// get a single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    // assign input id as an array to that it can be passed into query call below
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            // notify client request wasn't accepted & to try a diff request
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message:'sucess',
            data: row
        });
    });
});

// delete a candidate
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });

// create a candidate
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
//     VALUES (?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];

// db.query(sql, params, (err, result) => {
//     if (err) {
//      console.log(err);
//     }
//     console.log(result);
// });

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