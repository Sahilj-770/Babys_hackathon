import React, { useState } from 'react';
import { Music, Play, RotateCcw, Volume2 } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';

interface NoteKey {
  label: string;
  note: string;
  freq: number;
  color: string;
}

const BASE_NOTES: NoteKey[] = [
  { label: 'C5', note: 'Do (Cloud)', freq: 523.25, color: '#ffd88a' },
  { label: 'D5', note: 'Re (Starlight)', freq: 587.33, color: '#ffb3ba' },
  { label: 'E5', note: 'Mi (Velvet)', freq: 659.25, color: '#bae1ff' },
  { label: 'G5', note: 'Sol (Slumber)', freq: 783.99, color: '#baffc9' },
  { label: 'A5', note: 'La (Whisper)', freq: 880.00, color: '#e8dff5' },
  { label: 'C6', note: 'Do High (Dawn)', freq: 1046.50, color: '#fcf6bd' }
];

export const LullabyLab: React.FC = () => {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [melodyHistory, setMelodyHistory] = useState<string[]>([]);
  const [isPlayingMelody, setIsPlayingMelody] = useState(false);
  const [octaveMultiplier, setOctaveMultiplier] = useState<number>(1); // 1 = standard, 0.5 = deep slumber

  const handlePlayNote = (noteKey: NoteKey) => {
    setActiveNote(noteKey.label);
    const targetFreq = noteKey.freq * octaveMultiplier;
    soundEngine.playMusicBoxNote(targetFreq, 1.2);
    setMelodyHistory((prev) => [...prev.slice(-7), noteKey.label]);

    setTimeout(() => {
      setActiveNote((curr) => (curr === noteKey.label ? null : curr));
    }, 280);
  };

  const handlePlaySleepyMelody = () => {
    if (isPlayingMelody) return;
    setIsPlayingMelody(true);

    const sequence = [
      { note: BASE_NOTES[0], delay: 0 },
      { note: BASE_NOTES[2], delay: 400 },
      { note: BASE_NOTES[3], delay: 800 },
      { note: BASE_NOTES[2], delay: 1200 },
      { note: BASE_NOTES[4], delay: 1600 },
      { note: BASE_NOTES[3], delay: 2000 },
      { note: BASE_NOTES[5], delay: 2500 }
    ];

    sequence.forEach(({ note, delay }) => {
      setTimeout(() => {
        handlePlayNote(note);
      }, delay);
    });

    setTimeout(() => {
      setIsPlayingMelody(false);
    }, 3200);
  };

  const handleClear = () => {
    soundEngine.playClick(300);
    setMelodyHistory([]);
  };

  const toggleOctave = () => {
    const next = octaveMultiplier === 1 ? 0.75 : 1;
    setOctaveMultiplier(next);
    soundEngine.playClick(next === 1 ? 600 : 400);
  };

  return (
    <div className="retro-window">
      <div className="retro-window-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Music size={14} color="var(--color-berry)" />
          <span>EXHIBIT 01: LULLABY_LAB.EXE [SYNTHESIZER]</span>
        </div>
        <span style={{ color: 'var(--color-berry)' }}>WEB_AUDIO API</span>
      </div>

      <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Exhibit Header with official asset badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '16px',
              backgroundColor: 'var(--bg-retro-panel)',
              border: '1.5px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0
            }}
          >
            <img
              src="/assets/pip_lullaby_box.png"
              alt="Pip's hand-crafted Lullaby Box instrument"
              style={{ width: '80%', height: '80%', objectFit: 'contain' }}
            />
          </div>

          <div style={{ flex: 1, minWidth: '220px' }}>
            <h3 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--text-heading)' }}>
              Pip's Sleepy Music Box
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Interactive chime resonator created by Pip to soothe restless midnight dreamers.
              Click the keys to synthesize pure sine-tone dream waves.
            </p>
          </div>

          {/* Tone register toggle */}
          <button
            onClick={toggleOctave}
            className="retro-btn"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.7rem' }}
            title="Toggle between Crystalline Bell and Deep Slumber register"
          >
            <Volume2 size={13} />
            <span>{octaveMultiplier === 1 ? 'Crystal 432Hz' : 'Deep REM Tone'}</span>
          </button>
        </div>

        {/* Music Box Interactive Tines / Keys */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(75px, 1fr))',
            gap: '0.65rem'
          }}
        >
          {BASE_NOTES.map((n) => {
            const isPressed = activeNote === n.label;
            return (
              <button
                key={n.label}
                onClick={() => handlePlayNote(n)}
                aria-label={`Play chime ${n.label} - ${n.note}`}
                className={isPressed ? 'chime-active' : ''}
                style={{
                  background: isPressed ? n.color : 'var(--bg-surface)',
                  border: `2px solid ${isPressed ? 'var(--color-berry)' : 'var(--border-color)'}`,
                  borderRadius: '12px',
                  padding: '1.25rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  transform: isPressed ? 'translateY(4px)' : 'translateY(0)',
                  boxShadow: isPressed ? 'none' : '0 4px 0 var(--border-color)',
                  transition: 'all 0.1s ease'
                }}
              >
                <span
                  className="font-mono"
                  style={{
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: 'var(--text-heading)'
                  }}
                >
                  {n.label}
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {n.note.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Melody Readout & Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--bg-retro-panel)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <span className="font-mono" style={{ color: 'var(--text-muted)' }}>MELODY STREAM:</span>
            <span className="font-mono" style={{ fontWeight: 700, color: 'var(--color-berry)' }}>
              {melodyHistory.length > 0 ? melodyHistory.join(' - ') : '[PRESS KEYS ABOVE]'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handlePlaySleepyMelody}
              disabled={isPlayingMelody}
              className="retro-btn"
              style={{
                fontSize: '0.8rem',
                padding: '0.35rem 0.75rem',
                backgroundColor: isPlayingMelody ? 'var(--bg-surface)' : 'var(--color-berry)',
                color: isPlayingMelody ? 'var(--text-muted)' : '#ffffff'
              }}
            >
              <Play size={13} fill="currentColor" />
              <span>{isPlayingMelody ? 'Playing...' : 'Play Pip\'s Lullaby'}</span>
            </button>

            {melodyHistory.length > 0 && (
              <button
                onClick={handleClear}
                className="retro-btn"
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.55rem' }}
                title="Clear Notes"
              >
                <RotateCcw size={13} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
