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


async function connectRabbitMQ() {
    const rabbitHost = process.env.RABBITMQ_HOST
    const connection = await amqp.connect(`amqp://rabbit`);
    const channel = await connection.createChannel();
    await channel.assertQueue('questionsQueue');
    console.log("connected_succesfully")
    return channel;
}

//const channelPromise = connectRabbitMQ();

app.post('/submit_question', async (req, res) => {
    const questionData = req.body;
    console.log('Received question:', questionData);

    const channel = await channelPromise;
    channel.sendToQueue('questionsQueue', Buffer.from(JSON.stringify(questionData)));

    res.json({ status: 'Success', message: 'Question sent to RabbitMQ' });
});


app.get('/question', function(req, res) {	
	res.render('questions.ejs', {});
});

app.get('/login', function(req, res) {	
	res.render('login.ejs', {});
});

app.get('/course', function(req, res) {	
	res.render('course.ejs', {});
});


app.listen(3000);
console.log("App is running");



