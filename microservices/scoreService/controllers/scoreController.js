const ScoreService = require('../services/scoreService');

class ScoreController {
    // Update the score for a lection
    static async updateLectionScore(req, res) {
        try {
            const { userId, lectionId, lectionScore } = req.body;
            await ScoreService.updateLectionScore(userId, lectionId, lectionScore);
            res.status(200).json({ message: 'Lection score updated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error updating lection score' });
            console.error(error);
        }
    }

    // Get the total score for a user
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
