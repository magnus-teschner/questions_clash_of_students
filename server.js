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


app.get('/question', function(req, res) {	
	res.render('template.ejs', {});
});


app.listen(3000);
console.log("App is running");



