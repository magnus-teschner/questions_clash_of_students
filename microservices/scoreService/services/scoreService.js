const ScoreRepository = require('../repositories/scoreRepository');

class ScoreService {
    static async updateLectionScore(userId, lectionId, lectionScore) {
        try {
            await ScoreRepository.updateLectionScore(userId, lectionId, lectionScore);

            const courseScoreResult = await ScoreRepository.calculateCourseScore(lectionId, userId);
            const courseScore = courseScoreResult[0]?.total_course_score || 0;
            const courseId = courseScoreResult[0]?.course_id;

            await ScoreRepository.updateCourseScore(userId, courseId, courseScore);

            const totalScoreResult = await ScoreRepository.calculateUserTotalScore(userId);
            const totalScore = totalScoreResult[0]?.total_score || 0;
            await ScoreRepository.updateUserTotalScore(userId, totalScore);
        } catch (error) {
            throw new Error(`Error updating lection score: ${error.message}`);
        }
    }

    static async getUserTotalScore(userId) {
        try {
            const result = await ScoreRepository.getUserTotalScore(userId);
            return result[0]?.score || null;
        } catch (error) {
            throw new Error(`Error fetching user total score: ${error.message}`);
        }
    }
}

module.exports = ScoreService;
