const db = require('../db/db');

class CourseRepository {

    static async moveCourse(userId, programId, courseId) {
        const query = `
            UPDATE courses SET program_id = ? WHERE course_id = ? AND creator = ?
        `;
        return this.query(query, [programId, courseId, userId]);
    }


    static async createLection(courseId, lectionName) {
        const query = `
            Insert into lections (lection_name, course_id) VALUES (?,?)
        `;
        return this.query(query, [lectionName, courseId]);
    }

    static async createCourse(userId, programId, courseName) {
        const query = `
            Insert into courses (course_name, program_id, creator) VALUES (?,?,?)
        `;
        const result = await this.query(query, [courseName, programId, userId]);
        return { courseId: result.insertId, courseName: courseName };
    }

    static async getCoursesAfterProgram(userId, programId) {
        const query = `
            Select * from courses where program_id = ? and creator = ?
        `;
        return this.query(query, [programId, userId]);
    }

    static async getMembers(courseId) {
        const query = `SELECT cm.*, a.firstname, a.lastname, a.email
            FROM course_members cm
            JOIN accounts a ON cm.user_id = a.user_id
            WHERE cm.course_id = ?
        `;
        return this.query(query, [courseId]);
    }

    static async getLections(courseId) {
        const query = `
            Select * from lections where course_id = ?
        `;
        return this.query(query, [courseId]);
    }

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

    static async renameCourse(user_id, course_id, new_course_name) {
        const query_update_course = 'UPDATE courses SET course_name = ? WHERE course_id = ? AND creator = ?';
        const values_course = [new_course_name, course_id, user_id];
        const result_course = await this.query(query_update_course, values_course);

        if (result_course.affectedRows === 0) {
            throw new Error('Course not found or not authorized to rename this course');
        }
        return result_course;
    }

    static deleteCourse(user_id, course_id) {
        const query = 'DELETE FROM courses WHERE course_id = ? AND creator = ?';
        const values = [course_id, user_id];
        return this.query(query, values);
    }

    static deleteMember(userId, courseId) {
        const query = 'DELETE FROM course_members WHERE course_id = ? AND user_id = ?';
        const values = [courseId, userId];
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