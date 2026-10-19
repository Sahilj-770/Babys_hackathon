import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  RotateCcw,
  Volume2
} from 'lucide-react';
import type { Destination } from '../../types/atlas';
import { soundEngine } from '../../audio/soundEngine';

export interface AtlasMobileViewProps {
  destinations: Destination[];
  selectedIdx: number;
  flightProgress: number;
  isDispatching: boolean;
  pipPosition: { x: number; y: number };
  onSelectDestination: (index: number) => void;
  onDispatchDream: () => void;
  onResetRoute: () => void;
}

export const AtlasMobileView: React.FC<AtlasMobileViewProps> = ({
  destinations,
  selectedIdx,
  flightProgress,
  isDispatching,
  onSelectDestination,
  onDispatchDream,
  onResetRoute
}) => {
  const activeDestination = destinations[selectedIdx];
  const deliveredCount = destinations.filter((d) => d.status === 'delivered').length;
  const isAllDelivered = deliveredCount === destinations.length;

  return (
    <div
      className="atlas-mobile-fieldbook"
      style={{
        maxWidth: '540px',
        margin: '0 auto',
        padding: '0 0.5rem',
        position: 'relative',
        zIndex: 1
      }}
    >
      {/* 1. Mobile Utility Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          gap: '0.5rem'
        }}
      >
        <Link
          to="/"
          onClick={() => soundEngine.playClick(440)}
          className="retro-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.85rem',
            fontSize: '0.8rem',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: '#ffd88a',
            textDecoration: 'none',
            borderColor: 'rgba(255, 216, 138, 0.4)'
          }}
        >
          <ArrowLeft size={14} />
          <span>Nursery</span>
        </Link>

        {/* Route status badge & Reset button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            className="font-mono"
            style={{
              fontSize: '0.72rem',
              color: '#ffd88a',
              backgroundColor: 'rgba(255, 216, 138, 0.12)',
              border: '1px solid rgba(255, 216, 138, 0.3)',
              borderRadius: '999px',
              padding: '0.3rem 0.65rem',
              fontWeight: 700
            }}
          >
            ✦ {deliveredCount}/{destinations.length} DELIVERED
          </span>

          <button
            onClick={onResetRoute}
            className="retro-btn"
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.72rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#ffb3ba',
              borderColor: 'rgba(255, 179, 186, 0.3)'
            }}
            title="Reset route"
            aria-label="Reset delivery route"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* 2. Pocket Fieldbook Header with Courier Identity */}
      <div
        className="retro-panel"
        style={{
          backgroundColor: 'rgba(12, 9, 29, 0.9)',
          border: '1.5px solid rgba(255, 216, 138, 0.35)',
          borderRadius: '16px',
          padding: '1.25rem',
          marginBottom: '1.25rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <img
            src="/assets/pip_portrait.png"
            alt="Pip with nightcap"
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #ffd88a',
              background: '#1b123d',
              flexShrink: 0
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              className="font-mono"
              style={{
                fontSize: '0.68rem',
                color: '#ffd88a',
                letterSpacing: '0.12em',
                marginBottom: '0.2rem'
              }}
            >
              PIP'S NOCTURNAL FIELDBOOK
            </div>
            <h1
              className="font-serif"
              style={{
                fontSize: '1.6rem',
                color: '#fff8f1',
                margin: '0 0 0.2rem 0',
                lineHeight: 1.15
              }}
            >
              The Pocket Atlas
            </h1>
            <p style={{ fontSize: '0.8rem', color: '#c4b5fd', margin: 0, lineHeight: 1.4 }}>
              Tap a stop to inspect resident, then tap Dispatch Pip to fly across the rooftops.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Illustrated Pocket Constellation Map (Horizontal Thumbnail) */}
      <div
        style={{
          position: 'relative',
          height: '130px',
          borderRadius: '16px',
          backgroundColor: '#040616',
          border: '1.5px solid rgba(255, 216, 138, 0.3)',
          overflow: 'hidden',
          marginBottom: '1.25rem',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Full Moon */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '18px',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #fffdf0, #ffd88a 55%, #d4a34b)',
            boxShadow: '0 0 20px rgba(255, 216, 138, 0.7)',
            pointerEvents: 'none'
          }}
        />

        <svg viewBox="0 0 360 130" style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
          <defs>
            <linearGradient id="pocket-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffd88a" />
              <stop offset="50%" stopColor="#ffb3ba" />
              <stop offset="100%" stopColor="#86efac" />
            </linearGradient>
          </defs>

          {/* Rooftop Silhouettes */}
          <path
            d="M0 130 L0 100 L30 85 L60 100 L90 88 L120 105 L150 75 L180 105 L210 90 L240 105 L270 82 L300 105 L330 92 L360 102 L360 130 Z"
            fill="#090b20"
          />
          <path
            d="M0 130 L0 110 L25 98 L50 110 L80 102 L110 115 L140 92 L170 115 L200 104 L230 116 L265 96 L295 116 L325 106 L360 114 L360 130 Z"
            fill="#040614"
          />

          {/* Mini Route Path */}
          <path
            d="M 30 85 Q 90 40, 150 75 T 270 82 T 330 92"
            fill="none"
            stroke="url(#pocket-grad)"
            strokeWidth="2.5"
            strokeDasharray="4 4"
            opacity="0.85"
          />

          {/* Node Stars */}
          {destinations.map((d, i) => {
            // Map coordinates into 360x130 viewBox
            const cx = 30 + i * 60;
            const cy = 80 - Math.sin((i / 5) * Math.PI) * 35;
            const isSelected = selectedIdx === i;
            const isDelivered = d.status === 'delivered';

            return (
              <g key={d.id} onClick={() => onSelectDestination(i)} style={{ cursor: 'pointer' }}>
                {isSelected && (
                  <circle cx={cx} cy={cy} r="11" fill="none" stroke="#ffd88a" strokeWidth="1.5" strokeDasharray="2 2" />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r="7"
                  fill={isDelivered ? '#15803d' : isSelected ? '#581c87' : '#1e1b4b'}
                  stroke={isDelivered ? '#86efac' : isSelected ? '#ffd88a' : '#c4b5fd'}
                  strokeWidth="2"
                />
                <text x={cx} y={cy + 3} textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">
                  {isDelivered ? '✓' : d.id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Current Sector Pill Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '12px',
            fontSize: '0.72rem',
            color: '#ffd88a',
            fontFamily: 'monospace',
            backgroundColor: 'rgba(6, 4, 18, 0.75)',
            padding: '0.2rem 0.55rem',
            borderRadius: '6px'
          }}
        >
          STOP {selectedIdx + 1}: {activeDestination.name} · {Math.round(flightProgress)}% FLIGHT
        </div>
      </div>

      {/* 4. Active Destination Dispatch Focus Card */}
      <div
        className="retro-panel"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '2px solid var(--color-gold)',
          borderRadius: '18px',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-soft)',
          marginBottom: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--color-berry)' }}>
            SECTOR 0{activeDestination.id} // ACTIVE DWELLING
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: '0.7rem',
              padding: '0.2rem 0.55rem',
              borderRadius: '999px',
              backgroundColor: activeDestination.status === 'delivered' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(255, 216, 138, 0.15)',
              color: activeDestination.status === 'delivered' ? '#15803d' : 'var(--color-gold)',
              border: activeDestination.status === 'delivered' ? '1px solid rgba(74, 222, 128, 0.4)' : '1px solid rgba(255, 216, 138, 0.4)'
            }}
          >
            {activeDestination.status === 'delivered' ? '✦ DELIVERED' : '○ PENDING'}
          </span>
        </div>

        <h2
          className="font-serif"
          style={{
            fontSize: '1.5rem',
            color: 'var(--text-heading)',
            margin: '0 0 0.25rem 0',
            lineHeight: 1.2
          }}
        >
          {activeDestination.name}
        </h2>

        <div style={{ fontSize: '0.88rem', color: 'var(--color-berry)', fontWeight: 600, marginBottom: '0.65rem' }}>
          Resident: {activeDestination.resident}
        </div>

        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-main)',
            lineHeight: 1.55,
            backgroundColor: 'var(--bg-retro-panel)',
            padding: '0.75rem 0.9rem',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            margin: '0 0 1rem 0'
          }}
        >
          {activeDestination.description}
        </p>

        {/* Primary Mobile Dispatch Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <button
            onClick={onDispatchDream}
            disabled={isDispatching}
            className="retro-btn"
            style={{
              backgroundColor: activeDestination.status === 'delivered' ? '#15803d' : 'var(--color-berry)',
              color: '#ffffff',
              borderColor: activeDestination.status === 'delivered' ? '#15803d' : 'var(--color-berry)',
              padding: '0.9rem',
              fontSize: '0.96rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '3px 3px 0px var(--color-cocoa)',
              cursor: isDispatching ? 'not-allowed' : 'pointer',
              opacity: isDispatching ? 0.8 : 1,
              width: '100%'
            }}
          >
            <Send size={16} />
            <span>
              {isDispatching
                ? 'Flying Across Rooftops...'
                : activeDestination.status === 'delivered'
                  ? 'Redeliver Slumber Vial ✦'
                  : 'Dispatch Slumber to Bedroom'}
            </span>
          </button>

          <button
            onClick={() => soundEngine.playMusicBoxNote(activeDestination.frequency, 1.4)}
            className="retro-btn"
            style={{
              padding: '0.65rem',
              fontSize: '0.78rem',
              backgroundColor: 'var(--bg-retro-panel)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              width: '100%'
            }}
            title="Play bedtime harmonic tone"
          >
            <Volume2 size={13} color="var(--color-gold)" />
            <span className="font-mono">{activeDestination.freqLabel}</span>
          </button>
        </div>
      </div>

      {/* 5. The Vertical Pocket Dream-Path Journey */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div
          className="font-mono"
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-heading)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            marginBottom: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>ALL 6 NOCTURNAL SECTORS</span>
          <span style={{ color: 'var(--color-gold)' }}>
            {isAllDelivered ? '★ COMPLETED' : `${deliveredCount}/6`}
          </span>
        </div>

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Vertical Connecting Line */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '20px',
              bottom: '20px',
              left: '20px',
              width: '3px',
              background: 'linear-gradient(180deg, #ffd88a 0%, #ffb3ba 50%, #c4b5fd 100%)',
              opacity: 0.4,
              zIndex: 0
            }}
          />

          {destinations.map((dest, i) => {
            const isSelected = selectedIdx === i;
            const isDelivered = dest.status === 'delivered';

            return (
              <div
                key={dest.id}
                onClick={() => onSelectDestination(i)}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '14px',
                  backgroundColor: isSelected
                    ? '#fffdf5'
                    : 'var(--bg-surface)',
                  border: isSelected
                    ? '2px solid #b45309'
                    : '1px solid var(--border-color)',
                  boxShadow: isSelected ? '0 4px 18px rgba(245, 158, 11, 0.25)' : 'var(--shadow-soft)',
                  cursor: 'pointer',
                  minHeight: '56px',
                  touchAction: 'manipulation'
                }}
                role="button"
                tabIndex={0}
                aria-label={`Select Stop ${dest.id}: ${dest.name}, ${dest.resident}, status ${dest.status}`}
              >
                {/* Node Target Circle */}
                <span
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: isDelivered ? '#15803d' : isSelected ? 'var(--color-berry)' : '#2b2144',
                    color: '#ffffff',
                    border: isSelected ? '2px solid var(--color-gold)' : '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    flexShrink: 0
                  }}
                >
                  {isDelivered ? '✓' : dest.id}
                </span>

                {/* Stop Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '0.92rem',
                        color: 'var(--text-heading)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {dest.name}
                    </span>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: '0.66rem',
                        color: isDelivered ? '#15803d' : 'var(--text-muted)',
                        flexShrink: 0
                      }}
                    >
                      {isDelivered ? 'DELIVERED' : 'PENDING'}
                    </span>
                  </div>
                  <div className="font-mono" style={{ fontSize: '0.74rem', color: 'var(--color-berry)' }}>
                    {dest.resident} · “{dest.dreamType.split('&')[0]}”
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
