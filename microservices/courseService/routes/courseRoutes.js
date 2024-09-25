const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();

router.get('/courses', courseController.getAllCourses);
router.post('/enroll-course', courseController.enrollCourse);
router.post('/unenroll-course', courseController.unenrollCourse);

module.exports = router;
