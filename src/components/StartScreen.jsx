const StartScreen = ({ onStartQuiz }) => {
  return (
    <div className="start-screen">
      <h1>Text Study Quiz</h1>
      <p>Choose a difficulty mode to begin:</p>
      <div className="mode-buttons">
        <button onClick={() => onStartQuiz('easy')} className="easy-mode-btn">
          Easy Mode
          <span>3-5 words will be hidden</span>
        </button>
        <button onClick={() => onStartQuiz('hard')} className="hard-mode-btn">
          Hard Mode
          <span>Entire paragraph will be hidden</span>
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
