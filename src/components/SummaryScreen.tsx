import type { WordResult } from '../types';

interface SummaryScreenProps {
  playerName: string;
  results: WordResult[];
  onPlayAgain: () => void;
}

export function SummaryScreen({ playerName, results, onPlayAgain }: SummaryScreenProps) {
  const correctWords = results.filter(r => r.correct);
  const incorrectWords = results.filter(r => !r.correct);

  return (
    <div className="summary-screen">
      <h1 className="summary-screen__title">Round Complete!</h1>
      <p className="summary-screen__subtitle">Great effort, {playerName}!</p>

      <div className="summary-screen__totals">
        <div className="summary-screen__total summary-screen__total--correct">
          <span className="summary-screen__total-number">{correctWords.length}</span>
          <span className="summary-screen__total-label">Correct</span>
        </div>
        <div className="summary-screen__total summary-screen__total--incorrect">
          <span className="summary-screen__total-number">{incorrectWords.length}</span>
          <span className="summary-screen__total-label">Incorrect</span>
        </div>
      </div>

      <div className="summary-screen__columns">
        <div className="summary-screen__column">
          <div className="summary-screen__column-line summary-screen__column-line--correct" />
          <ul className="summary-screen__word-list">
            {correctWords.length === 0 && (
              <li className="summary-screen__word-item summary-screen__word-item--empty">None</li>
            )}
            {correctWords.map((r, i) => (
              <li key={i} className="summary-screen__word-item">{r.word}</li>
            ))}
          </ul>
        </div>
        <div className="summary-screen__column">
          <div className="summary-screen__column-line summary-screen__column-line--incorrect" />
          <ul className="summary-screen__word-list">
            {incorrectWords.length === 0 && (
              <li className="summary-screen__word-item summary-screen__word-item--empty">None</li>
            )}
            {incorrectWords.map((r, i) => (
              <li key={i} className="summary-screen__word-item">{r.word}</li>
            ))}
          </ul>
        </div>
      </div>

      <button className="summary-screen__play-again" onClick={onPlayAgain}>
        Play Again
      </button>
    </div>
  );
}
