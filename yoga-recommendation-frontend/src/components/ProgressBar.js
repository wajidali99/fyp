const ProgressBar = ({ step, totalSteps }) => {
    const progress = (step / totalSteps) * 100;
    return (
      <div className="progress-bar">
        <div style={{ width: `${progress}%` }} className="progress" />
      </div>
    );
  };
  
  export default ProgressBar;
  