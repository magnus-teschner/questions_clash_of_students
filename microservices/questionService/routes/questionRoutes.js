const express = require('express');
const QuestionController = require('../controllers/questionController');
const router = express.Router();

router.get('/programs', QuestionController.getAllPrograms);
router.get('/questions/:userId', QuestionController.getQuestionsByUser);
router.get('/question', QuestionController.getQuestion);
router.post('/question', QuestionController.addQuestion);
router.put('/question', QuestionController.updateQuestion);
router.get('/lection/:lectionId/unused-positions', QuestionController.getUnusedPositions);

module.exports = router;
