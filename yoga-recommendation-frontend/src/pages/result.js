import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Result = () => {
  const router = useRouter();
  const [yogaType, setYogaType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopYogaType = async () => {
      const { data } = router.query;
      if (!data) return;

      try {
        const response = await fetch('http://localhost:5000/api/submit_answers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: data, // Send the serialized data
        });

        if (!response.ok) throw new Error('Failed to fetch recommended yoga type');

        const result = await response.json();
        setYogaType(result.recommendation); // Assuming result has a recommendation field
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady && router.query.data) {
      fetchTopYogaType();
    }
  }, [router.isReady, router.query]);

  if (loading) return <div>Loading recommended yoga type...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!yogaType) return <div>No matching yoga type found.</div>;

  // Display the recommended yoga type
  return (
    <div className="result-container">
      <h1>Recommended Yoga Type</h1>
      <h2>{yogaType.name}</h2>
      <p><strong>Primary Benefit:</strong> {yogaType.primary_benefit}</p>
      <p><strong>Flexibility Rate:</strong> {yogaType.flexibility_rate}</p>
      <p><strong>Stretching:</strong> {yogaType.stretching}</p>
      <p><strong>Practice Days:</strong> {yogaType.practice_days}</p>
      <p><strong>Focus Area:</strong> {yogaType.focus_area}</p>
      <p><strong>Pose Comfort:</strong> {yogaType.pose_comfort}</p>
    </div>
  );
};

export default Result;
