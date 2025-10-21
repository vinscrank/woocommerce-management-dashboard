import { useState, useEffect } from 'react';

/**
 * Hook per gestire il debounce di un valore
 * @param value - Il valore da debounciare
 * @param delay - Il ritardo in millisecondi (default: 1000ms)
 * @returns Il valore debounciato
 */
export function useDebounce<T>(value: T, delay: number = 1000): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

