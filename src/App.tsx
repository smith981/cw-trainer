import { useState, useEffect, useCallback } from 'react';
import type { Difficulty, Screen, WordResult } from './types';
import { loadName, loadDifficulty } from './utils/storage';
import { LandingPage } from './components/LandingPage';
import { ReadyScreen } from './components/ReadyScreen';
import { GameScreen } from './components/GameScreen';
import { SummaryScreen } from './components/SummaryScreen';
import './App.css';

function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(1);
  const [initialDifficulty, setInitialDifficulty] = useState<Difficulty | null>(null);
  const [results, setResults] = useState<WordResult[]>([]);

  useEffect(() => {
    const storedName = loadName();
    const storedDifficulty = loadDifficulty();
    if (storedName) setName(storedName);
    if (storedDifficulty) {
      setDifficulty(storedDifficulty);
      setInitialDifficulty(storedDifficulty);
    }
  }, []);

  const handleLandingComplete = useCallback((n: string, d: Difficulty) => {
    setName(n);
    setDifficulty(d);
    setScreen('ready');
  }, []);

  const handleCountdownComplete = useCallback(() => {
    setScreen('game');
  }, []);

  const handleGameEnd = useCallback((r: WordResult[]) => {
    setResults(r);
    setScreen('summary');
  }, []);

  const handlePlayAgain = useCallback(() => {
    setResults([]);
    setScreen('ready');
  }, []);

  switch (screen) {
    case 'landing':
      return (
        <LandingPage
          initialName={name}
          initialDifficulty={initialDifficulty}
          onStart={handleLandingComplete}
        />
      );
    case 'ready':
      return (
        <ReadyScreen
          playerName={name}
          onCountdownComplete={handleCountdownComplete}
        />
      );
    case 'game':
      return (
        <GameScreen
          key={Date.now()}
          difficulty={difficulty}
          onGameEnd={handleGameEnd}
        />
      );
    case 'summary':
      return (
        <SummaryScreen
          playerName={name}
          results={results}
          onPlayAgain={handlePlayAgain}
        />
      );
  }
}

export default App;
