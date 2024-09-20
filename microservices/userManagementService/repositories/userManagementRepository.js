const db = require('../db/db');

class UserManagementRepository {
    static findIdByEmail(email) {
        const sql = 'SELECT user_id FROM accounts WHERE email = ?';
        return this.query(sql, [email]);
    }

    static findAccountById(user_id) {
        const sql = 'SELECT * FROM accounts WHERE user_id = ?';
        return this.query(sql, [user_id]);
    }

    static findAccountByToken(token) {
        const sql = 'SELECT * FROM accounts WHERE verificationToken = ?';
        return this.query(sql, [token]);
    }

    static verifyAccount(user_id) {
        const sql = 'UPDATE accounts SET isVerified = 1 WHERE id = ?';
        return this.query(sql, [user_id]);
    }

    static resetVerificationToken(user_id) {
        const sql = 'UPDATE accounts SET verificationToken = NULL WHERE id = ?';
        return this.query(sql, [user_id]);
    }

    static createAccount(firstname, lastname, email, hashedPassword, role, verificationToken) {
        const query_insert = 'INSERT INTO accounts (firstname, lastname, email, password, role, verificationToken) VALUES (?, ?, ?, ?, ?, ?)';
        return this.query(sql, [firstname, lastname, email, hashedPassword, role, verificationToken]);
    }

    static updatePassword(hashedPassword) {
        const query_insert = 'UPDATE accounts SET password = ? WHERE id = ?';
        return this.query(sql, [hashedPassword]);
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