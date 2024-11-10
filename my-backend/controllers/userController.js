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

// Controller to get questions based on the primary goal
const getQuestionsByPrimaryGoal = async (req, res) => {
  const primaryGoal = req.query.primaryGoal; // Get the primary goal from query parameters

  // Log the primary goal received in the request
  console.log('Received primary goal:', primaryGoal);

  try {
    // Log that we are calling the service to get questions
    console.log('Calling userService.getQuestionsByPrimaryGoal with primaryGoal:', primaryGoal);

    // Call the service to get the questions
    const questions = await userService.getQuestionsByPrimaryGoal(primaryGoal);

    // Log the questions received from the service
    console.log('Questions received from userService:', questions);

    // Check if there are questions to return
    if (questions.length > 0) {
      console.log('Questions found, sending response with status 200');
      res.status(200).json(questions);
    } else {
      console.log('No questions found for the selected primary goal');
      res.status(404).json({ message: 'No questions found for the selected primary goal' });
    }
  } catch (error) {
    // Log any errors that occur during execution
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const submitAnswers = async (req, res) => {
  try {
    const { username, email, password, primaryGoal, answers } = req.body;

    console.log("req body ",req.body);
    // Step 1: Save the user's answers in the database
    await userService.saveUserAnswers(username, email, password, primaryGoal, answers);

    // Step 2: Fetch the best matching yoga type based on user's answers
    const recommendedYoga = await userService.getBestMatchingYoga(primaryGoal, answers);
    // Step 3: Send the recommendation back in the response
    res.status(200).json({
      message: 'Answers submitted successfully',
      recommendation: recommendedYoga,
    });
  } catch (error) {
    console.error('Error submitting answers:', error);
    res.status(500).json({ message: 'Failed to submit answers' });
  }
};






module.exports = {
  getAllYogaTypesBySimilarity,
  getQuestions,
  saveUserAnswers,
  getRecommendations,
  savePreferences,
  getQuestionsByPrimaryGoal,
  submitAnswers,

};
