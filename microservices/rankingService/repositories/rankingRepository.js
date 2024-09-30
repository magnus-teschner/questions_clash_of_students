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
        } else {
            query = `
                SELECT a.user_id, a.firstname, a.lastname, cm.course_score, c.course_name
                FROM accounts a
                JOIN course_members cm ON a.user_id = cm.user_id
                JOIN courses c ON cm.course_id = c.course_id
                WHERE c.course_name = ?
            `;
            queryParams = [selectedCourse];

            if (selectedLection) {
                query += `
                    AND EXISTS (
                        SELECT 1 
                        FROM lections l 
                        WHERE l.course_id = c.course_id
                        AND l.lection_name = ?
                    )
                `;
                queryParams.push(selectedLection);
            }

            query += ' ORDER BY cm.course_score DESC';
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
