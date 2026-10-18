import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Play, FastForward } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface BootScreenProps {
  onEnter: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onEnter }) => {
  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [progress, setProgress] = useState(isReducedMotion ? 100 : 0);
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);
  const [isReady, setIsReady] = useState(isReducedMotion);
  const [isExiting, setIsExiting] = useState(false);

  const messages = [
    'ALIGNING CELESTIAL ASTROLABE...',
    'CALIBRATING 432 Hz LULLABY REGISTER...',
    'IGNITING PIP\'S STARLIGHT LANTERN...',
    'MIDNIGHT NURSERY ONLINE // READY TO WAKE'
  ];

  const handleEnter = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    soundEngine.playMusicBoxNote(523.25, 1.4);
    setTimeout(() => {
      onEnter();
    }, 550);
  }, [isExiting, onEnter]);

  useEffect(() => {
    if (isReducedMotion) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
        const next = prev + 3;
        if (next >= 25 && next < 50) setActiveMessageIndex(1);
        else if (next >= 50 && next < 85) setActiveMessageIndex(2);
        else if (next >= 85) setActiveMessageIndex(3);
        return next;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [isReducedMotion]);

  // Keyboard shortcut listener: Enter or Space to enter, Esc to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleEnter();
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (isReady) {
          handleEnter();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReady, handleEnter]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Midnight Nursery DreamOS 99 Startup Sequence"
      className={`theatrical-boot-screen ${isExiting ? 'boot-exit-fade' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#050718',
        color: '#ffd88a',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(1.5rem, 4vw, 3rem)',
        overflow: 'hidden',
        transition: 'opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1), transform 0.55s ease'
      }}
    >
      {/* Background Ambient Cosmic Glows */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(119, 125, 255, 0.18) 0%, rgba(9, 11, 32, 0) 70%)',
          pointerEvents: 'none',
          filter: 'blur(60px)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(255, 216, 138, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(50px)'
        }}
      />

      {/* Rotating Astrolabe Mechanism */}
      <div
        className="boot-astrolabe-ring"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 'min(75vw, 680px)',
          height: 'min(75vw, 680px)',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          border: '1px dashed rgba(255, 216, 138, 0.2)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '30px',
            borderRadius: '50%',
            border: '1px solid rgba(119, 125, 255, 0.15)'
          }}
        />
      </div>

      {/* Top Bar: Header & Skip Action */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span
            className="font-mono"
            style={{
              padding: '0.2rem 0.55rem',
              backgroundColor: 'rgba(255, 216, 138, 0.15)',
              border: '1px solid rgba(255, 216, 138, 0.35)',
              borderRadius: '6px',
              fontSize: '0.72rem',
              color: '#ffd88a',
              letterSpacing: '0.05em'
            }}
          >
            BOOT // BIOS 1.99
          </span>
          <span className="font-mono" style={{ fontSize: '0.74rem', color: '#9ba0d8' }}>
            PID 077 • MIDNIGHT DAEMON
          </span>
        </div>

        <button
          onClick={handleEnter}
          className="retro-btn"
          style={{
            padding: '0.4rem 0.85rem',
            fontSize: '0.75rem',
            backgroundColor: 'transparent',
            borderColor: 'rgba(255, 216, 138, 0.4)',
            color: '#ffd88a'
          }}
          title="Skip boot intro and enter immediately [ESC]"
          aria-label="Skip boot sequence"
        >
          <FastForward size={13} />
          <span>Skip [ESC]</span>
        </button>
      </div>

      {/* Center Stage: Oversized Editorial Typography & Awakening Artwork */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '850px',
          margin: 'auto',
          position: 'relative',
          zIndex: 10,
          padding: '1rem'
        }}
      >
        {/* Subtle Pip Portrait Glow Awakening */}
        <div
          style={{
            position: 'relative',
            width: '130px',
            height: '130px',
            marginBottom: '1.25rem',
            opacity: Math.max(0.2, progress / 100),
            transform: `scale(${0.9 + (progress / 100) * 0.1})`,
            transition: 'all 0.3s ease'
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '-15px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 216, 138, 0.5) 0%, transparent 70%)',
              filter: 'blur(20px)'
            }}
          />
          <img
            src="/assets/pip_portrait.png"
            alt="Pip waking up in Midnight Nursery"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: '50%',
              position: 'relative',
              zIndex: 2,
              filter: 'drop-shadow(0 0 15px rgba(255, 216, 138, 0.6))',
              WebkitMaskImage: 'radial-gradient(circle at center, black 60%, transparent 95%)',
              maskImage: 'radial-gradient(circle at center, black 60%, transparent 95%)'
            }}
          />
        </div>

        {/* Grand Editorial Headline */}
        <h1
          className="font-serif boot-title"
          style={{
            fontSize: 'clamp(2.6rem, 6vw, 4.5rem)',
            color: '#fff8f1',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            margin: 0,
            textShadow: '0 4px 30px rgba(119, 125, 255, 0.4)'
          }}
        >
          Midnight Nursery
        </h1>

        <div
          className="font-mono"
          style={{
            fontSize: 'clamp(0.9rem, 1.8vw, 1.25rem)',
            color: '#ffd88a',
            letterSpacing: '0.2em',
            marginTop: '0.5rem',
            marginBottom: '1.5rem',
            fontWeight: 700
          }}
        >
          DREAMOS '99
        </div>

        {/* Luminous Particle Progress Line */}
        <div
          style={{
            width: '100%',
            maxWidth: '380px',
            position: 'relative',
            marginBottom: '1rem'
          }}
        >
          <div
            style={{
              height: '3px',
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              borderRadius: '999px',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #777dff, #ffd88a)',
                borderRadius: '999px',
                boxShadow: '0 0 12px #ffd88a',
                transition: 'width 0.1s linear'
              }}
            />
          </div>
        </div>

        {/* Atmospheric Boot Milestone Message */}
        <div
          className="font-mono"
          style={{
            fontSize: '0.8rem',
            color: '#c9ceff',
            minHeight: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            letterSpacing: '0.04em'
          }}
        >
          <Sparkles size={13} color="#ffd88a" />
          <span>{messages[activeMessageIndex]}</span>
        </div>
      </div>

      {/* Bottom Control Bar: Enter the Nursery Action */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10
        }}
      >
        <button
          onClick={handleEnter}
          disabled={!isReady}
          className="retro-btn boot-enter-btn"
          style={{
            backgroundColor: isReady ? '#ffd88a' : 'rgba(255, 216, 138, 0.25)',
            color: '#34221a',
            borderColor: '#ffd88a',
            boxShadow: isReady ? '0 0 25px rgba(255, 216, 138, 0.6), 4px 4px 0px #a34063' : 'none',
            padding: '0.85rem 2.2rem',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: isReady ? 'pointer' : 'default',
            transition: 'all 0.3s ease',
            opacity: isReady ? 1 : 0.65
          }}
        >
          <Play size={16} fill="currentColor" color="#a34063" />
          <span>ENTER THE NURSERY</span>
        </button>

        <span
          className="font-mono"
          style={{
            fontSize: '0.72rem',
            color: '#9ba0d8',
            opacity: 0.8
          }}
        >
          {isReady ? 'Press [ENTER] to wake up into the warm nursery' : `INITIALIZING NURSERY (${progress}%)`}
        </span>
      </div>
    </div>
  );
};
