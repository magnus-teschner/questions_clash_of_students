const CourseService = require('../services/courseServices');

class CourseController {
    static async getAllCourses(req, res) {
        try {
            const user_id = req.query.user_id;
            const { enrolledCourses, nonEnrolledCourses } = await CourseService.getAllCourses(user_id);

            return res.status(200).json({
                enrolledCourses,
                nonEnrolledCourses
            });
        } catch (error) {
            console.error('Error fetching courses:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    static async enrollCourse(req, res) {

        const { user_id, course_id } = req.body;

        try {
            await CourseService.enrollCourse(user_id, course_id);
            return res.status(200).send('Enrolled successfully');
        } catch (error) {
            console.error('Error enrolling in course:', error);
            return res.status(500).send('Internal Server Error');
        }
    }

    static async unenrollCourse(req, res) {
        const { user_id, course_id } = req.body;

        try {
            await CourseService.unenrollCourse(user_id, course_id);
            return res.status(200).send('Unenrolled successfully');
        } catch (error) {
            console.error('Error unenrolling from course:', error);
            return res.status(500).send('Internal Server Error');
        }
    }

    static async renameCourse(req, res) {
        const { user_id, course_id, new_course_name } = req.body;
        try {
            const result = await CourseService.renameCourse(user_id, course_id, new_course_name);

            if (result.affectedRows === 0) {
                return res.status(404).send('Course not found or not authorized to rename this course');
            }

            return res.status(200).send('Course renamed and questions updated successfully');
        } catch (error) {
            console.error('Error renaming course:', error);
            return res.status(500).send('Internal Server Error');
        }
    }

    static async deleteCourse(req, res) {
        const { user_id, course_id } = req.body;

        try {
            const result = await CourseService.deleteCourse(user_id, course_id);

            if (result.affectedRows === 0) {
                return res.status(404).send('Course not found or not authorized to delete this course');
            }

            return res.status(200).send('Course deleted successfully');
        } catch (error) {
            console.error('Error deleting course:', error);
            return res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = CourseController;
