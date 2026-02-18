interface WordDisplayProps {
  word: string;
  currentLetterIndex: number;
  decodedLetters: string[];
}

export function WordDisplay({ word, currentLetterIndex, decodedLetters }: WordDisplayProps) {
  return (
    <div className="word-display">
      <div className="word-display__target">
        {word.split('').map((letter, i) => {
          let className = 'word-display__letter';
          if (i < currentLetterIndex) {
            className += ' word-display__letter--matched';
          } else if (i === currentLetterIndex) {
            className += ' word-display__letter--current';
          } else {
            className += ' word-display__letter--upcoming';
          }
          return (
            <span key={i} className={className}>
              {letter}
            </span>
          );
        })}
      </div>
      <div className="word-display__decoded">
        {decodedLetters.map((letter, i) => (
          <span key={i} className="word-display__decoded-letter">
            {letter}
          </span>
        ))}
        <span className="word-display__cursor">|</span>
      </div>
    </div>
  );
}
