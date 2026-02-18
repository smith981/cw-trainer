import { useState } from 'react';
import type { Difficulty } from '../types';
import { DIFFICULTY_CONFIGS } from '../utils/config';
import { saveName, saveDifficulty } from '../utils/storage';
import { HamRadioSvg } from './HamRadioSvg';

interface LandingPageProps {
  initialName: string;
  initialDifficulty: Difficulty | null;
  onStart: (name: string, difficulty: Difficulty) => void;
}

export function LandingPage({ initialName, initialDifficulty, onStart }: LandingPageProps) {
  const [name, setName] = useState(initialName);
  const [step, setStep] = useState<'name' | 'difficulty'>(initialName ? 'difficulty' : 'name');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(initialDifficulty);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    saveName(trimmed);
    setName(trimmed);
    setStep('difficulty');
  };

  const handleDifficultySelect = (d: Difficulty) => {
    setSelectedDifficulty(d);
    saveDifficulty(d);
    onStart(name.trim(), d);
  };

  return (
    <div className="landing-page">
      <HamRadioSvg className="landing-page__radio" />
      <h1 className="landing-page__title">Welcome to CW Trainer</h1>
      <p className="landing-page__subtitle">Master Morse Code, one word at a time</p>

      {step === 'name' && (
        <form className="landing-page__form" onSubmit={handleNameSubmit}>
          <label htmlFor="name-input" className="landing-page__label">
            What's your name?
          </label>
          <input
            id="name-input"
            type="text"
            className="landing-page__input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your name"
            autoFocus
            maxLength={30}
          />
          <button type="submit" className="landing-page__button" disabled={!name.trim()}>
            Continue
          </button>
        </form>
      )}

      {step === 'difficulty' && (
        <div className="landing-page__difficulty">
          <p className="landing-page__greeting">
            {initialName ? `Welcome back, ${name}!` : `Great, ${name}!`}
          </p>
          <p className="landing-page__label">Choose your difficulty level:</p>
          <div className="landing-page__levels">
            {([1, 2, 3, 4, 5] as Difficulty[]).map(d => (
              <button
                key={d}
                className={`landing-page__level-btn${selectedDifficulty === d ? ' landing-page__level-btn--selected' : ''}`}
                onClick={() => handleDifficultySelect(d)}
              >
                <span className="landing-page__level-number">Level {d}</span>
                <span className="landing-page__level-label">{DIFFICULTY_CONFIGS[d].label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
