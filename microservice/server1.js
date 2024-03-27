const http = require('http');
const amqp = require('amqplib');
const express = require('express');
const mysql = require('mysql')
const app = express();
const fs = require('fs');
const cors = require('cors');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'my-secret-pw',
    database: 'questions'

});

// Define your endpoint
app.get('/data', (req, res) => {
    var course = req.query.course
    var level = req.query.level
    var position = req.query.position

    db.query(`select frage, option_a, option_b, option_c, option_d, correct_option from final_questions where course = "${course}" AND level = "${level}" AND position = "${position}";`, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});


db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL Server")
})
app.listen(3000);
console.log("App is running 1");



