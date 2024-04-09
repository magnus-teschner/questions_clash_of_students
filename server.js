const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Send "questions.html" when the "/questions" route is accessed
app.get('/questions', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views', 'questions.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
