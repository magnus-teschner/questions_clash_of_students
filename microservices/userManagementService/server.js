const express = require('express');
const cors = require('cors');
const userManagementRoutes = require('./routes/userManagementRoutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use('/', userManagementRoutes);

const port = process.env.PORT || 1000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
