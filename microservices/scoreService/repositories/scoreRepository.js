const db = require('../db/db');

class ScoreRepository {
    static async updateLectionScore(userId, lectionId, newLectionScore) {
        const sqlSelect = `SELECT lection_score FROM lection_scores WHERE lection_id = ? AND user_id = ?`;

        const existingScoreResult = await this.query(sqlSelect, [lectionId, userId]);
        const existingScore = existingScoreResult[0]?.lection_score;

        if (existingScore === undefined) {
            const sqlInsert = `
                INSERT INTO lection_scores (lection_id, user_id, lection_score)
                VALUES (?, ?, ?)`;
            return this.query(sqlInsert, [lectionId, userId, newLectionScore]);
        } else if (newLectionScore > existingScore) {
            const sqlUpdate = `
                UPDATE lection_scores SET lection_score = ? 
                WHERE lection_id = ? AND user_id = ?`;
            return this.query(sqlUpdate, [newLectionScore, lectionId, userId]);
        } else {
            return { message: 'Lection score not updated because the new score is not greater than the existing score' };
        }
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

    static calculateCourseProgress(userId, courseId) {
        const sql = `
            SELECT COUNT(*) AS completed_lections
            FROM lection_scores ls
            JOIN lections l ON ls.lection_id = l.lection_id
            WHERE ls.user_id = ? AND l.course_id = ? AND ls.lection_score > 0`;
        return this.query(sql, [userId, courseId]);
    }

    static updateCourseProgress(userId, courseId, progress) {
        const sql = `UPDATE course_members SET progress = ? WHERE user_id = ? AND course_id = ?`;
        return this.query(sql, [progress, userId, courseId]);
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
