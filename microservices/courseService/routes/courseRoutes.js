const express = require('express');
const CourseController = require('../controllers/courseController');

const router = express.Router();

//student
router.get('/courses', CourseController.getAllCourses);
router.post('/enroll-course', CourseController.enrollCourse);
router.post('/unenroll-course', CourseController.unenrollCourse);

//prof
router.get('/programs/:programId/user/:userId/courses', CourseController.getCoursesAfterProgram)
router.get('/course/:courseId/lections', CourseController.getLections)
router.put('/rename-course', CourseController.renameCourse);
router.delete('/delete-course', CourseController.deleteCourse);
router.post('/course', CourseController.createCourse);

module.exports = router;
