/**
 * Theme Manager for WorkVerse Platform
 * Supports localStorage persistence, prefers-color-scheme detection, and live OS scheme listener.
 */

const STORAGE_KEY = 'workverse_theme';

export function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }
  return 'light';
}

export function applyTheme(theme) {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.add('light');
    root.classList.remove('dark');
  } else {
    root.classList.add('dark');
    root.classList.remove('light');
  }
}

export function saveThemeChoice(theme) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
}

export function initThemeListener(onSystemThemeChange) {
  if (typeof window === 'undefined') return () => {};
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = (e) => {
    // Only respond to OS changes if user hasn't explicitly set a preference
    if (!localStorage.getItem(STORAGE_KEY)) {
      const newTheme = e.matches ? 'dark' : 'light';
      applyTheme(newTheme);
      if (onSystemThemeChange) onSystemThemeChange(newTheme);
    }
  };

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }
  return () => {};
}
