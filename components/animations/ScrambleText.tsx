'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

interface ScrambleTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export function ScrambleText({
  text,
  className = '',
  delay = 0,
  duration = 1500,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isClient, setIsClient] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    setIsClient(true);
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const getRandomChar = useCallback(() => {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }, []);

  useEffect(() => {
    if (!isClient || prefersReducedMotion) {
      setDisplayText(text);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      startTimeRef.current = null;

      const animate = (timestamp: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        const resolvedCount = Math.floor(progress * text.length);

        const result = text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (i < resolvedCount) return char;
            return getRandomChar();
          })
          .join('');

        setDisplayText(result);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayText(text);
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [text, delay, duration, isClient, prefersReducedMotion, getRandomChar]);

  return (
    <span className={className} aria-label={text}>
      {displayText}
    </span>
  );
}
