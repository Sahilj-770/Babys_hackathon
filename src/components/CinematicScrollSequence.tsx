import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

gsap.registerPlugin(ScrollTrigger);

export const CinematicScrollSequence: React.FC = () => {
  const pinSectionRef = useRef<HTMLDivElement>(null);
  
  // Coordinated sky layers: Cream -> Amber -> Peach -> Lavender Dusk -> Deep Indigo
  const skyAmberRef = useRef<HTMLDivElement>(null);
  const skyPeachRef = useRef<HTMLDivElement>(null);
  const skyLavenderRef = useRef<HTMLDivElement>(null);
  const midnightSkyRef = useRef<HTMLDivElement>(null);
  
  const starsDeepRef = useRef<HTMLDivElement>(null);
  const starsForeRef = useRef<HTMLDivElement>(null);
  const burstFlashRef = useRef<HTMLDivElement>(null);
  const lanternGlowRef = useRef<HTMLDivElement>(null);
  const lanternHolderRef = useRef<HTMLDivElement>(null);
  const rooftopsRef = useRef<HTMLDivElement>(null);
  const windowsGroupRef = useRef<SVGGElement>(null);
  const flightPathRef = useRef<SVGPathElement>(null);
  const waypointsRef = useRef<SVGGElement>(null);
  const pipCloudMarkerRef = useRef<HTMLDivElement>(null);
  const convergingParticlesRef = useRef<HTMLDivElement>(null);
  const stagePillTextRef = useRef<HTMLSpanElement>(null);

  // Cross-fading narrative text refs (GSAP-driven, eliminating React re-render jitter)
  const textAwakeningRef = useRef<HTMLParagraphElement>(null);
  const textDuskRef = useRef<HTMLParagraphElement>(null);
  const textFlightRef = useRef<HTMLParagraphElement>(null);

  const [pathLength, setPathLength] = useState(650);

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
          // Reduced motion: statically reveal the midnight town without pinned animation
          if (midnightSkyRef.current) gsap.set(midnightSkyRef.current, { opacity: 1 });
          if (rooftopsRef.current) gsap.set(rooftopsRef.current, { y: 0, opacity: 1 });
          if (windowsGroupRef.current) gsap.set(windowsGroupRef.current.children, { opacity: 1 });
          if (waypointsRef.current) gsap.set(waypointsRef.current, { opacity: 1 });
          if (flightPathRef.current) gsap.set(flightPathRef.current, { strokeDashoffset: 0 });
          if (pipCloudMarkerRef.current) gsap.set(pipCloudMarkerRef.current, { opacity: 1 });
          if (textFlightRef.current) gsap.set(textFlightRef.current, { opacity: 1, display: 'block' });
          if (textAwakeningRef.current) gsap.set(textAwakeningRef.current, { display: 'none' });
          if (textDuskRef.current) gsap.set(textDuskRef.current, { display: 'none' });
          if (stagePillTextRef.current) {
            stagePillTextRef.current.textContent = 'ACT III: DREAM DELIVERY // FLIGHTPATH ILLUMINATED';
          }
          return;
        }

        // Master GSAP Timeline with ScrollTrigger (coordinated, 100% reversible)
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: pinSectionRef.current,
            start: 'top top',
            end: isDesktop ? '+=250%' : '+=180%',
            pin: true,
            scrub: 0.9,
            anticipatePin: 1
          }
        });

        // =========================================================================
        // 1. SKY COLOR ORCHESTRATION: Cream -> Amber -> Peach -> Lavender -> Indigo
        // =========================================================================
        
        // Amber Layer (0.0 to 1.5s): Warm nursery begins gathering golden starlight
        masterTl.to(skyAmberRef.current, { opacity: 1, duration: 1.4, ease: 'power1.inOut' }, 0);

        // Peach Dusk Layer (1.2 to 2.8s): Ambient light blossoms into sunset peach
        masterTl.to(skyPeachRef.current, { opacity: 1, duration: 1.6, ease: 'power1.inOut' }, 1.2);

        // Lavender Twilight Layer (2.4 to 4.0s): Peach darkens into luminous lavender dusk
        masterTl.to(skyLavenderRef.current, { opacity: 1, duration: 1.6, ease: 'power1.inOut' }, 2.4);

        // Deep Cosmic Indigo Midnight Layer (3.6 to 5.4s): Deep midnight envelops the world
        masterTl.to(midnightSkyRef.current, { opacity: 1, duration: 1.8, ease: 'power1.inOut' }, 3.6);

        // =========================================================================
        // 2. CONVERGING PARTICLES & LANTERN LIGHT BLOOM (0.0 to 2.2s)
        // =========================================================================
        if (convergingParticlesRef.current) {
          masterTl.fromTo(
            convergingParticlesRef.current.children,
            { scale: 1.5, opacity: 0.8, x: (i) => (i % 2 === 0 ? -50 : 50), y: (i) => (i < 2 ? -40 : 40) },
            { scale: 0.2, opacity: 0, x: 0, y: 0, ease: 'power2.in', duration: 1.4 },
            0.1
          );
        }

        // Lantern light core warms, expands gently
        masterTl.to(
          lanternGlowRef.current,
          {
            scale: 2.4,
            opacity: 0.95,
            ease: 'power2.inOut',
            duration: 1.5
          },
          0.2
        );

        // Tasteful golden flare climax at dusk transition
        masterTl.fromTo(
          burstFlashRef.current,
          { scale: 0.4, opacity: 0 },
          { scale: 5.5, opacity: 0.65, ease: 'power3.out', duration: 0.8 },
          1.8
        );
        masterTl.to(
          burstFlashRef.current,
          { opacity: 0, duration: 0.6, ease: 'power2.in' },
          2.4
        );

        // =========================================================================
        // 3. PARALLAX CELESTIAL STARS & LANTERN ASCENSION (2.2 to 4.2s)
        // =========================================================================
        masterTl.fromTo(
          starsDeepRef.current,
          { opacity: 0, y: 35 },
          { opacity: 0.75, y: -20, ease: 'power1.out', duration: 2.2 },
          2.4
        );
        masterTl.fromTo(
          starsForeRef.current,
          { opacity: 0, y: 55 },
          { opacity: 1, y: -35, ease: 'power1.out', duration: 2.2 },
          2.7
        );

        // Lantern gently elevates to guide dreamers
        masterTl.to(
          lanternHolderRef.current,
          {
            scale: isDesktop ? 0.72 : 0.65,
            y: isDesktop ? -95 : -60,
            opacity: 0.95,
            ease: 'power2.out',
            duration: 2.0
          },
          2.6
        );

        // =========================================================================
        // 4. SILHOUETTED ROOFTOPS & STAGGERED ILLUMINATED WINDOWS (3.8 to 5.2s)
        // =========================================================================
        masterTl.fromTo(
          rooftopsRef.current,
          { y: 150, opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out', duration: 1.6 },
          3.8
        );

        if (windowsGroupRef.current) {
          masterTl.fromTo(
            windowsGroupRef.current.children,
            { opacity: 0, scale: 0.6, transformOrigin: 'center center' },
            { opacity: 1, scale: 1, stagger: 0.12, ease: 'back.out(1.6)', duration: 0.55 },
            4.4
          );
        }

        // =========================================================================
        // 5. LUMINOUS SVG FLIGHTPATH & PIP CLOUD AVATAR (4.6 to 6.6s)
        // =========================================================================
        if (flightPathRef.current) {
          const len = flightPathRef.current.getTotalLength();
          masterTl.fromTo(
            flightPathRef.current,
            { strokeDashoffset: len },
            { strokeDashoffset: 0, ease: 'power1.inOut', duration: 2.0 },
            4.6
          );
        }

        if (waypointsRef.current) {
          masterTl.fromTo(
            waypointsRef.current,
            { opacity: 0 },
            { opacity: 1, ease: 'power1.out', duration: 0.8 },
            4.8
          );
        }

        if (pipCloudMarkerRef.current) {
          masterTl.fromTo(
            pipCloudMarkerRef.current,
            { x: -180, y: 50, opacity: 0, scale: 0.7 },
            {
              x: isDesktop ? 270 : 130,
              y: -30,
              opacity: 1,
              scale: 1,
              ease: 'power1.inOut',
              duration: 2.2
            },
            4.7
          );
        }

        // =========================================================================
        // 6. NARRATIVE TEXT CHOREOGRAPHY (Cross-faded smoothly in GSAP)
        // =========================================================================
        // Text 1 (Awakening) -> Text 2 (Dusk & Rooftops)
        masterTl.to(textAwakeningRef.current, { opacity: 0, y: -12, duration: 0.5 }, 1.8);
        masterTl.fromTo(
          textDuskRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.6 },
          2.3
        );

        // Text 2 (Dusk) -> Text 3 (Flightpath)
        masterTl.to(textDuskRef.current, { opacity: 0, y: -12, duration: 0.5 }, 4.1);
        masterTl.fromTo(
          textFlightRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.6 },
          4.6
        );

        // Stage pill updates cleanly at key points
        masterTl.call(() => {
          if (stagePillTextRef.current) stagePillTextRef.current.textContent = 'ACT II: THE AWAKENING // LANTERN STIRS';
        }, [], 0.5);

        masterTl.call(() => {
          if (stagePillTextRef.current) stagePillTextRef.current.textContent = 'ACT II: TWILIGHT SETTLES // STARS KINDLE';
        }, [], 2.4);

        masterTl.call(() => {
          if (stagePillTextRef.current) stagePillTextRef.current.textContent = 'ACT III: DREAM DELIVERY // FLIGHTPATH ILLUMINATED';
        }, [], 4.6);

        return () => {
          masterTl.kill();
        };
      }
    );

    return () => mm.revert();
  }, [pathLength]);

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
        backgroundColor: '#fff8f1'
      }}
    >
      {/* Layer 1: Warm Amber Honey Dusk */}
      <div
        ref={skyAmberRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 45%, #fbbf24 100%)',
          opacity: 0,
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* Layer 2: Sunset Peach & Twilight Coral */}
      <div
        ref={skyPeachRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #fed7aa 0%, #fca5a5 45%, #ea580c 100%)',
          opacity: 0,
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      {/* Layer 3: Luminous Lavender Twilight */}
      <div
        ref={skyLavenderRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #c4b5fd 0%, #a78bfa 50%, #4338ca 100%)',
          opacity: 0,
          zIndex: 3,
          pointerEvents: 'none'
        }}
      />

      {/* Layer 4: Deep Indigo Midnight Sky with Starfield */}
      <div
        ref={midnightSkyRef}
        className="cinematic-midnight-sky"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #050718 0%, #090b24 55%, #040510 100%)',
          opacity: 0,
          zIndex: 4,
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
              'radial-gradient(1.5px 1.5px at 120px 80px, #ffd88a, transparent), ' +
              'radial-gradient(2px 2px at 380px 140px, #ffffff, transparent), ' +
              'radial-gradient(1.5px 1.5px at 680px 90px, #c4b5fd, transparent), ' +
              'radial-gradient(2px 2px at 980px 120px, #ffd88a, transparent)',
            backgroundRepeat: 'repeat',
            backgroundSize: '900px 280px',
            opacity: 0
          }}
        />
      </div>

      {/* Sudden Golden Flare Burst (Visual Climax) */}
      <div
        ref={burstFlashRef}
        style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          width: '140px',
          height: '140px',
          transform: 'translate(-50%, -50%) scale(0.4)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #ffd88a 0%, rgba(255, 216, 138, 0.8) 35%, transparent 70%)',
          filter: 'blur(35px)',
          opacity: 0,
          zIndex: 6,
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
          background: 'radial-gradient(circle, #ffd88a 0%, rgba(255, 216, 138, 0.55) 45%, transparent 75%)',
          filter: 'blur(40px)',
          opacity: 0.35,
          zIndex: 5,
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
            backgroundColor: 'rgba(5, 7, 24, 0.82)',
            border: '1px solid rgba(255, 216, 138, 0.35)',
            color: '#ffd88a',
            fontSize: '0.78rem',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}
        >
          <Sparkles size={13} color="#ffd88a" />
          <span ref={stagePillTextRef}>ACT II: THE AWAKENING // LANTERN STIRS</span>
        </div>
      </div>

      {/* Central Lantern Stage with Converging Star Particles */}
      <div
        style={{
          position: 'relative',
          zIndex: 7,
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
            zIndex: 6
          }}
        >
          <span style={{ position: 'absolute', top: '15%', left: '15%', color: '#ffd88a', fontSize: '1rem' }}>✦</span>
          <span style={{ position: 'absolute', top: '20%', right: '15%', color: '#ffd88a', fontSize: '0.85rem' }}>★</span>
          <span style={{ position: 'absolute', bottom: '25%', left: '20%', color: '#c4b5fd', fontSize: '0.9rem' }}>✧</span>
          <span style={{ position: 'absolute', bottom: '20%', right: '22%', color: '#ffd88a', fontSize: '1.1rem' }}>✦</span>
        </div>

        {/* The Lantern Artwork: Transparent, unboxed asset with radiant ambient drop-shadow */}
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
              filter: 'drop-shadow(0 15px 35px rgba(255, 216, 138, 0.8)) drop-shadow(0 0 50px rgba(255, 180, 80, 0.45))'
            }}
          />
        </div>

        {/* Dynamic Storytelling Text (Pre-rendered and cross-faded smoothly in GSAP) */}
        <div
          style={{
            width: '100%',
            maxWidth: '720px',
            textAlign: 'center',
            marginTop: '1.25rem',
            position: 'relative',
            minHeight: '4.5rem',
            zIndex: 8
          }}
        >
          <p
            ref={textAwakeningRef}
            className="font-serif cinematic-narrative-text"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              margin: 0,
              fontSize: 'clamp(1.15rem, 2.2vw, 1.6rem)',
              lineHeight: 1.45,
              color: 'var(--text-heading)',
              textShadow: '0 2px 14px rgba(255, 216, 138, 0.4)'
            }}
          >
            "In the quiet nursery, Pip turns the brass key. Golden starlight gathers toward the wick, ready to wake the night."
          </p>

          <p
            ref={textDuskRef}
            className="font-serif cinematic-narrative-text"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              margin: 0,
              fontSize: 'clamp(1.15rem, 2.2vw, 1.6rem)',
              lineHeight: 1.45,
              color: '#ffffff',
              opacity: 0,
              textShadow: '0 2px 18px rgba(0, 0, 0, 0.7)'
            }}
          >
            "Amber turns to lavender dusk as the golden flare blossoms. Sleeping chimneys rise through starry mist."
          </p>

          <p
            ref={textFlightRef}
            className="font-serif cinematic-narrative-text"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              margin: 0,
              fontSize: 'clamp(1.15rem, 2.2vw, 1.6rem)',
              lineHeight: 1.45,
              color: '#ffffff',
              opacity: 0,
              textShadow: '0 2px 18px rgba(0, 0, 0, 0.7)'
            }}
          >
            "Pip takes flight along the golden constellation route, dropping sweet slumber down every chimney pot."
          </p>
        </div>
      </div>

      {/* Silhouetted Rooftops, Windows & Interactive Flightpath */}
      <div
        ref={rooftopsRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '36vh',
          maxHeight: '320px',
          zIndex: 8,
          pointerEvents: 'none',
          opacity: 0
        }}
      >
        <svg
          viewBox="0 0 1200 360"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <defs>
            <linearGradient id="flight-trail-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffd88a" stopOpacity="0.4" />
              <stop offset="30%" stopColor="#ffd88a" stopOpacity="1" />
              <stop offset="70%" stopColor="#ffb3ba" stopOpacity="1" />
              <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.95" />
            </linearGradient>

            <filter id="route-path-glow-fx" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Deep Silhouette Rooftops */}
          <path
            d="M 0 360 L 0 240 L 90 180 L 180 240 L 260 190 L 370 260 L 490 160 L 610 240 L 730 180 L 860 250 L 980 170 L 1100 240 L 1200 200 L 1200 360 Z"
            fill="#050718"
          />

          {/* Foreground Silhouetted Gables & Chimneys */}
          <path
            d="M 0 360 L 0 280 L 70 220 L 140 280 L 155 210 L 175 210 L 175 280 L 230 240 L 320 300 L 410 220 L 520 300 L 560 230 L 590 230 L 590 300 L 680 250 L 790 310 L 880 230 L 990 310 L 1080 250 L 1200 290 L 1200 360 Z"
            fill="#03040c"
          />

          {/* Staggered Illuminated Windows */}
          <g ref={windowsGroupRef}>
            <rect x="95" y="250" width="14" height="20" rx="3" fill="#ffd88a" opacity="0.95" filter="url(#route-path-glow-fx)" />
            <rect x="250" y="265" width="16" height="22" rx="3" fill="#ffd88a" opacity="0.9" filter="url(#route-path-glow-fx)" />
            <rect x="440" y="245" width="15" height="20" rx="3" fill="#ffd88a" opacity="0.95" filter="url(#route-path-glow-fx)" />
            <rect x="710" y="260" width="16" height="22" rx="3" fill="#ffd88a" opacity="0.9" filter="url(#route-path-glow-fx)" />
            <rect x="910" y="250" width="14" height="20" rx="3" fill="#ffd88a" opacity="0.95" filter="url(#route-path-glow-fx)" />
            <rect x="1115" y="265" width="15" height="22" rx="3" fill="#ffd88a" opacity="0.95" filter="url(#route-path-glow-fx)" />
          </g>

          {/* Luminous Animated Flightpath */}
          <path
            ref={flightPathRef}
            id="cinematic-flight-curve"
            d="M 60 170 C 240 100, 420 220, 640 130 C 840 50, 1020 190, 1140 140"
            stroke="url(#flight-trail-grad)"
            strokeWidth="3.8"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength}
            filter="url(#route-path-glow-fx)"
          />

          {/* Starlight Waypoints */}
          <g ref={waypointsRef} style={{ opacity: 0 }}>
            <circle cx="60" cy="170" r="5" fill="#ffd88a" filter="url(#route-path-glow-fx)" />
            <circle cx="640" cy="130" r="6" fill="#ffd88a" filter="url(#route-path-glow-fx)" />
            <circle cx="1140" cy="140" r="5" fill="#c4b5fd" filter="url(#route-path-glow-fx)" />
          </g>
        </svg>

        {/* Pip Cloud Avatar Gliding along the Flightpath */}
        <div
          ref={pipCloudMarkerRef}
          style={{
            position: 'absolute',
            bottom: '140px',
            left: '35%',
            width: '95px',
            height: '95px',
            pointerEvents: 'none',
            zIndex: 9,
            filter: 'drop-shadow(0 0 25px rgba(255, 216, 138, 0.9))'
          }}
        >
          <img
            src="/assets/pip_avatar_cloud.png"
            alt="Pip floating gently on a midnight bedtime cloud"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
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
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          color: '#ffd88a',
          fontSize: '0.74rem',
          letterSpacing: '0.08em',
          textShadow: '0 1px 8px rgba(0,0,0,0.6)'
        }}
      >
        <span className="font-mono">SCROLL TO STEP THROUGH DUSK & MIDNIGHT ↕</span>
      </div>
    </div>
  );
};
