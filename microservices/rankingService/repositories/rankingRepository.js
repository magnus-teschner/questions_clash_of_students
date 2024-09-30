const db = require('../db/db');

class RankingRepository {
    static getCourses() {
        const query = 'SELECT DISTINCT course_name, course_id FROM courses';
        return this.query(query, []);
    }

    static getLections(selectedCourse) {
        const query = `
            SELECT lection_id, lection_name 
            FROM lections 
            WHERE course_id = (
                SELECT course_id FROM courses WHERE course_name = ?
            )
        `;
        return this.query(query, [selectedCourse]);
    }

    static getRanking(selectedCourse, selectedLection) {
        let query;
        let queryParams = [];
    
        if (selectedCourse === 'all') {
            query = `
                SELECT a.user_id, a.firstname, a.lastname, s.score
                FROM accounts a
                JOIN scores s ON a.user_id = s.user_id
                ORDER BY s.score DESC
            `;
        } else if (selectedLection === 'all' || !selectedLection) {
            query = `
                SELECT a.user_id, a.firstname, a.lastname, cm.course_score, c.course_name
                FROM accounts a
                JOIN course_members cm ON a.user_id = cm.user_id
                JOIN courses c ON cm.course_id = c.course_id
                WHERE c.course_name = ?
                ORDER BY cm.course_score DESC
            `;
            queryParams = [selectedCourse];
        } else {
            query = `
                SELECT a.user_id, a.firstname, a.lastname, ls.lection_score, l.lection_name
                FROM accounts a
                JOIN lection_scores ls ON a.user_id = ls.user_id
                JOIN lections l ON ls.lection_id = l.lection_id
                JOIN courses c ON l.course_id = c.course_id
                WHERE c.course_name = ? AND l.lection_name = ?
                ORDER BY ls.lection_score DESC
            `;
            queryParams = [selectedCourse, selectedLection];
        }
    
        return this.query(query, queryParams);
    }

    static query(sql, params) {
        return new Promise((resolve, reject) => {
            db.query(sql, params, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
}

module.exports = RankingRepository;
