const CourseService = require('../services/courseServices');

class CourseController {
    static async createCourse(req, res) {
        try {
            const { userId, programId, courseName } = req.body;

            const courseInfos = await CourseService.createCourse(userId, programId, courseName);
            res.json(courseInfos);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while creating a course' });
            console.error(error);
        }
    }

    static async moveCourse(req, res) {
        try {
            const { userId, programId, courseId } = req.body;
            const courseMovement = await CourseService.moveCourse(userId, programId, courseId);
            res.json(courseMovement);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while creating a course' });
            console.error(error);
        }
    }

    static async getMembers(req, res) {
        try {
            const { courseId } = req.params;

            const members = await CourseService.getMembers(courseId);
            if (!members.length) {
                return res.status(404).json({ error: "No members found" });
            }
            res.json(members);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while retrieving members for a course' });
            console.error(error);
        }
    }

    static async getCoursesAfterProgram(req, res) {
        try {
            const { userId, programId } = req.params;

            const courses = await CourseService.getCoursesAfterProgram(userId, programId);
            if (!courses.length) {
                return res.status(404).json({ error: "No courses found" });
            }
            res.json(courses);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while retrieving courses for a program' });
            console.error(error);
        }
    }

    static async createLections(req, res) {
        try {
            const { courseId } = req.params;

            const lections = await CourseService.createLections(courseId);
            return res.status(200).send('Created Lections');
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while retrieving lections for a course' });
            console.error(error);
        }
    }
    static async getLections(req, res) {
        try {
            const { courseId } = req.params;

            const lections = await CourseService.getLections(courseId);
            if (!lections.length) {
                return res.status(404).json({ error: "No Lections found" });
            }
            res.json(lections);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while retrieving lections for a course' });
            console.error(error);
        }
    }

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

    static async getCourseProgress(req, res) {
        const userId = req.query.user_id;
    
        try {
          const progressData = await CourseService.getCourseProgress(userId);
          return res.status(200).json(progressData);
        } catch (error) {
          console.error('Error fetching course progress:', error);
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

    static async deleteMember(req, res) {
        const { userId, courseId } = req.params;

        try {
            const result = await CourseService.deleteMember(userId, courseId);

            if (result.affectedRows === 0) {
                return res.status(404).send('Member not found or not authorized to delete the member');
            }

            return res.status(200).send('Course member deleted successfully');
        } catch (error) {
            console.error('Error deleting course member:', error);
            return res.status(500).send('Internal Server Error');
        }
    }


}



module.exports = CourseController;
