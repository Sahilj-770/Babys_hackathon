import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, FastForward, Volume2, VolumeX, Compass } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface BootScreenProps {
  onEnter: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({
  onEnter,
  isMuted = false,
  onToggleMute
}) => {
  const isReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Cinematic awakening phases:
  // 0: Void & Stars, 1: Constellation Alignment, 2: Lantern Ignition, 3: Golden Light Sweep & Ready
  const [phase, setPhase] = useState<number>(isReducedMotion ? 3 : 0);
  const [isExiting, setIsExiting] = useState(false);

  const handleEnter = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    if (!isMuted) {
      soundEngine.playCelebrationChime();
    }
    setTimeout(() => {
      onEnter();
    }, 600);
  }, [isExiting, isMuted, onEnter]);

  // Phase choreography
  useEffect(() => {
    if (isReducedMotion) return;

    // Phase 1: Constellation lines align
    const t1 = setTimeout(() => {
      setPhase(1);
    }, 700);

    // Phase 2: Lantern ignites with chime
    const t2 = setTimeout(() => {
      setPhase(2);
      if (!isMuted) {
        soundEngine.playMusicBoxNote(523.25, 1.5);
      }
    }, 1800);

    // Phase 3: Golden light sweep & ready
    const t3 = setTimeout(() => {
      setPhase(3);
      if (!isMuted) {
        soundEngine.playMusicBoxNote(659.25, 1.2);
      }
    }, 3100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isReducedMotion, isMuted]);

  // Keyboard shortcut listener: Enter / Space to enter, Esc to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleEnter();
      } else if (e.key === 'Enter' || e.key === ' ') {
        handleEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleEnter]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Midnight Nursery DreamOS 99 Startup Sequence"
      className={`theatrical-boot-screen ${isExiting ? 'boot-exit-sweep' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#050718',
        color: '#fff8f1',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(1.2rem, 3.5vw, 2.5rem)',
        overflow: 'hidden',
        transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s ease'
      }}
    >
      {/* 1. Deep Cosmic Star Field with twinkling stars */}
      <div
        className="boot-star-field"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'radial-gradient(1.5px 1.5px at 80px 120px, #ffffff, transparent), ' +
            'radial-gradient(2px 2px at 220px 80px, #ffd88a, transparent), ' +
            'radial-gradient(1px 1px at 380px 190px, #ffffff, transparent), ' +
            'radial-gradient(2px 2px at 540px 100px, #c4b5fd, transparent), ' +
            'radial-gradient(1.5px 1.5px at 700px 240px, #ffd88a, transparent), ' +
            'radial-gradient(2px 2px at 860px 70px, #ffffff, transparent), ' +
            'radial-gradient(1px 1px at 1020px 160px, #ffd88a, transparent), ' +
            'radial-gradient(2px 2px at 1180px 90px, #c4b5fd, transparent), ' +
            'radial-gradient(1.5px 1.5px at 320px 420px, #ffffff, transparent), ' +
            'radial-gradient(2px 2px at 780px 460px, #ffd88a, transparent), ' +
            'radial-gradient(1.5px 1.5px at 980px 520px, #ffffff, transparent)',
          backgroundSize: '1200px 600px',
          opacity: 0.85
        }}
      />

      {/* 2. Constellation Vector Geometry (Connecting star nodes) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 600"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(90vw, 1000px)',
          height: 'min(90vh, 600px)',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: phase >= 1 ? 0.75 : 0.15,
          transition: 'opacity 1.2s ease-in-out'
        }}
      >
        <defs>
          <linearGradient id="boot-constellation-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd88a" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#c4b5fd" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffd88a" stopOpacity="0.8" />
          </linearGradient>
          <filter id="boot-star-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Animated Constellation Geometry Lines */}
        <g stroke="url(#boot-constellation-grad)" strokeWidth="1.5" strokeDasharray="6 4" fill="none">
          <path
            d="M 220 200 L 360 140 L 500 220 L 640 140 L 780 200 L 660 380 L 500 440 L 340 380 Z"
            style={{
              strokeDasharray: 2000,
              strokeDashoffset: phase >= 1 ? 0 : 2000,
              transition: isReducedMotion ? 'none' : 'stroke-dashoffset 2.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
          <path
            d="M 500 220 L 500 440"
            style={{
              strokeDasharray: 500,
              strokeDashoffset: phase >= 1 ? 0 : 500,
              transition: isReducedMotion ? 'none' : 'stroke-dashoffset 1.8s ease 0.4s'
            }}
          />
          <path
            d="M 360 140 L 640 140"
            style={{
              strokeDasharray: 500,
              strokeDashoffset: phase >= 1 ? 0 : 500,
              transition: isReducedMotion ? 'none' : 'stroke-dashoffset 1.6s ease 0.6s'
            }}
          />
        </g>

        {/* Major Constellation Star Nodes */}
        {[
          { cx: 220, cy: 200, r: 4 },
          { cx: 360, cy: 140, r: 5 },
          { cx: 500, cy: 220, r: 6 },
          { cx: 640, cy: 140, r: 5 },
          { cx: 780, cy: 200, r: 4 },
          { cx: 660, cy: 380, r: 5 },
          { cx: 500, cy: 440, r: 6 },
          { cx: 340, cy: 380, r: 5 }
        ].map((star, idx) => (
          <circle
            key={idx}
            cx={star.cx}
            cy={star.cy}
            r={star.r}
            fill="#ffd88a"
            filter="url(#boot-star-glow)"
            style={{
              opacity: phase >= 1 ? 1 : 0.3,
              transformOrigin: `${star.cx}px ${star.cy}px`,
              transform: phase >= 1 ? 'scale(1)' : 'scale(0.5)',
              transition: `all 0.8s ease ${idx * 0.1}s`
            }}
          />
        ))}
      </svg>

      {/* 3. Golden Light Sweep across the canvas */}
      <div
        className="boot-golden-sweep"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(115deg, transparent 20%, rgba(255, 216, 138, 0.22) 48%, rgba(255, 255, 255, 0.35) 50%, rgba(255, 216, 138, 0.22) 52%, transparent 80%)',
          transform: phase >= 2 ? 'translateX(120%)' : 'translateX(-120%)',
          transition: isReducedMotion ? 'none' : 'transform 1.8s cubic-bezier(0.25, 1, 0.5, 1)',
          pointerEvents: 'none',
          zIndex: 2
        }}
      />

      {/* Top Bar: Telemetry, Mute Toggle & Visible Skip */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <span
            className="font-mono"
            style={{
              padding: '0.25rem 0.65rem',
              backgroundColor: 'rgba(255, 216, 138, 0.12)',
              border: '1px solid rgba(255, 216, 138, 0.35)',
              borderRadius: '999px',
              fontSize: '0.72rem',
              color: '#ffd88a',
              letterSpacing: '0.06em'
            }}
          >
            DREAM_MACHINE // BIOS 1.99
          </span>
          <span className="font-mono" style={{ fontSize: '0.74rem', color: '#9ba0d8' }}>
            PID 077 • CONSTELLATION AWAKENING
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Mute / Unmute Toggle */}
          {onToggleMute && (
            <button
              onClick={onToggleMute}
              className="retro-btn"
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.74rem',
                backgroundColor: 'rgba(9, 11, 32, 0.75)',
                color: '#fff8f1',
                borderColor: 'rgba(255, 216, 138, 0.3)'
              }}
              aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX size={14} color="#ffb3ba" /> : <Volume2 size={14} color="#ffd88a" />}
              <span className="font-mono">{isMuted ? 'Muted' : 'Sound'}</span>
            </button>
          )}

          {/* Visible Skip Button */}
          <button
            onClick={handleEnter}
            className="retro-btn"
            style={{
              padding: '0.35rem 0.85rem',
              fontSize: '0.74rem',
              backgroundColor: 'rgba(255, 216, 138, 0.15)',
              color: '#ffd88a',
              borderColor: 'rgba(255, 216, 138, 0.5)'
            }}
            title="Skip awakening sequence [ESC]"
            aria-label="Skip awakening sequence"
          >
            <FastForward size={13} />
            <span className="font-mono">Skip [ESC]</span>
          </button>
        </div>
      </div>

      {/* Center Stage: Igniting Lantern, Light Bloom, & Editorial Awakening */}
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
        {/* Central Igniting Lantern Stage */}
        <div
          style={{
            position: 'relative',
            width: '160px',
            height: '160px',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Expanding Igniting Lantern Radial Bloom */}
          <div
            style={{
              position: 'absolute',
              inset: '-25px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 216, 138, 0.85) 0%, rgba(255, 180, 100, 0.4) 40%, transparent 75%)',
              filter: 'blur(30px)',
              transform: phase >= 2 ? 'scale(1.4)' : 'scale(0.3)',
              opacity: phase >= 2 ? 0.95 : 0.15,
              transition: isReducedMotion ? 'none' : 'all 1.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              pointerEvents: 'none'
            }}
          />

          {/* Lantern Core Illustration */}
          <img
            src="/assets/pip_dream_lantern.png"
            alt="Pip's starlight lantern igniting in the cosmos"
            style={{
              width: '120px',
              height: '120px',
              objectFit: 'contain',
              position: 'relative',
              zIndex: 3,
              filter: phase >= 2
                ? 'drop-shadow(0 0 25px rgba(255, 216, 138, 0.95)) drop-shadow(0 0 45px rgba(255, 216, 138, 0.5))'
                : 'brightness(0.5) drop-shadow(0 0 10px rgba(255, 216, 138, 0.3))',
              transform: phase >= 2 ? 'scale(1.05)' : 'scale(0.92)',
              transition: isReducedMotion ? 'none' : 'all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          />
        </div>

        {/* Grand Editorial Headline */}
        <div
          style={{
            opacity: phase >= 1 ? 1 : 0.4,
            transform: phase >= 1 ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.8s ease'
          }}
        >
          <div
            className="font-mono"
            style={{
              fontSize: '0.78rem',
              color: '#ffd88a',
              letterSpacing: '0.18em',
              marginBottom: '0.45rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Sparkles size={14} color="#ffd88a" />
            <span>CONSTELLATION NO. 01 • DREAM-MACHINE</span>
            <Sparkles size={14} color="#ffd88a" />
          </div>

          <h1
            className="font-serif boot-title"
            style={{
              fontSize: 'clamp(2.6rem, 6vw, 4.8rem)',
              color: '#fff8f1',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              margin: '0 0 0.5rem 0',
              textShadow: '0 4px 30px rgba(255, 216, 138, 0.35)'
            }}
          >
            Midnight Nursery
          </h1>

          <div
            className="font-mono"
            style={{
              fontSize: '1rem',
              letterSpacing: '0.28em',
              color: 'var(--color-gold)',
              fontWeight: 700,
              marginBottom: '1rem'
            }}
          >
            DREAMOS '99
          </div>
        </div>

        {/* Phase Status Readout */}
        <div
          className="font-mono"
          style={{
            fontSize: '0.82rem',
            color: '#c4b5fd',
            letterSpacing: '0.06em',
            minHeight: '1.4rem'
          }}
        >
          {phase === 0 && 'SCANNING NIGHT SKY FOR RESTLESS DREAMERS...'}
          {phase === 1 && 'ALIGNING STARLIGHT CONSTELLATION MESH...'}
          {phase === 2 && 'IGNITING PIP\'S STARLIGHT LANTERN CORE (432 Hz)...'}
          {phase >= 3 && '✦ MIDNIGHT NURSERY ONLINE // READY TO AWAKEN'}
        </div>
      </div>

      {/* Bottom Bar: Action Trigger & Tactile Hint */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          position: 'relative',
          zIndex: 10
        }}
      >
        <button
          onClick={handleEnter}
          className="retro-btn boot-enter-btn"
          style={{
            backgroundColor: '#ffd88a',
            color: '#26160f',
            borderColor: '#ffd88a',
            fontSize: '1.02rem',
            fontWeight: 700,
            padding: '0.9rem 2.4rem',
            boxShadow: '0 0 35px rgba(255, 216, 138, 0.75), 0 4px 15px rgba(0,0,0,0.4)',
            cursor: 'pointer',
            transform: phase >= 3 ? 'scale(1)' : 'scale(0.95)',
            opacity: phase >= 2 ? 1 : 0.65,
            transition: 'all 0.3s ease'
          }}
          aria-label="Awaken the Nursery and explore Pip's dream world"
        >
          <Compass size={18} color="#26160f" />
          <span>AWAKEN THE NURSERY</span>
          <Sparkles size={16} color="#26160f" />
        </button>

        <span
          className="font-mono"
          style={{
            fontSize: '0.74rem',
            color: '#9ba0d8',
            letterSpacing: '0.05em'
          }}
        >
          Press [ENTER] or [SPACE] to enter • [ESC] to skip
        </span>
      </div>
    </div>
  );
};
