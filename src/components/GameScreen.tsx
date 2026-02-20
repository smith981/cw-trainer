import { useReducer, useEffect, useRef, useCallback, useState } from 'react';
import type { Difficulty, WordResult } from '../types';
import { GAME_CONFIG } from '../utils/config';
import { selectWords } from '../utils/wordLists';
import { getMorseForChar } from '../utils/morseCode';
import { useMorseInput } from '../hooks/useMorseInput';
import { useGameTimer } from '../hooks/useGameTimer';
import { useIsMobile } from '../hooks/useIsMobile';
import { ScoreBoard } from './ScoreBoard';
import { WordDisplay } from './WordDisplay';
import { MorseDisplay } from './MorseDisplay';

interface GameScreenProps {
  difficulty: Difficulty;
  onGameEnd: (results: WordResult[]) => void;
}

interface GameState {
  currentWordIndex: number;
  currentLetterIndex: number;
  decodedLetters: string[];
  wordsCorrect: number;
  wordsIncorrect: number;
  results: WordResult[];
  feedbackMessage: string | null;
}

type GameAction =
  | { type: 'LETTER_DECODED'; letter: string; words: string[] }
  | { type: 'WORD_TIMEOUT'; words: string[] }
  | { type: 'CLEAR_FEEDBACK' };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'LETTER_DECODED': {
      const currentWord = action.words[state.currentWordIndex];
      if (!currentWord) return state;

      const expectedLetter = currentWord[state.currentLetterIndex];

      if (action.letter === '' || action.letter !== expectedLetter) {
        return {
          ...state,
          wordsIncorrect: state.wordsIncorrect + 1,
          results: [...state.results, { word: currentWord, correct: false }],
          currentWordIndex: state.currentWordIndex + 1,
          currentLetterIndex: 0,
          decodedLetters: [],
          feedbackMessage: 'INCORRECT',
        };
      }

      const newDecodedLetters = [...state.decodedLetters, action.letter];

      if (newDecodedLetters.length === currentWord.length) {
        return {
          ...state,
          wordsCorrect: state.wordsCorrect + 1,
          results: [...state.results, { word: currentWord, correct: true }],
          currentWordIndex: state.currentWordIndex + 1,
          currentLetterIndex: 0,
          decodedLetters: [],
          feedbackMessage: 'CORRECT!',
        };
      }

      return {
        ...state,
        currentLetterIndex: state.currentLetterIndex + 1,
        decodedLetters: newDecodedLetters,
        feedbackMessage: null,
      };
    }

    case 'WORD_TIMEOUT': {
      const currentWord = action.words[state.currentWordIndex];
      if (!currentWord) return state;

      return {
        ...state,
        wordsIncorrect: state.wordsIncorrect + 1,
        results: [...state.results, { word: currentWord, correct: false }],
        currentWordIndex: state.currentWordIndex + 1,
        currentLetterIndex: 0,
        decodedLetters: [],
        feedbackMessage: 'TIME UP!',
      };
    }

    case 'CLEAR_FEEDBACK':
      return { ...state, feedbackMessage: null };

    default:
      return state;
  }
}

const initialState: GameState = {
  currentWordIndex: 0,
  currentLetterIndex: 0,
  decodedLetters: [],
  wordsCorrect: 0,
  wordsIncorrect: 0,
  results: [],
  feedbackMessage: null,
};

