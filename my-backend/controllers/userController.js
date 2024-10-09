const userService = require('../services/userService');

// Controller to save user preferences
const savePreferences = (req, res) => {
  const { username, preferences } = req.body;

  userService.savePreferences(username, preferences, (err, result) => {
    if (err) {
      return res.status(500).send({ error: 'Failed to save preferences' });
    }
    res.send({ message: 'Preferences saved successfully' });
  });
};

// Controller to get recommendations based on userId
const getRecommendations = async (req, res) => {
  try {
    const userId = req.query.userId; // Get userId from query parameters
    const recommendations = await userService.getRecommendations(userId);
    res.status(200).json(recommendations);
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
};

module.exports = {
  savePreferences,
  getRecommendations
};
