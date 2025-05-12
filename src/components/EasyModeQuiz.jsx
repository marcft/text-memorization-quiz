import { useState, useEffect } from 'react';
import { normalizeText } from '../utils';

const EasyModeQuiz = ({ paragraphs, onContinue }) => {
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null); // null, 'correct', or 'incorrect'
  const [blankedParagraph, setBlankedParagraph] = useState('');
  const [originalParagraph, setOriginalParagraph] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [hiddenWords, setHiddenWords] = useState([]);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [isRandomMode, setIsRandomMode] = useState(false);
  const [numHiddenWords, setNumHiddenWords] = useState(5);

  // Get a paragraph based on mode
  const getParagraph = () => {
    if (isRandomMode) {
      // Random mode: get a random paragraph
      const randomIndex = Math.floor(Math.random() * paragraphs.length);
      setCurrentTitle(paragraphs[randomIndex].title);
      return paragraphs[randomIndex].content;
    } else {
      // Sequential mode: get the next paragraph in order
      const paragraph = paragraphs[currentParagraphIndex];

      // Update index for next time, wrapping around when we reach the end
      const nextIndex = (currentParagraphIndex + 1) % paragraphs.length;
      setCurrentParagraphIndex(nextIndex);

      setCurrentTitle(paragraph.title);
      return paragraph.content;
    }
  };

  // Prepare a new paragraph with blanks
  const prepareNewParagraph = () => {
    const paragraph = getParagraph();
    setOriginalParagraph(paragraph);
    setUserInput('');
    setFeedback(null);

    // Easy mode: blank out numHiddenWords random words
    const words = paragraph.split(' ');
    let numWordsToHide = numHiddenWords;
    if (numWordsToHide >= words.length) {
      // If more than available, blank all words
      setBlankedParagraph(words.map(() => '______').join(' '));
      setHiddenWords(words);
      return;
    }
    const hiddenIndices = [];

    // Select random indices to hide
    while (
      hiddenIndices.length < numWordsToHide &&
      hiddenIndices.length < words.length
    ) {
      const randomIndex = Math.floor(Math.random() * words.length);
      if (
        !hiddenIndices.includes(randomIndex) &&
        words[randomIndex].length > 2
      ) {
        hiddenIndices.push(randomIndex);
      }
    }

    // Create blanked paragraph
    const blankedWords = words.map((word, index) => {
      if (hiddenIndices.includes(index)) {
        return '______';
      }
      return word;
    });

    setBlankedParagraph(blankedWords.join(' '));
    setHiddenWords(hiddenIndices.map((index) => words[index]));
  };

  // Initialize with a paragraph
  useEffect(() => {
    prepareNewParagraph();
  }, []);

  // Handle user submission
  const handleSubmit = () => {
    // Check if all hidden words are in the user input
    const normalizedInput = normalizeText(userInput);
    const allWordsFound = hiddenWords.every((word) => {
      const normalizedWord = normalizeText(word);
      return normalizedInput.includes(normalizedWord);
    });

    setFeedback(allWordsFound ? 'correct' : 'incorrect');
  };

  // Load next paragraph after answer
  const handleContinue = () => {
    prepareNewParagraph();
    if (onContinue) onContinue();
  };

  // Toggle between random and sequential modes
  const toggleRandomMode = () => {
    setIsRandomMode((prev) => !prev);
  };

  return (
    <>
      <div
        className="mode-toggle"
        style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
      >
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={isRandomMode}
            onChange={toggleRandomMode}
          />
          <span className="toggle-slider"></span>
        </label>
        <span className="toggle-label">
          {isRandomMode ? 'Random Mode' : 'Sequential Mode'}
        </span>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginLeft: '16px',
          }}
        >
          <span>Hidden words:</span>
          <input
            type="number"
            min="1"
            value={numHiddenWords}
            onChange={(e) => setNumHiddenWords(Number(e.target.value))}
            className="hidden-words-input"
            style={{ width: '60px' }}
          />
        </label>
      </div>

      <h3 className="paragraph-title" style={{ marginBottom: '-25px' }}>
        {currentTitle || 'Untitled Paragraph'}
      </h3>
      <div className="paragraph-display">
        <p>{blankedParagraph}</p>
      </div>

      <div className="user-input-area">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type the missing words..."
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
            <p className="correct-answer">
              {originalParagraph.split(' ').map((word, index) => {
                // Check if this word was one of the hidden words
                const isHiddenWord = hiddenWords.includes(word);
                return (
                  <span key={index}>
                    {isHiddenWord ? <strong>{word}</strong> : word}
                    {index < originalParagraph.split(' ').length - 1 ? ' ' : ''}
                  </span>
                );
              })}
            </p>
            <button onClick={handleContinue} className="continue-btn">
              Continue
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default EasyModeQuiz;
