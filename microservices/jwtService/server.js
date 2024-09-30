const express = require('express');
const cors = require('cors');
const jwtRoutes = require('./routes/jwtRoutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use('/', jwtRoutes);

const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
