import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Result = () => {
  const router = useRouter();
  const [yogaType, setYogaType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the top recommended yoga type from the backend based on user's answers
  useEffect(() => {
    const fetchTopYogaType = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/get_all_yoga_types_by_similarity', {
            method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answers: router.query }),  // Send user's answers as POST body
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recommended yoga type');
        }

        const result = await response.json();
        setYogaType(result); // Set the top yoga type
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (router.query) {
      fetchTopYogaType();
    }
  }, [router.query]);

  if (loading) {
    return <div>Loading recommended yoga type...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!yogaType) {
    return <div>No matching yoga type found.</div>;
  }

  // Display the top recommended yoga type
  return (
    <div className="result-container">
      <h1>Recommended Yoga Type</h1>
      <h2>{yogaType.name}</h2>
      <p><strong>Primary Goal:</strong> {yogaType.primary_goal}</p>
      <p><strong>Experience Level:</strong> {yogaType.experience_level}</p>
      <p><strong>Health Conditions:</strong> {yogaType.health_conditions}</p>
      <p><strong>Practice Frequency:</strong> {yogaType.practice_frequency}</p>
      <p><strong>Yoga Style:</strong> {yogaType.yoga_style}</p>
      <p><strong>Session Duration:</strong> {yogaType.session_duration}</p>
      <p><strong>Target Body Area:</strong> {yogaType.target_body_area}</p>
      <p><strong>Energy Level:</strong> {yogaType.energy_level}</p>
      <p><strong>Comfort with Balance Poses:</strong> {yogaType.balance_poses ? 'Yes' : 'No'}</p>
      <p><strong>Preferred Practice Time:</strong> {yogaType.practice_time}</p>
    </div>
  );
};

export default Result;
