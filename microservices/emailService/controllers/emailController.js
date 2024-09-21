const EmailService = require('../services/emailService');

class EmailController {
    static async sendVerificationEmail(req, res) {
        const { firstname, lastname, email, token } = req.body;
        const backend = req.hostname;
        const port = process.env.PORT || 1999;

        try {
            await EmailService.sendVerificationEmail(firstname, lastname, email, token, backend, port);
            res.status(200).json({ message: 'Verification email sent successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async sendResetPasswordEmail(req, res) {
        const { firstname, lastname, email, token } = req.body;
        const backend = req.hostname;
        const port = process.env.PORT || 1999;

        try {
            await EmailService.sendResetPasswordEmail(firstname, lastname, email, token, backend, port);
            res.status(200).json({ message: 'Password reset email sent successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = EmailController;
