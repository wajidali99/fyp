const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Route to submit user preferences
router.post('/submit_preferences', userController.savePreferences);

// Route to get recommendations
router.get('/recommendations', userController.getRecommendations);
module.exports = router;
