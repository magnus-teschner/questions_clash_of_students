const QuestionRepository = require('../repositories/questionRepository');
const minioClient = require('../minio/minioClient'); // MinIO client setup
const { v4: uuidv4 } = require('uuid');

class QuestionService {
    static async getAllPrograms() {
        return await QuestionRepository.getAllPrograms();
    }

    static async getQuestionsByUser(userId) {
        return await QuestionRepository.getQuestionsByUser(userId);
    }

    static async getQuestion(courseId, lectionId, position) {
        return await QuestionRepository.getQuestion(courseId, lectionId, position);
    }

    static async addQuestion(question, file) {
        let imageUrl = null;

        if (file) {
            imageUrl = await this.uploadImageToMinIO(file);
        }

        const questionData = { ...question, imageUrl };
        return await QuestionRepository.addQuestion(questionData);
    }

    static async updateQuestion(question, file) {
        let imageUrl = null;

        if (file) {
            imageUrl = await this.uploadImageToMinIO(file);
        }

        const questionData = { ...question, imageUrl };
        return await QuestionRepository.updateQuestion(questionData);
    }

    static async getUnusedPositions(userId, programId, courseId, lectionId) {
        const usedPositions = await QuestionRepository.getUnusedPositions(userId, programId, courseId, lectionId);
        const existingValues = usedPositions.map(row => row.position);
        const allPositions = Array.from({ length: 9 }, (_, i) => i + 1);
        const unusedPositions = allPositions.filter(position => !existingValues.includes(position));
        return unusedPositions;
    }

    static async uploadImageToMinIO(file) {
        try {
            const fileEnding = file.mimetype.split('/')[1];
            const fileName = `${uuidv4()}.${fileEnding}`;
            const bucket = 'questions-images';

            await minioClient.putObject(bucket, fileName, file.buffer);
            const imageUrl = `http://${minioClient.endPoint}:${minioClient.port}/${bucket}/${fileName}`;
            return imageUrl;
        } catch (error) {
            console.error('Error uploading to MinIO:', error);
            throw new Error('Image upload failed');
        }
    }
}

module.exports = QuestionService;
