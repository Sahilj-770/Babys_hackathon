import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { Sparkles, FastForward, Volume2, VolumeX, Compass, Stars } from 'lucide-react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const astrolabeRef = useRef<SVGSVGElement>(null);
  const dreamPathRef = useRef<SVGPathElement>(null);
  const lanternHaloRef = useRef<HTMLDivElement>(null);
  const flareRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const pipRef = useRef<HTMLDivElement>(null);
  const enterBtnRef = useRef<HTMLButtonElement>(null);

  const isReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [diagnosticMsg, setDiagnosticMsg] = useState(() =>
    isReducedMotion
      ? '✦ MIDNIGHT NURSERY ONLINE // READY TO AWAKEN'
      : 'ALIGNING MIDNIGHT NURSERY CONSTELLATIONS...'
  );
  const [isExiting, setIsExiting] = useState(false);

  // Intentional enter handler
  const handleEnter = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);

    if (!isMuted) {
      soundEngine.playCelebrationChime();
    }

    if (flareRef.current && containerRef.current && !isReducedMotion) {
      gsap.to(flareRef.current, {
        opacity: 1,
        scale: 2.5,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.out',
            onComplete: onEnter
          });
        }
      });
    } else {
      onEnter();
    }
  }, [isExiting, isMuted, isReducedMotion, onEnter]);

  // GSAP Choreography Timeline
  useEffect(() => {
    if (isReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Slow continuous rotation of the celestial astrolabe mechanism
      if (astrolabeRef.current) {
        gsap.to(astrolabeRef.current, {
          rotation: 360,
          duration: 48,
          repeat: -1,
          ease: 'none',
          transformOrigin: '50% 50%'
        });
      }

      const tl = gsap.timeline();

      // Stage 1: Darkness & Deep Cosmic Silence (Initial state)
      gsap.set([titleRef.current, pipRef.current, enterBtnRef.current, lanternHaloRef.current], {
        opacity: 0,
        y: 18
      });

      if (dreamPathRef.current) {
        const length = dreamPathRef.current.getTotalLength() || 800;
        gsap.set(dreamPathRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length
        });
      }

      // Stage 2 (0.4s to 1.6s): Constellation Formation — Golden dream route draws across the cosmos
      tl.to(dreamPathRef.current, {
        strokeDashoffset: 0,
        duration: 1.3,
        ease: 'power1.inOut',
        onStart: () => {
          setDiagnosticMsg('CHARTING CELESTIAL DREAMWAYS // 432 Hz');
        }
      }, 0.4)

      // Stage 3 (1.4s to 2.4s): Astrolabe & Celestial Dial Awakening — Header title reveals
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        onStart: () => {
          setDiagnosticMsg('ALIGNING NURSERY CONSTELLATIONS & LULLABY RESONATORS...');
        }
      }, 1.4)

      // Stage 4 (2.2s to 3.4s): Starlight Lantern Ignition — Pip awakens and lantern halo blooms
      .to(pipRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'back.out(1.2)',
        onStart: () => {
          setDiagnosticMsg('STARLIGHT LANTERN IGNITED // FREQ 432.0 Hz');
        }
      }, 2.2)
      .to(lanternHaloRef.current, {
        scale: 1.5,
        opacity: 0.95,
        duration: 0.9,
        ease: 'power2.out'
      }, 2.5)

      // Stage 5 (3.2s to 4.0s): Golden Light Sweep Climax — Warm radial starlight pulse sweeps outwards
      .fromTo(flareRef.current, 
        { scale: 0.3, opacity: 0 },
        { scale: 2.2, opacity: 0.65, duration: 0.6, ease: 'power2.out' },
        3.2
      )
      .to(flareRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in'
      }, 3.8)

      // Stage 6 (4.0s+): Readiness & Seamless Reveal — Enter CTA unlocks
      .to(enterBtnRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          setDiagnosticMsg('✦ MIDNIGHT NURSERY ONLINE // READY TO ENTER');
        }
      }, 4.0);

    }, containerRef);

    return () => ctx.revert();
  }, [isReducedMotion]);

  // Keyboard shortcut listener: Enter / Space to enter, Esc to skip immediately
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
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Midnight Nursery DreamOS 99 Startup Sequence"
      className="theatrical-boot-screen"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#040616',
        color: '#fff8f1',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(1.2rem, 3.5vw, 2.5rem)',
        overflow: 'hidden'
      }}
    >
      {/* 1. Deep Midnight Cosmic Atmospheric Glows */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-10%',
          left: '20%',
          width: '60vw',
          height: '60vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(119, 125, 255, 0.16) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '15%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(163, 64, 99, 0.18) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }}
      />

      {/* 2. Twinkling Star Field Background */}
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
            'radial-gradient(1.5px 1.5px at 1020px 160px, #ffd88a, transparent), ' +
            'radial-gradient(2px 2px at 1180px 90px, #c4b5fd, transparent)',
          backgroundSize: '1200px 600px',
          opacity: 0.8
        }}
      />

      {/* 3. Celestial Astrolabe Rotating Mechanism */}
      <svg
        ref={astrolabeRef}
        aria-hidden="true"
        viewBox="0 0 600 600"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(85vw, 680px)',
          height: 'min(85vw, 680px)',
          pointerEvents: 'none',
          opacity: 0.22,
          zIndex: 1
        }}
      >
        <circle cx="300" cy="300" r="280" fill="none" stroke="#ffd88a" strokeWidth="1" strokeDasharray="3 6" />
        <circle cx="300" cy="300" r="220" fill="none" stroke="#777dff" strokeWidth="1.2" strokeDasharray="8 8" />
        <circle cx="300" cy="300" r="160" fill="none" stroke="#ffd88a" strokeWidth="1" />
        <line x1="300" y1="20" x2="300" y2="580" stroke="#ffd88a" strokeWidth="0.8" opacity="0.6" />
        <line x1="20" y1="300" x2="580" y2="300" stroke="#ffd88a" strokeWidth="0.8" opacity="0.6" />
        <line x1="102" y1="102" x2="498" y2="498" stroke="#777dff" strokeWidth="0.8" opacity="0.4" />
        <line x1="102" y1="498" x2="498" y2="102" stroke="#777dff" strokeWidth="0.8" opacity="0.4" />
        {/* Constellation anchor stars */}
        <circle cx="300" cy="80" r="4" fill="#ffd88a" />
        <circle cx="520" cy="300" r="4" fill="#ffd88a" />
        <circle cx="300" cy="520" r="4" fill="#ffd88a" />
        <circle cx="80" cy="300" r="4" fill="#ffd88a" />
      </svg>

      {/* 4. Golden Luminous Dream Path SVG */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 300"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          top: '55%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '240px',
          pointerEvents: 'none',
          zIndex: 2,
          opacity: 0.85
        }}
      >
        <defs>
          <linearGradient id="bootDreamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffd88a" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#ffd88a" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffb3ba" stopOpacity="0.3" />
          </linearGradient>
          <filter id="bootGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          ref={dreamPathRef}
          d="M 50 160 Q 250 80 500 150 T 950 140"
          fill="none"
          stroke="url(#bootDreamGrad)"
          strokeWidth="3.5"
          filter="url(#bootGlow)"
          strokeLinecap="round"
        />
      </svg>

      {/* 5. Golden Flare Screen Sweep (For smooth exit transition) */}
      <div
        ref={flareRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-20%',
          background: 'radial-gradient(circle at center, #ffd88a 0%, #fff8f1 45%, rgba(255, 248, 241, 0) 75%)',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 9999
        }}
      />

      {/* TOP BAR: Telemetry & Controls */}
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

      {/* CENTER STAGE: Pip, Lantern, & Expressive Midnight Nursery Headline */}
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
        {/* Pip Centerpiece & Waking Starlight Lantern */}
        <div
          ref={pipRef}
          style={{
            position: 'relative',
            width: '160px',
            height: '160px',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Radial Light Bloom */}
          <div
            ref={lanternHaloRef}
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: '-20px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 216, 138, 0.85) 0%, rgba(255, 180, 100, 0.4) 40%, transparent 75%)',
              filter: 'blur(28px)',
              transform: 'scale(0.8)',
              opacity: 0.5,
              pointerEvents: 'none'
            }}
          />

          {/* Official Lantern Illustration */}
          <img
            src="/assets/pip_dream_lantern.png"
            alt="Pip's starlight lantern igniting in the cosmos"
            style={{
              width: '125px',
              height: '125px',
              objectFit: 'contain',
              position: 'relative',
              zIndex: 3,
              filter: 'drop-shadow(0 0 25px rgba(255, 216, 138, 0.9)) drop-shadow(0 0 45px rgba(255, 216, 138, 0.45))'
            }}
          />
        </div>

        {/* Expressive Editorial Typography */}
        <div ref={titleRef}>
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

        {/* Diagnostic Telemetry Feed */}
        <div
          className="font-mono"
          style={{
            fontSize: '0.82rem',
            color: '#c4b5fd',
            letterSpacing: '0.06em',
            minHeight: '1.4rem'
          }}
        >
          {diagnosticMsg}
        </div>
      </div>

      {/* BOTTOM BAR: Clear ENTER THE NURSERY Button & Tactile Hint */}
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
          ref={enterBtnRef}
          onClick={handleEnter}
          className="retro-btn boot-enter-btn"
          style={{
            backgroundColor: '#ffd88a',
            color: '#26160f',
            borderColor: '#ffd88a',
            fontSize: '1.05rem',
            fontWeight: 700,
            padding: '0.95rem 2.6rem',
            boxShadow: '0 0 35px rgba(255, 216, 138, 0.75), 0 4px 15px rgba(0,0,0,0.4)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          aria-label="Enter Midnight Nursery and explore Pip's dream world"
        >
          <Compass size={18} color="#26160f" />
          <span>ENTER THE NURSERY</span>
          <Stars size={18} color="#26160f" />
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

export default BootScreen;