export function GameScreen({ difficulty, onGameEnd }: GameScreenProps) {
  const isMobile = useIsMobile();
  const [words] = useState(() => selectWords(difficulty, GAME_CONFIG.wordsPerRound));
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [isActive, setIsActive] = useState(true);
  const [wordTimeLeft, setWordTimeLeft] = useState(GAME_CONFIG.wordTimeLimitSeconds);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const gameEndedRef = useRef(false);
  const wordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wordTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleRoundExpired = useCallback(() => {
    setIsActive(false);
  }, []);

  const { timeRemaining, start: startTimer } = useGameTimer(
    GAME_CONFIG.roundDurationSeconds,
    handleRoundExpired
  );

  const handleLetterDecoded = useCallback((letter: string) => {
    dispatch({ type: 'LETTER_DECODED', letter, words });
  }, [words]);

  const morseInput = useMorseInput({
    onLetterDecoded: handleLetterDecoded,
    active: isActive && state.currentWordIndex < words.length,
  });

  // Start the round timer on mount
  useEffect(() => {
    startTimer();
  }, [startTimer]);

  // Speak the word when it appears
  useEffect(() => {
    if (!speechEnabled || !isActive || state.currentWordIndex >= words.length) return;
    const word = words[state.currentWordIndex];
    if (!word) return;

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.85;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);

    return () => { speechSynthesis.cancel(); };
  }, [state.currentWordIndex, speechEnabled, isActive, words]);

  // Per-word countdown timer
  useEffect(() => {
    if (!isActive || state.currentWordIndex >= words.length) return;

    setWordTimeLeft(GAME_CONFIG.wordTimeLimitSeconds);

    wordTimerRef.current = setInterval(() => {
      setWordTimeLeft(prev => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    wordTimeoutRef.current = setTimeout(() => {
      morseInput.reset();
      dispatch({ type: 'WORD_TIMEOUT', words });
    }, GAME_CONFIG.wordTimeLimitSeconds * 1000);

    return () => {
      if (wordTimerRef.current) clearInterval(wordTimerRef.current);
      if (wordTimeoutRef.current) clearTimeout(wordTimeoutRef.current);
    };
  }, [state.currentWordIndex, isActive, words, morseInput]);

  // Clear feedback after delay
  useEffect(() => {
    if (!state.feedbackMessage) return;

    feedbackTimerRef.current = setTimeout(() => {
      dispatch({ type: 'CLEAR_FEEDBACK' });
    }, 800);

    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, [state.feedbackMessage, state.currentWordIndex]);

  const handleQuit = useCallback(() => {
    if (gameEndedRef.current) return;
    gameEndedRef.current = true;
    setIsActive(false);
    onGameEnd(state.results);
  }, [state.results, onGameEnd]);

  // End game when all words done or round expired
  useEffect(() => {
    if (gameEndedRef.current) return;

    if (!isActive || state.currentWordIndex >= words.length) {
      gameEndedRef.current = true;
      // Small delay so user sees the last feedback
      const timer = setTimeout(() => {
        onGameEnd(state.results);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isActive, state.currentWordIndex, state.results, words.length, onGameEnd]);

  const currentWord = words[state.currentWordIndex] ?? '';
  const currentExpectedChar = currentWord[state.currentLetterIndex] ?? '';
  const expectedMorse = getMorseForChar(currentExpectedChar);

  return (
    <div className="game-screen">
      <ScoreBoard
        wordsCorrect={state.wordsCorrect}
        wordsIncorrect={state.wordsIncorrect}
        timeRemaining={timeRemaining}
      />

      <div className="game-screen__top-actions">
        <button
          className="game-screen__speech-toggle"
          onClick={() => { speechSynthesis.cancel(); setSpeechEnabled(v => !v); }}
          title={speechEnabled ? 'Mute word speech' : 'Unmute word speech'}
        >
          {speechEnabled ? '\u{1F50A}' : '\u{1F507}'}
        </button>
        <button className="game-screen__quit" onClick={handleQuit}>
          Quit
        </button>
      </div>

      <div className="game-screen__info-bar">
        <span className="game-screen__word-count">
          Word {Math.min(state.currentWordIndex + 1, words.length)} of {words.length}
        </span>
        <span className="game-screen__word-timer">
          Word time: {wordTimeLeft}s
        </span>
      </div>

      {state.currentWordIndex < words.length && (
        <div className="game-screen__play-area">
          <WordDisplay
            word={currentWord}
            currentLetterIndex={state.currentLetterIndex}
            decodedLetters={state.decodedLetters}
          />

          <MorseDisplay elements={morseInput.currentElements} />

          {expectedMorse && (
            <div className="game-screen__hint">
              Hint: <strong>{currentExpectedChar}</strong> = {expectedMorse}
            </div>
          )}

          {!isMobile && (
            <div className="game-screen__instructions">
              Short press = dit (<span className="morse-dot">&middot;</span>)
              &nbsp;&nbsp;|&nbsp;&nbsp;
              Long press = dah (<span className="morse-dash">&mdash;</span>)
            </div>
          )}
        </div>
      )}

      {isMobile && state.currentWordIndex < words.length && (
        <div className="morse-key-container">
          <span className="morse-key-label">TAP KEY</span>
          <span className="morse-key-arrow">&darr;</span>
          <button
            className="morse-key"
            onTouchStart={e => { e.preventDefault(); morseInput.pressStart(); }}
            onTouchEnd={e => { e.preventDefault(); morseInput.pressEnd(); }}
          />
        </div>
      )}

      {state.feedbackMessage && (
        <div
          className={`game-screen__feedback ${
            state.feedbackMessage === 'CORRECT!'
              ? 'game-screen__feedback--correct'
              : 'game-screen__feedback--incorrect'
          }`}
          key={`${state.feedbackMessage}-${state.currentWordIndex}`}
        >
          {state.feedbackMessage}
        </div>
      )}
    </div>
  );
}
