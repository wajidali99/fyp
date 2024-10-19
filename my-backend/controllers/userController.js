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

// Controller to retrieve questions from the database
const getQuestions = async (req, res) => {
  try {
    const questions = await userService.getQuestions();
    res.status(200).json(questions);
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ message: 'Error fetching questions' });
  }
};

const saveUserAnswers = (req, res) => {
  const { username, answers } = req.body;

  // Log the request body to verify if answers are being received
  console.log('Received data:', req.body);

  if (!answers || !Array.isArray(answers)) {
    return res.status(400).send({ error: 'Invalid or missing answers array' });
  }

  userService.saveUserAnswers(username, answers, (err, result) => {
    if (err) {
      return res.status(500).send({ error: 'Failed to save answers' });
    }
    res.send({ message: 'Answers saved successfully' });
  });
};


// Controller to get all yoga types sorted by similarity to the user's answers
const getAllYogaTypesBySimilarity = async (req, res) => {
  try {
    const { answers } = req.body; // Get answers from request body

    // Call the service to find all matching yoga types, sorted by similarity
    const sortedYogaTypes = await userService.getAllYogaTypesBySimilarity(answers);

    // Return the sorted list of yoga types to the client
    res.status(200).json(sortedYogaTypes);
  } catch (err) {
    console.error('Error fetching yoga types by similarity:', err);
    res.status(500).json({ message: 'Server error' });
  }
};




module.exports = {
  getAllYogaTypesBySimilarity,
  getQuestions,
  saveUserAnswers,
  getRecommendations,
  savePreferences
};
