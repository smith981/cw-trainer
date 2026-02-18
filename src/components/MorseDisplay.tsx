import type { MorseElement } from '../types';

interface MorseDisplayProps {
  elements: MorseElement[];
}

export function MorseDisplay({ elements }: MorseDisplayProps) {
  return (
    <div className="morse-display">
      <div className="morse-display__elements">
        {elements.map((el, i) => (
          <span
            key={i}
            className={`morse-display__element morse-display__element--${el}`}
          >
            {el === 'dit' ? '\u00B7' : '\u2014'}
          </span>
        ))}
        {elements.length === 0 && (
          <span className="morse-display__placeholder">
            Press SPACEBAR to input Morse
          </span>
        )}
      </div>
    </div>
  );
}
