const express = require('express');
const cors = require('cors');
const emailRoutes = require('./routes/emailRoutes'); // Adjust the path as necessary

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use('/email', emailRoutes);

const port = process.env.PORT || 1001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
