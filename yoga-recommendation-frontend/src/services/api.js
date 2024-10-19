
  export const submitAnswers = async (answers) => {
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
      });
      return await response.json();
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  // Fetch questions from the backend
export const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/questions');
      const data = await response.json();
      return data; // List of questions and options
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };
  
  // Submit user preferences (answers)
  export const submitPreferences = async (username, answers) => {
    try {
      const response = await fetch('/api/users/submit_preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, answers }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error submitting preferences:', error);
    }
  };
  
  