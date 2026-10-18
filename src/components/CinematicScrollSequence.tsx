import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

gsap.registerPlugin(ScrollTrigger);

export const CinematicScrollSequence: React.FC = () => {
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const lanternRef = useRef<HTMLDivElement>(null);
  const lanternGlowRef = useRef<HTMLDivElement>(null);
  const midnightSkyRef = useRef<HTMLDivElement>(null);
  const rooftopsRef = useRef<HTMLDivElement>(null);
  const windowsRef = useRef<SVGGElement>(null);
  const flightPathRef = useRef<SVGPathElement>(null);
  const pipCloudRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  const [pathLength, setPathLength] = useState(600);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    if (flightPathRef.current) {
      const len = flightPathRef.current.getTotalLength();
      setPathLength(len);
    }
  }, []);

  useEffect(() => {
    if (!pinSectionRef.current) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 769px)',
        isMobile: '(max-width: 768px)',
        isNormalMotion: '(prefers-reduced-motion: no-preference)',
        isReducedMotion: '(prefers-reduced-motion: reduce)'
      },
      (context) => {
        const { isDesktop, isNormalMotion } = context.conditions as {
          isDesktop: boolean;
          isMobile: boolean;
          isNormalMotion: boolean;
        };

        if (!isNormalMotion) {
          // Reduced motion: Show the nighttime scene statically without forced scroll-pinning
          if (midnightSkyRef.current) gsap.set(midnightSkyRef.current, { opacity: 1 });
          if (rooftopsRef.current) gsap.set(rooftopsRef.current, { y: 0, opacity: 1 });
          if (windowsRef.current) gsap.set(windowsRef.current, { opacity: 1 });
          if (flightPathRef.current) gsap.set(flightPathRef.current, { strokeDashoffset: 0 });
          return;
        }

        // Master Scrubbed Timeline for Act II (Awakening) -> Act III (Dream World)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinSectionRef.current,
            start: 'top top',
            end: isDesktop ? '+=180%' : '+=120%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => {
              setScrollPercent(Math.round(self.progress * 100));
            }
          }
        });

        // 1. Lantern awakens & golden radial halo expands
        tl.to(
          lanternGlowRef.current,
          {
            scale: isDesktop ? 6 : 4,
            opacity: 1,
            ease: 'power2.inOut',
            duration: 2
          },
          0
        );

        // 2. Midnight indigo sky fades in over the warm nursery canvas
        tl.to(
          midnightSkyRef.current,
          {
            opacity: 1,
            ease: 'power2.inOut',
            duration: 2.5
          },
          0.5
        );

        // 3. Lantern gently scales and drifts upward into position
        tl.to(
          lanternRef.current,
          {
            scale: 0.65,
            y: isDesktop ? -80 : -40,
            opacity: 0.85,
            ease: 'power1.out',
            duration: 2
          },
          1
        );

        // 4. Rooftops and chimneys rise from the mist
        tl.fromTo(
          rooftopsRef.current,
          { y: 120, opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out', duration: 2 },
          1.5
        );

        // 5. Windows illuminate in the sleeping houses
        if (windowsRef.current) {
          tl.fromTo(
            windowsRef.current,
            { opacity: 0 },
            { opacity: 1, ease: 'power1.in', duration: 1.5 },
            2.2
          );
        }

        // 6. SVG Flightpath draws itself across the rooftops
        if (flightPathRef.current) {
          const len = flightPathRef.current.getTotalLength();
          tl.fromTo(
            flightPathRef.current,
            { strokeDashoffset: len },
            { strokeDashoffset: 0, ease: 'power1.inOut', duration: 3 },
            2.5
          );
        }

        // 7. Pip on the Cloud glides across the rooftops
        if (pipCloudRef.current) {
          tl.fromTo(
            pipCloudRef.current,
            { x: -120, y: 30, opacity: 0, scale: 0.8 },
            {
              x: isDesktop ? 220 : 120,
              y: -20,
              opacity: 1,
              scale: 1,
              ease: 'power1.inOut',
              duration: 3
            },
            2.8
          );
        }

        return () => {
          tl.kill();
        };
      }
    );

    return () => mm.revert();
  }, [pathLength]);

  const getCinematicStageLabel = () => {
    if (scrollPercent < 30) return 'ACT II: THE AWAKENING // LANTERN STIRS';
    if (scrollPercent < 65) return 'ACT III: MIDNIGHT DESCENT // ROOFTOPS EMERGE';
    return 'ACT III: DREAM DELIVERY // FLIGHTPATH ILLUMINATED';
  };

  const getCinematicStoryText = () => {
    if (scrollPercent < 30) {
      return 'As twilight deepens, Pip turns the brass key of the starlight lantern. A warm golden ember blossoms inside the glass.';
    }
    if (scrollPercent < 65) {
      return 'Golden light spills across the nursery floor, opening a portal into the midnight sky. Silhouetted chimney stacks rise from the mist.';
    }
    return 'Pip takes to the clouds, following the golden starlight route to deliver peaceful dreams to every slumbering bedroom.';
  };

  return (
    <div
      id="awakening"
      ref={pinSectionRef}
      className="cinematic-scroll-root"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'var(--color-cream)'
      }}
    >
      {/* Dynamic Midnight Sky Overlay that fades in with scroll */}
      <div
        ref={midnightSkyRef}
        className="cinematic-midnight-sky"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #090b20 0%, #0d1238 60%, #060818 100%)',
          opacity: 0,
          zIndex: 1,
          pointerEvents: 'none'
        }}
      >
        {/* Shimmering Celestial Stars */}
        <div className="cinematic-celestial-field" />
      </div>

      {/* Massive Expanding Starlight Bloom from the Lantern */}
      <div
        ref={lanternGlowRef}
        className="cinematic-lantern-bloom"
        style={{
          position: 'absolute',
          top: '42%',
          left: '50%',
          width: '180px',
          height: '180px',
          transform: 'translate(-50%, -50%) scale(1)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #ffd88a 0%, rgba(255, 216, 138, 0.6) 40%, transparent 75%)',
          filter: 'blur(35px)',
          opacity: 0.35,
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      {/* Top Editorial Status Pill */}
      <div
        style={{
          position: 'absolute',
          top: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: '90%',
          width: 'fit-content'
        }}
      >
        <div
          className="font-mono cinematic-badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1.1rem',
            borderRadius: '999px',
            backgroundColor: 'rgba(9, 11, 32, 0.65)',
            border: '1px solid rgba(255, 216, 138, 0.35)',
            color: '#ffd88a',
            fontSize: '0.78rem',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
          }}
        >
          <Sparkles size={13} color="#ffd88a" />
          <span>{getCinematicStageLabel()}</span>
        </div>
      </div>

      {/* Central Interactive Artwork & Transformation Stage */}
      <div
        style={{
          position: 'relative',
          zIndex: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '1100px',
          padding: '0 1.5rem',
          marginTop: '-2rem'
        }}
      >
        {/* The Central Dream Lantern Artwork */}
        <div
          ref={lanternRef}
          className="cinematic-lantern-holder"
          style={{
            position: 'relative',
            width: '260px',
            height: '260px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          onClick={() => {
            soundEngine.playMusicBoxNote(784, 1.4);
          }}
          title="Pip's glowing starlight lantern"
        >
          <img
            src="/assets/pip_dream_lantern.png"
            alt="Pip's glowing starlight dream lantern"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 35px rgba(255, 216, 138, 0.75))',
              position: 'relative',
              zIndex: 3
            }}
          />
        </div>

        {/* Dynamic Storytelling Text that updates with the scroll transformation */}
        <div
          ref={captionRef}
          style={{
            maxWidth: '640px',
            textAlign: 'center',
            marginTop: '1.5rem',
            zIndex: 6
          }}
        >
          <p
            className="font-serif cinematic-narrative-text"
            style={{
              fontSize: 'clamp(1.15rem, 2.2vw, 1.65rem)',
              lineHeight: 1.45,
              color: scrollPercent > 35 ? '#fff8f1' : 'var(--text-heading)',
              textShadow: scrollPercent > 35 ? '0 2px 18px rgba(0,0,0,0.6)' : 'none',
              transition: 'color 0.4s ease'
            }}
          >
            "{getCinematicStoryText()}"
          </p>
        </div>
      </div>

      {/* Illustrated Rooftops & Golden SVG Route Horizon (Rises up during scroll) */}
      <div
        ref={rooftopsRef}
        className="cinematic-rooftops-container"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          zIndex: 5,
          pointerEvents: 'none'
        }}
      >
        <svg
          viewBox="0 0 1200 380"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            {/* Window Glow Filter */}
            <filter id="cinematic-window-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Flightpath Golden Glow Filter */}
            <filter id="route-path-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffd88a" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#ffd88a" stopOpacity="1" />
              <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Distant Rooftop Silhouettes */}
          <path
            d="M0 380 L0 260 L90 200 L180 260 L240 230 L310 270 L420 180 L520 250 L610 210 L700 270 L820 190 L920 250 L1020 220 L1110 260 L1200 210 L1200 380 Z"
            fill="#050714"
            opacity="0.85"
          />

          {/* Foreground Victorian Rooftop Skyline */}
          <path
            d="M0 380 L0 300 L60 250 L120 300 L135 220 L155 220 L155 300 L210 260 L290 320 L360 240 L450 310 L480 230 L510 230 L510 310 L590 270 L680 330 L760 250 L840 310 L910 230 L990 290 L1070 240 L1150 290 L1200 260 L1200 380 Z"
            fill="#02030a"
          />

          {/* Chimney smoke puffs */}
          <circle cx="145" cy="195" r="8" fill="#ffd88a" opacity="0.25" />
          <circle cx="148" cy="175" r="12" fill="#ffd88a" opacity="0.15" />
          <circle cx="495" cy="205" r="8" fill="#ffd88a" opacity="0.25" />
          <circle cx="498" cy="185" r="13" fill="#ffd88a" opacity="0.15" />

          {/* Warm Illuminated Windows in Sleeping Houses */}
          <g ref={windowsRef} filter="url(#cinematic-window-glow)" fill="#ffd88a">
            <rect x="80" y="275" width="14" height="20" rx="3" opacity="0.9" />
            <rect x="235" y="280" width="16" height="22" rx="3" opacity="0.95" />
            <rect x="390" y="265" width="14" height="18" rx="3" opacity="0.85" />
            <rect x="630" y="290" width="18" height="24" rx="3" opacity="0.9" />
            <rect x="790" y="275" width="16" height="20" rx="3" opacity="0.95" />
            <rect x="940" y="260" width="15" height="20" rx="3" opacity="0.85" />
            <rect x="1100" y="270" width="16" height="22" rx="3" opacity="0.9" />
          </g>

          {/* Luminous Animated Flightpath */}
          <path
            ref={flightPathRef}
            id="cinematic-flight-curve"
            d="M 80 140 C 240 60, 420 220, 640 100 C 840 0, 1020 180, 1140 120"
            stroke="url(#path-gradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength}
            filter="url(#route-path-glow)"
          />

          {/* Route stops / Star Waypoints */}
          <circle cx="80" cy="140" r="5" fill="#ffd88a" filter="url(#route-path-glow)" />
          <circle cx="640" cy="100" r="6" fill="#ffd88a" filter="url(#route-path-glow)" />
          <circle cx="1140" cy="120" r="5" fill="#c4b5fd" filter="url(#route-path-glow)" />
        </svg>

        {/* Pip Cloud Avatar Gliding along the Flightpath */}
        <div
          ref={pipCloudRef}
          style={{
            position: 'absolute',
            bottom: '160px',
            left: '35%',
            width: '90px',
            height: '90px',
            pointerEvents: 'none',
            zIndex: 6,
            filter: 'drop-shadow(0 0 16px rgba(255, 216, 138, 0.8))'
          }}
        >
          <img
            src="/assets/pip_avatar_cloud.png"
            alt="Pip floating gently on a midnight bedtime cloud"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.25rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 8,
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: scrollPercent > 40 ? '#ffd88a' : 'var(--text-muted)',
          fontSize: '0.72rem',
          fontFamily: 'var(--font-mono)',
          transition: 'color 0.4s ease'
        }}
      >
        <span>SCROLL PROGRESS: {scrollPercent}%</span>
        <span style={{ opacity: 0.5 }}>↓</span>
      </div>
    </div>
  );
};
