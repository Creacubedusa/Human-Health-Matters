import { useEffect, useRef, useState } from 'react';

function formatSeconds(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function useCallTimer(active: boolean): string {
  const [seconds, setSeconds] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (active) {
      ref.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (ref.current) {
        clearInterval(ref.current);
        ref.current = null;
      }
    }
    return () => {
      if (ref.current) {
        clearInterval(ref.current);
      }
    };
  }, [active]);

  return formatSeconds(seconds);
}
