const db = require('../db/db'); // Assuming you have a db connection module

class QuestionRepository {
    static async getAllPrograms() {
        const query = 'SELECT * FROM programs;';
        return db.query(query);
    }

    static async getQuestionsByUser(userId) {
        const query = `SELECT * FROM questions WHERE user_id = ?;`;
        const values = [userId];
        return db.query(query, values);
    }

    static async getQuestion(course_id, lection_id, position) {
        const query = `
          SELECT q.* FROM questions q
          JOIN lections l ON q.lection_id = l.lection_id
          WHERE l.course_id = ? AND q.lection_id = ? AND q.position = ?;
        `;
        const values = [course_id, lection_id, position];
        return con.query(query, values);
    }

    static async addQuestion(question) {
        const query = `
          INSERT INTO questions (user_id, question_type, frage, answer_a, answer_b, answer_c, answer_d, correct_answer, position, image_url, lection_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const values = [
            question.user_id,
            question.question_type,
            question.frage,
            question.answer_a,
            question.answer_b,
            question.answer_c,
            question.answer_d,
            question.correct_answer,
            question.position,
            question.image_url,
            question.lection_id,
        ];
        return db.query(query, values);
    }

    static async updateQuestion(question) {
        const query = `
          UPDATE questions
          SET frage = ?, question_type = ?, answer_a = ?, answer_b = ?, answer_c = ?, answer_d = ?, correct_answer = ?, image_url = ?
          WHERE question_id = ? AND user_id = ?;
        `;
        const values = [
            question.frage,
            question.question_type,
            question.answer_a,
            question.answer_b,
            question.answer_c,
            question.answer_d,
            question.correct_answer,
            question.image_url,
            question.question_id,
            question.user_id,
        ];
        return db.query(query, values);
    }

    static async getUnusedPositions(userId, programId, courseId, lectionId) {
        const query = `
          SELECT position FROM questions
          WHERE program_id = ? AND course_id = ? AND lection_id = ? AND user_id = ?;
        `;
        const values = [programId, courseId, lectionId, userId];
        return db.query(query, values);
    }
}
module.exports = QuestionRepository;
