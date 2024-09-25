const express = require('express');
const CourseController = require('../controllers/courseController');

const router = express.Router();

router.get('/courses', CourseController.getAllCourses);
router.post('/enroll-course', CourseController.enrollCourse);
router.post('/unenroll-course', CourseController.unenrollCourse);
router.delete('/delete-course', CourseController.deleteCourse);

module.exports = router;
