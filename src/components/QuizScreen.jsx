import EasyModeQuiz from './EasyModeQuiz';
import HardModeQuiz from './HardModeQuiz';

const QuizScreen = ({
  paragraphs,
  difficultyMode,
  onRestartTraining,
  onChangeDifficulty,
}) => {
  return (
    <div className="quiz-screen">
      <div className="quiz-header">
        <h2>
          Text Study Quiz -{' '}
          {difficultyMode === 'easy' ? 'Easy Mode' : 'Hard Mode'}
        </h2>
        <div className="quiz-controls">
          <button
            onClick={() =>
              onChangeDifficulty(difficultyMode === 'easy' ? 'hard' : 'easy')
            }
            className="mode-toggle-btn"
          >
            Switch to {difficultyMode === 'easy' ? 'Hard' : 'Easy'} Mode
          </button>
          <button onClick={onRestartTraining} className="restart-btn">
            Restart Training
          </button>
        </div>
      </div>

      <div className="quiz-content">
        {difficultyMode === 'easy' ? (
          <EasyModeQuiz paragraphs={paragraphs} />
        ) : (
          <HardModeQuiz paragraphs={paragraphs} />
        )}
      </div>
    </div>
  );
};

export default QuizScreen;
