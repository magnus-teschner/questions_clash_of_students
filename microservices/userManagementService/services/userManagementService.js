const UserManagementRepository = require('../repositories/userManagementRepository');
const { hashPassword } = require('../utils/hashUtils');

class UserManagementService {
    static validateEmailByRole(email, role) {
        let emailPattern;

        if (role === 'student') {
            emailPattern = /^[a-zA-Z0-9._%+-]+@student.reutlingen-university\.de$/;
        } else if (role === 'professor') {
            emailPattern = /^[a-zA-Z0-9._%+-]+@reutlingen-university\.de$/;
        } else {
            return false;
        }

        return emailPattern.test(email);
    }

    static async findIdByEmail(email) {
        return await UserManagementRepository.findIdByEmail(email);
    }

    static async findAccountById(user_id) {
        return await UserManagementRepository.findAccountById(user_id);
    }

    static async findAccountByToken(token) {
        return await UserManagementRepository.findAccountByToken(token);
    }

    static async verifyAccount(user_id) {
        return await UserManagementRepository.verifyAccount(user_id);
    }

    static async resetVerificationToken(user_id) {
        return await UserManagementRepository.resetVerificationToken(user_id);
    }

    static async createAccount(firstname, lastname, email, hashedPassword, role, verificationToken) {
        if (!this.validateEmailByRole(email, role)) {
            throw new Error('Invalid email for the specified role');
        }
        return await UserManagementRepository.createAccount(firstname, lastname, email, hashedPassword, role, verificationToken);
    }

    static async updatePassword(user_id, hashedPassword) {
        return await UserManagementRepository.updatePassword(user_id, hashedPassword);
    }
}

module.exports = UserManagementService;
