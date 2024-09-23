const express = require('express');
const cors = require('cors');
const scoreRoutes = require('./routes/scoreRoutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Use the score routes
app.use('/score', scoreRoutes);

const port = process.env.PORT || 5002;
app.listen(port, () => {
    console.log(`ScoreService running on port ${port}`);
});