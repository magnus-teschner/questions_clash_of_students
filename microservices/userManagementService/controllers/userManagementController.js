const UserManagementService = require('../services/userManagementService');

class UserManagementController {
    static async getHealth(req, res) {
        return res.status(200).json({ message: "User Management Backend works!" });
    }

    static async findIdByEmail(req, res) {
        try {
            const { email } = req.params;
            const userId = await UserManagementService.findIdByEmail(email);
            if (!userId) {
                return res.status(404).json({ error: `No user found with email ${email}` });
            }
            res.json(userId);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while retrieving user ID by email' });
            console.error(error);
        }
    }

    static async checkVerification(req, res) {
        try {
            const { user_id } = req.params;
            const verification_status = await UserManagementService.checkVerification(user_id);
            if (!verification_status) {
                return res.status(404).json({ error: `No verification info found for user_id ${user_id}` });
            }
            res.json(verification_status);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while retrieving verification status by ID' });
            console.error(error);
        }
    }


    static async findAccountByEmail(req, res) {
        try {
            const { email } = req.params;
            const account = await UserManagementService.findAccountByEmail(email);
            if (!account) {
                return res.status(404).json({ error: `No account found for email ${email}` });
            }
            res.json(account);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while retrieving account by email' });
            console.error(error);
        }
    }

    static async findAccountById(req, res) {
        try {
            const { user_id } = req.params;
            const account = await UserManagementService.findAccountById(user_id);
            if (!account) {
                return res.status(404).json({ error: `No account found for user ID ${user_id}` });
            }
            res.json(account);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while retrieving account by ID' });
            console.error(error);
        }
    }

    static async findAccountByToken(req, res) {
        try {
            const { token } = req.params;
            const account = await UserManagementService.findAccountByToken(token);
            if (!account) {
                return res.status(404).json({ error: `No account found with token ${token}` });
            }
            res.json(account);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while retrieving account by token' });
            console.error(error);
        }
    }

    static async verifyAccount(req, res) {
        try {
            const { user_id } = req.params;
            await UserManagementService.verifyAccount(user_id);
            res.status(200).json({ message: `Account with user ID ${user_id} has been verified` });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while verifying the account' });
            console.error(error);
        }
    }

    static async resetVerificationToken(req, res) {
        try {
            const { user_id } = req.params;
            await UserManagementService.resetVerificationToken(user_id);
            res.status(200).json({ message: `Verification token for user ID ${user_id} has been reset` });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while resetting the verification token' });
            console.error(error);
        }
    }

    static async createAccount(req, res) {
        try {
            const { firstname, lastname, email, password, role } = req.body;
            if (!firstname || !lastname || !email || !password || !role) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            await UserManagementService.createAccount(firstname, lastname, email, password, role);
            res.status(201).json({ message: 'Account created successfully' });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while creating the account' });
            console.error(error);
        }
    }

    static async updatePassword(req, res) {
        try {
            const { user_id } = req.params;
            const { newPassword } = req.body;
            if (!user_id || !newPassword) {
                return res.status(400).json({ error: 'User ID and new password are required' });
            }
            await UserManagementService.updatePassword(user_id, newPassword);
            res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while updating the password' });
            console.error(error);
        }
    }
}

module.exports = UserManagementController;
