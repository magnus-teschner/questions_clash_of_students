const db = require('../db/db');

class ScoreRepository {
    static updateLectionScore(userId, lectionId, lectionScore) {
        const sql = `
            INSERT INTO lection_scores (lection_id, user_id, lection_score)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE lection_score = ?`;
        return this.query(sql, [lectionId, userId, lectionScore, lectionScore]);
    }

    static calculateCourseScore(lectionId, userId) {
        const sql = `
            SELECT l.course_id, SUM(ls.lection_score) AS total_course_score
            FROM lection_scores ls
            JOIN lections l ON ls.lection_id = l.lection_id
            WHERE l.course_id = (SELECT course_id FROM lections WHERE lection_id = ?)
            AND ls.user_id = ?
            GROUP BY l.course_id`;
        return this.query(sql, [lectionId, userId]);
    }

    static updateCourseScore(userId, courseId, courseScore) {
        const sql = `UPDATE course_members SET course_score = ? WHERE course_id = ? AND user_id = ?`;
        return this.query(sql, [courseScore, courseId, userId]);
    }

    static calculateUserTotalScore(userId) {
        const sql = `SELECT SUM(course_score) AS total_score FROM course_members WHERE user_id = ?`;
        return this.query(sql, [userId]);
    }

    static updateUserTotalScore(userId, totalScore) {
        const sql = `
            INSERT INTO scores (user_id, score) VALUES (?, ?)
            ON DUPLICATE KEY UPDATE score = ?`;
        return this.query(sql, [userId, totalScore, totalScore]);
    }

    static getUserTotalScore(userId) {
        const sql = `SELECT score FROM scores WHERE user_id = ?`;
        return this.query(sql, [userId]);
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

module.exports = ScoreRepository;
