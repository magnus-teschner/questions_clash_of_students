const CourseRepository = require('../repositories/courseRepository');
const { capitalizeFirstLetter, getLectionsForCourse } = require('../utils/helperFunctions');

class CourseService {

    static async moveCourse(userId, programId, courseId) {
        return await CourseRepository.moveCourse(userId, programId, courseId);
    }

    static async createCourse(userId, programId, courseName) {
        return await CourseRepository.createCourse(userId, programId, courseName);
    }

    static async getCoursesAfterProgram(userId, programId) {
        return await CourseRepository.getCoursesAfterProgram(userId, programId);
    }

    static async getMembers(courseId) {
        return await CourseRepository.getMembers(courseId);
    }



    static async createLections(courseId) {
        for (let lectionName = 1; lectionName < 9; lectionName++) {
            await CourseRepository.createLection(courseId, lectionName);
        }
        return
    }

    static async getLections(courseId) {
        return await CourseRepository.getLections(courseId);
    }

    static async getAllCourses(user_id) {
        try {
            const courses = await CourseRepository.getAllCourses();
            let enrolledCourses = [];
            let nonEnrolledCourses = [];

            if (user_id) {
                enrolledCourses = await CourseRepository.getEnrolledCourses(user_id);
                nonEnrolledCourses = courses.filter(course =>
                    !enrolledCourses.some(enrolled => enrolled.course_id === course.course_id)
                );
            } else {
                nonEnrolledCourses = courses;
            }

            return { enrolledCourses, nonEnrolledCourses };
        } catch (error) {
            throw error;
        }
    }
    static async enrollCourse(user_id, course_id) {
        return CourseRepository.enrollCourse(user_id, course_id);
    }

    static async unenrollCourse(user_id, course_id) {
        return CourseRepository.unenrollCourse(user_id, course_id);
    }

    static async renameCourse(user_id, course_id, new_course_name) {
        return CourseRepository.renameCourse(user_id, course_id, new_course_name);
    }

    static async deleteCourse(user_id, course_id) {
        return CourseRepository.deleteCourse(user_id, course_id);
    }

    static async deleteMember(userId, courseId) {
        return CourseRepository.deleteMember(userId, courseId);
    }


}

module.exports = CourseService;
