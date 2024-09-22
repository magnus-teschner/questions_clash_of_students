const express = require('express');
const cors = require('cors');
const userManagementRoutes = require('./routes/userManagementRoutes'); // Adjust the path to your file

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Use the user management routes
app.use('/', userManagementRoutes);

const port = process.env.PORT || 1000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
