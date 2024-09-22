const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'yourSecretKey';  // Move secret to environment variables for security

class JWTService {
    static generateToken(email, firstname, lastname, program, course, professorEmail) {
        const payload = {
            email: email,
            firstname: firstname,
            lastname: lastname,
            program: program,
            course: course,
            professor_email: professorEmail
        };

        return jwt.sign(payload, secretKey, { expiresIn: '24h' });
    }
}

module.exports = JWTService;
