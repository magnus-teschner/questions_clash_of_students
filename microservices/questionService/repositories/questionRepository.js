const con = require('../config/mysqlConfig');

class QuestionRepository {

    static async insertQuestion(questionData) {
        const query = `
      INSERT INTO questions 
      (user_id, question_type, frage, answer_a, answer_b, answer_c, answer_d, correct_answer, position, image_url, lection_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const values = [
            questionData.user_id,
            questionData.question_type,
            questionData.frage,
            questionData.answer_a,
            questionData.answer_b,
            questionData.answer_c,
            questionData.answer_d,
            questionData.correct_answer,
            questionData.position,
            questionData.image_url,
            questionData.lection_id,
        ];
        return con.query(query, values);
    }

    static async updateQuestion(updatedData) {
        const query = `
      UPDATE questions 
      SET frage = ?, question_type = ?, answer_a = ?, answer_b = ?, answer_c = ?, answer_d = ?, correct_answer = ?, 
      position = ?, image_url = ?, lection_id = ?
      WHERE question_id = ? 
    `;
        const values = [
            updatedData.frage,
            updatedData.question_type,
            updatedData.answer_a,
            updatedData.answer_b,
            updatedData.answer_c,
            updatedData.answer_d,
            updatedData.correct_answer,
            updatedData.position,
            updatedData.image_url,
            updatedData.lection_id,
            updatedData.question_id
        ];
        return con.query(query, values);
    }

    static async getQuestionsByUser(user_id) {
        const query = `
      SELECT * FROM questions WHERE user_id = ?;
    `;
        const values = [user_id];
        return con.query(query, values);
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

    // Get unused positions in a lection
    static async getUnusedPositions(lection_id, user_id) {
        const query = `
      SELECT position FROM questions WHERE lection_id = ? AND user_id = ?;
    `;
        const values = [lection_id, user_id];
        const [existingPositions] = await con.query(query, values);

        // Assuming position range is from 1 to 10
        const allPositions = Array.from({ length: 10 }, (_, i) => i + 1);
        const usedPositions = existingPositions.map((row) => row.position);
        const unusedPositions = allPositions.filter((pos) => !usedPositions.includes(pos));

        return unusedPositions;
    }

    // Get all programs
    static async getPrograms() {
        const query = `SELECT * FROM programs;`;
        return con.query(query);
    }

    // Get all courses by a specific user and program
    static async getCourses(user_id, program_id) {
        const query = `
      SELECT c.course_id, c.course_name FROM courses c
      WHERE c.creator = ? AND c.program_id = ?;
    `;
        const values = [user_id, program_id];
        return con.query(query, values);
    }
}

module.exports = QuestionRepository;
