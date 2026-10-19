import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import type { ThemeMode } from '../../types';
import { soundEngine } from '../../audio/soundEngine';
import { OSNavbar } from '../OSNavbar';
import { SparkleTrail } from '../SparkleTrail';
import { Footer } from '../Footer';
import { EasterEggModal } from '../EasterEggModal';
import { ConstellationPassportModal } from '../ConstellationPassportModal';

export const SharedLayout: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>('daydream');
  const [isMuted, setIsMuted] = useState(false);
  const [chaosMode, setChaosMode] = useState(false);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [isArcadeUnlocked, setIsArcadeUnlocked] = useState(false);

  const location = useLocation();
  const routeWipeRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isFirstRenderRef = useRef(true);

  // Cinematic starlight aperture transition on route changes
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.style.setProperty('--scroll-night-progress', '0');

    // Skip transition on initial app mount
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    const wipeEl = routeWipeRef.current;
    const mainEl = document.getElementById('main-content');

    if (isReduced || !wipeEl) {
      if (mainEl) {
        gsap.fromTo(mainEl, { opacity: 0.85 }, { opacity: 1, duration: 0.2, ease: 'power1.out' });
      }
      ScrollTrigger.refresh();
      return;
    }

    // Gentle starlight chime on page navigation
    soundEngine.playMusicBoxNote(587.33, 0.7);

    const tl = gsap.timeline({
      onComplete: () => {
        ScrollTrigger.refresh();
        if (wipeEl) {
          gsap.set(wipeEl, { opacity: 0 });
        }
      }
    });

    timelineRef.current = tl;

    tl.set(wipeEl, { opacity: 1, clipPath: 'circle(0% at 50% 50%)' })
      .to(wipeEl, {
        clipPath: 'circle(120% at 50% 50%)',
        duration: 0.25,
        ease: 'power2.in'
      })
      .add(() => {
        if (mainEl) {
          gsap.fromTo(mainEl, { opacity: 0.75, y: 6 }, { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' });
        }
      })
      .to(wipeEl, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.out'
      });

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      if (wipeEl) {
        gsap.set(wipeEl, { opacity: 0 });
      }
    };
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
        onOpenPassport={() => setIsPassportOpen(true)}
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

      {/* Constellation Passport Modal */}
      {isPassportOpen && (
        <ConstellationPassportModal
          isOpen={isPassportOpen}
          onClose={() => setIsPassportOpen(false)}
        />
      )}

      {/* Cinematic Golden Starlight Celestial Route Aperture Wipe */}
      <div
        ref={routeWipeRef}
        className="celestial-route-wipe"
        aria-hidden="true"
        onClick={() => {
          if (timelineRef.current) {
            timelineRef.current.progress(1);
          }
        }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          pointerEvents: 'none',
          opacity: 0,
          background: 'radial-gradient(circle at center, rgba(255, 230, 160, 0.95) 0%, rgba(42, 28, 62, 0.98) 65%, #161026 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            fontFamily: 'serif',
            fontSize: '1.6rem',
            color: '#ffd88a',
            textShadow: '0 0 15px rgba(255, 216, 138, 0.8)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}
        >
          ✦
        </div>
      </div>
    </div>
  );
};

export default SharedLayout;
