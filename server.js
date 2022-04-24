// import mysql2
const mysql = require('mysql2');
// import express
const express = require('express');
const res = require('express/lib/response');
// import inputCheck function
const inputCheck = require('./utils/inputCheck');

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
    // select all fields in candidates table using wildcard found via dot notiation
    // also select the name of the parties from the parties table (using parties.name)
    // rename that added column party_name so it doesn't just list name in the joined table
    // use left join so we return the whole candidates table, with just the party name selected
    // return the parties where the candidate's party_id equals the party id from the parties table
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id`;

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
    // select all the fields in the candidates table and select the names from the parties table
    // rename the parties.name as party_name so the column doesn't just list name as the title
    // use left join to display a table that returns the entire candidates table and the selects items from the parties table
    // provide results where the candidates party id equals the foreign key party id
    // perform this when the single candidate id is provided
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id
                WHERE candidates.id = ?`;
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
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
  
    db.query(sql, params, (err, result) => {
        // if request prompts an error, respond with error message
        if (err) {
            res.statusMessage(400).json({ error: res.message });
        //prvent user from deleting candidate that does not exist
        } else if (!result.affectedRows) {
            res.json({
            // if there are no affected rows let user know that the candidate doesn't exist
            message: 'Candidate not found'
            });
        } else {
            res.json({
            message: 'deleted',
            // change(i.e. delete) affected rows
            changes: result.affectedRows,
            id: req.params.id
            });
        }
    });
});

// Create a candidate
// post rute used to instert a candidate into table
// using object descructuring to pull body out of the request object
app.post('/api/candidate', ({ body }, res) => {
    // validate user added user date prior to entering it into the database
    // if inputCheck returns an error, return 400 err to promt new user request & reasons for err
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
    // instert candidate row information
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
    VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    // execute prepared SQL statement above
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

// display all parties
app.get('/api/parties', (req, res) => {
    const sql = `SELECT * FROM parties`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// display an individual party
app.get('/api/party:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// delete parties
app.delete('/api/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message });
            // check if anything was deleted
        } else if (!result.affectedRows) {
            res.json({
                message: 'Party not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

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