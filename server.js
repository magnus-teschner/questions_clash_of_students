const http = require('http');
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





app.get('/question', function(req, res) {	
	res.render('template.ejs', {});
});


app.listen(3000);
console.log("App is running");



