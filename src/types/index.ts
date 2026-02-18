export type Difficulty = 1 | 2 | 3 | 4 | 5;

export type Screen = 'landing' | 'ready' | 'game' | 'summary';

export type MorseElement = 'dit' | 'dah';

export interface WordResult {
  word: string;
  correct: boolean;
}

export interface DifficultyConfig {
  minLength: number;
  maxLength: number;
  label: string;
}

export interface GameConfig {
  roundDurationSeconds: number;
  wordsPerRound: number;
  wordTimeLimitSeconds: number;
  ditThresholdMs: number;
  letterGapMs: number;
}
