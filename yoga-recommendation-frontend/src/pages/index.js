import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Questionnaire = () => {
  const [primaryGoal, setPrimaryGoal] = useState(null);
  const [secondaryQuestions, setSecondaryQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrimaryGoalSelected, setIsPrimaryGoalSelected] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const router = useRouter();

  // Mock user data for this example
  const username = "test_user";
  const email = "test_user@example.com";
  const password = "securePassword123";

  // Fetch secondary questions from the backend based on the selected primary goal
  useEffect(() => {
    if (isPrimaryGoalSelected && primaryGoal) {
      const loadSecondaryQuestions = async () => {
        setIsLoadingQuestions(true);
        try {
          const response = await fetch(`http://localhost:5000/api/questions?primaryGoal=${primaryGoal}`);
          if (!response.ok) throw new Error('Failed to fetch questions');
          const fetchedQuestions = await response.json();
          setSecondaryQuestions(fetchedQuestions);
        } catch (error) {
          console.error('Error fetching secondary questions:', error);
        } finally {
          setIsLoadingQuestions(false);
        }
      };
      loadSecondaryQuestions();
    }
  }, [isPrimaryGoalSelected, primaryGoal]);

  // Handle primary goal selection
  const handlePrimaryGoalSelect = (goal) => {
    setPrimaryGoal(goal);
    setIsPrimaryGoalSelected(true);
  };

  // Handle answer changes
  const handleAnswerChange = (e) => {
    const questionKey = secondaryQuestions[currentQuestionIndex].question_key;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionKey]: e.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const submissionData = {
      username,
      email,
      password,
      primaryGoal,
      answers: secondaryQuestions.map((question) => ({
        questionId: question.id.toString(),
        answer: answers[question.question_key] || '',
      })),
    };

    // Pass data to Result page
    router.push({
      pathname: '/result',
      query: { data: JSON.stringify(submissionData) },
    });
  };

  // Handle the "Next" button click
  const handleNext = () => {
    if (currentQuestionIndex < secondaryQuestions.length - 1) {
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
  const progressPercentage = ((currentQuestionIndex + 1) / secondaryQuestions.length) * 100;

  // If primary goal is not yet selected, show primary goal selection options
  if (!isPrimaryGoalSelected) {
    return (
      <div className="primary-goal-container">
        <h2>Select Your Primary Goal</h2>
        <div className="primary-goal-options">
          {['Flexibility', 'Strength', 'Relaxation', 'Mindfulness', 'Back Pain', 'Joint Issues', 'Neck Pain'].map((goal, index) => (
            <button key={index} onClick={() => handlePrimaryGoalSelect(goal)}>{goal}</button>
          ))}
        </div>
      </div>
    );
  }

  // Show a loading state while secondary questions are being fetched
  if (isLoadingQuestions) {
    return <div>Loading questions...</div>;
  }

  if (!secondaryQuestions.length) return <div>No questions found.</div>;

  return (
    <div className="question-container">
      {/* Slider/Progress Bar */}
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progressPercentage}%` }}></div>
      </div>

      {/* Question */}
      <h2>Question {currentQuestionIndex + 1}: {secondaryQuestions[currentQuestionIndex].question_text}</h2>
      <div className="question-options">
        {secondaryQuestions[currentQuestionIndex].options.map((option, index) => (
          <label key={index}>
            <input
              type="radio"
              name={secondaryQuestions[currentQuestionIndex].question_key}
              value={option}
              checked={answers[secondaryQuestions[currentQuestionIndex].question_key] === option}
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
          {currentQuestionIndex === secondaryQuestions.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Questionnaire;
