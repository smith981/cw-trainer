import type { DifficultyConfig, GameConfig, Difficulty } from '../types';

export const GAME_CONFIG: GameConfig = {
  roundDurationSeconds: 120,
  wordsPerRound: 20,
  wordTimeLimitSeconds: 10,
  ditThresholdMs: 200,
  letterGapMs: 600,
};

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  1: { minLength: 3, maxLength: 4, label: 'Easy' },
  2: { minLength: 3, maxLength: 6, label: 'Moderate' },
  3: { minLength: 3, maxLength: 8, label: 'Intermediate' },
  4: { minLength: 3, maxLength: 10, label: 'Advanced' },
  5: { minLength: 3, maxLength: 12, label: 'Expert' },
};
