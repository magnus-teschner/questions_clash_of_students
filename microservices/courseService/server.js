const express = require('express');
const cors = require('cors');
const courseRoutes = require('./routes/courseRoutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use('/', courseRoutes);

const port = process.env.PORT || 5003;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});