const db = require('../config/db');

const savePreferences = (username, preferences, callback) => {
  const sql = `INSERT INTO users (username, preferences) VALUES (?, ?)`;
  db.query(sql, [username, JSON.stringify(preferences)], callback);
};

const getRecommendations = (userId) => {
  return new Promise((resolve, reject) => {
    const userQuery = `SELECT difficulty, health_conditions, goals FROM users WHERE id = ?`;

    db.query(userQuery, [userId], (err, userResults) => {
      if (err) return reject(err);

      if (userResults.length === 0) {
        return reject(new Error('User not found'));
      }
    //    resolve(userResults);

      const { difficulty, health_conditions, goals } = userResults[0];

      const query = `
        SELECT * FROM yoga_types 
        WHERE difficulty = ? 
        AND health_conditions IN (?) 
        AND goals IN (?)`;

      db.query(query, [difficulty, health_conditions, goals], (err, yogaResults) => {
        if (err) return reject(err);
        resolve(yogaResults);
     });
    });
  });
};


// Function to retrieve questions from the database
const getQuestions = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM questions`;
    
    db.query(query, (err, results) => {
      if (err) return reject(err);

      // Format the options field from JSON string to array
      const questions = results.map(question => ({
        id: question.id,
        question: question.question,
        options: JSON.parse(question.options)
      }));
      resolve(questions);
    });
  });
};


const saveUserAnswers = (username, answers, callback) => {
  if (!answers || !Array.isArray(answers)) {
    return callback(new Error('Invalid answers array'));
  }

  const answerPromises = answers.map(answer => {
    const { questionId, answer: userAnswer } = answer;
    const sql = `INSERT INTO user_answers (username, question_id, answer) VALUES (?, ?, ?)`;
    return new Promise((resolve, reject) => {
      db.query(sql, [username, questionId, userAnswer], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  });

  Promise.all(answerPromises)
    .then(() => callback(null, { success: true }))
    .catch(callback);
};



const getAllYogaTypesBySimilarity = (userAnswers) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM yoga_type';

    // Fetch all yoga types from the database
    db.query(sql, (err, yogaTypes) => {
      if (err) return reject(err);

      // Calculate similarity score for each yoga type
      const scoredYogaTypes = yogaTypes.map((currentType) => {
        let score = 0;

        // Compare each field and increment score for matches
        if (currentType.primary_goal === userAnswers.primary_goal) score++;
        if (currentType.experience_level === userAnswers.experience_level) score++;
        if (currentType.health_conditions === userAnswers.health_conditions || currentType.health_conditions === 'None') score++;
        if (currentType.practice_frequency === userAnswers.practice_frequency) score++;
        if (currentType.yoga_style === userAnswers.yoga_style) score++;
        if (currentType.session_duration === userAnswers.session_duration) score++;
        if (currentType.target_body_area === userAnswers.target_body_area) score++;
        if (currentType.energy_level === userAnswers.energy_level) score++;
        if (currentType.balance_poses === (userAnswers.balance_poses === true ? 1 : 0)) score++;
        if (currentType.practice_time === userAnswers.practice_time) score++;

        return { ...currentType, score }; // Attach score to the yoga type
      });

      // Sort the yoga types by score in descending order
      scoredYogaTypes.sort((a, b) => b.score - a.score);

      // Resolve only the top yoga type (first element of the sorted array)
      resolve(scoredYogaTypes[0]);
    });
  });
};






module.exports = {
  getAllYogaTypesBySimilarity,
  getQuestions,
  savePreferences,
  getRecommendations,
  saveUserAnswers,
};