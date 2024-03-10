const http = require('http');
const amqp = require('amqplib');
const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

app.use(cors({
    origin: '*'
}));

const { Pool } = require('pg');
const { Console } = require('console');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'users',
    password: 'my-secret-pw',
    port: 5432,
  });

async function connectRabbitMQ() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('questionsQueue');
    return channel;
}

const channelPromise = connectRabbitMQ();

app.post('/submit_question', async (req, res) => {
    const questionData = req.body;
    console.log('Received question:', questionData);

    const channel = await channelPromise;
    channel.sendToQueue('questionsQueue', Buffer.from(JSON.stringify(questionData)));

    res.json({ status: 'Success', message: 'Question sent to RabbitMQ' });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM Benutzer WHERE email = $1', [email]);
        const user = result.rows[0];

        if (user && user.passwort === password) {
            // Authentifizierung erfolgreich, hier kannst du eine Session erstellen oder einen Token senden
            res.json({ status: 'Success', message: 'Login successful' });
        } else {
            res.status(401).json({ status: 'Error', message: 'Invalid email or password' });
        }

        client.release();
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ status: 'Error', message: 'Internal Server Error' });
    }
});

app.get('/', function(req, res) {
    res.sendFile('views/index.html', { root: __dirname });
});

app.get('/question', function(req, res) {	
	res.render('template.ejs', {});
});


app.listen(3000);
console.log("App is running");



