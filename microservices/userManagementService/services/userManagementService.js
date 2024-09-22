const UserManagementRepository = require('../repositories/userManagementRepository');
const { hashPassword } = require('../utils/hashUtils');
const { v4: uuidv4 } = require('uuid');

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

    static generateVerificationToken() {
        return uuidv4();
    }

    static async findIdByEmail(email) {
        const result = await UserManagementRepository.findIdByEmail(email);
        return result[0];
    }

    static async checkVerification(user_id) {
        const result = await UserManagementRepository.checkVerification(user_id);
        return result[0];
    }

    static async findAccountById(user_id) {
        const result = await UserManagementRepository.findAccountById(user_id);
        return result[0];
    }

    static async findAccountByEmail(email) {
        const result = await UserManagementRepository.findAccountByEmail(email);
        return result[0];
    }

    static async findAccountByToken(token) {
        const result = await UserManagementRepository.findAccountByToken(token);
        return result[0];
    }

    static async verifyAccount(user_id) {
        return await UserManagementRepository.verifyAccount(user_id);
    }

    static async resetVerificationToken(user_id) {
        return await UserManagementRepository.resetVerificationToken(user_id);
    }

    static async createAccount(firstname, lastname, email, password, role) {
        if (!this.validateEmailByRole(email, role)) {
            throw new Error('Invalid email for the specified role');
        }

        try {
            const hashedPassword = await hashPassword(password);
            const verificationToken = this.generateVerificationToken();
            return await UserManagementRepository.createAccount(
                firstname, lastname, email, hashedPassword, role, verificationToken
            );
            //send verification email
            //insert user score in table
        } catch (error) {
            throw new Error(error);
        }
    }

    static async updatePassword(user_id, newPassword) {
        try {
            const hashedPassword = await hashPassword(newPassword);
            return await UserManagementRepository.updatePassword(user_id, hashedPassword);
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = UserManagementService;
