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
        const response = await fetch('/text/study.txt');
        if (!response.ok) {
          throw new Error(`Failed to fetch text file: ${response.status}`);
        }
        const text = await response.text();

        // Parse text with metadata format: sections separated by '---'
        // Each section has title metadata and content
        const sections = text
          .split('---')
          .filter((section) => section.trim().length > 0);
        const parsedParagraphs = [];

        for (let i = 0; i < sections.length; i += 2) {
          // Even indices contain metadata (title)
          // Odd indices contain paragraph content
          if (i + 1 < sections.length) {
            const metadata = sections[i].trim();
            const content = sections[i + 1].trim();

            // Extract title from metadata
            const titleMatch = metadata.match(/title:\s*(.+)/);
            const title = titleMatch ? titleMatch[1].trim() : '';

            // Store both title and content
            parsedParagraphs.push({
              title,
              content,
            });
          }
        }

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
