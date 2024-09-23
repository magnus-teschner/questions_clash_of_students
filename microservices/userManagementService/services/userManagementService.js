const UserManagementRepository = require('../repositories/userManagementRepository');
const { hashPassword } = require('../utils/hashUtils');
const AppError = require('../utils/appError');
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

    static async checkEmailinUse(email) {
        const account = await this.findAccountByEmail(email);
        if (!account) {
            return false;
        }
        return true;
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
            throw new AppError('Invalid email for the specified role', 400);
        }

        const emailInUse = await this.checkEmailinUse(email);
        if (emailInUse) {
            throw new AppError('Email already in use', 409);
        }

        try {
            const hashedPassword = await hashPassword(password);
            const verificationToken = this.generateVerificationToken();
            const user_id = await UserManagementRepository.createAccount(
                firstname, lastname, email, hashedPassword, role, verificationToken
            );
            return { verificationToken, user_id };
        } catch (error) {
            throw new AppError('Failed to create account', 500);
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
