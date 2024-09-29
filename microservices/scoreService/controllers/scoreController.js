const ScoreService = require('../services/scoreService');

class ScoreController {
    createUserScore

    static async createUserScore(req, res) {
        try {
            const { userId } = req.params;
            await ScoreService.createUserScore(userId);
            res.status(200).send('Created User Score');
        } catch (error) {
            res.status(500).json({ error: 'Error creating user score' });
            console.error(error);
        }
    }

    static async updateLectionScore(req, res) {
        try {
            const { userId, lectionId, lectionScore } = req.body;
            await ScoreService.updateLectionScore(userId, lectionId, lectionScore);

            const progress = await ScoreService.updateCourseProgress(userId, lectionId);

            res.status(200).json({ message: 'Lection score updated and course progress updated', progress });
        } catch (error) {
            res.status(500).json({ error: 'Error updating lection score and course progress' });
            console.error(error);
        }
    }

    static async getCourseScore(req, res) {
        try {
            const { userId, lectionId } = req.params;
            const { courseId, courseScore } = await ScoreService.getCourseScore(userId, lectionId);
            res.json({ courseId, courseScore });
        } catch (error) {
            res.status(500).json({ error: 'Error fetching course score' });
            console.error(error);
        }
    }

    static async getUserTotalScore(req, res) {
        try {
            const { userId } = req.params;
            const totalScore = await ScoreService.getUserTotalScore(userId);
            if (totalScore === null) {
                return res.status(404).json({ error: `No score found for user ${userId}` });
            }
            res.json({ totalScore });
        } catch (error) {
            res.status(500).json({ error: 'Error fetching user total score' });
            console.error(error);
        }
    }
}

module.exports = ScoreController;
