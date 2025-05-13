import { useState, useEffect, useRef } from 'react';
import { normalizeText } from '../utils';

const PracticeMode = ({ paragraphs }) => {
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  // Modified feedback state to store an object or null
  // null | { type: 'correct' } | { type: 'incorrect', typed: string, expected: string }
  // | { type: 'partial_error', correctCount: number, typed: string, expected: string }
  // | { type: 'completed' }
  const [feedback, setFeedback] = useState(null);
  const [originalParagraph, setOriginalParagraph] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [completedText, setCompletedText] = useState('');
  const [remainingText, setRemainingText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words, setWords] = useState([]);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  // Initialize with the first paragraph
  useEffect(() => {
    if (paragraphs && paragraphs.length > 0) {
      // Ensure prepareNewParagraph is called only once with the initial index
      prepareNewParagraph(0); // Initialize with the first paragraph explicitly
      setCurrentParagraphIndex(0); // Set index if not already
    }
  }, [paragraphs]); // Dependency on paragraphs ensures re-init if paragraphs change

  // Focus input field when component mounts or when feedback changes
  useEffect(() => {
    if (inputRef.current && !(feedback && feedback.type === 'completed')) {
      inputRef.current.focus();
    }
  }, [feedback]); // Depend on the feedback object

  // Prepare a paragraph for practice
  const prepareNewParagraph = (index) => {
    if (
      !paragraphs ||
      paragraphs.length === 0 ||
      index < 0 ||
      index >= paragraphs.length
    )
      return;

    const paragraph = paragraphs[index];
    setOriginalParagraph(paragraph.content);
    setCurrentTitle(paragraph.title);
    setUserInput('');
    setFeedback(null);
    setCompletedText('');

    const wordsArray = paragraph.content.split(/\s+/).filter(Boolean); // Filter out empty strings
    setWords(wordsArray);
    setCurrentWordIndex(0);
    setRemainingText(paragraph.content);
    setProgress(0);
  };

  // Handle user input
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  // Processes a sequence of correctly typed words
  const processCorrectWords = (count) => {
    // If no words to process, return current state
    if (count === 0) {
      return {
        paragraphCompleted: currentWordIndex >= words.length,
        newCurrentWordIndex: currentWordIndex,
      };
    }

    const firstWordInSequenceIndex = currentWordIndex;
    const newCompleted = words
      .slice(0, firstWordInSequenceIndex + count)
      .join(' ');
    setCompletedText(newCompleted);

    const nextIdx = firstWordInSequenceIndex + count;
    setCurrentWordIndex(nextIdx); // Set state for the next render/interaction

    if (nextIdx < words.length) {
      setRemainingText(words.slice(nextIdx).join(' '));
    } else {
      setRemainingText('');
    }
    setProgress(Math.round((nextIdx / words.length) * 100));
    return {
      paragraphCompleted: nextIdx >= words.length,
      newCurrentWordIndex: nextIdx,
    };
  };

  // Processes the word at a given index as incorrect (auto-completes it)
  const processIncorrectWord = (indexToProcess) => {
    if (indexToProcess >= words.length) return true; // Already past end or nothing to process

    const wordToAutocomplete = words[indexToProcess];
    setCompletedText(
      (prevCompletedText) =>
        prevCompletedText + (prevCompletedText ? ' ' : '') + wordToAutocomplete
    );

    const nextIdxAfterThisWord = indexToProcess + 1;
    setCurrentWordIndex(nextIdxAfterThisWord); // Set state for the next render/interaction

    if (nextIdxAfterThisWord < words.length) {
      setRemainingText(words.slice(nextIdxAfterThisWord).join(' '));
    } else {
      setRemainingText('');
    }
    setProgress(Math.round((nextIdxAfterThisWord / words.length) * 100));
    return nextIdxAfterThisWord >= words.length; // Returns true if paragraph is completed
  };

  // Check if the input matches the current word or phrase
  const checkInput = () => {
    const initialCurrentWordIndexForCheck = currentWordIndex; // Capture at the start of this check

    if (initialCurrentWordIndexForCheck >= words.length || !userInput.trim()) {
      if (!userInput.trim()) setFeedback(null);
      return;
    }

    const typedWordsArray = userInput.trim().split(/\s+/).filter(Boolean);
    if (typedWordsArray.length === 0) {
      setFeedback(null);
      setUserInput('');
      return;
    }

    let numCorrectSequential = 0;
    let incorrectTypedWord = '';
    let expectedWordAtErrorPoint = '';
    let errorFound = false;

    for (let i = 0; i < typedWordsArray.length; i++) {
      if (initialCurrentWordIndexForCheck + i >= words.length) {
        errorFound = true;
        incorrectTypedWord = typedWordsArray[i];
        expectedWordAtErrorPoint = '[end of paragraph]';
        break;
      }

      const typedWord = normalizeText(typedWordsArray[i]);
      const expectedWordOriginalCasing =
        words[initialCurrentWordIndexForCheck + i];
      const expectedWordNormalized = normalizeText(expectedWordOriginalCasing);

      if (typedWord === expectedWordNormalized) {
        numCorrectSequential++;
      } else {
        errorFound = true;
        incorrectTypedWord = typedWordsArray[i];
        expectedWordAtErrorPoint = expectedWordOriginalCasing;
        break;
      }
    }

    let paragraphCompletedByProcessing = false;
    let indexAfterCorrectWords = initialCurrentWordIndexForCheck;

    if (numCorrectSequential > 0) {
      // processCorrectWords uses the current state of currentWordIndex, which is initialCurrentWordIndexForCheck here
      const correctResult = processCorrectWords(numCorrectSequential);
      paragraphCompletedByProcessing = correctResult.paragraphCompleted;
      indexAfterCorrectWords = correctResult.newCurrentWordIndex;

      if (errorFound) {
        if (!paragraphCompletedByProcessing) {
          // The error occurred at 'indexAfterCorrectWords'.
          // processIncorrectWord will auto-complete words[indexAfterCorrectWords]
          paragraphCompletedByProcessing = processIncorrectWord(
            indexAfterCorrectWords
          );
        }
        setFeedback({
          type: 'partial_error',
          correctCount: numCorrectSequential,
          typed: incorrectTypedWord,
          expected: expectedWordAtErrorPoint, // This was correctly captured based on initialCurrentWordIndexForCheck
        });
      } else {
        // All typed words were correct
        if (paragraphCompletedByProcessing) {
          setFeedback({ type: 'completed' });
        } else {
          setFeedback({ type: 'correct' });
        }
      }
    } else if (errorFound) {
      // First word typed was incorrect. Error is at initialCurrentWordIndexForCheck.
      const actualExpected = words[initialCurrentWordIndexForCheck];
      paragraphCompletedByProcessing = processIncorrectWord(
        initialCurrentWordIndexForCheck
      );
      if (paragraphCompletedByProcessing) {
        setFeedback({ type: 'completed' });
      } else {
        setFeedback({
          type: 'incorrect',
          typed: incorrectTypedWord, // This is typedWordsArray[0]
          expected: actualExpected,
        });
      }
    } else {
      // This case should ideally not be reached if typedWordsArray is not empty.
      setFeedback(null);
    }

    setUserInput('');
  };

  // Handle key press events
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkInput();
    }
  };

  // Move to the next paragraph
  const handleNextParagraph = () => {
    const nextIndex = (currentParagraphIndex + 1) % paragraphs.length;
    setCurrentParagraphIndex(nextIndex);
    prepareNewParagraph(nextIndex);
  };

  // Repeat the current paragraph
  const handleRepeatParagraph = () => {
    prepareNewParagraph(currentParagraphIndex);
  };

  // Handle paragraph selection
  const handleParagraphSelect = (e) => {
    const index = parseInt(e.target.value, 10);
    setCurrentParagraphIndex(index);
    prepareNewParagraph(index);
  };

  // Determine input field class based on feedback type
  let inputClassName = '';
  if (feedback && feedback.type) {
    if (feedback.type === 'partial_error' || feedback.type === 'incorrect') {
      inputClassName = 'input-incorrect';
    } else if (feedback.type === 'correct') {
      inputClassName = 'input-correct';
    } else if (feedback.type === 'completed') {
      inputClassName = 'input-completed'; // Or some other style
    }
  }

  return (
    <div className="practice-mode">
      <div className="practice-header">
        <h2>Practice Mode</h2>

        <div className="paragraph-selector">
          <label htmlFor="paragraph-select">Select Paragraph: </label>
          <select
            id="paragraph-select"
            value={currentParagraphIndex}
            onChange={handleParagraphSelect}
            disabled={!paragraphs || paragraphs.length === 0}
          >
            {paragraphs &&
              paragraphs.map((paragraph, index) => (
                <option key={index} value={index}>
                  {index + 1}. {paragraph.title}
                </option>
              ))}
          </select>
        </div>

        <div className="paragraph-info">
          <span>
            Paragraph{' '}
            {paragraphs && paragraphs.length > 0
              ? currentParagraphIndex + 1
              : 0}{' '}
            of {paragraphs ? paragraphs.length : 0}
          </span>
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="practice-content">
        <h3 className="paragraph-title">{currentTitle}</h3>

        <div className="practice-paragraph">
          <span className="completed-text">{completedText}</span>
          {remainingText && currentWordIndex < words.length && (
            <span className="remaining-text">
              {/* Show hint for the next word */}
              {` ${words[currentWordIndex].substring(0, 1)}...`}
            </span>
          )}
        </div>

        <div className="input-container">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={
              currentWordIndex >= words.length
                ? 'Paragraph completed!'
                : 'Type the next word(s)...'
            }
            disabled={
              currentWordIndex >= words.length ||
              !paragraphs ||
              paragraphs.length === 0
            }
            ref={inputRef}
            className={inputClassName}
          />
          <button
            onClick={checkInput}
            disabled={
              currentWordIndex >= words.length ||
              !userInput.trim() ||
              !paragraphs ||
              paragraphs.length === 0
            }
          >
            Check
          </button>
        </div>

        {feedback && feedback.type && (
          <div className={`feedback ${
            feedback.type === 'partial_error' || feedback.type === 'incorrect'
              ? 'feedback-incorrect' // Apply 'feedback-incorrect' style for both
              : `feedback-${feedback.type.split('_')[0]}` // Original logic for other types
          }`}>
            {' '}
            {/* e.g. feedback-partial */}
            {feedback.type === 'correct' && <span>Correct! Keep going!</span>}
            {feedback.type === 'incorrect' && (
              <span>
                Incorrect. You typed "<strong>{feedback.typed}</strong>", but
                expected "<strong>{feedback.expected}</strong>".
              </span>
            )}
            {feedback.type === 'partial_error' && (
              <span>
                You got {feedback.correctCount} word(s) right. Then, for the
                next word, you typed "<strong>{feedback.typed}</strong>" but
                expected "<strong>{feedback.expected}</strong>".
              </span>
            )}
            {feedback.type === 'completed' && (
              <div className="completion-options">
                <p>Great job! You've completed this paragraph.</p>
                <button onClick={handleNextParagraph}>Next Paragraph</button>
                <button onClick={handleRepeatParagraph}>
                  Repeat This Paragraph
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeMode;
