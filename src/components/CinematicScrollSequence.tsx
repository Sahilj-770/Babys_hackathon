import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

gsap.registerPlugin(ScrollTrigger);

export const CinematicScrollSequence: React.FC = () => {
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const lanternHolderRef = useRef<HTMLDivElement>(null);
  const lanternGlowRef = useRef<HTMLDivElement>(null);
  const burstFlashRef = useRef<HTMLDivElement>(null);
  const midnightSkyRef = useRef<HTMLDivElement>(null);
  const starsDeepRef = useRef<HTMLDivElement>(null);
  const starsForeRef = useRef<HTMLDivElement>(null);
  const rooftopsRef = useRef<HTMLDivElement>(null);
  const windowsGroupRef = useRef<SVGGElement>(null);
  const flightPathRef = useRef<SVGPathElement>(null);
  const pipCloudMarkerRef = useRef<HTMLDivElement>(null);
  const convergingParticlesRef = useRef<HTMLDivElement>(null);

  const [pathLength, setPathLength] = useState(650);
  const [scrollProgress, setScrollProgress] = useState(0);

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
          // Reduced motion: statically reveal the midnight town
          if (midnightSkyRef.current) gsap.set(midnightSkyRef.current, { opacity: 1 });
          if (rooftopsRef.current) gsap.set(rooftopsRef.current, { y: 0, opacity: 1 });
          if (windowsGroupRef.current) gsap.set(windowsGroupRef.current.children, { opacity: 1 });
          if (flightPathRef.current) gsap.set(flightPathRef.current, { strokeDashoffset: 0 });
          if (pipCloudMarkerRef.current) gsap.set(pipCloudMarkerRef.current, { opacity: 1 });
          return;
        }

        // Master GSAP Timeline with ScrollTrigger
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: pinSectionRef.current,
            start: 'top top',
            end: isDesktop ? '+=200%' : '+=140%',
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            onUpdate: (self) => {
              setScrollProgress(Math.round(self.progress * 100));
            }
          }
        });

        // ACT II: BUILD-UP (0.0 to 1.2s)
        // 1. Converging star particles gather toward the lantern
        if (convergingParticlesRef.current) {
          masterTl.fromTo(
            convergingParticlesRef.current.children,
            { scale: 1.4, opacity: 0.8, x: (i) => (i % 2 === 0 ? -40 : 40), y: (i) => (i < 2 ? -30 : 30) },
            { scale: 0.2, opacity: 0, x: 0, y: 0, ease: 'power2.in', duration: 1.2 },
            'buildUp'
          );
        }

        // 2. Lantern core warms and pulses
        masterTl.to(
          lanternGlowRef.current,
          {
            scale: 2.2,
            opacity: 0.95,
            ease: 'power2.in',
            duration: 1.2
          },
          'buildUp'
        );

        // ACT II: THE CLIMAX — GOLDEN FLARE BURST (1.2 to 2.2s)
        masterTl.fromTo(
          burstFlashRef.current,
          { scale: 0.5, opacity: 0 },
          { scale: 8, opacity: 0.75, ease: 'power3.out', duration: 0.8 },
          'climax'
        );
        masterTl.to(
          burstFlashRef.current,
          { opacity: 0, duration: 0.6, ease: 'power2.in' },
          'climax+=0.5'
        );

        // 3. Midnight sky dissolves in over warm cream
        masterTl.to(
          midnightSkyRef.current,
          { opacity: 1, ease: 'power2.inOut', duration: 1.8 },
          'climax-=0.2'
        );

        // 4. Multi-depth parallax stars appear
        masterTl.fromTo(
          starsDeepRef.current,
          { opacity: 0, y: 30 },
          { opacity: 0.6, y: -15, ease: 'power1.out', duration: 2 },
          'climax+=0.2'
        );
        masterTl.fromTo(
          starsForeRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: -30, ease: 'power1.out', duration: 2 },
          'climax+=0.4'
        );

        // 5. Lantern gently elevates into celestial guidance position
        masterTl.to(
          lanternHolderRef.current,
          {
            scale: 0.7,
            y: isDesktop ? -90 : -50,
            opacity: 0.9,
            ease: 'power2.out',
            duration: 1.8
          },
          'climax+=0.4'
        );

        // ACT III: ROOFTOPS & STAGGERED WINDOWS (2.4 to 4.0s)
        // 6. Rooftops rise from the mist
        masterTl.fromTo(
          rooftopsRef.current,
          { y: 140, opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out', duration: 1.8 },
          'townRise'
        );

        // 7. Staggered window illumination across sleeping homes
        if (windowsGroupRef.current) {
          masterTl.fromTo(
            windowsGroupRef.current.children,
            { opacity: 0, scale: 0.7, transformOrigin: 'center center' },
            { opacity: 1, scale: 1, stagger: 0.15, ease: 'back.out(1.5)', duration: 0.6 },
            'townRise+=0.6'
          );
        }

        // ACT III: FLIGHTPATH & PIP CLOUD DISPATCH (3.6 to 5.5s)
        // 8. Glowing SVG route draws through the town
        if (flightPathRef.current) {
          const len = flightPathRef.current.getTotalLength();
          masterTl.fromTo(
            flightPathRef.current,
            { strokeDashoffset: len },
            { strokeDashoffset: 0, ease: 'power1.inOut', duration: 2.2 },
            'flight'
          );
        }

        // 9. Pip Cloud avatar glides along the illuminated path
        if (pipCloudMarkerRef.current) {
          masterTl.fromTo(
            pipCloudMarkerRef.current,
            { x: -160, y: 40, opacity: 0, scale: 0.75 },
            {
              x: isDesktop ? 260 : 130,
              y: -25,
              opacity: 1,
              scale: 1,
              ease: 'power1.inOut',
              duration: 2.4
            },
            'flight+=0.2'
          );
        }

        return () => {
          masterTl.kill();
        };
      }
    );

    return () => mm.revert();
  }, [pathLength]);

  const getCinematicStageLabel = () => {
    if (scrollProgress < 25) return 'ACT II: THE AWAKENING // LANTERN STIRS';
    if (scrollProgress < 60) return 'ACT III: MIDNIGHT DESCENT // ROOFTOPS EMERGE';
    return 'ACT III: DREAM DELIVERY // FLIGHTPATH ILLUMINATED';
  };

  const getCinematicStoryText = () => {
    if (scrollProgress < 25) {
      return 'In the quiet nursery, Pip turns the brass key. Golden starlight gathers toward the wick, ready to wake the night.';
    }
    if (scrollProgress < 60) {
      return 'A luminous golden flare erupts into deep midnight indigo. Sleeping chimneys rise through starry mist.';
    }
    return 'Pip takes flight along the golden constellation route, dropping sweet slumber down every chimney pot.';
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
        backgroundColor: 'var(--color-cream)'
      }}
    >
      {/* Background Deep Midnight Sky that dissolves in */}
      <div
        ref={midnightSkyRef}
        className="cinematic-midnight-sky"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #050718 0%, #090b24 55%, #040510 100%)',
          opacity: 0,
          zIndex: 1,
          pointerEvents: 'none'
        }}
      >
        {/* Deep Distant Star Layer */}
        <div ref={starsDeepRef} className="cinematic-celestial-field" style={{ opacity: 0 }} />

        {/* Foreground Twinkling Constellations */}
        <div
          ref={starsForeRef}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(1.5px 1.5px at 120px 80px, #ffd88a, transparent), radial-gradient(2px 2px at 380px 140px, #ffffff, transparent), radial-gradient(1.5px 1.5px at 680px 90px, #c4b5fd, transparent), radial-gradient(2px 2px at 980px 120px, #ffd88a, transparent)',
            backgroundRepeat: 'repeat',
            backgroundSize: '900px 280px',
            opacity: 0
          }}
        />
      </div>

      {/* Sudden Golden Flare Burst (Visual Climax at scroll ~25%) */}
      <div
        ref={burstFlashRef}
        style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          width: '140px',
          height: '140px',
          transform: 'translate(-50%, -50%) scale(0.5)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #ffd88a 0%, rgba(255, 216, 138, 0.8) 35%, transparent 70%)',
          filter: 'blur(35px)',
          opacity: 0,
          zIndex: 3,
          pointerEvents: 'none'
        }}
      />

      {/* Expanding Lantern Core Aura */}
      <div
        ref={lanternGlowRef}
        style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          width: '180px',
          height: '180px',
          transform: 'translate(-50%, -50%) scale(1)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #ffd88a 0%, rgba(255, 216, 138, 0.5) 45%, transparent 75%)',
          filter: 'blur(40px)',
          opacity: 0.35,
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      {/* Top Editorial Status Pill (Positioned safely below sticky navbar) */}
      <div
        style={{
          position: 'absolute',
          top: '4.8rem',
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
            padding: '0.4rem 1.15rem',
            borderRadius: '999px',
            backgroundColor: 'rgba(5, 7, 24, 0.75)',
            border: '1px solid rgba(255, 216, 138, 0.35)',
            color: '#ffd88a',
            fontSize: '0.78rem',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}
        >
          <Sparkles size={13} color="#ffd88a" />
          <span>{getCinematicStageLabel()}</span>
        </div>
      </div>

      {/* Central Lantern Stage with Converging Star Particles */}
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
          marginTop: '-1rem'
        }}
      >
        {/* Converging Star Particles around Lantern */}
        <div
          ref={convergingParticlesRef}
          style={{
            position: 'absolute',
            width: '280px',
            height: '280px',
            pointerEvents: 'none',
            zIndex: 3
          }}
        >
          <span style={{ position: 'absolute', top: '15%', left: '15%', color: '#ffd88a', fontSize: '1rem' }}>✦</span>
          <span style={{ position: 'absolute', top: '20%', right: '15%', color: '#ffd88a', fontSize: '0.85rem' }}>★</span>
          <span style={{ position: 'absolute', bottom: '25%', left: '20%', color: '#c4b5fd', fontSize: '0.9rem' }}>✧</span>
          <span style={{ position: 'absolute', bottom: '20%', right: '22%', color: '#ffd88a', fontSize: '1.1rem' }}>✦</span>
        </div>

        {/* The Lantern Artwork: Seamless feathered mask + gilded celestial portal rim */}
        <div
          ref={lanternHolderRef}
          className="cinematic-lantern-holder"
          style={{
            position: 'relative',
            width: '270px',
            maxWidth: '100%',
            aspectRatio: '1024 / 914',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          onClick={() => {
            soundEngine.playMusicBoxNote(783.99, 1.4);
          }}
          title="Pip's glowing starlight lantern. Click to resonate."
        >
          <img
            src="/assets/pip_dream_lantern.png"
            alt="Pip's glowing starlight dream lantern"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              position: 'relative',
              zIndex: 3,
              WebkitMaskImage:
                'radial-gradient(ellipse 65% 70% at 50% 50%, black 45%, rgba(0,0,0,0.7) 65%, transparent 86%)',
              maskImage:
                'radial-gradient(ellipse 65% 70% at 50% 50%, black 45%, rgba(0,0,0,0.7) 65%, transparent 86%)',
              filter: 'drop-shadow(0 0 30px rgba(255, 216, 138, 0.75))'
            }}
          />
        </div>

        {/* Dynamic Storytelling Text that updates with the scroll transformation */}
        <div
          style={{
            maxWidth: '680px',
            textAlign: 'center',
            marginTop: '1.25rem',
            zIndex: 6
          }}
        >
          <p
            className="font-serif cinematic-narrative-text"
            style={{
              fontSize: 'clamp(1.15rem, 2.2vw, 1.6rem)',
              lineHeight: 1.45,
              color: scrollProgress > 30 ? '#fff8f1' : 'var(--text-heading)',
              textShadow: scrollProgress > 30 ? '0 2px 20px rgba(0,0,0,0.7)' : 'none',
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
            <filter id="cinematic-window-glow-fx" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="route-path-glow-fx" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <linearGradient id="flight-trail-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffd88a" stopOpacity="0.3" />
              <stop offset="45%" stopColor="#ffd88a" stopOpacity="1" />
              <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Distant Midnight Rooftop Silhouettes */}
          <path
            d="M0 380 L0 260 L90 200 L180 260 L240 230 L310 270 L420 180 L520 250 L610 210 L700 270 L820 190 L920 250 L1020 220 L1110 260 L1200 210 L1200 380 Z"
            fill="#060818"
            opacity="0.9"
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

          {/* Staggered Warm Illuminated Windows */}
          <g ref={windowsGroupRef} filter="url(#cinematic-window-glow-fx)" fill="#ffd88a">
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
            stroke="url(#flight-trail-grad)"
            strokeWidth="3.8"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength}
            filter="url(#route-path-glow-fx)"
          />

          {/* Starlight Waypoints */}
          <circle cx="80" cy="140" r="5" fill="#ffd88a" filter="url(#route-path-glow-fx)" />
          <circle cx="640" cy="100" r="6" fill="#ffd88a" filter="url(#route-path-glow-fx)" />
          <circle cx="1140" cy="120" r="5" fill="#c4b5fd" filter="url(#route-path-glow-fx)" />
        </svg>

        {/* Pip Cloud Avatar Gliding along the Flightpath (Seamless feathered cloud mask) */}
        <div
          ref={pipCloudMarkerRef}
          style={{
            position: 'absolute',
            bottom: '160px',
            left: '35%',
            width: '95px',
            height: '95px',
            pointerEvents: 'none',
            zIndex: 6,
            filter: 'drop-shadow(0 0 20px rgba(255, 216, 138, 0.9))'
          }}
        >
          <img
            src="/assets/pip_avatar_cloud.png"
            alt="Pip floating gently on a midnight bedtime cloud"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              WebkitMaskImage:
                'radial-gradient(circle at 50% 50%, black 35%, rgba(0,0,0,0.7) 50%, transparent 70%)',
              maskImage:
                'radial-gradient(circle at 50% 50%, black 35%, rgba(0,0,0,0.7) 50%, transparent 70%)'
            }}
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
          gap: '0.45rem',
          color: scrollProgress > 30 ? '#ffd88a' : 'var(--text-muted)',
          fontSize: '0.72rem',
          fontFamily: 'var(--font-mono)',
          transition: 'color 0.4s ease'
        }}
      >
        <span>SCROLL PROGRESS: {scrollProgress}%</span>
        <span style={{ opacity: 0.5 }}>↓</span>
      </div>
    </div>
  );
};
