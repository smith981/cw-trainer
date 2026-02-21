import { useState, useEffect, useRef, useCallback } from 'react';

interface UseGameTimerReturn {
  timeRemaining: number;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
}

export function useGameTimer(durationSeconds: number, onExpired: () => void): UseGameTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExpiredRef = useRef(onExpired);
  onExpiredRef.current = onExpired;

  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setTimeRemaining(durationSeconds);
    setIsRunning(true);
  }, [durationSeconds]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          stop();
          onExpiredRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, stop]);

  const pause = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resume = useCallback(() => {
    setIsRunning(true);
  }, []);

  return { timeRemaining, isRunning, start, stop, pause, resume };
}
