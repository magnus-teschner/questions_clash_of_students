const rankingService = require('../services/rankingServices');

class RankingController {
    static async getRanking(req, res, next) {
        try {
            const selectedCourse = req.query.course || 'all';
            const selectedLection = req.query.lection || null;

            const result = await rankingService.getRankingData(selectedCourse, selectedLection);

            res.json({
                rankingList: result.rankingList,
                courses: result.courses,
                lections: result.lections,
                selectedCourse,
                selectedLection
            });
        } catch (error) {
            console.error('Error fetching ranking data:', error);
            res.status(500).json({ error: 'Error fetching ranking data' });
        }
    }
}

module.exports = RankingController;