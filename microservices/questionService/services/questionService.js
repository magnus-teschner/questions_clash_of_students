const QuestionRepository = require('../repositories/questionRepository');
const minioService = require('../services/minioService');
const { v4: uuidv4 } = require('uuid');

class QuestionService {
    static async getAllPrograms() {
        return await QuestionRepository.getAllPrograms();
    }

    static async getQuestionsByUser(userId) {
        return await QuestionRepository.getQuestionsByUser(userId);
    }

    static async getQuestion(courseId, lectionName, position) {
        const result = await QuestionRepository.getQuestion(courseId, lectionName, position);
        return result[0];
    }

    static async addQuestion(user_id, question_type, frage, answer_a, answer_b, answer_c, answer_d, correct_answer, position, lection_id, file) {
        let image_url = null;

        if (file) {
            image_url = await minioService.uploadImageToMinio(file.buffer, file.mimetype);
        }

        return await QuestionRepository.addQuestion(
            user_id,
            question_type,
            frage,
            answer_a,
            answer_b,
            answer_c,
            answer_d,
            correct_answer,
            position,
            lection_id,
            image_url
        );
    }

    static async updateQuestion(question_id, user_id, question_type, frage, answer_a, answer_b, answer_c, answer_d, correct_answer, file) {
        let image_url = null;

        if (file) {
            image_url = await minioService.uploadImageToMinio(file.buffer, file.mimetype);
        }

        return await QuestionRepository.updateQuestion(
            question_id,
            user_id,
            question_type,
            frage,
            answer_a,
            answer_b,
            answer_c,
            answer_d,
            correct_answer,
            image_url
        );
    }

    static async getUnusedPositions(lectionId) {
        const usedPositions = await QuestionRepository.getUnusedPositions(lectionId);
        const existingValues = usedPositions.map(row => row.position);
        const allPositions = Array.from({ length: 9 }, (_, i) => i + 1);
        const unusedPositions = allPositions.filter(position => !existingValues.includes(position));
        return unusedPositions;
    }
}

module.exports = QuestionService;
