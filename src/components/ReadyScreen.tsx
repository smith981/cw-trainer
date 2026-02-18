import { useEffect } from 'react';
import { useCountdown } from '../hooks/useCountdown';

interface ReadyScreenProps {
  playerName: string;
  onCountdownComplete: () => void;
}

export function ReadyScreen({ playerName, onCountdownComplete }: ReadyScreenProps) {
  const { phase, count, start } = useCountdown(5, 1000);

  useEffect(() => {
    if (phase === 'done') {
      onCountdownComplete();
    }
  }, [phase, onCountdownComplete]);

  return (
    <div className="ready-screen">
      {phase === 'idle' && (
        <div className="ready-screen__prompt">
          <h2 className="ready-screen__question">
            Are you Ready, {playerName}?
          </h2>
          <button className="ready-screen__button" onClick={start}>
            Ready!
          </button>
        </div>
      )}

      {phase === 'counting' && (
        <div className="ready-screen__countdown" key={count}>
          <span className="ready-screen__number">{count}</span>
        </div>
      )}

      {phase === 'go' && (
        <div className="ready-screen__go">
          <span className="ready-screen__go-text">GO!</span>
        </div>
      )}
    </div>
  );
}
