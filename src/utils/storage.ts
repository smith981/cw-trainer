import type { Difficulty } from '../types';

const STORAGE_KEY_NAME = 'cw_trainer_name';
const STORAGE_KEY_DIFFICULTY = 'cw_trainer_difficulty';

export function loadName(): string {
  return localStorage.getItem(STORAGE_KEY_NAME) ?? '';
}

export function loadDifficulty(): Difficulty | null {
  const raw = localStorage.getItem(STORAGE_KEY_DIFFICULTY);
  if (!raw) return null;
  const parsed = parseInt(raw, 10);
  if (parsed >= 1 && parsed <= 5) return parsed as Difficulty;
  return null;
}

export function saveName(name: string): void {
  localStorage.setItem(STORAGE_KEY_NAME, name);
}

export function saveDifficulty(difficulty: Difficulty): void {
  localStorage.setItem(STORAGE_KEY_DIFFICULTY, String(difficulty));
}
