'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="relative w-8 h-8 flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
      style={{
        backgroundColor: 'transparent',
      }}
    >
      {/* Outer light circle */}
      <div className="w-6 h-6 rounded-full bg-white dark:bg-gray-300 absolute z-10" />

      {/* Inner dark overlay for crescent effect */}
      <div
        className={`w-6 h-6 rounded-full bg-black absolute z-20 transition-transform duration-300 ${
          isDark ? 'translate-x-1 translate-y-1' : '-translate-x-1 -translate-y-1'
        }`}
      />

      {/* Optional emoji overlay for fun */}
      <span className="absolute text-xs">
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
