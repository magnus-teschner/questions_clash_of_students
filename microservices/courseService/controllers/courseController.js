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
}

module.exports = CourseController;
