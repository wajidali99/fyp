export default function handler(req, res) {
    const questions = [
      {
        question: 'What is your primary yoga goal?',
        options: ['Flexibility', 'Strength', 'Relaxation', 'Balance', 'Mindfulness'],
        questionKey: 'primaryGoal',
      },
      {
        question: 'What is your current experience level?',
        options: ['Beginner', 'Intermediate', 'Advanced'],
        questionKey: 'experienceLevel',
      },
      {
        question: 'Do you have any specific health conditions or physical limitations?',
        options: ['None', 'Back pain', 'Joint issues', 'Neck pain', 'Other'],
        questionKey: 'healthConditions',
      },
      {
        question: 'How many days a week would you like to practice yoga?',
        options: ['1-2 days', '3-4 days', '5+ days'],
        questionKey: 'practiceFrequency',
      },
      {
        question: 'What is your preferred yoga style?',
        options: ['Hatha', 'Vinyasa', 'Restorative', 'Power Yoga', 'Yin Yoga'],
        questionKey: 'yogaStyle',
      },
      {
        question: 'How long would you like each session to last?',
        options: ['Less than 20 minutes', '20-40 minutes', 'More than 40 minutes'],
        questionKey: 'sessionDuration',
      },
      {
        question: 'Are you looking to target a specific body area?',
        options: ['Full-body', 'Core', 'Back', 'Shoulders', 'Hips'],
        questionKey: 'targetBodyArea',
      },
      {
        question: 'What is your current energy level?',
        options: ['Low', 'Medium', 'High'],
        questionKey: 'energyLevel',
      },
      {
        question: 'Are you comfortable with practicing balance poses?',
        options: ['Yes', 'No'],
        questionKey: 'balancePoses',
      },
      {
        question: 'When do you prefer to practice yoga?',
        options: ['Morning', 'Afternoon', 'Evening'],
        questionKey: 'practiceTime',
      },
    ];
  
    res.status(200).json({ questions });
  }
  