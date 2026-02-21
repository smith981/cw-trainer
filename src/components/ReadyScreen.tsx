import { useEffect } from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { useIsMobile } from '../hooks/useIsMobile';

interface ReadyScreenProps {
  playerName: string;
  onCountdownComplete: () => void;
}

export function ReadyScreen({ playerName, onCountdownComplete }: ReadyScreenProps) {
  const { phase, count, start } = useCountdown(5, 1000);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (phase === 'done') {
      onCountdownComplete();
    }
  }, [phase, onCountdownComplete]);

  return (
    <div className="ready-screen">
      {phase === 'idle' && (
        <div className="ready-screen__prompt">
          <div className="ready-screen__instructions">
            {isMobile ? (
              <>
                <p className="ready-screen__instructions-title">How to play</p>
                <p>
                  Words will appear on screen. Tap the silver key to enter Morse code.
                </p>
                <p>
                  <strong>Quick tap</strong> = dit
                  (<span className="morse-dot">&middot;</span>)
                  &nbsp;&nbsp;
                  <strong>Long press</strong> = dah
                  (<span className="morse-dash">&mdash;</span>)
                </p>
                <p>Each letter is checked as you go. Get them all right before time runs out!</p>
                <p>
                  Tap <strong>{'\u{1F50A}'}</strong> to toggle word announcements on/off.
                  Tap <strong>Quit</strong> to end the round early.
                </p>

                <div className="ready-screen__key-preview">
                  <span className="morse-key-label">TAP KEY</span>
                  <span className="morse-key-arrow">&darr;</span>
                  <div className="morse-key morse-key--preview" />
                </div>
              </>
            ) : (
              <>
                <p className="ready-screen__instructions-title">How to play</p>
                <p>
                  Words will appear on screen. Use the <kbd>SPACEBAR</kbd> to tap out Morse code.
                </p>
                <p>
                  <strong>Short press</strong> = dit
                  (<span className="morse-dot">&middot;</span>)
                  &nbsp;&nbsp;
                  <strong>Long press</strong> = dah
                  (<span className="morse-dash">&mdash;</span>)
                </p>
                <p>Each letter is checked as you go. Get them all right before time runs out!</p>
                <p>
                  Click <strong>{'\u{1F50A}'}</strong> to toggle word announcements on/off.
                  Click <strong>Quit</strong> to end the round early.
                </p>
              </>
            )}
          </div>

          <h2 className="ready-screen__question">
            Are you Ready, {playerName}?
          </h2>
          <button
            className="ready-screen__button"
            onClick={() => {
              // Unlock speech synthesis on mobile (requires user gesture)
              const utterance = new SpeechSynthesisUtterance('');
              speechSynthesis.speak(utterance);
              start();
            }}
          >
            Ready!
          </button>
        </div>
      )}

      {phase === 'counting' && (
        <div className="ready-screen__countdown" key={count}>
          <span className="ready-screen__number">{count}</span>
          {isMobile && (
            <div className="morse-key-container morse-key-container--countdown">
              <span className="morse-key-label">TAP KEY</span>
              <span className="morse-key-arrow">&darr;</span>
              <div className="morse-key" />
            </div>
          )}
        </div>
      )}

      {phase === 'go' && (
        <div className="ready-screen__go">
          <span className="ready-screen__go-text">GO!</span>
          {isMobile && (
            <div className="morse-key-container morse-key-container--countdown">
              <span className="morse-key-label">TAP KEY</span>
              <span className="morse-key-arrow">&darr;</span>
              <div className="morse-key" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
