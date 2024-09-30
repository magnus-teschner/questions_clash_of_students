const db = require('../db/db');

class ScoreRepository {
    static async createUserScore(userId) {
        const sql = 'Insert into scores (user_id, score) VALUES (?, 0)';
        return this.query(sql, [userId]);
    }

    static getUserTotalScore(userId) {
        const sql = `SELECT score FROM scores WHERE user_id = ?`;
        return this.query(sql, [userId]);
    }

    // Fetch lectionId using lectionName and courseId
    static async getLectionByNameAndCourse(lectionName, courseId) {
        const sql = `SELECT lection_id FROM lections WHERE lection_name = ? AND course_id = ?`;
        const results = await this.query(sql, [lectionName, courseId]);
        return results[0] || null;
    }

    static async getLectionScore(userId, lectionId) {
        const sql = `SELECT lection_score FROM lection_scores WHERE user_id = ? AND lection_id = ?`;
        const results = await this.query(sql, [userId, lectionId]);
        return results[0] || null;
    }

    static async insertLectionScore(userId, lectionId, score) {
        const sql = `INSERT INTO lection_scores (user_id, lection_id, lection_score) VALUES (?, ?, ?)`;
        return this.query(sql, [userId, lectionId, score]);
    }

    static async updateLectionScore(userId, lectionId, score) {
        const sql = `UPDATE lection_scores SET lection_score = ? WHERE user_id = ? AND lection_id = ?`;
        return this.query(sql, [score, userId, lectionId]);
    }

    static async getTotalLectionScoreForCourse(userId, courseId) {
        const sql = `
            SELECT SUM(lection_score) as totalScore
            FROM lection_scores
            JOIN lections ON lection_scores.lection_id = lections.lection_id
            WHERE lection_scores.user_id = ? AND lections.course_id = ?
        `;
        const results = await this.query(sql, [userId, courseId]);
        return results[0].totalScore || 0;
    }

    static async updateCourseScore(userId, courseId, score) {
        const sql = `UPDATE course_members SET course_score = ? WHERE user_id = ? AND course_id = ?`;
        return this.query(sql, [score, userId, courseId]);
    }

    static async getTotalCourseScore(userId) {
        const sql = `SELECT SUM(course_score) as totalScore FROM course_members WHERE user_id = ?`;
        const results = await this.query(sql, [userId]);
        return results[0].totalScore || 0;
    }

    static async updateTotalScore(userId, totalScore) {
        const sql = `UPDATE scores SET score = ? WHERE user_id = ?`;
        return this.query(sql, [totalScore, userId]);
    }

    static async calculateCourseProgress(userId, courseId) {
        const sql = `
            SELECT COUNT(*) AS completed_lections
            FROM lection_scores ls
            JOIN lections l ON ls.lection_id = l.lection_id
            WHERE ls.user_id = ? AND l.course_id = ? AND ls.lection_score > 0
        `;
        const results = await this.query(sql, [userId, courseId]);
        return results[0].completed_lections;
    }

    static async updateCourseProgress(userId, courseId, progress) {
        const sql = `UPDATE course_members SET progress = ? WHERE user_id = ? AND course_id = ?`;
        return this.query(sql, [progress, userId, courseId]);
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
