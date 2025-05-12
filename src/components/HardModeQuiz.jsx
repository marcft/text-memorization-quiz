import { useState, useEffect } from 'react';
import { normalizeText } from '../utils';

const HardModeQuiz = ({ paragraphs, onContinue }) => {
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null); // null, 'correct', or 'incorrect'
  const [originalParagraph, setOriginalParagraph] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');

  // Prepare a new paragraph
  const prepareNewParagraph = () => {
    const paragraph = paragraphs[currentParagraphIndex];
    setOriginalParagraph(paragraph.content);
    setCurrentTitle(paragraph.title);
    setUserInput('');
    setFeedback(null);
  };

  // Initialize with a paragraph
  useEffect(() => {
    prepareNewParagraph();
  }, [currentParagraphIndex]);

  // Handle user submission
  const handleSubmit = () => {
    // Compare the entire paragraph
    const normalizedInput = normalizeText(userInput);
    const normalizedOriginal = normalizeText(originalParagraph);
    setFeedback(
      normalizedInput === normalizedOriginal ? 'correct' : 'incorrect'
    );
  };

  // Load next paragraph after answer
  const handleContinue = () => {
    // Move to the next paragraph when continuing
    const nextIndex =
      currentParagraphIndex < paragraphs.length - 1
        ? currentParagraphIndex + 1
        : 0;
    setCurrentParagraphIndex(nextIndex);

    if (onContinue) onContinue();
  };

  // Get previous paragraph text if available
  const getPreviousParagraph = () => {
    if (currentParagraphIndex > 0) {
      return paragraphs[currentParagraphIndex - 1].content;
    }
    return null;
  };

  // Get next paragraph text if available
  const getNextParagraph = () => {
    if (currentParagraphIndex < paragraphs.length - 1) {
      return paragraphs[currentParagraphIndex + 1].content;
    }
    return null;
  };

  // Get previous paragraph title if available
  const getPreviousTitle = () => {
    if (currentParagraphIndex > 0) {
      return paragraphs[currentParagraphIndex - 1].title;
    }
    return null;
  };

  // Get next paragraph title if available
  const getNextTitle = () => {
    if (currentParagraphIndex < paragraphs.length - 1) {
      return paragraphs[currentParagraphIndex + 1].title;
    }
    return null;
  };

  const previousParagraph = getPreviousParagraph();
  const nextParagraph = getNextParagraph();
  const previousTitle = getPreviousTitle();
  const nextTitle = getNextTitle();

  // Calculate a better visual representation of the blank paragraph
  const createVisualBlank = () => {
    if (!originalParagraph) return null;

    // Estimate the length of the paragraph to create a proportional blank
    const wordCount = originalParagraph.split(' ').length;
    const charCount = originalParagraph.length;

    // Create a visual representation based on paragraph length
    return (
      <div className="blank-paragraph">
        <div className="blank-line-container">
          {Array(Math.min(Math.ceil(wordCount / 10), 8))
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="blank-line"
                style={{
                  width: `${Math.min(
                    95,
                    30 + ((charCount % 100) / 100) * 65
                  )}%`,
                }}
              ></div>
            ))}
        </div>
        <div className="blank-indicator">
          <span className="blank-icon">📝</span>
          <span>
            Type the full paragraph ({wordCount} words, {charCount} characters)
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="context-paragraphs">
        {previousParagraph && (
          <div className="previous-paragraph">
            <h4>Previous Paragraph:</h4>
            {previousTitle && (
              <h5 className="paragraph-title">{previousTitle}</h5>
            )}
            <p>{previousParagraph}</p>
          </div>
        )}

        <div className="current-paragraph">
          <h4>Current Paragraph:</h4>
          {currentTitle && <h3 className="paragraph-title">{currentTitle}</h3>}
          <div className="paragraph-display">{createVisualBlank()}</div>
        </div>

        {nextParagraph && (
          <div className="next-paragraph">
            <h4>Next Paragraph:</h4>
            {nextTitle && <h5 className="paragraph-title">{nextTitle}</h5>}
            <p>{nextParagraph}</p>
          </div>
        )}
      </div>

      <div className="user-input-area">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type the entire paragraph..."
          disabled={feedback !== null}
        />
        {feedback === null ? (
          <button onClick={handleSubmit} className="submit-btn">
            Submit
          </button>
        ) : feedback === 'correct' ? (
          <div className="feedback correct">
            <p>Correct! Well done!</p>
            <button onClick={handleContinue} className="continue-btn">
              Continue
            </button>
          </div>
        ) : (
          <div className="feedback incorrect">
            <p>Not quite right. Here's the correct text:</p>
            <p className="correct-answer">{originalParagraph}</p>
            <button onClick={handleContinue} className="continue-btn">
              Continue
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default HardModeQuiz;
