const ScoreService = require('../services/scoreService');

class ScoreController {
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
            const { userId, courseId, lectionName, score } = req.body;
            await ScoreService.updateLectionScore(userId, courseId, lectionName, score);
            res.status(200).json({ message: 'Lection score updated and course progress updated' });
        } catch (error) {
            res.status(500).json({ error: 'Error updating lection score and course progress' });
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
