const express = require('express');
const CourseController = require('../controllers/courseController');

const router = express.Router();

//student
router.get('/courses', CourseController.getAllCourses);
router.post('/enroll-course', CourseController.enrollCourse);
router.get('/course-progress', CourseController.getCourseProgress);
router.post('/unenroll-course', CourseController.unenrollCourse);
router.delete('/course/:courseId/user/:userId', CourseController.deleteMember);

//prof
router.get('/programs/:programId/user/:userId/courses', CourseController.getCoursesAfterProgram)
router.get('/course/:courseId/lections', CourseController.getLections);
router.get('/course/:courseId/members', CourseController.getMembers)
router.put('/rename-course', CourseController.renameCourse);
router.put('/course/move', CourseController.moveCourse);
router.delete('/delete-course', CourseController.deleteCourse);
router.post('/course', CourseController.createCourse);
router.post('/course/:courseId/lections', CourseController.createLections)

module.exports = router;
