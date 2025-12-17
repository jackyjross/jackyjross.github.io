'use client';

import { useEffect, useState } from 'react';

interface ThemeSwitcherProps {
  onThemeChange: (isDark: boolean) => void;
  onMonospacedChange: (isMonospaced: boolean) => void;
}

export default function ThemeSwitcher({ onThemeChange, onMonospacedChange }: ThemeSwitcherProps) {
  const [isDark, setIsDark] = useState(true);
  const [isMonospaced, setIsMonospaced] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedMonospaced = localStorage.getItem('monospaced') === 'true';

    if (savedTheme === 'light') {
      setIsDark(false);
      onThemeChange(false);
    }
    if (savedMonospaced) {
      setIsMonospaced(true);
      onMonospacedChange(true);
    }
  }, [onThemeChange, onMonospacedChange]);

  const handleThemeChange = (dark: boolean) => {
    setIsDark(dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    onThemeChange(dark);
  };

  const handleMonospacedChange = () => {
    const newValue = !isMonospaced;
    setIsMonospaced(newValue);
    localStorage.setItem('monospaced', String(newValue));
    onMonospacedChange(newValue);
  };

  return (
    <div className="fixed bottom-[120px] left-[70px] z-[150] flex flex-col gap-3">
      {/* Monospaced Toggle */}
      <label className="flex items-center gap-2.5 cursor-pointer hover:opacity-60 transition-opacity">
        <div
          className={`w-3.5 h-3.5 border border-current relative transition-all ${
            isMonospaced ? 'bg-current' : ''
          }`}
        >
          {isMonospaced && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[--bg-color]" />
          )}
        </div>
        <span className="text-[13px] font-light tracking-wider">MONOSPACED</span>
        <input
          type="checkbox"
          checked={isMonospaced}
          onChange={handleMonospacedChange}
          className="sr-only"
        />
      </label>

      {/* Dark Toggle */}
      <label className="flex items-center gap-2.5 cursor-pointer hover:opacity-60 transition-opacity">
        <div
          className={`w-3.5 h-3.5 border border-current relative transition-all ${
            isDark ? 'bg-current' : ''
          }`}
        >
          {isDark && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[--bg-color]" />
          )}
        </div>
        <span className="text-[13px] font-light tracking-wider">DARK</span>
        <input
          type="radio"
          name="theme"
          checked={isDark}
          onChange={() => handleThemeChange(true)}
          className="sr-only"
        />
      </label>

      {/* Light Toggle */}
      <label className="flex items-center gap-2.5 cursor-pointer hover:opacity-60 transition-opacity">
        <div
          className={`w-3.5 h-3.5 border border-current relative transition-all ${
            !isDark ? 'bg-current' : ''
          }`}
        >
          {!isDark && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[--bg-color]" />
          )}
        </div>
        <span className="text-[13px] font-light tracking-wider">LIGHT</span>
        <input
          type="radio"
          name="theme"
          checked={!isDark}
          onChange={() => handleThemeChange(false)}
          className="sr-only"
        />
      </label>
    </div>
  );
}
