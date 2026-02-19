import { useEffect, useRef, useCallback, useState } from 'react';
import type { MorseElement } from '../types';
import { GAME_CONFIG } from '../utils/config';
import { decodeMorseElements } from '../utils/morseCode';

interface UseMorseInputOptions {
  onLetterDecoded: (letter: string) => void;
  active: boolean;
}

interface UseMorseInputReturn {
  currentElements: MorseElement[];
  reset: () => void;
  pressStart: () => void;
  pressEnd: () => void;
}

export function useMorseInput({ onLetterDecoded, active }: UseMorseInputOptions): UseMorseInputReturn {
  const elementsRef = useRef<MorseElement[]>([]);
  const keyDownTimeRef = useRef<number | null>(null);
  const gapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [elements, setElements] = useState<MorseElement[]>([]);
  const onLetterDecodedRef = useRef(onLetterDecoded);
  onLetterDecodedRef.current = onLetterDecoded;

  const clearGapTimer = useCallback(() => {
    if (gapTimerRef.current !== null) {
      clearTimeout(gapTimerRef.current);
      gapTimerRef.current = null;
    }
  }, []);

  const startGapTimer = useCallback(() => {
    clearGapTimer();
    gapTimerRef.current = setTimeout(() => {
      const decoded = decodeMorseElements(elementsRef.current);
      if (decoded) {
        onLetterDecodedRef.current(decoded);
      } else if (elementsRef.current.length > 0) {
        onLetterDecodedRef.current('');
      }
      elementsRef.current = [];
      setElements([]);
    }, GAME_CONFIG.letterGapMs);
  }, [clearGapTimer]);

  const reset = useCallback(() => {
    clearGapTimer();
    elementsRef.current = [];
    setElements([]);
    keyDownTimeRef.current = null;
  }, [clearGapTimer]);

  const pressStart = useCallback(() => {
    if (!active) return;
    clearGapTimer();
    keyDownTimeRef.current = performance.now();
  }, [active, clearGapTimer]);

  const pressEnd = useCallback(() => {
    if (!active) return;
    if (keyDownTimeRef.current === null) return;

    const duration = performance.now() - keyDownTimeRef.current;
    keyDownTimeRef.current = null;

    const element: MorseElement = duration < GAME_CONFIG.ditThresholdMs ? 'dit' : 'dah';
    elementsRef.current = [...elementsRef.current, element];
    setElements([...elementsRef.current]);

    startGapTimer();
  }, [active, startGapTimer]);

  useEffect(() => {
    if (!active) {
      reset();
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || e.repeat) return;
      e.preventDefault();
      pressStart();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      e.preventDefault();
      pressEnd();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearGapTimer();
    };
  }, [active, clearGapTimer, pressStart, pressEnd, reset]);

  return { currentElements: elements, reset, pressStart, pressEnd };
}
