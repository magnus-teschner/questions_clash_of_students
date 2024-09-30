const ScoreRepository = require('../repositories/scoreRepository');

class ScoreService {
    static async createUserScore(userId) {
        return await ScoreRepository.createUserScore(userId);
    }
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

            return { courseId, courseScore, totalScore };
        } catch (error) {
            throw new Error(`Error updating lection score: ${error.message}`);
        }
    }

    static async getCourseScore(userId, lectionId) {
        try {
            const result = await ScoreRepository.calculateCourseScore(lectionId, userId);
            if (!result[0]) {
                throw new Error('No course found for this lection');
            }
            const courseScore = result[0].total_course_score;
            const courseId = result[0].course_id;

            await ScoreRepository.updateCourseScore(userId, courseId, courseScore);

            return { courseId, courseScore };
        } catch (error) {
            throw new Error(`Error fetching course score: ${error.message}`);
        }
    }

    static async updateCourseProgress(userId, lectionId) {
        try {
            const result = await ScoreRepository.calculateCourseScore(lectionId, userId);
            if (!result[0]) {
                throw new Error('No course found for this lection');
            }
            const courseId = result[0].course_id;
            const progressResult = await ScoreRepository.calculateCourseProgress(userId, courseId);
            const progress = progressResult[0]?.completed_lections || 0;

            await ScoreRepository.updateCourseProgress(userId, courseId, progress);
            return progress;
        } catch (error) {
            throw new Error(`Error updating course progress: ${error.message}`);
        }
    }

    static async getUserTotalScore(userId) {
        try {
            const result = await ScoreRepository.getUserTotalScore(userId);
            console.log(result);
            return result[0].score;
        } catch (error) {
            throw new Error(`Error fetching user total score: ${error.message}`);
        }
    }
}

module.exports = ScoreService;
