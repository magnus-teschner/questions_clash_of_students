const ScoreRepository = require('../repositories/scoreRepository');

class ScoreService {
    static async createUserScore(userId) {
        return await ScoreRepository.createUserScore(userId);
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
    static async updateLectionScore(userId, courseId, lectionName, newScore) {
        try {
            // Get the lectionId based on lectionName and courseId
            const lection = await ScoreRepository.getLectionByNameAndCourse(lectionName, courseId);
            if (!lection) {
                throw new Error('Lection not found');
            }
            const lectionId = lection.lection_id;

            const existingLectionScore = await ScoreRepository.getLectionScore(userId, lectionId);

            if (!existingLectionScore) {
                await ScoreRepository.insertLectionScore(userId, lectionId, newScore);
            } else if (existingLectionScore.lection_score < newScore) {
                await ScoreRepository.updateLectionScore(userId, lectionId, newScore);
            } else {
                return;
            }

            const totalLectionScore = await ScoreRepository.getTotalLectionScoreForCourse(userId, courseId);
            await ScoreRepository.updateCourseScore(userId, courseId, totalLectionScore);

            const totalCourseScore = await ScoreRepository.getTotalCourseScore(userId);
            await ScoreRepository.updateTotalScore(userId, totalCourseScore);

            const progress = await ScoreRepository.calculateCourseProgress(userId, courseId);
            await ScoreRepository.updateCourseProgress(userId, courseId, progress);
        } catch (error) {
            throw new Error(`Error updating lection score: ${error.message}`);
        }
    }
}

module.exports = ScoreService;
