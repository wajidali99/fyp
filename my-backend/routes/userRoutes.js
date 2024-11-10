const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Route to submit user preferences
router.post('/submit_preferences', userController.savePreferences);

// Route to get recommendations
router.get('/recommendations', userController.getRecommendations);

// Route to retrieve questions
router.get('/questions', userController.getQuestionsByPrimaryGoal);

// // Route to submit user preferences
// router.post('/submit_answers', userController.saveUserAnswers);

router.post('/submit_answers', userController.submitAnswers);


// Route to get the best matching yoga type
router.post('/get_all_yoga_types_by_similarity', userController.getAllYogaTypesBySimilarity);


module.exports = router;
