import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  BookmarkCheck,
  Moon,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';
import { unlockFragment } from '../utils/passportStorage';

interface Destination {
  id: number;
  name: string;
  resident: string;
  dreamType: string;
  description: string;
  coords: { x: number; y: number };
  frequency: number;
  freqLabel: string;
  status: 'pending' | 'delivered';
}

const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: 1,
    name: 'Clover Cottage',
    resident: 'Baby Leo',
    dreamType: 'Warm Milk & Kitten Paws',
    description: 'A cozy thatched cottage with ivy on the eaves. Baby Leo is tossing restlessly in his wooden crib.',
    coords: { x: 90, y: 220 },
    frequency: 432.0,
    freqLabel: '432.0 Hz (Delta Calm)',
    status: 'delivered'
  },
  {
    id: 2,
    name: 'Clocktower Attic',
    resident: 'Grandma Martha',
    dreamType: 'Old Garden Roses & Vinyl Records',
    description: 'High above the quiet cobblestones where pendulum gears click gently in 3/4 waltz time.',
    coords: { x: 260, y: 110 },
    frequency: 440.0,
    freqLabel: '440.0 Hz (Nostalgia)',
    status: 'pending'
  },
  {
    id: 3,
    name: 'Lighthouse Loft',
    resident: 'Sailor Finn',
    dreamType: 'Gentle Harbor Waves & Starlight',
    description: 'Perched on the sleepy rocky headland where distant foghorns sound like quiet lullabies.',
    coords: { x: 440, y: 190 },
    frequency: 428.2,
    freqLabel: '428.2 Hz (Ocean Tide)',
    status: 'pending'
  },
  {
    id: 4,
    name: 'Moonrise Nursery',
    resident: 'Pip & Friends',
    dreamType: 'Sugar Clouds & Velvet Bedtime',
    description: 'The attic headquarters of DreamOS 99, where sleepy teddy bears guard the constellation maps.',
    coords: { x: 620, y: 95 },
    frequency: 436.5,
    freqLabel: '436.5 Hz (Cumulus)',
    status: 'pending'
  },
  {
    id: 5,
    name: 'Celestial Observatory',
    resident: 'Astronomer Luna',
    dreamType: 'Comets & Silver Nebulas',
    description: 'A brass dome turned toward the Milky Way. Starlight charts flutter against the open telescope slit.',
    coords: { x: 790, y: 165 },
    frequency: 528.0,
    freqLabel: '528.0 Hz (Starlight Core)',
    status: 'pending'
  },
  {
    id: 6,
    name: 'Whisper Willow',
    resident: 'Woodland Fawns',
    dreamType: 'Moss Pillows & Firefly Sparks',
    description: 'A clearing at the edge of the sleepy pines. Dew gathers on spiderwebs that shine like silver lace.',
    coords: { x: 930, y: 225 },
    frequency: 432.0,
    freqLabel: '432.0 Hz (Pine Slumber)',
    status: 'pending'
  }
];

