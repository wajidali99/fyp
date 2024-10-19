import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Questionnaire = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState('');
  const [isUsernameSubmitted, setIsUsernameSubmitted] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const router = useRouter();

  // Fetch questions from the backend
  useEffect(() => {
    if (isUsernameSubmitted) {
      const loadQuestions = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/questions');
          const fetchedQuestions = await response.json();
          setQuestions(fetchedQuestions);
        } catch (error) {
          console.error('Error fetching questions:', error);
        } finally {
          setIsLoadingQuestions(false);
        }
      };
      loadQuestions();
    }
  }, [isUsernameSubmitted]);

  // Handle the username form submission
  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsUsernameSubmitted(true);
      setIsLoadingQuestions(true);
    } else {
      alert('Please enter a valid username.');
    }
  };

  // Handle answer changes
  const handleAnswerChange = (e) => {
    const questionKey = questions[currentQuestionIndex].questionKey;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionKey]: e.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Construct the user's answers
    const formattedAnswers = questions.map((question) => ({
      questionId: question.id,
      answer: answers[question.questionKey],
    }));

    try {
      // Redirect to the result page and pass user's answers as query parameters
      router.push({
        pathname: '/result', // The result page where yoga types will be displayed
        query: answers, // Pass the answers as query parameters
      });
    } catch (error) {
      console.error('Error during form submission:', error);
      alert('There was an error submitting your answers. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle the "Next" button click
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit(); // Submit the answers if it's the last question
    }
  };

  // Handle the "Previous" button click
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Calculate progress percentage
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  // If username is not yet submitted, show the username form
  if (!isUsernameSubmitted) {
    return (
      <div className="username-container">
        <h2>Please Enter Your Username</h2>
        <form onSubmit={handleUsernameSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
          <button type="submit">Start Questionnaire</button>
        </form>
      </div>
    );
  }

  // Show a loading state while questions are being fetched
  if (isLoadingQuestions) {
    return <div>Loading questions...</div>;
  }

  if (!questions.length) return <div>No questions found.</div>;

  return (
    <div className="question-container">
      {/* Slider/Progress Bar */}
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progressPercentage}%` }}></div>
      </div>

      {/* Question */}
      <h2>Question {currentQuestionIndex + 1}: {questions[currentQuestionIndex].question}</h2>
      <div className="question-options">
        {questions[currentQuestionIndex].options.map((option, index) => (
          <label key={index}>
            <input
              type="radio"
              name={questions[currentQuestionIndex].questionKey}
              value={option}
              checked={answers[questions[currentQuestionIndex].questionKey] === option}
              onChange={handleAnswerChange}
            />
            {option}
          </label>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="navigation-buttons">
        {currentQuestionIndex > 0 && (
          <button onClick={handlePrevious} disabled={isSubmitting}>Previous</button>
        )}
        <button onClick={handleNext} disabled={isSubmitting}>
          {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Questionnaire;
