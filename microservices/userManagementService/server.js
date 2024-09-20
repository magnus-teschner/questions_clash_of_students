const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
let port = 1000;

const config_mysql = {
    user: "admin",
    password: "admin",
    host: process.env.EVENTORDERSDB || "localhost",
    database: "clashOfStudents"
};

const con = mysql.createConnection(config_mysql);

con.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.get('/accounts/:email', (req, res) => {
    const email = req.params.email;
    const sql = 'SELECT * FROM accounts WHERE email = ?';

    con.query(sql, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Account not found' });
        }

        res.json(results[0]);
    });
});

app.get('/accounts/verify-by-token/:token', (req, res) => {
    const token = req.params.token;
    const sql = 'SELECT * FROM accounts WHERE verificationToken = ?';

    con.query(sql, [token], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Account not found' });
        }

        res.json(results[0]);
    });
});

app.put('/accounts/:id/set-verified', (req, res) => {
    const userId = req.params.id;
    const sql = 'UPDATE accounts SET isVerified = 1 WHERE id = ?';

    con.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database update error' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Account not found' });
        }

        res.json({ message: 'Account successfully verified' });
    });
});

app.post('/accounts', (req, res, next) => {
    const { firstname, lastname, email, password, role } = req.body;

    if (validateEmailByRole(email, role) === false) {
        return res.status(400).json({ message: "Provided email does not match the required format." });
    }

    const query_check = 'SELECT * FROM accounts WHERE email = ?';
    con.query(query_check, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database query error' });
        }

        if (result.length > 0) {
            return res.status(409).json({ message: 'Email is already in use.' }); // 409 Conflict
        }

        const verificationToken = uuidv4();

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ error: 'Error hashing password' });
            }

            const query_insert = 'INSERT INTO accounts (firstname, lastname, email, password, role, verificationToken) VALUES (?, ?, ?, ?, ?, ?)';
            const values = [firstname, lastname, email, hashedPassword, role, verificationToken];

            con.query(query_insert, values, async (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Database insertion error' });
                }

                await sendVerificationEmail(req.body.fname, req.body.lname, req.body.email, verificationToken);
                return res.status(201).json({ message: "Successfully created user!" })
            });
        });
    });
});

app.post('/accounts/:id/verify', (req, res) => {
    const { verificationToken } = req.body;
    const userId = req.params.id;
    const sql = 'UPDATE accounts SET verificationToken = NULL WHERE id = ?';

    con.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database update error' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Account not found' });
        }

        res.json({ message: 'Verification token removed and account verified' });
    });
});

app.put('/accounts/:id/password', (req, res) => {
    const { password } = req.body;
    const userId = req.params.id;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: 'Error hashing password' });
        }

        const sql = 'UPDATE accounts SET password = ? WHERE id = ?';

        con.query(sql, [hashedPassword, userId], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database update error' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Account not found' });
            }

            res.json({ message: 'Password updated' });
        });
    });
});

function validateEmailByRole(email, role) {
    let emailPattern;

    if (role === 'student') {
        emailPattern = /^[a-zA-Z0-9._%+-]+@student.reutlingen-university\.de$/;
    } else if (role === 'professor') {
        emailPattern = /^[a-zA-Z0-9._%+-]+@reutlingen-university\.de$/;
    } else {
        return false;
    }

    return emailPattern.test(email);
}

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});

