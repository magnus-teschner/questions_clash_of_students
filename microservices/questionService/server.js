const express = require('express');
const cors = require('cors');
const questionRoutes = require('./routes/questionRoutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use('/', questionRoutes);

const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
