import { useState, useEffect } from 'react';
import './App.css';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';

function App() {
  const [paragraphs, setParagraphs] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('start'); // 'start' or 'quiz'
  const [difficultyMode, setDifficultyMode] = useState('easy'); // 'easy' or 'hard'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTextFile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('./text/study.txt');
        if (!response.ok) {
          throw new Error(`Failed to fetch text file: ${response.status}`);
        }

        const text = await response.text();
        console.log('Text file loaded, length:', text.length);

        // Use regex to match sections properly with their content
        const sectionRegex =
          /---\s*title:\s*([^\n]+)\s*---\s*\n([\s\S]*?)(?=---|\s*$)/g;
        const parsedParagraphs = [];

        let match;
        while ((match = sectionRegex.exec(text)) !== null) {
          const title = match[1].trim();
          const content = match[2].trim();

          if (content) {
            // Only add if there's content
            parsedParagraphs.push({
              title,
              content,
            });
          }
        }

        console.log(
          `Parsed ${parsedParagraphs.length} paragraphs, with format:`,
          parsedParagraphs[0]
        );

        setParagraphs(parsedParagraphs);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading text file:', err);
        setError('Failed to load study text. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchTextFile();
  }, []);

  const handleStartQuiz = (mode) => {
    setDifficultyMode(mode);
    setCurrentScreen('quiz');
  };

  const handleRestartTraining = () => {
    setCurrentScreen('start');
  };

  if (isLoading) {
    return <div className="loading-container">Loading study text...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="app-container">
      {currentScreen === 'start' ? (
        <StartScreen onStartQuiz={handleStartQuiz} />
      ) : (
        <QuizScreen
          paragraphs={paragraphs}
          difficultyMode={difficultyMode}
          onRestartTraining={handleRestartTraining}
          onChangeDifficulty={setDifficultyMode}
        />
      )}
    </div>
  );
}

export default App;
