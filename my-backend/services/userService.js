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


const getQuestionsByPrimaryGoal = (primaryGoal) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM questions
      WHERE primary_goal = ?
    `;

    db.query(sql, [primaryGoal], (err, results) => {
      if (err) {
        console.error("Database query error:", err); // Log error if there’s an issue with the query
        return reject(err);
      }

      console.log("Raw Results from Database:", results); // Log the raw results from the database

      // Parse options as JSON arrays
      const questionsWithParsedOptions = results.map((question) => {
        const parsedOptions = question.options ? JSON.parse(question.options) : [];
        console.log(`Parsed Options for Question ID ${question.id}:`, parsedOptions); // Log parsed options for each question

        return {
          ...question,
          options: parsedOptions, // Set parsed options in the question object
        };
      });

      console.log("Questions with Parsed Options:", questionsWithParsedOptions); // Log the final questions with parsed options
      resolve(questionsWithParsedOptions);
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



// Helper function to wrap db.query in a Promise
const queryAsync = (query, values = []) => {
  return new Promise((resolve, reject) => {
    db.query(query, values, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
};

// Store the user's answers in the database
const saveUserAnswers = async (username, email, password, primaryGoal, answers) => {
  try {

    console.log('username ', username)
    // Insert the user data
    const userInsertQuery = `INSERT INTO users (username, email, password, primary_goal) VALUES (?, ?, ?, ?)`;
    const userResult = await queryAsync(userInsertQuery, [username, email, password, primaryGoal]);
    const userId = userResult.insertId;

    // Insert each answer individually
    const answerInsertQuery = `INSERT INTO user_answers (user_id, question_id, answer) VALUES (?, ?, ?)`;

    for (const answer of answers) {
      await queryAsync(answerInsertQuery, [userId, answer.questionId, answer.answer]);
    }
  } catch (error) {
    console.error('Error storing user answers:', error);
    throw error;
  }
};



const getBestMatchingYoga = async (primaryGoal, answers) => {
  try {
    console.log("Primary Goal:", primaryGoal);
    console.log("User Answers:", answers);

    // Fetch yoga options with the same primary benefit as the user's primary goal
    const yogaQuery = `SELECT * FROM yoga WHERE primary_benefit = ?`;
    const yogaOptions = await queryAsync(yogaQuery, [primaryGoal]);

    console.log("Yoga Options:", yogaOptions);

    let bestMatch = null;
    let maxScore = 0;

    yogaOptions.forEach((yoga) => {
      let score = 0;

      // Compare each answer against the corresponding yoga attribute
      answers.forEach((answerObj) => {
        const { questionId, answer } = answerObj;

        if (
          ( yoga.flexibility_rate === answer) ||
          ( yoga.stretching === answer) ||
          ( yoga.practice_days === answer) ||
          ( yoga.focus_area === answer) ||
          ( yoga.pose_comfort === answer)
        ) {
          score += 1;
        }
      });

      // Update the best match if the current yoga has a higher score
      if (score > maxScore) {
        console.log(score);
        maxScore = score;
        bestMatch = yoga;
      }
    });

    console.log("Best Match Yoga:", bestMatch);
    return bestMatch;
  } catch (error) {
    console.error("Error fetching best matching yoga:", error);
    throw error;
  }
};


module.exports = {
  getAllYogaTypesBySimilarity,
  getQuestions,
  savePreferences,
  getRecommendations,
  saveUserAnswers,
  getQuestionsByPrimaryGoal,
  getBestMatchingYoga,


  
};