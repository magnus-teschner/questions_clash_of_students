//jwt generation
// JWT secret key
const jwt = require('jsonwebtoken');
const secretKey = 'yourSecretKey';

// Endpoint to generate a JWT token
app.post('/jwt', (req, res) => {
    const { program, course, professorEmail } = req.body;

    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Construct the JWT payload
    const payload = {
        email: req.user.email,
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        program: program,
        course: course,
        professor_email: professorEmail
    };

    // Generate the token
    const token = jwt.sign(payload, secretKey, { expiresIn: '24h' });

    // Send the token back as the response
    res.json({ result: token });
});