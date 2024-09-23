const QuestionService = require('../services/questionService');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

class QuestionController {
    static async getAllPrograms(req, res) {
        try {
            const programs = await QuestionService.getAllPrograms();
            if (!programs.length) {
                return res.status(404).json({ error: "No programs found" });
            }
            res.json(programs);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while retrieving programs' });
            console.error(error);
        }
    }

    static async getQuestionsByUser(req, res) {
        try {
            const { userId } = req.params;
            const questions = await QuestionService.getQuestionsByUser(userId);
            if (!questions.length) {
                return res.status(404).json({ error: `No questions found for user ID ${userId}` });
            }
            res.json(questions);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while retrieving questions by user' });
            console.error(error);
        }
    }

    static async getQuestion(req, res) {
        try {
            const { courseId, lectionId, position } = req.query;
            const question = await QuestionService.getQuestion(courseId, lectionId, position);
            if (!question) {
                return res.status(404).json({ error: `No question found for course ID ${courseId}, lection ID ${lectionId}, and position ${position}` });
            }
            res.json(question);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while retrieving the question' });
            console.error(error);
        }
    }

    static async addQuestion(req, res) {
        try {
            upload.single('image')(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({ error: 'Image upload failed' });
                }

                const questionData = req.body;
                const imageFile = req.file; // Image file is optional
                await QuestionService.addQuestion(questionData, imageFile);
                res.status(201).json({ message: 'Question added successfully' });
            });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while adding the question' });
            console.error(error);
        }
    }

    static async updateQuestion(req, res) {
        try {
            upload.single('image')(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({ error: 'Image upload failed' });
                }

                const questionData = req.body;
                const imageFile = req.file; // Image file is optional
                await QuestionService.updateQuestion(questionData, imageFile);
                res.status(200).json({ message: 'Question updated successfully' });
            });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while updating the question' });
            console.error(error);
        }
    }

    static async getUnusedPositions(req, res) {
        try {
            const { userId, programId, courseId, lectionId } = req.query;
            if (!userId || !programId || !courseId || !lectionId) {
                return res.status(400).json({ error: 'All parameters (userId, programId, courseId, lectionId) are required' });
            }
            const unusedPositions = await QuestionService.getUnusedPositions(userId, programId, courseId, lectionId);
            if (!unusedPositions.length) {
                return res.status(404).json({ error: 'No unused positions found' });
            }
            res.json(unusedPositions);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while retrieving unused positions' });
            console.error(error);
        }
    }
}

module.exports = QuestionController;
