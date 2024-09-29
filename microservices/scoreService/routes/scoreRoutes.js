const express = require('express');
const ScoreController = require('../controllers/scoreController');

const router = express.Router();

// Update the score for a lection
router.post('/update-lection-score', ScoreController.updateLectionScore);

// Route to get the course score by calculating from lection scores
router.get('/user/:userId/lection/:lectionId/course-score', ScoreController.getCourseScore);

// Get the total score for a user
router.get('/user/:userId', ScoreController.getUserTotalScore);

module.exports = router;