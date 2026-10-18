import React, { useState, useEffect, useCallback } from 'react';
import { Music, Play, Sliders } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';

interface NoteKey {
  label: string;
  note: string;
  key: string;
  freq: number;
  color: string;
}

const BASE_NOTES: NoteKey[] = [
  { label: 'C5', note: 'Do (Cloud)', key: '1', freq: 523.25, color: '#ffd88a' },
  { label: 'D5', note: 'Re (Starlight)', key: '2', freq: 587.33, color: '#ffb3ba' },
  { label: 'E5', note: 'Mi (Velvet)', key: '3', freq: 659.25, color: '#bae1ff' },
  { label: 'G5', note: 'Sol (Slumber)', key: '4', freq: 783.99, color: '#baffc9' },
  { label: 'A5', note: 'La (Whisper)', key: '5', freq: 880.00, color: '#e8dff5' },
  { label: 'C6', note: 'Do High (Dawn)', key: '6', freq: 1046.50, color: '#fcf6bd' }
];

export const LullabyLab: React.FC = () => {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [melodyHistory, setMelodyHistory] = useState<string[]>([]);
  const [isPlayingMelody, setIsPlayingMelody] = useState(false);
  const [frequencyRegister, setFrequencyRegister] = useState<'432Hz' | '528Hz'>('432Hz');
  const [acousticRipple, setAcousticRipple] = useState(false);

  const multiplier = frequencyRegister === '432Hz' ? 1 : 1.22;

  const handlePlayNote = useCallback(
    (noteKey: NoteKey) => {
      setActiveNote(noteKey.label);
      const targetFreq = noteKey.freq * multiplier;
      soundEngine.playMusicBoxNote(targetFreq, 1.3);
      setMelodyHistory((prev) => [...prev.slice(-7), noteKey.label]);
      setAcousticRipple(true);

      setTimeout(() => {
        setActiveNote((curr) => (curr === noteKey.label ? null : curr));
      }, 320);

      setTimeout(() => {
        setAcousticRipple(false);
      }, 700);
    },
    [multiplier]
  );

  // Keyboard shortcut listener (1-6 keys for chimes)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement).tagName.toLowerCase())) return;
      const matched = BASE_NOTES.find((n) => n.key === e.key);
      if (matched) {
        handlePlayNote(matched);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
  }, [handlePlayNote]);

  const handlePlaySleepyMelody = () => {
    if (isPlayingMelody) return;
    setIsPlayingMelody(true);

    const sequence = [
      { note: BASE_NOTES[0], delay: 0 },
      { note: BASE_NOTES[2], delay: 420 },
      { note: BASE_NOTES[3], delay: 840 },
      { note: BASE_NOTES[2], delay: 1260 },
      { note: BASE_NOTES[4], delay: 1680 },
      { note: BASE_NOTES[3], delay: 2100 },
      { note: BASE_NOTES[5], delay: 2600 }
    ];

    sequence.forEach(({ note, delay }) => {
      setTimeout(() => {
        handlePlayNote(note);
      }, delay);
    });

    setTimeout(() => {
      setIsPlayingMelody(false);
    }, 3300);
  };

  const toggleRegister = () => {
    const next = frequencyRegister === '432Hz' ? '528Hz' : '432Hz';
    setFrequencyRegister(next);
    soundEngine.playClick(next === '432Hz' ? 432 : 528);
  };

  return (
    <div
      id="lullaby-lab"
      className="lullaby-exhibit-workbench"
      style={{
        position: 'relative',
        background: 'var(--bg-surface)',
        borderRadius: '24px',
        border: '1.5px solid var(--border-color)',
        boxShadow: 'var(--shadow-soft)',
        padding: '2.5rem',
        overflow: 'hidden'
      }}
    >
      {/* Background warm acoustic grain */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 216, 138, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Left Stage: Large Official Music Box Centerpiece & Acoustic Ripple */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          {/* Animated concentric soundwave ripples */}
          <div
            className={`lullaby-ripple ${acousticRipple ? 'ripple-active' : ''}`}
            aria-hidden="true"
          />

          <div
            className="lullaby-box-holder"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '310px',
              aspectRatio: '1 / 1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            onClick={() => handlePlayNote(BASE_NOTES[0])}
            title="Click Pip's Lullaby Box to strike a chime"
          >
            <img
              src="/assets/pip_lullaby_box.png"
              alt="Pip's hand-crafted Lullaby Box instrument"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: acousticRipple
                  ? 'drop-shadow(0 0 28px rgba(255, 216, 138, 0.9)) drop-shadow(0 15px 25px rgba(92, 64, 51, 0.2))'
                  : 'drop-shadow(0 12px 24px rgba(92, 64, 51, 0.15))',
                transform: activeNote ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            />
          </div>

          {/* Harmonic Register Switch pill */}
          <div
            style={{
              marginTop: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}
          >
            <button
              onClick={toggleRegister}
              className="retro-btn"
              style={{
                padding: '0.45rem 1rem',
                fontSize: '0.78rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'var(--bg-retro-panel)'
              }}
              title="Toggle between 432 Hz Natural Frequency and 528 Hz Slumber Miracle"
            >
              <Sliders size={13} color="var(--color-berry)" />
              <span className="font-mono">REGISTER: {frequencyRegister}</span>
            </button>
          </div>
        </div>

        {/* Right Stage: Interactive Chime Keyboard & Sequencer Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div
              className="font-mono"
              style={{
                fontSize: '0.74rem',
                color: 'var(--color-berry)',
                letterSpacing: '0.06em',
                marginBottom: '0.35rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              <Music size={13} />
              <span>EXHIBIT 01 // SOUND PROTOCOL</span>
            </div>
            <h3
              className="font-serif"
              style={{
                fontSize: 'clamp(1.7rem, 2.8vw, 2.2rem)',
                color: 'var(--text-heading)',
                margin: 0
              }}
            >
              Pip's Sleepy Music Box
            </h3>
            <p
              style={{
                fontSize: '0.94rem',
                color: 'var(--text-muted)',
                lineHeight: 1.55,
                marginTop: '0.5rem'
              }}
            >
              Tuned to soothing harmonic frequencies using the pure Web Audio API. Strike the brass
              chime tines below or play Pip's automated slumber lullaby.
            </p>
          </div>

          {/* Chime Tines Keyboard (Pentatonic Scale) */}
          <div
            role="region"
            aria-label="Lullaby chime keyboard"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.65rem'
            }}
          >
            {BASE_NOTES.map((n) => {
              const isSelected = activeNote === n.label;
              return (
                <button
                  key={n.label}
                  onClick={() => handlePlayNote(n)}
                  aria-label={`Play chime ${n.label} - ${n.note}`}
                  className={`chime-key-tile ${isSelected ? 'chime-active' : ''}`}
                  style={{
                    padding: '0.85rem 0.65rem',
                    borderRadius: '14px',
                    border: `1.5px solid ${isSelected ? 'var(--color-berry)' : 'var(--border-color)'}`,
                    backgroundColor: isSelected ? 'var(--color-gold)' : 'var(--bg-retro-panel)',
                    color: isSelected ? '#34221a' : 'var(--text-main)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.18s cubic-bezier(0.2, 0.8, 0.4, 1)',
                    boxShadow: isSelected
                      ? '0 0 16px rgba(255, 216, 138, 0.9)'
                      : '2px 2px 0px var(--border-color)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <span className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                    {n.label}
                  </span>
                  <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>{n.note.split(' ')[0]}</span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.65rem',
                      opacity: 0.6,
                      marginTop: '0.15rem'
                    }}
                  >
                    [{n.key}]
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sequencer Action Buttons & Play History Tape */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
              paddingTop: '0.5rem',
              borderTop: '1px solid var(--border-color)'
            }}
          >
            <button
              onClick={handlePlaySleepyMelody}
              disabled={isPlayingMelody}
              className="retro-btn"
              style={{
                backgroundColor: 'var(--color-berry)',
                color: '#ffffff',
                borderColor: 'var(--color-berry)',
                boxShadow: '3px 3px 0px var(--color-cocoa)',
                padding: '0.65rem 1.35rem',
                fontSize: '0.88rem',
                opacity: isPlayingMelody ? 0.75 : 1
              }}
            >
              <Play size={14} fill="currentColor" />
              <span>{isPlayingMelody ? 'Playing Lullaby...' : "Play Pip's Lullaby"}</span>
            </button>

            {/* Note Tape History */}
            <div
              className="font-mono"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.74rem',
                color: 'var(--text-muted)'
              }}
            >
              <span style={{ opacity: 0.7 }}>HISTORY:</span>
              {melodyHistory.length === 0 ? (
                <span style={{ fontStyle: 'italic', opacity: 0.5 }}>awaiting notes</span>
              ) : (
                melodyHistory.map((note, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      backgroundColor: 'var(--bg-retro-panel)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--color-berry)',
                      fontWeight: 600
                    }}
                  >
                    {note}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
