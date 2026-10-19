import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  RotateCcw,
  Sparkles,
  BookmarkCheck,
  Moon,
  ChevronRight,
  Compass,
  Volume2
} from 'lucide-react';
import type { Destination } from '../../types/atlas';
import { soundEngine } from '../../audio/soundEngine';

export interface AtlasViewProps {
  destinations: Destination[];
  selectedIdx: number;
  flightProgress: number;
  isDispatching: boolean;
  pipPosition: { x: number; y: number };
  pathRef: React.RefObject<SVGPathElement | null>;
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  pipMarkerRef: React.RefObject<SVGGElement | null>;
  progressBarRef: React.RefObject<HTMLDivElement | null>;
  onSelectDestination: (index: number) => void;
  onDispatchDream: () => void;
  onResetRoute: () => void;
}

export const AtlasDesktopView: React.FC<AtlasViewProps> = ({
  destinations,
  selectedIdx,
  flightProgress,
  isDispatching,
  pipPosition,
  pathRef,
  mapContainerRef,
  pipMarkerRef,
  progressBarRef,
  onSelectDestination,
  onDispatchDream,
  onResetRoute
}) => {
  const activeDestination = destinations[selectedIdx];
  const deliveredCount = destinations.filter((d) => d.status === 'delivered').length;
  const isAllDelivered = deliveredCount === destinations.length;

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
      {/* Top Header Bar & Telemetry HUD */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
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

        {/* Global Wayfinding Links */}
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

      {/* Atmospheric Editorial Introduction with Integrated Courier Context */}
      <header
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
          gap: '2.5rem',
          alignItems: 'center',
          marginBottom: '2.2rem',
          paddingBottom: '1.75rem',
          borderBottom: '1px solid rgba(255, 216, 138, 0.2)'
        }}
      >
        <div>
          <div
            className="font-mono"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              fontSize: '0.75rem',
              color: '#ffd88a',
              letterSpacing: '0.18em',
              marginBottom: '0.5rem',
              padding: '0.2rem 0.75rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 216, 138, 0.1)',
              border: '1px solid rgba(255, 216, 138, 0.25)'
            }}
          >
            <Compass size={12} color="#ffd88a" />
            <span>THE NOCTURNAL DREAM CARTOGRAPHER // 432 Hz DISPATCH</span>
          </div>

          <h1
            className="font-serif"
            style={{
              fontSize: 'clamp(2.4rem, 4.2vw, 3.6rem)',
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
              fontSize: '1.05rem',
              maxWidth: '720px',
              margin: 0,
              lineHeight: 1.6
            }}
          >
            Chart Pip’s nocturnal flight across quiet slate roofs, church towers, coastal lofts,
            and pine forests. Select any waiting resident to inspect their dream vial, then dispatch
            Pip along the celestial route before the first bell of dawn.
          </p>
        </div>

        {/* Courier Status Card */}
        <div
          className="retro-panel"
          style={{
            backgroundColor: 'rgba(12, 9, 29, 0.85)',
            border: '1.5px solid rgba(255, 216, 138, 0.35)',
            borderRadius: '16px',
            padding: '1.25rem 1.6rem',
            minWidth: '260px',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div
            className="font-mono"
            style={{
              fontSize: '0.72rem',
              color: '#ffd88a',
              letterSpacing: '0.12em',
              marginBottom: '0.65rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>COURIER STATUS</span>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isDispatching ? '#86efac' : '#ffd88a',
                boxShadow: isDispatching ? '0 0 8px #86efac' : '0 0 8px #ffd88a'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.75rem' }}>
            <img
              src="/assets/pip_portrait.png"
              alt="Pip the Courier"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid #ffd88a',
                background: '#1a123d'
              }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff8f1' }}>Pip (Junior Courier)</div>
              <div className="font-mono" style={{ fontSize: '0.74rem', color: '#c4b5fd' }}>
                {isDispatching ? 'IN FLIGHT // VELVET VIAL' : 'AT REST // READY TO FLY'}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.65rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.82rem'
            }}
          >
            <span className="font-mono" style={{ color: '#ffd88a' }}>
              STOPS: {deliveredCount} / {destinations.length}
            </span>
            <button
              onClick={onResetRoute}
              className="retro-btn"
              style={{
                padding: '0.2rem 0.55rem',
                fontSize: '0.72rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#ffb3ba',
                borderColor: 'rgba(255, 179, 186, 0.3)'
              }}
              title="Reset all deliveries"
            >
              <RotateCcw size={10} style={{ marginRight: '4px' }} />
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* ====================================================================
          Centerpiece Cartographic Dream Map Canvas
          ==================================================================== */}
      <div
        ref={mapContainerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(380px, 46vw, 490px)',
          borderRadius: '24px',
          backgroundColor: '#040616',
          border: '2px solid rgba(255, 216, 138, 0.35)',
          boxShadow: '0 25px 70px -10px rgba(0, 0, 0, 0.85), 0 0 30px rgba(255, 216, 138, 0.12)',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}
      >
        {/* Cartographic Compass Markings & Graticule */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1,
            backgroundImage:
              'linear-gradient(rgba(255, 216, 138, 0.04) 1px, transparent 1px), ' +
              'linear-gradient(90deg, rgba(255, 216, 138, 0.04) 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }}
        />

        {/* Top-Right Latitude / Astrolabe Coordinate Stamp */}
        <div
          className="font-mono"
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '16px',
            left: '20px',
            fontSize: '0.7rem',
            color: 'rgba(255, 216, 138, 0.75)',
            letterSpacing: '0.12em',
            zIndex: 2,
            background: 'rgba(4, 6, 22, 0.65)',
            padding: '0.2rem 0.6rem',
            borderRadius: '6px',
            border: '1px solid rgba(255, 216, 138, 0.2)'
          }}
        >
          MAP SECTOR: NOCTURNAL-01 // 43° 21' N · 12° 08' E
        </div>

        {/* Luminous Full Moon with Warm Corona */}
        <div
          style={{
            position: 'absolute',
            top: '25px',
            right: '45px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #fffdf0 0%, #ffd88a 50%, #d4a34b 100%)',
            boxShadow: '0 0 40px rgba(255, 216, 138, 0.8), 0 0 85px rgba(255, 216, 138, 0.4)',
            pointerEvents: 'none',
            zIndex: 2
          }}
        />

        {/* Atmospheric Nebula Glows */}
        <div
          style={{
            position: 'absolute',
            top: '8%',
            left: '12%',
            width: '450px',
            height: '240px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(163, 64, 99, 0.2) 0%, transparent 70%)',
            filter: 'blur(55px)',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '22%',
            right: '22%',
            width: '500px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(119, 125, 255, 0.16) 0%, transparent 70%)',
            filter: 'blur(65px)',
            pointerEvents: 'none'
          }}
        />

        {/* Panoramic Vector Rooftops & SVG Flight Path */}
        <svg
          viewBox="0 0 1020 320"
          style={{ width: '100%', height: '100%' }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="desktop-flight-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffd88a" />
              <stop offset="30%" stopColor="#ffb3ba" />
              <stop offset="65%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#86efac" />
            </linearGradient>

            <filter id="desktop-atlas-glow" x="-20%" y="-20%" width="140%" height="140%">
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
            stroke="url(#desktop-flight-gradient)"
            strokeWidth="4"
            strokeDasharray="8 8"
            filter="url(#desktop-atlas-glow)"
          />

          {/* Destination Waypoint Nodes */}
          {destinations.map((dest, i) => {
            const isSelected = selectedIdx === i;
            const isDelivered = dest.status === 'delivered';
            return (
              <g
                key={dest.id}
                onClick={() => onSelectDestination(i)}
                style={{ cursor: 'pointer' }}
                tabIndex={0}
                role="button"
                aria-label={`Select destination ${dest.name}, resident ${dest.resident}, status ${dest.status}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectDestination(i);
                  }
                }}
              >
                {/* Outer Ring Pulse for selected node */}
                {isSelected && (
                  <circle
                    cx={dest.coords.x}
                    cy={dest.coords.y}
                    r="24"
                    fill="none"
                    stroke="#ffd88a"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.8"
                  />
                )}

                {/* Node Target Halo */}
                <circle
                  cx={dest.coords.x}
                  cy={dest.coords.y}
                  r="14"
                  fill={isDelivered ? '#064e3b' : isSelected ? '#581c87' : '#1e1b4b'}
                  stroke={isDelivered ? '#86efac' : isSelected ? '#ffd88a' : '#c4b5fd'}
                  strokeWidth="2.5"
                />

                {/* Node Center Icon / Glyphs */}
                {isDelivered ? (
                  <text
                    x={dest.coords.x}
                    y={dest.coords.y + 4}
                    textAnchor="middle"
                    fill="#86efac"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    ✓
                  </text>
                ) : (
                  <text
                    x={dest.coords.x}
                    y={dest.coords.y + 4}
                    textAnchor="middle"
                    fill={isSelected ? '#ffd88a' : '#c4b5fd'}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {dest.id}
                  </text>
                )}

                {/* Waypoint Label Badge */}
                <rect
                  x={dest.coords.x - 48}
                  y={dest.coords.y + 20}
                  width="96"
                  height="22"
                  rx="6"
                  fill="rgba(6, 4, 18, 0.85)"
                  stroke={isSelected ? '#ffd88a' : 'rgba(255, 216, 138, 0.3)'}
                  strokeWidth="1"
                />
                <text
                  x={dest.coords.x}
                  y={dest.coords.y + 35}
                  textAnchor="middle"
                  fill={isSelected ? '#ffd88a' : '#fff8f1'}
                  fontSize="10"
                  fontFamily="'Space Mono', monospace"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                >
                  {dest.name}
                </text>
              </g>
            );
          })}

          {/* Animated Courier Marker (Pip Floating along Flight Path) */}
          <g
            ref={pipMarkerRef}
            transform={`translate(${pipPosition.x}, ${pipPosition.y})`}
            style={{
              transition: isDispatching ? 'none' : 'transform 0.3s ease',
              pointerEvents: 'none'
            }}
          >
            {/* Courier Starlight Aura */}
            <circle cx="0" cy="0" r="26" fill="rgba(255, 216, 138, 0.25)" filter="url(#desktop-atlas-glow)" />
            <circle cx="0" cy="0" r="14" fill="#ffd88a" />

            {/* Glowing Lantern Ember */}
            <circle cx="8" cy="-6" r="5" fill="#fff8f1" filter="url(#desktop-atlas-glow)" />

            {/* Micro Pip Nightcap */}
            <path d="M -6 -12 L 8 -18 L 6 -6 Z" fill="#2a1f4a" stroke="#ffd88a" strokeWidth="1" />
            <circle cx="9" cy="-19" r="2" fill="#ffd88a" />

            {/* Tiny Starlight Sparkles */}
            <text x="0" y="3" textAnchor="middle" fill="#26160f" fontSize="8" fontWeight="bold">
              ✦
            </text>
          </g>
        </svg>

        {/* Bottom Cartographic Scrubber Track */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '24px',
            right: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            backgroundColor: 'rgba(6, 4, 18, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 216, 138, 0.3)',
            borderRadius: '12px',
            padding: '0.6rem 1.25rem',
            zIndex: 3
          }}
        >
          <span className="font-mono" style={{ fontSize: '0.78rem', color: '#ffd88a', whiteSpace: 'nowrap' }}>
            ROUTE FLIGHT: {Math.round(flightProgress)}%
          </span>

          <div
            style={{
              flex: 1,
              height: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '999px',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <div
              ref={progressBarRef}
              style={{
                width: `${flightProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #ffd88a, #ffb3ba, #c4b5fd)',
                transition: isDispatching ? 'none' : 'width 0.3s ease',
                boxShadow: '0 0 10px rgba(255, 216, 138, 0.7)'
              }}
            />
          </div>

          <span className="font-mono" style={{ fontSize: '0.78rem', color: '#c4b5fd', whiteSpace: 'nowrap' }}>
            STOP {selectedIdx + 1} OF {destinations.length}
          </span>
        </div>
      </div>

      {/* ====================================================================
          Nocturnal Dispatch Control Deck (Below Map)
          ==================================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: '1.75rem',
          alignItems: 'start'
        }}
      >
        {/* Left: Active Destination Dossier & Delivery Launcher */}
        <div
          className="retro-panel"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '2px solid var(--color-gold)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: 'var(--shadow-soft)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-berry)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Moon size={13} color="var(--color-gold)" />
              <span>SECTOR {activeDestination.id} OF 06 // ACTIVE TARGET</span>
            </div>

            <span
              className="font-mono"
              style={{
                fontSize: '0.74rem',
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                backgroundColor: activeDestination.status === 'delivered' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(255, 216, 138, 0.15)',
                color: activeDestination.status === 'delivered' ? '#15803d' : 'var(--color-gold)',
                border: activeDestination.status === 'delivered' ? '1px solid rgba(74, 222, 128, 0.4)' : '1px solid rgba(255, 216, 138, 0.4)'
              }}
            >
              {activeDestination.status === 'delivered' ? '✦ DELIVERED' : '○ PENDING DELIVERY'}
            </span>
          </div>

          <h2
            className="font-serif"
            style={{
              fontSize: '2rem',
              color: 'var(--text-heading)',
              margin: '0 0 0.35rem 0',
              lineHeight: 1.2
            }}
          >
            {activeDestination.name}
          </h2>

          <div
            style={{
              fontSize: '0.98rem',
              color: 'var(--color-berry)',
              fontWeight: 600,
              marginBottom: '1rem'
            }}
          >
            Resident: {activeDestination.resident} · Vial: “{activeDestination.dreamType}”
          </div>

          <p
            style={{
              color: 'var(--text-main)',
              fontSize: '0.96rem',
              lineHeight: 1.6,
              marginBottom: '1.5rem',
              backgroundColor: 'var(--bg-retro-panel)',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)'
            }}
          >
            {activeDestination.description}
          </p>

          {/* Action Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={onDispatchDream}
              disabled={isDispatching}
              className="retro-btn"
              style={{
                backgroundColor: activeDestination.status === 'delivered' ? '#15803d' : 'var(--color-berry)',
                color: '#ffffff',
                borderColor: activeDestination.status === 'delivered' ? '#15803d' : 'var(--color-berry)',
                padding: '0.85rem 1.8rem',
                fontSize: '1rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '4px 4px 0px var(--color-cocoa)',
                cursor: isDispatching ? 'not-allowed' : 'pointer',
                opacity: isDispatching ? 0.8 : 1
              }}
            >
              <Send size={16} />
              <span>
                {isDispatching
                  ? 'Flying Route Across Roofs...'
                  : activeDestination.status === 'delivered'
                    ? 'Redeliver Slumber Vial ✦'
                    : 'Dispatch Slumber to Bedroom'}
              </span>
            </button>

            <button
              onClick={() => soundEngine.playMusicBoxNote(activeDestination.frequency, 1.5)}
              className="retro-btn"
              style={{
                padding: '0.85rem 1.25rem',
                fontSize: '0.85rem',
                backgroundColor: 'var(--bg-retro-panel)',
                color: 'var(--text-main)'
              }}
              title="Resonate sector harmonic tone"
            >
              <Volume2 size={15} color="var(--color-gold)" style={{ marginRight: '6px' }} />
              <span className="font-mono">{activeDestination.freqLabel}</span>
            </button>
          </div>
        </div>

        {/* Right: Waypoint Selector Strip & All Sectors List */}
        <div
          className="retro-panel"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1.5px solid var(--border-color)',
            borderRadius: '20px',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-soft)'
          }}
        >
          <div
            className="font-mono"
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-heading)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>ROUTE WAYPOINTS // ALL SECTORS</span>
            <span style={{ color: 'var(--color-gold)' }}>
              {isAllDelivered ? '★ ALL CLEAR' : `${deliveredCount}/6`}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {destinations.map((dest, i) => {
              const isSelected = selectedIdx === i;
              const isDelivered = dest.status === 'delivered';
              return (
                <div
                  key={dest.id}
                  onClick={() => onSelectDestination(i)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    backgroundColor: isSelected
                      ? 'rgba(255, 216, 138, 0.16)'
                      : 'var(--bg-retro-panel)',
                    border: isSelected
                      ? '1.5px solid var(--color-gold)'
                      : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onSelectDestination(i);
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: isDelivered ? '#15803d' : isSelected ? 'var(--color-berry)' : '#4a3853',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}
                    >
                      {isDelivered ? '✓' : dest.id}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-heading)' }}>
                        {dest.name}
                      </div>
                      <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {dest.resident}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: '0.68rem',
                        color: isDelivered ? '#15803d' : 'var(--text-muted)'
                      }}
                    >
                      {isDelivered ? 'DELIVERED' : 'PENDING'}
                    </span>
                    <ChevronRight size={14} color={isSelected ? 'var(--color-gold)' : 'var(--text-muted)'} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
