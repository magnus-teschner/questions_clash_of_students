const rankingRepository = require('../repositories/rankingRepository');

class RankingService {
    static async getRankingData(selectedCourse, selectedLection) {
        const courses = await rankingRepository.getCourses();
        const lections = selectedCourse !== 'all' ? await rankingRepository.getLections(selectedCourse) : [];
        const rankingRows = await rankingRepository.getRanking(selectedCourse, selectedLection);

        let rankingList;

        if (selectedCourse === 'all') {
            rankingList = rankingRows
                .sort((a, b) => b.score - a.score)
                .map((user, index, sortedUsers) => {
                    const rank = index > 0 && sortedUsers[index - 1].score === user.score ? sortedUsers[index - 1].rank : index + 1;
                    return {
                        user_id: user.user_id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        score: user.score,
                        rank: rank
                    };
                });
        } else if (selectedLection === 'all' || !selectedLection) {
            rankingList = rankingRows
                .sort((a, b) => b.course_score - a.course_score)
                .map((user, index, sortedUsers) => {
                    const rank = index > 0 && sortedUsers[index - 1].course_score === user.course_score ? sortedUsers[index - 1].rank : index + 1;
                    return {
                        user_id: user.user_id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        course_score: user.course_score,
                        course_name: user.course_name,
                        rank: rank
                    };
                });
        } else {
            rankingList = rankingRows
                .sort((a, b) => b.lection_score - a.lection_score)
                .map((user, index, sortedUsers) => {
                    const rank = index > 0 && sortedUsers[index - 1].lection_score === user.lection_score ? sortedUsers[index - 1].rank : index + 1;
                    return {
                        user_id: user.user_id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        lection_score: user.lection_score,
                        lection_name: user.lection_name,
                        rank: rank
                    };
                });
        }
        return { courses, lections, rankingList };
    }
}

module.exports = RankingService;