export const MidnightAtlasPage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [selectedIdx, setSelectedIdx] = useState<number>(1);
  const [flightProgress, setFlightProgress] = useState<number>(20);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [pipPosition, setPipPosition] = useState<{ x: number; y: number }>({ x: 90, y: 220 });
  const [pathLength, setPathLength] = useState<number>(1000);

  const pathRef = useRef<SVGPathElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Initialize and measure flight path
  useEffect(() => {
    window.scrollTo(0, 0);
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);
      const pt = pathRef.current.getPointAtLength(0.2 * len);
      setPipPosition({ x: pt.x, y: pt.y });
    }
  }, []);

  // Update Pip coordinates when scrubber or progress changes
  const updatePipAtProgress = useCallback(
    (progressFraction: number) => {
      if (!pathRef.current || pathLength <= 0) return;
      const dist = Math.max(0, Math.min(pathLength, progressFraction * pathLength));
      const pt = pathRef.current.getPointAtLength(dist);
      setPipPosition({ x: pt.x, y: pt.y });
    },
    [pathLength]
  );

  const activeDestination = destinations[selectedIdx];

  // Select destination
  const handleSelectDestination = (index: number) => {
    setSelectedIdx(index);
    const targetProgress = (index / (destinations.length - 1)) * 100;
    setFlightProgress(targetProgress);
    updatePipAtProgress(targetProgress / 100);
    soundEngine.playClick(440 + index * 40);
    unlockFragment('rooftop');
  };

  // Dispatch dream action
  const handleDispatchDream = () => {
    if (isDispatching) return;
    setIsDispatching(true);
    soundEngine.playClick(580);
    soundEngine.playMusicBoxNote(activeDestination.frequency, 1.4);

    const targetProgress = (selectedIdx / (destinations.length - 1)) * 100;
    const startProgress = flightProgress;

    // Animate progress with GSAP
    const obj = { val: startProgress };
    gsap.to(obj, {
      val: targetProgress,
      duration: 1.8,
      ease: 'power2.inOut',
      onUpdate: () => {
        setFlightProgress(Math.round(obj.val));
        updatePipAtProgress(obj.val / 100);
      },
      onComplete: () => {
        setIsDispatching(false);
        soundEngine.playCelebrationChime();

        // Mark as delivered
        setDestinations((prev) =>
          prev.map((d, i) => (i === selectedIdx ? { ...d, status: 'delivered' } : d))
        );

        // Confetti burst
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#ffd88a', '#c4b5fd', '#ffb3ba', '#bae1ff']
        });
      }
    });
  };

  // Reset entire route
  const handleResetRoute = () => {
    setDestinations((prev) => prev.map((d, i) => (i === 0 ? { ...d, status: 'delivered' } : { ...d, status: 'pending' })));
    setSelectedIdx(0);
    setFlightProgress(0);
    updatePipAtProgress(0);
    soundEngine.playClick(320);
  };

  const deliveredCount = destinations.filter((d) => d.status === 'delivered').length;

  return (
    <div
      className="midnight-atlas-page"
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: '2rem 1.5rem 5rem',
        backgroundColor: '#050718',
        color: '#fff8f1'
      }}
    >
      {/* Background Starfield */}
      <div className="midnight-celestial-stars" style={{ opacity: 0.8 }} />

      <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Navigation Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <Link
            to="/"
            onClick={() => soundEngine.playClick(440)}
            className="retro-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 1rem',
              fontSize: '0.82rem',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#ffd88a',
              textDecoration: 'none',
              borderColor: 'rgba(255, 216, 138, 0.4)'
            }}
          >
            <ArrowLeft size={14} />
            <span className="font-mono">Back to Nursery Home</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              to="/dream-forge"
              onClick={() => soundEngine.playClick(500)}
              className="retro-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.95rem',
                fontSize: '0.82rem',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#ffd88a',
                borderColor: 'rgba(255, 216, 138, 0.4)',
                textDecoration: 'none'
              }}
            >
              <Sparkles size={14} color="#ffd88a" />
              <span className="font-mono">Dream Forge</span>
            </Link>

            <Link
              to="/archive"
              onClick={() => soundEngine.playClick(560)}
              className="retro-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.95rem',
                fontSize: '0.82rem',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#ffd88a',
                borderColor: 'rgba(255, 216, 138, 0.4)',
                textDecoration: 'none'
              }}
            >
              <BookmarkCheck size={14} color="#ffd88a" />
              <span className="font-mono">Bedtime Archive</span>
            </Link>
          </div>
        </div>

        {/* Page Header */}
        <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            className="font-mono"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 1rem',
              borderRadius: '999px',
              border: '1px solid rgba(255, 216, 138, 0.35)',
              backgroundColor: 'rgba(255, 216, 138, 0.12)',
              color: '#ffd88a',
              fontSize: '0.78rem',
              letterSpacing: '0.08em',
              marginBottom: '0.75rem'
            }}
          >
            <Moon size={14} color="#ffd88a" />
            <span>MIDNIGHT ROOFTOP RADAR // 6 SLUMBER DESTINATIONS</span>
            <Moon size={14} color="#ffd88a" />
          </div>

          <h1
            className="font-serif"
            style={{
              fontSize: 'clamp(2.4rem, 4.8vw, 3.8rem)',
              color: '#fff8f1',
              lineHeight: 1.1,
              margin: '0 0 0.8rem 0',
              textShadow: '0 4px 25px rgba(255, 216, 138, 0.25)'
            }}
          >
            The Midnight Atlas
          </h1>

          <p
            style={{
              color: '#c9ceff',
              fontSize: '1.08rem',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6
            }}
          >
            Chart Pip's nocturnal flight across quiet slate roofs, church towers, coastal headlands,
            and pine forests. Dispatch sweet slumber to waiting residents before the first light of dawn.
          </p>
        </header>

        {/* ====================================================================
            Full-Screen Illustrated Dream Map Canvas
            ==================================================================== */}
        <div
          ref={mapContainerRef}
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(360px, 50vw, 480px)',
            borderRadius: '24px',
            backgroundColor: '#040616',
            border: '2px solid rgba(119, 125, 255, 0.3)',
            boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.8)',
            overflow: 'hidden',
            marginBottom: '2rem'
          }}
        >
          {/* Luminous Full Moon */}
          <div
            style={{
              position: 'absolute',
              top: '25px',
              right: '45px',
              width: '75px',
              height: '75px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #fffdf0 0%, #ffd88a 50%, #d4a34b 100%)',
              boxShadow: '0 0 35px rgba(255, 216, 138, 0.7), 0 0 70px rgba(255, 216, 138, 0.35)',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />

          {/* Distant Atmospheric Nebula Clouds */}
          <div
            style={{
              position: 'absolute',
              top: '10%',
              left: '15%',
              width: '450px',
              height: '250px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(163, 64, 99, 0.18) 0%, transparent 70%)',
              filter: 'blur(50px)',
              pointerEvents: 'none'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '20%',
              right: '25%',
              width: '500px',
              height: '250px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(119, 125, 255, 0.15) 0%, transparent 70%)',
              filter: 'blur(60px)',
              pointerEvents: 'none'
            }}
          />

          {/* The Panoramic Vector Roofscape & SVG Flight Path */}
          <svg
            viewBox="0 0 1020 320"
            style={{ width: '100%', height: '100%' }}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="atlas-flight-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffd88a" />
                <stop offset="30%" stopColor="#ffb3ba" />
                <stop offset="65%" stopColor="#c4b5fd" />
                <stop offset="100%" stopColor="#86efac" />
              </linearGradient>

              <filter id="atlas-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Layer 1: Distant Mountain Silhouettes */}
            <path
              d="M0 320 L0 230 Q 180 170, 360 220 T 720 180 T 1020 220 L 1020 320 Z"
              fill="#080b22"
              opacity="0.8"
            />

            {/* Layer 2: Midground Rooftops & Spires */}
            <path
              d="M0 320 L0 240 L50 200 L110 240 L160 210 L230 250 L260 140 L280 250 L340 220 L400 250 L440 180 L460 250 L530 210 L600 240 L620 130 L640 240 L710 200 L770 240 L790 160 L810 240 L880 210 L940 250 L1020 220 L1020 320 Z"
              fill="#0a0d2a"
            />

            {/* Layer 3: Foreground Detailed Rooftops with Chimney Pots */}
            <path
              d="M0 320 L0 260 L40 230 L80 260 L90 220 L105 220 L105 260 L150 240 L210 270 L260 230 L320 270 L350 240 L370 240 L370 270 L430 240 L490 270 L550 235 L610 270 L670 235 L730 270 L770 240 L830 270 L890 240 L950 270 L1020 250 L1020 320 Z"
              fill="#060714"
            />

            {/* Glowing Amber Windows across the sleepy town */}
            <rect x="75" y="270" width="10" height="15" rx="2" fill="#ffd88a" opacity="0.9" />
            <rect x="230" y="275" width="12" height="16" rx="2" fill="#ffd88a" opacity="0.85" />
            <rect x="390" y="280" width="11" height="14" rx="2" fill="#ffd88a" opacity="0.9" />
            <rect x="580" y="275" width="12" height="16" rx="2" fill="#ffd88a" opacity="0.95" />
            <rect x="750" y="275" width="10" height="14" rx="2" fill="#ffd88a" opacity="0.8" />
            <rect x="910" y="280" width="11" height="15" rx="2" fill="#ffd88a" opacity="0.85" />

            {/* The Flight Path Bezier Spline */}
            <path
              ref={pathRef}
              id="atlas-main-route"
              d="M 90 220 Q 180 80, 260 110 T 440 190 T 620 95 T 790 165 T 930 225"
              fill="none"
              stroke="url(#atlas-flight-gradient)"
              strokeWidth="4"
              strokeDasharray="8 8"
              filter="url(#atlas-glow)"
            />

            {/* Destination Waypoint Nodes */}
            {destinations.map((dest, i) => {
              const isSelected = selectedIdx === i;
              const isDelivered = dest.status === 'delivered';
              return (
                <g
                  key={dest.id}
                  onClick={() => handleSelectDestination(i)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Outer pulse ring for selected waypoint */}
                  {isSelected && (
                    <circle
                      cx={dest.coords.x}
                      cy={dest.coords.y}
                      r="16"
                      fill="none"
                      stroke="#ffd88a"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                  )}

                  {/* Waypoint circle */}
                  <circle
                    cx={dest.coords.x}
                    cy={dest.coords.y}
                    r={isSelected ? 9 : 6}
                    fill={isDelivered ? '#ffd88a' : '#777dff'}
                    filter="url(#atlas-glow)"
                  />

                  {/* Number label inside node */}
                  <text
                    x={dest.coords.x}
                    y={dest.coords.y - 14}
                    textAnchor="middle"
                    fill={isSelected ? '#ffd88a' : '#c9ceff'}
                    fontSize="11"
                    fontWeight={isSelected ? 700 : 400}
                    fontFamily="var(--font-mono)"
                  >
                    {dest.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Animated Pip On Cloud Marker */}
          <div
            style={{
              position: 'absolute',
              left: `${(pipPosition.x / 1020) * 100}%`,
              top: `${(pipPosition.y / 320) * 100}%`,
              transform: 'translate(-50%, -75%)',
              pointerEvents: 'none',
              transition: isDispatching ? 'none' : 'all 0.2s ease-out',
              zIndex: 10,
              filter: 'drop-shadow(0 0 20px rgba(255, 216, 138, 0.95))'
            }}
          >
            <img
              src="/assets/pip_avatar_cloud.png"
              alt="Pip on dream delivery cloud"
              style={{
                width: '74px',
                height: '74px',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>

        {/* ====================================================================
            Interactive Map Controls & Telemetry Dashboard
            ==================================================================== */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.75rem',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Active Destination Detail Card */}
          <div
            style={{
              backgroundColor: 'rgba(9, 11, 32, 0.85)',
              borderRadius: '20px',
              border: '1.5px solid rgba(255, 216, 138, 0.35)',
              padding: '2rem',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div
                className="font-mono"
                style={{
                  fontSize: '0.74rem',
                  color: '#ffd88a',
                  letterSpacing: '0.08em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <MapPin size={13} color="#ffd88a" />
                <span>WAYPOINT 0{activeDestination.id} OF 06</span>
              </div>

              <div
                className="font-mono"
                style={{
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '999px',
                  backgroundColor:
                    activeDestination.status === 'delivered'
                      ? 'rgba(134, 239, 172, 0.2)'
                      : 'rgba(255, 216, 138, 0.2)',
                  color: activeDestination.status === 'delivered' ? '#86efac' : '#ffd88a',
                  border: `1px solid ${activeDestination.status === 'delivered' ? '#86efac' : '#ffd88a'}`
                }}
              >
                {activeDestination.status === 'delivered' ? '✓ DREAM DELIVERED' : '✦ SLUMBER PENDING'}
              </div>
            </div>

            <div>
              <h2
                className="font-serif"
                style={{
                  fontSize: '1.9rem',
                  color: '#fff8f1',
                  margin: '0 0 0.35rem 0'
                }}
              >
                {activeDestination.name}
              </h2>
              <div style={{ fontSize: '0.92rem', color: '#ffd88a', fontWeight: 600 }}>
                Recipient: {activeDestination.resident}
              </div>
            </div>

            <p style={{ fontSize: '0.94rem', color: '#c9ceff', lineHeight: 1.6, margin: 0 }}>
              {activeDestination.description}
            </p>

            {/* Cargo Box */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px dashed rgba(255, 216, 138, 0.4)',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}
            >
              <div className="font-mono" style={{ fontSize: '0.72rem', color: '#ffd88a' }}>
                BEDTIME CARGO SPECS:
              </div>
              <div style={{ fontSize: '1.02rem', fontStyle: 'italic', color: '#ffffff' }}>
                "{activeDestination.dreamType}"
              </div>
              <div className="font-mono" style={{ fontSize: '0.74rem', color: '#a3a8d8' }}>
                RESONANCE: {activeDestination.freqLabel}
              </div>
            </div>

            {/* Dispatch Action Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleDispatchDream}
                disabled={isDispatching}
                className="retro-btn"
                style={{
                  backgroundColor: '#ffd88a',
                  color: '#26160f',
                  borderColor: '#ffd88a',
                  padding: '0.85rem 1.8rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  boxShadow: '0 0 25px rgba(255, 216, 138, 0.5)',
                  cursor: isDispatching ? 'default' : 'pointer',
                  opacity: isDispatching ? 0.75 : 1
                }}
              >
                <Send size={15} color="#26160f" />
                <span>{isDispatching ? 'Pip Flying Over Roofs...' : 'Dispatch Sweet Dream'}</span>
              </button>

              <button
                onClick={() => {
                  const next = (selectedIdx + 1) % destinations.length;
                  handleSelectDestination(next);
                }}
                className="retro-btn"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#fff8f1',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '0.85rem 1.25rem',
                  fontSize: '0.85rem'
                }}
              >
                <ChevronRight size={15} />
                <span>Next Stop</span>
              </button>
            </div>
          </div>

          {/* Right Column: Waypoint Grid & Flight Scrubber Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Delivery Progress Bar */}
            <div
              style={{
                backgroundColor: 'rgba(9, 11, 32, 0.85)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="font-mono" style={{ fontSize: '0.78rem', color: '#c9ceff' }}>
                  NIGHTLY FLIGHT QUOTA:
                </span>
                <span className="font-mono" style={{ fontSize: '0.82rem', color: '#ffd88a', fontWeight: 700 }}>
                  {deliveredCount} / {destinations.length} DELIVERED
                </span>
              </div>

              {/* Scrubber slider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={flightProgress}
                  aria-label="Atlas flight route scrubber"
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setFlightProgress(val);
                    updatePipAtProgress(val / 100);
                    const nearest = Math.min(
                      destinations.length - 1,
                      Math.max(0, Math.round((val / 100) * (destinations.length - 1)))
                    );
                    setSelectedIdx(nearest);
                  }}
                  style={{
                    width: '100%',
                    accentColor: '#ffd88a',
                    cursor: 'pointer'
                  }}
                />
                <span className="font-mono" style={{ fontSize: '0.82rem', color: '#ffd88a', minWidth: '42px' }}>
                  {flightProgress}%
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem' }}>
                <span style={{ fontSize: '0.76rem', color: '#9ba0d8' }}>
                  Drag scrubber to glide Pip across any sector
                </span>
                <button
                  onClick={handleResetRoute}
                  className="retro-btn"
                  style={{
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.72rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#c9ceff',
                    borderColor: 'rgba(255, 255, 255, 0.15)'
                  }}
                  title="Reset all waypoints to pending"
                >
                  <RotateCcw size={12} />
                  <span>Reset Route</span>
                </button>
              </div>
            </div>

            {/* Waypoint Chips Grid */}
            <div
              role="region"
              aria-label="Delivery destinations selector"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.75rem'
              }}
            >
              {destinations.map((dest, i) => {
                const isSelected = selectedIdx === i;
                const isDelivered = dest.status === 'delivered';
                return (
                  <button
                    key={dest.id}
                    onClick={() => handleSelectDestination(i)}
                    style={{
                      padding: '0.85rem 0.75rem',
                      borderRadius: '14px',
                      backgroundColor: isSelected ? 'rgba(255, 216, 138, 0.15)' : 'rgba(9, 11, 32, 0.7)',
                      border: isSelected
                        ? '1.5px solid #ffd88a'
                        : '1px solid rgba(255, 255, 255, 0.12)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 0 16px rgba(255, 216, 138, 0.3)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className="font-mono" style={{ fontSize: '0.68rem', color: '#a3a8d8' }}>
                        STOP 0{dest.id}
                      </span>
                      {isDelivered && <CheckCircle2 size={13} color="#86efac" />}
                    </div>
                    <div
                      className="font-serif"
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: isSelected ? '#ffd88a' : '#fff8f1'
                      }}
                    >
                      {dest.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#c9ceff', opacity: 0.8 }}>
                      {dest.resident}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MidnightAtlasPage;
