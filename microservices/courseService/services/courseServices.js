const CourseRepository = require('../repositories/courseRepository');
const { capitalizeFirstLetter, getLectionsForCourse } = require('../utils/helperFunctions');

class CourseService {
    static async getAllCourses(user_id) {
        try {
            const courses = await CourseRepository.getAllCourses();
            let enrolledCourses = [];
            let nonEnrolledCourses = [];

            if (user_id) {
                enrolledCourses = await CourseRepository.getEnrolledCourses(user_id);

                const promises_enroll = enrolledCourses.map(async course => {
                    course.creator_lastname = capitalizeFirstLetter(course.creator_lastname);
                    course.lections = await getLectionsForCourse(course.program_name, course.course_name);
                });
                await Promise.all(promises_enroll);

                nonEnrolledCourses = courses.filter(course =>
                    !enrolledCourses.some(enrolled => enrolled.course_id === course.course_id)
                );

                const promises_unenroll = nonEnrolledCourses.map(async course => {
                    course.creator_lastname = capitalizeFirstLetter(course.creator_lastname);
                });
                await Promise.all(promises_unenroll);
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
}

module.exports = CourseService;
