const express = require('express');
const cors = require('cors');
const rankingRoutes = require('./routes/rankingRoutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use('/', rankingRoutes);

const port = process.env.PORT || 5004;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});