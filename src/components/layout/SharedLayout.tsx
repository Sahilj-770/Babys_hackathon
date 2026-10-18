import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import gsap from 'gsap';

import type { ThemeMode } from '../../types';
import { soundEngine } from '../../audio/soundEngine';
import { OSNavbar } from '../OSNavbar';
import { SparkleTrail } from '../SparkleTrail';
import { Footer } from '../Footer';
import { EasterEggModal } from '../EasterEggModal';

export const SharedLayout: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>('daydream');
  const [isMuted, setIsMuted] = useState(false);
  const [chaosMode, setChaosMode] = useState(false);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);
  const [isArcadeUnlocked, setIsArcadeUnlocked] = useState(false);

  const location = useLocation();

  // Scroll to top and subtle fade on route changes
  useEffect(() => {
    window.scrollTo(0, 0);
    const mainEl = document.getElementById('main-content');
    if (mainEl) {
      gsap.fromTo(
        mainEl,
        { opacity: 0.85, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [location.pathname]);

  // Synchronize theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Synchronize chaos mode class to document body
  useEffect(() => {
    if (chaosMode) {
      document.body.classList.add('chaos-mode');
    } else {
      document.body.classList.remove('chaos-mode');
    }
  }, [chaosMode]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'daydream' ? 'midnight' : 'daydream'));
  };

  const toggleMute = () => {
    const nextMute = soundEngine.toggleMute();
    setIsMuted(nextMute);
  };

  const toggleChaos = () => {
    setChaosMode((prev) => !prev);
  };

  const handleOpenSecret = () => {
    setIsEasterEggOpen(true);
    setIsArcadeUnlocked(true);
  };

  return (
    <div id="top" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sparkle cursor trail on mouse devices */}
      <SparkleTrail />

      {/* Floating Retro OS Dream Navbar */}
      <OSNavbar
        theme={theme}
        onToggleTheme={toggleTheme}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        chaosMode={chaosMode}
        onToggleChaos={toggleChaos}
        onOpenSecret={handleOpenSecret}
        isArcadeUnlocked={isArcadeUnlocked}
      />

      {/* Main Content Area */}
      <main id="main-content" style={{ flex: 1 }}>
        <Outlet context={{ onOpenSecret: handleOpenSecret }} />
      </main>

      {/* Shared Footer across all routes */}
      <Footer />

      {/* Easter Egg Modal */}
      <EasterEggModal isOpen={isEasterEggOpen} onClose={() => setIsEasterEggOpen(false)} />
    </div>
  );
};

export default SharedLayout;
