import React, { useEffect, useState } from 'react';
import { X, Sparkles, Lock, Check, RotateCcw, Volume2, Compass } from 'lucide-react';
import {
  STAR_FRAGMENTS,
  getPassportData,
  resetPassport,
  PASSPORT_EVENT_NAME,
  type StarFragmentId,
  type ConstellationPassportData
} from '../utils/passportStorage';
import { soundEngine } from '../audio/soundEngine';

interface ConstellationPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConstellationPassportModal: React.FC<ConstellationPassportModalProps> = ({
  isOpen,
  onClose
}) => {
  const [passport, setPassport] = useState<ConstellationPassportData>(() => getPassportData());
  const [selectedFragmentId, setSelectedFragmentId] = useState<StarFragmentId>('lullaby');

  // Synchronize on custom events
  useEffect(() => {
    const handleUpdate = () => {
      setPassport(getPassportData());
    };

    window.addEventListener(PASSPORT_EVENT_NAME, handleUpdate);
    return () => window.removeEventListener(PASSPORT_EVENT_NAME, handleUpdate);
  }, []);

  // Keyboard accessibility: Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unlockedCount = passport.unlockedFragmentIds.length;
  const isAllCompleted = unlockedCount === 4;

  const fragmentsList = Object.values(STAR_FRAGMENTS);
  const activeFragment = STAR_FRAGMENTS[selectedFragmentId];
  const isActiveUnlocked = passport.unlockedFragmentIds.includes(selectedFragmentId);

  const handlePlayConstellationChime = () => {
    soundEngine.playCelebrationChime();
    setTimeout(() => soundEngine.playMusicBoxNote(523.25, 2.0), 300);
    setTimeout(() => soundEngine.playMusicBoxNote(659.25, 2.0), 600);
    setTimeout(() => soundEngine.playMusicBoxNote(783.99, 2.5), 900);
  };

  const handleReset = () => {
    if (window.confirm('Reset your collected constellation fragments for a fresh journey?')) {
      resetPassport();
      soundEngine.playClick(320);
    }
  };

  return (
    <div
      className="dream-modal-backdrop"
      onClick={onClose}
      role="presentation"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(26, 17, 39, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem'
      }}
    >
      <div
        className="retro-panel passport-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="passport-modal-title"
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--color-gold)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 40px rgba(255, 216, 138, 0.25)',
          padding: '1.75rem',
          position: 'relative',
          borderRadius: '16px'
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1.5px dashed var(--border-color)',
            paddingBottom: '1rem',
            marginBottom: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                fontSize: '1.4rem',
                color: 'var(--color-gold)',
                textShadow: '0 0 10px rgba(255, 216, 138, 0.6)'
              }}
            >
              ✦
            </span>
            <div>
              <h2
                id="passport-modal-title"
                className="font-serif"
                style={{
                  fontSize: '1.35rem',
                  margin: 0,
                  color: 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                Constellation Passport
                <span
                  className="font-mono"
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.2rem 0.55rem',
                    backgroundColor: isAllCompleted ? 'var(--color-gold)' : 'var(--bg-main)',
                    color: isAllCompleted ? '#3b2512' : 'var(--text-muted)',
                    borderRadius: '999px',
                    fontWeight: 'bold',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  {unlockedCount}/4 STARS
                </span>
              </h2>
              <p
                style={{
                  margin: '0.2rem 0 0',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)'
                }}
              >
                Explore Pip’s nursery world to reunite the ancient bedtime constellation.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="retro-btn"
            style={{
              padding: '0.45rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--bg-main)'
            }}
            aria-label="Close Constellation Passport"
          >
            <X size={18} />
          </button>
        </div>

        {/* Constellation Celestial Chart SVG */}
        <div
          className="constellation-chart-wrapper"
          style={{
            backgroundColor: '#161026',
            borderRadius: '12px',
            padding: '1rem',
            position: 'relative',
            border: '1.5px solid rgba(255, 216, 138, 0.25)',
            marginBottom: '1.5rem',
            overflow: 'hidden'
          }}
        >
          {/* Subtle star dust background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 216, 138, 0.08) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <svg
            viewBox="0 0 600 240"
            style={{ width: '100%', height: 'auto', display: 'block' }}
            aria-label="Celestial Constellation Map"
          >
            <defs>
              <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Connecting Constellation Lines */}
            {/* Lullaby (120, 150) -> Rooftop (300, 50) */}
            <line
              x1="120"
              y1="150"
              x2="300"
              y2="50"
              stroke={
                passport.unlockedFragmentIds.includes('lullaby') &&
                passport.unlockedFragmentIds.includes('rooftop')
                  ? '#ffd88a'
                  : 'rgba(255, 255, 255, 0.15)'
              }
              strokeWidth={
                passport.unlockedFragmentIds.includes('lullaby') &&
                passport.unlockedFragmentIds.includes('rooftop')
                  ? '2.5'
                  : '1.5'
              }
              strokeDasharray={
                passport.unlockedFragmentIds.includes('lullaby') &&
                passport.unlockedFragmentIds.includes('rooftop')
                  ? 'none'
                  : '4 4'
              }
              filter={
                passport.unlockedFragmentIds.includes('lullaby') &&
                passport.unlockedFragmentIds.includes('rooftop')
                  ? 'url(#glow-gold)'
                  : undefined
              }
            />

            {/* Rooftop (300, 50) -> Story (480, 150) */}
            <line
              x1="300"
              y1="50"
              x2="480"
              y2="150"
              stroke={
                passport.unlockedFragmentIds.includes('rooftop') &&
                passport.unlockedFragmentIds.includes('story')
                  ? '#ffd88a'
                  : 'rgba(255, 255, 255, 0.15)'
              }
              strokeWidth={
                passport.unlockedFragmentIds.includes('rooftop') &&
                passport.unlockedFragmentIds.includes('story')
                  ? '2.5'
                  : '1.5'
              }
              strokeDasharray={
                passport.unlockedFragmentIds.includes('rooftop') &&
                passport.unlockedFragmentIds.includes('story')
                  ? 'none'
                  : '4 4'
              }
              filter={
                passport.unlockedFragmentIds.includes('rooftop') &&
                passport.unlockedFragmentIds.includes('story')
                  ? 'url(#glow-gold)'
                  : undefined
              }
            />

            {/* Story (480, 150) -> Dream (300, 195) */}
            <line
              x1="480"
              y1="150"
              x2="300"
              y2="195"
              stroke={
                passport.unlockedFragmentIds.includes('story') &&
                passport.unlockedFragmentIds.includes('dream')
                  ? '#ffd88a'
                  : 'rgba(255, 255, 255, 0.15)'
              }
              strokeWidth={
                passport.unlockedFragmentIds.includes('story') &&
                passport.unlockedFragmentIds.includes('dream')
                  ? '2.5'
                  : '1.5'
              }
              strokeDasharray={
                passport.unlockedFragmentIds.includes('story') &&
                passport.unlockedFragmentIds.includes('dream')
                  ? 'none'
                  : '4 4'
              }
              filter={
                passport.unlockedFragmentIds.includes('story') &&
                passport.unlockedFragmentIds.includes('dream')
                  ? 'url(#glow-gold)'
                  : undefined
              }
            />

            {/* Dream (300, 195) -> Lullaby (120, 150) */}
            <line
              x1="300"
              y1="195"
              x2="120"
              y2="150"
              stroke={
                passport.unlockedFragmentIds.includes('dream') &&
                passport.unlockedFragmentIds.includes('lullaby')
                  ? '#ffd88a'
                  : 'rgba(255, 255, 255, 0.15)'
              }
              strokeWidth={
                passport.unlockedFragmentIds.includes('dream') &&
                passport.unlockedFragmentIds.includes('lullaby')
                  ? '2.5'
                  : '1.5'
              }
              strokeDasharray={
                passport.unlockedFragmentIds.includes('dream') &&
                passport.unlockedFragmentIds.includes('lullaby')
                  ? 'none'
                  : '4 4'
              }
              filter={
                passport.unlockedFragmentIds.includes('dream') &&
                passport.unlockedFragmentIds.includes('lullaby')
                  ? 'url(#glow-gold)'
                  : undefined
              }
            />

            {/* Central harmonic diagonal cross: Rooftop to Dream */}
            <line
              x1="300"
              y1="50"
              x2="300"
              y2="195"
              stroke={
                isAllCompleted ? 'rgba(255, 216, 138, 0.7)' : 'rgba(255, 255, 255, 0.08)'
              }
              strokeWidth={isAllCompleted ? '1.5' : '1'}
              strokeDasharray="2 3"
            />

            {/* Constellation Nodes */}
            {[
              { id: 'lullaby', x: 120, y: 150, symbol: '✧', label: 'Lullaby' },
              { id: 'rooftop', x: 300, y: 50, symbol: '★', label: 'Rooftop' },
              { id: 'story', x: 480, y: 150, symbol: '✦', label: 'Story' },
              { id: 'dream', x: 300, y: 195, symbol: '✪', label: 'Dream' }
            ].map((node) => {
              const isUnlocked = passport.unlockedFragmentIds.includes(node.id as StarFragmentId);
              const isSelected = selectedFragmentId === node.id;

              return (
                <g
                  key={node.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedFragmentId(node.id as StarFragmentId);
                    soundEngine.playClick(isUnlocked ? 600 : 400);
                  }}
                >
                  {/* Outer selection ring */}
                  {isSelected && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="22"
                      fill="none"
                      stroke="#ffd88a"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Halo when unlocked */}
                  {isUnlocked && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="16"
                      fill="rgba(255, 216, 138, 0.25)"
                      filter="url(#glow-gold)"
                    />
                  )}

                  {/* Main Node circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="11"
                    fill={isUnlocked ? '#ffd88a' : '#231a38'}
                    stroke={isUnlocked ? '#ffffff' : 'rgba(255, 255, 255, 0.3)'}
                    strokeWidth="2"
                  />

                  {/* Glyph symbol inside */}
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fill={isUnlocked ? '#3b2512' : 'rgba(255, 255, 255, 0.5)'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {node.symbol}
                  </text>

                  {/* Label */}
                  <text
                    x={node.x}
                    y={node.y < 100 ? node.y - 15 : node.y + 24}
                    textAnchor="middle"
                    fill={isUnlocked ? '#ffd88a' : 'rgba(255, 255, 255, 0.45)'}
                    fontSize="9.5"
                    fontFamily="monospace"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Watermark of constellation name */}
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '12px',
              fontSize: '0.68rem',
              color: isAllCompleted ? '#ffd88a' : 'rgba(255, 255, 255, 0.3)',
              fontFamily: 'monospace'
            }}
          >
            {isAllCompleted ? '✦ URSA SOMNOLENS (AWAKENED)' : 'CHART: URSA SOMNOLENS [INCOMPLETE]'}
          </div>
        </div>

        {/* 4 Fragment Selection Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '0.65rem',
            marginBottom: '1.25rem'
          }}
        >
          {fragmentsList.map((frag) => {
            const isUnlocked = passport.unlockedFragmentIds.includes(frag.id);
            const isSelected = selectedFragmentId === frag.id;

            return (
              <button
                key={frag.id}
                onClick={() => {
                  setSelectedFragmentId(frag.id);
                  soundEngine.playClick(isUnlocked ? 560 : 420);
                }}
                className="retro-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 0.75rem',
                  backgroundColor: isSelected
                    ? isUnlocked
                      ? 'rgba(255, 216, 138, 0.2)'
                      : 'var(--bg-main)'
                    : 'transparent',
                  borderColor: isSelected
                    ? 'var(--color-gold)'
                    : isUnlocked
                      ? 'rgba(255, 216, 138, 0.4)'
                      : 'var(--border-color)',
                  textAlign: 'left'
                }}
              >
                <span
                  style={{
                    fontSize: '1.1rem',
                    color: isUnlocked ? 'var(--color-gold)' : 'var(--text-muted)'
                  }}
                >
                  {isUnlocked ? frag.symbol : <Lock size={13} />}
                </span>
                <div style={{ overflow: 'hidden' }}>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      color: isUnlocked ? 'var(--text-main)' : 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden'
                    }}
                  >
                    {frag.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.65rem',
                      color: isUnlocked ? 'var(--color-berry)' : 'var(--text-muted)'
                    }}
                  >
                    {isUnlocked ? 'Discovered' : 'Awaiting'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Fragment Detail Card */}
        <div
          style={{
            padding: '1.2rem',
            backgroundColor: 'var(--bg-main)',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            marginBottom: '1.25rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span
                style={{
                  fontSize: '1.5rem',
                  color: isActiveUnlocked ? 'var(--color-gold)' : 'var(--text-muted)'
                }}
              >
                {activeFragment.symbol}
              </span>
              <div>
                <h3
                  className="font-serif"
                  style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}
                >
                  {activeFragment.name}
                  <span
                    style={{
                      marginLeft: '0.5rem',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      fontWeight: 'normal',
                      color: 'var(--text-muted)'
                    }}
                  >
                    ({activeFragment.title})
                  </span>
                </h3>
              </div>
            </div>

            <div
              className="font-mono"
              style={{
                fontSize: '0.72rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                backgroundColor: isActiveUnlocked
                  ? 'rgba(46, 125, 50, 0.15)'
                  : 'rgba(255, 152, 0, 0.15)',
                color: isActiveUnlocked ? '#4caf50' : '#ff9800',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              {isActiveUnlocked ? (
                <>
                  <Check size={12} />
                  <span>UNLOCKED // {activeFragment.rune}</span>
                </>
              ) : (
                <>
                  <Lock size={12} />
                  <span>LOCKED // AWAITING DISCOVERY</span>
                </>
              )}
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: '0.5rem 0' }}>
            {isActiveUnlocked ? (
              <p style={{ margin: 0, lineHeight: 1.5 }}>{activeFragment.flavor}</p>
            ) : (
              <div
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'rgba(0,0,0,0.06)',
                  borderRadius: '6px',
                  fontStyle: 'italic',
                  color: 'var(--text-muted)'
                }}
              >
                <Compass size={14} style={{ display: 'inline', marginRight: '6px' }} />
                <span>Discovery Clue: </span>
                {activeFragment.hint}
              </div>
            )}
          </div>

          <div
            className="font-mono"
            style={{
              display: 'flex',
              gap: '1.25rem',
              marginTop: '0.75rem',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              flexWrap: 'wrap'
            }}
          >
            <span>LOCATION: {activeFragment.location}</span>
            <span>HARMONIC: {activeFragment.frequency}</span>
            {isActiveUnlocked && passport.unlockedTimestamps[activeFragment.id] && (
              <span>
                DISCOVERED:{' '}
                {new Date(passport.unlockedTimestamps[activeFragment.id]).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Master Blessing Banner (Unlocked when 4/4) */}
        {isAllCompleted ? (
          <div
            style={{
              padding: '1.35rem',
              background: 'linear-gradient(135deg, #2b1f3d 0%, #1c142b 100%)',
              border: '2px solid var(--color-gold)',
              borderRadius: '12px',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(255, 216, 138, 0.25)',
              marginBottom: '1.25rem',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Sparkles size={18} color="var(--color-gold)" />
              <span
                className="font-mono"
                style={{
                  fontSize: '0.75rem',
                  letterSpacing: '1px',
                  color: 'var(--color-gold)',
                  fontWeight: 'bold'
                }}
              >
                URSA SOMNOLENS COMPLETE // PIP’S BEDTIME BLESSING
              </span>
            </div>

            <p
              className="font-serif"
              style={{
                fontSize: '1rem',
                fontStyle: 'italic',
                lineHeight: 1.6,
                margin: '0.5rem 0',
                color: '#fff8f1'
              }}
            >
              &ldquo;You have gathered all four stars of the Midnight Nursery. May every room you
              enter feel safe, every evening feel calm, and every dream feel like coming home.&rdquo;
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginTop: '1rem'
              }}
            >
              <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-gold)' }}>
                — Pip the Skull Baby, Junior Dream Engineer (432 Hz)
              </span>

              <button
                onClick={handlePlayConstellationChime}
                className="retro-btn"
                style={{
                  backgroundColor: 'var(--color-gold)',
                  color: '#3b2512',
                  borderColor: '#ffffff',
                  padding: '0.45rem 0.95rem',
                  fontSize: '0.78rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Volume2 size={14} />
                <span>Play Star Hymn</span>
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: 'var(--bg-main)',
              borderRadius: '8px',
              border: '1px dashed var(--border-color)',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <Sparkles size={18} color="var(--color-gold)" />
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Find remaining <strong>{4 - unlockedCount}</strong> stars to awaken the ancient Sleeping
              Bear constellation and receive Pip’s bedtime blessing.
            </div>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1rem'
          }}
        >
          <button
            onClick={handleReset}
            className="retro-btn"
            style={{
              fontSize: '0.72rem',
              padding: '0.4rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: 'var(--text-muted)'
            }}
            title="Reset fragments to explore from the beginning"
          >
            <RotateCcw size={12} />
            <span>Reset Passport</span>
          </button>

          <button
            onClick={onClose}
            className="retro-btn"
            style={{
              backgroundColor: 'var(--color-berry)',
              color: '#ffffff',
              padding: '0.5rem 1.4rem',
              fontSize: '0.85rem'
            }}
          >
            Return to World
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConstellationPassportModal;
