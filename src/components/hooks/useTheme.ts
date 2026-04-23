import { useState, useEffect } from 'react';

export type Theme = 'dark' | 'light' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try { return (localStorage.getItem('p2-theme') as Theme) || 'dark'; } catch { return 'dark'; }
  });
  useEffect(() => {
    const resolved = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    document.documentElement.setAttribute('data-theme', resolved);
    try { localStorage.setItem('p2-theme', theme); } catch {}
  }, [theme]);
  return { theme, setTheme };
}
