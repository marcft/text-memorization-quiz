import EasyModeQuiz from './EasyModeQuiz';
import HardModeQuiz from './HardModeQuiz';
import PracticeMode from './PracticeMode';

const QuizScreen = ({ paragraphs, difficultyMode, onRestartTraining }) => {
  return (
    <div className="quiz-screen">
      <div className="quiz-header">
        <h2>
          Text Study Quiz -{' '}
          {difficultyMode === 'practice'
            ? 'Practice Mode'
            : difficultyMode === 'easy'
            ? 'Easy Mode'
            : 'Hard Mode'}
        </h2>
        <button onClick={onRestartTraining} className="goback-btn">
          Go Back to Start
        </button>
      </div>

      <div className="quiz-content">
        {difficultyMode === 'practice' ? (
          <PracticeMode paragraphs={paragraphs} />
        ) : difficultyMode === 'easy' ? (
          <EasyModeQuiz paragraphs={paragraphs} />
        ) : (
          <HardModeQuiz paragraphs={paragraphs} />
        )}
      </div>
    </div>
  );
};

export default QuizScreen;
