const JWTService = require('../services/jwtService');

class JWTController {
    static generateToken(req, res) {
        const { email, firstname, lastname, program, course, professorEmail } = req.body;

        try {
            const token = JWTService.generateToken(email, firstname, lastname, program, course, professorEmail);
            res.json({ result: token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error generating token' });
        }
    }
}

module.exports = JWTController;
