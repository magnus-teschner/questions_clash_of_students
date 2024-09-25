const db = require('../db/db');

class CourseRepository {
    static async getAllCourses() {
        const query = `
            SELECT c.*, p.program_name, a.lastname AS creator_lastname
            FROM courses c
            JOIN programs p ON c.program_id = p.program_id
            JOIN accounts a ON c.creator = a.user_id
        `;
        return this.query(query);
    }

    static async getEnrolledCourses(userId) {
        const query = `
            SELECT c.*, cm.progress, cm.course_score, p.program_name, a.lastname AS creator_lastname
            FROM courses c 
            JOIN course_members cm ON c.course_id = cm.course_id
            JOIN programs p ON c.program_id = p.program_id
            JOIN accounts a ON c.creator = a.user_id
            WHERE cm.user_id = ?
        `;
        return this.query(query, [userId]);
    }

    static enrollCourse(user_id, course_id) {
        const query = `INSERT INTO course_members (user_id, course_id, progress, course_score) VALUES (?, ?, 0, 0)`;
        return this.query(query, [user_id, course_id]);
    }

    static unenrollCourse(user_id, course_id) {
        const query = `DELETE FROM course_members WHERE user_id = ? AND course_id = ?`;
        return this.query(query, [user_id, course_id]);
    }

    static deleteCourse(user_id, course_id) {
        const query = 'DELETE FROM courses WHERE course_id = ? AND creator = ?';
        const values = [course_id, user_id];
        return this.query(query, values);
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

module.exports = CourseRepository;