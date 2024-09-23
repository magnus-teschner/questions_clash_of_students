const db = require('../db/db');

class UserManagementRepository {
    static findIdByEmail(email) {
        const sql = 'SELECT user_id FROM accounts WHERE email = ?';
        return this.query(sql, [email]);
    }

    static checkVerification(user_id) {
        const sql = 'SELECT isVerified FROM accounts WHERE user_id = ?';
        return this.query(sql, [user_id]);
    }

    static findAccountById(user_id) {
        const sql = 'SELECT * FROM accounts WHERE user_id = ?';
        return this.query(sql, [user_id]);
    }

    static findAccountByEmail(email) {
        const sql = 'SELECT * FROM accounts WHERE email = ?';
        return this.query(sql, [email]);
    }

    static findAccountByToken(token) {
        const sql = 'SELECT * FROM accounts WHERE verificationToken = ?';
        return this.query(sql, [token]);
    }

    static verifyAccount(user_id) {
        const sql = 'UPDATE accounts SET isVerified = 1 WHERE user_id = ?';
        return this.query(sql, [user_id]);
    }

    static resetVerificationToken(user_id) {
        const sql = 'UPDATE accounts SET verificationToken = NULL WHERE user_id = ?';
        return this.query(sql, [user_id]);
    }

    static async createAccount(firstname, lastname, email, hashedPassword, role, verificationToken) {
        const sql = `
            INSERT INTO accounts (firstname, lastname, email, password, role, verificationToken)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const result = await this.query(sql, [firstname, lastname, email, hashedPassword, role, verificationToken]);
        return result.insertId;
    }

    static updatePassword(user_id, hashedPassword) {
        const sql = 'UPDATE accounts SET password = ? WHERE user_id = ?';
        return this.query(sql, [hashedPassword, user_id]);
    }



    static query(sql, params) {
        return new Promise((resolve, reject) => {
            db.query(sql, params, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
}

module.exports = UserManagementRepository;