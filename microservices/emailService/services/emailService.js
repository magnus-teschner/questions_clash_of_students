const EmailRepository = require('../repositories/emailRepository');

class EmailService {
    static async sendVerificationEmail(firstname, lastname, email, token, backend, port) {
        try {
            return await EmailRepository.sendVerificationEmail(firstname, lastname, email, token, backend, port);
        } catch (error) {
            throw new Error('Error sending verification email: ' + error.message);
        }
    }

    static async sendResetPasswordEmail(firstname, lastname, email, token, backend, port) {
        try {
            return await EmailRepository.sendResetPasswordEmail(firstname, lastname, email, token, backend, port);
        } catch (error) {
            throw new Error('Error sending reset password email: ' + error.message);
        }
    }
}

module.exports = EmailService;
