import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

export const useAppTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;

    // Fallback to system preference
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  });

  const [isTransitioningTheme, setIsTransitioningTheme] = useState(false);

  const toggleTheme = useCallback(() => {
    if (isTransitioningTheme) return; // Prevent spam clicks

    setIsTransitioningTheme(true);

    // Katana animation: Wait for blade to sweep screen (300ms)
    setTimeout(() => {
      setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));

      // Give a tiny bit of time (30ms) for DOM to update before blade sweeps out
      setTimeout(() => {
        setIsTransitioningTheme(false);
      }, 30);
    }, 300);
  }, [isTransitioningTheme]);

  useEffect(() => {
    document.body.className = theme;
    // Save to localStorage whenever theme changes
    localStorage.setItem('theme', theme);
  }, [theme]);

  return {
    theme,
    isTransitioningTheme,
    toggleTheme
  };
};
