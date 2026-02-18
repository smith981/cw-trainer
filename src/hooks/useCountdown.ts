import { useState, useEffect, useCallback, useRef } from 'react';

export type CountdownPhase = 'idle' | 'counting' | 'go' | 'done';

interface UseCountdownReturn {
  phase: CountdownPhase;
  count: number;
  start: () => void;
}

export function useCountdown(from: number = 5, goDurationMs: number = 1000): UseCountdownReturn {
  const [phase, setPhase] = useState<CountdownPhase>('idle');
  const [count, setCount] = useState(from);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    setCount(from);
    setPhase('counting');
  }, [from]);

  useEffect(() => {
    if (phase !== 'counting') return;

    intervalRef.current = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setPhase('go');
          setTimeout(() => setPhase('done'), goDurationMs);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase, goDurationMs]);

  return { phase, count, start };
}
