const db = require('../db/db'); // Assuming you have a db connection module

class QuestionRepository {
    static async getAllPrograms() {
        const sql = 'SELECT * FROM programs;';
        return this.query(sql);
    }

    static async getQuestionsByUser(userId) {
        const sql = `
            SELECT 
                q.*, -- Get all columns from the questions table
                p.program_name, 
                c.course_name, 
                l.lection_name
            FROM 
                questions q
            JOIN 
                lections l ON q.lection_id = l.lection_id
            JOIN 
                courses c ON l.course_id = c.course_id
            JOIN 
                programs p ON c.program_id = p.program_id
            WHERE 
                q.user_id = ?;
        `;
        return this.query(sql, [userId]);
    }

    static async getQuestion(course_id, lection_id, position) {
        const sql = `
            SELECT q.* FROM questions q
            JOIN lections l ON q.lection_id = l.lection_id
            WHERE l.course_id = ? AND q.lection_id = ? AND q.position = ?;
        `;
        return this.query(sql, [course_id, lection_id, position]);
    }

    static async addQuestion(user_id, question_type, frage, answer_a, answer_b, answer_c, answer_d, correct_answer, position, lection_id, image_url) {
        const sql = `
            INSERT INTO questions (user_id, question_type, frage, answer_a, answer_b, answer_c, answer_d, correct_answer, position, image_url, lection_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const values = [user_id, question_type, frage, answer_a, answer_b, answer_c, answer_d, correct_answer, position, image_url, lection_id];
        return this.query(sql, values);
    }

    static async updateQuestion(question_id, user_id, question_type, frage, answer_a, answer_b, answer_c, answer_d, correct_answer, image_url) {
        const sql = `
            UPDATE questions
            SET frage = ?, question_type = ?, answer_a = ?, answer_b = ?, answer_c = ?, answer_d = ?, correct_answer = ?, image_url = ?
            WHERE question_id = ? AND user_id = ?;
        `;
        const values = [frage, question_type, answer_a, answer_b, answer_c, answer_d, correct_answer, image_url, question_id, user_id];
        return this.query(sql, values);
    }

    static async getUnusedPositions(lectionId) {
        const sql = `
            SELECT position FROM questions
            WHERE lection_id = ?;
        `;
        return this.query(sql, [lectionId]);
    }

    static query(sql, params = []) {
        return new Promise((resolve, reject) => {
            db.query(sql, params, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
}

module.exports = QuestionRepository;
