'use client';

import { useState, useCallback } from 'react';
import ShaderBackground from '../shader/ShaderBackground';
import MainNav from './MainNav';
import ThemeSwitcher from './ThemeSwitcher';

interface SiteLayoutProps {
  children: React.ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  const [isDark, setIsDark] = useState(true);
  const [isMonospaced, setIsMonospaced] = useState(false);

  const handleThemeChange = useCallback((dark: boolean) => {
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
    }
  }, []);

  const handleMonospacedChange = useCallback((monospaced: boolean) => {
    setIsMonospaced(monospaced);
    if (monospaced) {
      document.documentElement.classList.add('monospaced');
    } else {
      document.documentElement.classList.remove('monospaced');
    }
  }, []);

  return (
    <>
      <ShaderBackground isDark={isDark} />

      {/* Frame Border */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <div className="absolute left-5 top-0 h-full w-px bg-current opacity-20" />
        <div className="absolute right-5 top-0 h-full w-px bg-current opacity-20" />
        <div className="absolute top-5 left-0 w-full h-px bg-current opacity-20" />
        <div className="absolute bottom-5 left-0 w-full h-px bg-current opacity-20" />
      </div>

      {/* Rule of Thirds Grid */}
      <div className="fixed inset-0 z-[5] pointer-events-none">
        {/* Vertical lines at 1/3 and 2/3 */}
        <div className="absolute left-[33.333%] top-0 h-full w-px bg-current opacity-[0.08]" />
        <div className="absolute left-[66.666%] top-0 h-full w-px bg-current opacity-[0.08]" />
        {/* Horizontal lines at 1/3 and 2/3 */}
        <div className="absolute top-[33.333%] left-0 w-full h-px bg-current opacity-[0.08]" />
        <div className="absolute top-[66.666%] left-0 w-full h-px bg-current opacity-[0.08]" />
      </div>

      <MainNav />
      <ThemeSwitcher onThemeChange={handleThemeChange} onMonospacedChange={handleMonospacedChange} />

      {/* Bio Text */}
      <div className="fixed bottom-20 right-[70px] max-w-[320px] z-[100]">
        <p className="text-[11px] leading-relaxed font-light tracking-wide">
          Based in Chicago, Illinois. I believe street photography can be more diverse and inspiring.
          With a mission to document urban landscapes and human stories, I am pursuing new perspectives
          through my camera while driving eCommerce growth and strategic partnerships at{' '}
          <a
            href="https://cpg.io"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-60 transition-opacity"
          >
            CPGIO
          </a>.
        </p>
      </div>

      {/* Copyright */}
      <div className="fixed bottom-12 left-[70px] z-[100]">
        <p className="text-[10px] font-light opacity-50">© Jack Ross</p>
      </div>

      {/* Main Content */}
      <main className="relative z-20">{children}</main>
    </>
  );
}
