import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import type { ThemeMode } from './types';
import { soundEngine } from './audio/soundEngine';

import { BootScreen } from './components/BootScreen';
import { OSNavbar } from './components/OSNavbar';
import { HeroSection } from './components/HeroSection';
import { CinematicScrollSequence } from './components/CinematicScrollSequence';
import { StatusWidget } from './components/StatusWidget';
import { LullabyLab } from './components/exhibits/LullabyLab';
import { NightlightCollection } from './components/exhibits/NightlightCollection';
import { DreamDelivery } from './components/exhibits/DreamDelivery';
import { DreamForge } from './components/exhibits/DreamForge';
import { OriginStory } from './components/story/OriginStory';
import { EasterEggModal } from './components/EasterEggModal';
import { SparkleTrail } from './components/SparkleTrail';
import { Footer } from './components/Footer';

import './App.css';

// Register GSAP plugins safely
gsap.registerPlugin(ScrollTrigger);

export function App() {
  const [booted, setBooted] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('daydream');
  const [isMuted, setIsMuted] = useState(false);
  const [chaosMode, setChaosMode] = useState(false);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);

  // Keyboard shortcut: ESC to skip boot screen, 'm' for mute
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !booted) {
        setBooted(true);
      }
      if (e.key.toLowerCase() === 'm') {
        const nextMute = soundEngine.toggleMute();
        setIsMuted(nextMute);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [booted]);

  // Sync theme attribute to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sync chaos mode class to document body
  useEffect(() => {
    if (chaosMode) {
      document.body.classList.add('chaos-mode');
    } else {
      document.body.classList.remove('chaos-mode');
    }
  }, [chaosMode]);

  // GSAP scroll choreography with official matchMedia reduced-motion support
  useEffect(() => {
    if (!booted) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isNormalMotion: '(prefers-reduced-motion: no-preference)',
        isReducedMotion: '(prefers-reduced-motion: reduce)'
      },
      (context) => {
        const { isNormalMotion } = context.conditions as {
          isNormalMotion: boolean;
          isReducedMotion: boolean;
        };

        if (isNormalMotion) {
          // Reversible smooth scroll entrance for exhibits
          gsap.utils.toArray<HTMLElement>('.gsap-fade-in').forEach((el) => {
            gsap.fromTo(
              el,
              { opacity: 0, y: 36 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: el,
                  start: 'top 85%',
                  end: 'bottom 15%',
                  toggleActions: 'play none none reverse'
                }
              }
            );
          });
        } else {
          gsap.set('.gsap-fade-in', { opacity: 1, y: 0 });
        }
      }
    );

    return () => mm.revert();
  }, [booted]);

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

      {/* Skippable Boot Screen */}
      {!booted && (
        <BootScreen
          onEnter={() => setBooted(true)}
          isMuted={isMuted}
          onToggleMute={toggleMute}
        />
      )}

      {/* Retro OS Floating Dream Navbar */}
      <OSNavbar
        theme={theme}
        onToggleTheme={toggleTheme}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        chaosMode={chaosMode}
        onToggleChaos={toggleChaos}
        onOpenSecret={() => setIsEasterEggOpen(true)}
      />

      <main style={{ flex: 1 }}>
        {/* ACT I: THE NURSERY — Editorial Hero starring large unboxed Pip */}
        <HeroSection onOpenSecret={() => setIsEasterEggOpen(true)} />

        {/* ACT II & III: THE AWAKENING & THE DREAM REALM — Signature GSAP Scroll Sequence */}
        <CinematicScrollSequence />

        {/* 3 Interactive Exhibits / Dream Labs */}
        <section
          id="exhibits"
          style={{
            maxWidth: '1160px',
            margin: '0 auto',
            padding: '4.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '3.5rem'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <span
              className="font-mono"
              style={{
                fontSize: '0.78rem',
                padding: '0.35rem 0.95rem',
                backgroundColor: 'var(--bg-retro-panel)',
                borderRadius: '999px',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)'
              }}
            >
              PROJECT DIRECTORY // 4 OPERATIONAL WORKBENCHES
            </span>
            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(2.2rem, 4.2vw, 3.2rem)',
                color: 'var(--text-heading)',
                marginTop: '0.75rem'
              }}
            >
              Pip's Interactive Dream Labs
            </h2>
            <p
              style={{
                color: 'var(--text-muted)',
                maxWidth: '640px',
                margin: '0.5rem auto 0',
                fontSize: '1.05rem',
                lineHeight: 1.55
              }}
            >
              Every invention in Midnight Nursery is an operational playground. Design a personalized
              bedtime dream in the Dream Forge, strike synthesizer chimes, calibrate radiant lanterns,
              and inspect the rooftop delivery flightpath.
            </p>
          </div>

          {/* Signature Exhibit: The Dream Forge */}
          <div className="gsap-fade-in">
            <DreamForge />
          </div>

          {/* Exhibit 1: Lullaby Lab */}
          <div className="gsap-fade-in">
            <LullabyLab />
          </div>

          {/* Exhibit 2: Nightlight Collection */}
          <div className="gsap-fade-in">
            <NightlightCollection />
          </div>

          {/* Exhibit 3: Rooftop Dream Delivery Route */}
          <div className="gsap-fade-in">
            <DreamDelivery />
          </div>
        </section>

        {/* ACT IV: BEDTIME & CHRONICLES — Origin Story & Midnight Realm */}
        <section className="midnight-realm-wrapper" aria-label="Midnight Dream Realm Origin Story">
          <div className="midnight-celestial-stars" />
          <OriginStory />
        </section>

        {/* Live Odometer & Nursery Diagnostic bar */}
        <section style={{ padding: '3rem 1.5rem 1rem' }}>
          <StatusWidget />
        </section>
      </main>

      {/* Official Credits and Footer */}
      <Footer />

      {/* Easter Egg Modal */}
      <EasterEggModal isOpen={isEasterEggOpen} onClose={() => setIsEasterEggOpen(false)} />
    </div>
  );
}

export default App;
