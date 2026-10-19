import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useOutlet, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles } from 'lucide-react';

import type { ThemeMode } from '../../types';
import { soundEngine } from '../../audio/soundEngine';
import { OSNavbar } from '../OSNavbar';
import { SparkleTrail } from '../SparkleTrail';
import { Footer } from '../Footer';
import { EasterEggModal } from '../EasterEggModal';
import { ConstellationPassportModal } from '../ConstellationPassportModal';

const getRouteMeta = (path: string) => {
  switch (path) {
    case '/':
      return { title: 'Midnight Nursery', code: 'SECTOR_01 // AWAKENING' };
    case '/dream-forge':
      return { title: 'The Dream Forge', code: 'SECTOR_02 // DREAM RECIPE' };
    case '/atlas':
      return { title: 'The Midnight Atlas', code: 'SECTOR_03 // NOCTURNAL RADAR' };
    case '/archive':
      return { title: 'The Bedtime Archive', code: 'SECTOR_04 // STORYBOOK TOME' };
    case '/secret-arcade':
      return { title: 'Secret Star Arcade', code: 'SECTOR_99 // CATCH-A-DREAM' };
    default:
      return { title: 'DreamOS Gateway', code: 'SECTOR_00 // TRANSIT' };
  }
};

export const SharedLayout: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>('daydream');
  const [isMuted, setIsMuted] = useState(false);
  const [chaosMode, setChaosMode] = useState(false);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [isArcadeUnlocked, setIsArcadeUnlocked] = useState(false);

  const location = useLocation();

  const handleOpenSecret = useCallback(() => {
    setIsEasterEggOpen(true);
    setIsArcadeUnlocked(true);
  }, []);

  const outlet = useOutlet({ onOpenSecret: handleOpenSecret });
  const [frozenOutlet, setFrozenOutlet] = useState<React.ReactNode>(null);
  const [isCurtainActive, setIsCurtainActive] = useState(false);
  const [curtainTargetMeta, setCurtainTargetMeta] = useState(() => getRouteMeta(location.pathname));

  const curtainRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isFirstRenderRef = useRef(true);
  const prevOutletRef = useRef(outlet);

  // Keep track of current rendered outlet when not transitioning
  useEffect(() => {
    if (!isCurtainActive) {
      prevOutletRef.current = outlet;
    }
  }, [outlet, isCurtainActive]);

  // Dream Curtain page-to-page transition on route changes
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      document.documentElement.style.setProperty('--scroll-night-progress', '0');
      return;
    }

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 768;
    const curtainEl = curtainRef.current;
    const meta = getRouteMeta(location.pathname);
    setCurtainTargetMeta(meta);

    // If an animation is already running, clean up safely
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    if (isReduced || !curtainEl) {
      setIsCurtainActive(false);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      document.documentElement.style.setProperty('--scroll-night-progress', '0');
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      return;
    }

    // Freeze previous page content during the curtain sweep-in
    setFrozenOutlet(prevOutletRef.current);
    setIsCurtainActive(true);

    // Subtle, restrained 432 Hz transit click
    soundEngine.playClick(560);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsCurtainActive(false);
        if (curtainEl) {
          gsap.set(curtainEl, { display: 'none', pointerEvents: 'none' });
        }
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      }
    });

    timelineRef.current = tl;

    // Phase A: Curtain sweeps down (-100% to 0%), covering outgoing page
    tl.set(curtainEl, {
      display: 'flex',
      pointerEvents: 'auto',
      yPercent: -100,
      opacity: 1
    })
      .to(curtainEl, {
        yPercent: 0,
        duration: isMobile ? 0.16 : 0.22,
        ease: 'power3.inOut'
      })
      // Phase B: When curtain 100% covers viewport, swap to new route and reset scroll
      .call(() => {
        setIsCurtainActive(false); // Unfreezes to new outlet behind the curtain
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
        document.documentElement.style.setProperty('--scroll-night-progress', '0');
      })
      // Brief tactile hold for reading route badge (40-60ms)
      .to({}, { duration: isMobile ? 0.04 : 0.06 })
      // Phase C: Curtain smoothly sweeps down to reveal destination
      .to(curtainEl, {
        yPercent: 100,
        duration: isMobile ? 0.18 : 0.24,
        ease: 'power3.out'
      });

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      setIsCurtainActive(false);
      if (curtainEl) {
        gsap.set(curtainEl, { display: 'none', pointerEvents: 'none' });
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

      {/* Main Content Area — Strictly transform: none to preserve ScrollTrigger pinning */}
      <main id="main-content" style={{ flex: 1 }}>
        {isCurtainActive ? frozenOutlet : outlet}
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

      {/* The Dream Curtain Cinematic Page Transition Overlay */}
      <div
        ref={curtainRef}
        className="dream-curtain-overlay"
        aria-hidden="true"
        onClick={() => {
          if (timelineRef.current) {
            timelineRef.current.progress(1);
          }
        }}
      >
        <div className="dream-curtain-lead-trim top-trim" />
        <div className="dream-curtain-lead-trim bottom-trim" />
        <div className="dream-curtain-ambient" />
        <div className="dream-curtain-astrolabe" />

        <div className="dream-curtain-center">
          <div className="font-mono dream-curtain-kicker">
            <Sparkles size={13} color="var(--color-gold)" />
            <span>PIP://DREAMOS '99 // TRANSIT BUS</span>
          </div>
          <h2 className="font-serif dream-curtain-title">
            {curtainTargetMeta.title}
          </h2>
          <div className="font-mono dream-curtain-sector">
            <span>{curtainTargetMeta.code}</span>
            <span className="curtain-dot">✦</span>
            <span>432 Hz CALIBRATED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedLayout;
