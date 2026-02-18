interface ScoreBoardProps {
  wordsCorrect: number;
  wordsIncorrect: number;
  timeRemaining: number;
}

export function ScoreBoard({ wordsCorrect, wordsIncorrect, timeRemaining }: ScoreBoardProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeStr = `${minutes}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="score-board">
      <div className="score-board__correct">
        Words Correct: <span>{wordsCorrect}</span>
      </div>
      <div className="score-board__timer">{timeStr}</div>
      <div className="score-board__incorrect">
        Words Incorrect: <span>{wordsIncorrect}</span>
      </div>
    </div>
  );
}
