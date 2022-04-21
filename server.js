// import express
const express = require('express');

// designate port & app
const PORT = process.env.PORT || 3001;
const app = express();

// express middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

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