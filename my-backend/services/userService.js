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





module.exports = {
  savePreferences,
  getRecommendations
};