import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Music, Play, Square, RotateCcw, Sliders, Sparkles, Disc } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';
import { unlockFragment } from '../../utils/passportStorage';

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

type TempoMode = 'sleepy' | 'dreamy' | 'starlight';

const TEMPOS: Record<TempoMode, { label: string; bpm: number; ms: number }> = {
  sleepy: { label: 'Sleepy (56 BPM)', bpm: 56, ms: 535 },
  dreamy: { label: 'Dreamy (72 BPM)', bpm: 72, ms: 416 },
  starlight: { label: 'Starlight (88 BPM)', bpm: 88, ms: 340 }
};

const PRESET_PATTERNS: Record<string, (number | null)[]> = {
  pipLullaby: [0, 2, 3, 2, 4, 3, 5, null],
  starlightChimney: [0, 3, 2, 5, 4, 2, 1, 3],
  velvetWaltz: [1, 2, 3, null, 4, 3, 2, 1]
};

export const LullabyLab: React.FC = () => {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [melodyHistory, setMelodyHistory] = useState<string[]>([]);
  const [frequencyRegister, setFrequencyRegister] = useState<'432Hz' | '528Hz'>('432Hz');
  const [acousticRipple, setAcousticRipple] = useState(false);

  // 8-step sequencer pattern: array of note indices (0..5) or null (rest)
  const [pattern, setPattern] = useState<(number | null)[]>(PRESET_PATTERNS.pipLullaby);
  const [isLooping, setIsLooping] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [tempo, setTempo] = useState<TempoMode>('dreamy');

  const sequencerTimerRef = useRef<number | null>(null);
  const currentStepRef = useRef<number>(0);
  const patternRef = useRef<(number | null)[]>(pattern);
  const isLoopingRef = useRef<boolean>(isLooping);

  // Keep refs in sync for the interval loop
  useEffect(() => {
    patternRef.current = pattern;
  }, [pattern]);

  useEffect(() => {
    isLoopingRef.current = isLooping;
  }, [isLooping]);

  const multiplier = frequencyRegister === '432Hz' ? 1 : 1.22;

  // Pure single-note playback
  const handlePlayNote = useCallback(
    (noteKey: NoteKey) => {
      setActiveNote(noteKey.label);
      const targetFreq = noteKey.freq * multiplier;
      soundEngine.playMusicBoxNote(targetFreq, 1.3);
      setMelodyHistory((prev) => [...prev.slice(-7), noteKey.label]);
      setAcousticRipple(true);
      unlockFragment('lullaby');

      setTimeout(() => {
        setActiveNote((curr) => (curr === noteKey.label ? null : curr));
      }, 300);

      setTimeout(() => {
        setAcousticRipple(false);
      }, 650);
    },
    [multiplier]
  );

  // Stop sequencer with full timer cleanup
  const stopSequencer = useCallback(() => {
    if (sequencerTimerRef.current !== null) {
      window.clearInterval(sequencerTimerRef.current);
      sequencerTimerRef.current = null;
    }
    setIsLooping(false);
    setCurrentStep(null);
    currentStepRef.current = 0;
  }, []);

  // Step tick execution
  const executeStep = useCallback(() => {
    const step = currentStepRef.current;
    setCurrentStep(step);

    const noteIdx = patternRef.current[step];
    if (noteIdx !== null && noteIdx >= 0 && noteIdx < BASE_NOTES.length) {
      const noteKey = BASE_NOTES[noteIdx];
      const targetFreq = noteKey.freq * multiplier;
      soundEngine.playMusicBoxNote(targetFreq, 1.2);
      setActiveNote(noteKey.label);
      setAcousticRipple(true);
      unlockFragment('lullaby');

      setTimeout(() => {
        setActiveNote((curr) => (curr === noteKey.label ? null : curr));
      }, 260);
      setTimeout(() => {
        setAcousticRipple(false);
      }, 550);
    }

    currentStepRef.current = (step + 1) % 8;
  }, [multiplier]);

  // Start sequencer loop
  const startSequencer = useCallback(() => {
    stopSequencer();
    setIsLooping(true);
    currentStepRef.current = 0;
    executeStep();

    const interval = TEMPOS[tempo].ms;
    sequencerTimerRef.current = window.setInterval(() => {
      executeStep();
    }, interval);
  }, [stopSequencer, executeStep, tempo]);

  // Toggle Play / Stop
  const handleToggleLoop = () => {
    if (isLooping) {
      soundEngine.playClick(360);
      stopSequencer();
    } else {
      soundEngine.playClick(560);
      startSequencer();
    }
  };

  // Change tempo dynamically during playback
  const handleSetTempo = (newTempo: TempoMode) => {
    soundEngine.playClick(440);
    setTempo(newTempo);
    if (isLooping) {
      if (sequencerTimerRef.current !== null) {
        window.clearInterval(sequencerTimerRef.current);
      }
      const interval = TEMPOS[newTempo].ms;
      sequencerTimerRef.current = window.setInterval(() => {
        executeStep();
      }, interval);
    }
  };

  // CRITICAL: Strict unmount timer cleanup
  useEffect(() => {
    return () => {
      if (sequencerTimerRef.current !== null) {
        window.clearInterval(sequencerTimerRef.current);
        sequencerTimerRef.current = null;
      }
    };
  }, []);

  // Keyboard shortcut listener (1-6 keys for chimes, Space for play/stop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea', 'select'].includes((e.target as HTMLElement).tagName.toLowerCase())) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (isLoopingRef.current) {
          stopSequencer();
        } else {
          startSequencer();
        }
        return;
      }

      const matched = BASE_NOTES.find((n) => n.key === e.key);
      if (matched) {
        handlePlayNote(matched);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayNote, startSequencer, stopSequencer]);

  // Step note cycling: click a step in the grid to cycle through notes or set rest
  const handleStepClick = (stepIndex: number) => {
    soundEngine.playClick(480);
    setPattern((prev) => {
      const next = [...prev];
      const current = next[stepIndex];
      if (current === null) {
        next[stepIndex] = 0; // C5
      } else if (current < BASE_NOTES.length - 1) {
        next[stepIndex] = current + 1;
      } else {
        next[stepIndex] = null; // Rest
      }
      return next;
    });
  };

  const handleApplyPreset = (presetKey: string) => {
    soundEngine.playClick(540);
    const selected = PRESET_PATTERNS[presetKey];
    if (selected) {
      setPattern(selected);
      if (isLooping) {
        currentStepRef.current = 0;
      }
    }
  };

  const handleClearPattern = () => {
    soundEngine.playClick(320);
    setPattern(new Array(8).fill(null));
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
        {/* Left Stage: Large Official Music Box Centerpiece & Real-Time Waveform */}
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
              maxWidth: '300px',
              aspectRatio: '1024 / 924',
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
                  ? 'drop-shadow(0 0 35px rgba(255, 216, 138, 0.95)) drop-shadow(0 15px 25px rgba(92, 64, 51, 0.2))'
                  : 'drop-shadow(0 15px 30px rgba(92, 64, 51, 0.15)) drop-shadow(0 0 20px rgba(255, 216, 138, 0.35))',
                transform: activeNote ? 'scale(1.03)' : 'scale(1)',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            />
          </div>

          {/* Real-time Starlight Harmonic Waveform Bars */}
          <div
            className="lullaby-waveform-container"
            aria-hidden="true"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '4px',
              height: '34px',
              marginTop: '1.25rem',
              padding: '4px 12px',
              backgroundColor: 'var(--bg-retro-panel)',
              borderRadius: '999px',
              border: '1px solid var(--border-color)'
            }}
          >
            {[18, 30, 22, 34, 26, 32, 20, 28, 16].map((h, i) => {
              const isPulsing = isLooping || acousticRipple;
              const scale = isPulsing ? 0.35 + Math.sin((currentStep ?? 0) + i) * 0.65 : 0.25;
              return (
                <span
                  key={i}
                  style={{
                    width: '3.5px',
                    height: `${Math.max(6, h * scale)}px`,
                    backgroundColor: isPulsing ? 'var(--color-gold)' : 'var(--border-color)',
                    borderRadius: '2px',
                    transition: 'height 0.15s ease-out, background-color 0.2s ease'
                  }}
                />
              );
            })}
          </div>

          {/* Harmonic Register Switch pill */}
          <div
            style={{
              marginTop: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}
          >
            <button
              onClick={toggleRegister}
              className="retro-btn"
              style={{
                padding: '0.4rem 0.95rem',
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

        {/* Right Stage: Interactive Chime Keyboard & 8-Step Sequencer Grid */}
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
              <span>EXHIBIT 01 // SOUND PROTOCOL & SEQUENCER</span>
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
                fontSize: '0.92rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                marginTop: '0.4rem'
              }}
            >
              Tuned to gentle 432 Hz harmonics. Strike the brass chimes, or compose a custom 8-step
              lullaby loop below.
            </p>
          </div>

          {/* Chime Tines Keyboard (Pentatonic Scale) */}
          <div
            role="region"
            aria-label="Lullaby chime keyboard"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.55rem'
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
                    padding: '0.75rem 0.5rem',
                    borderRadius: '12px',
                    border: `1.5px solid ${isSelected ? 'var(--color-berry)' : 'var(--border-color)'}`,
                    backgroundColor: isSelected ? 'var(--color-gold)' : 'var(--bg-retro-panel)',
                    color: isSelected ? '#34221a' : 'var(--text-main)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.2rem',
                    cursor: 'pointer',
                    transition: 'all 0.18s cubic-bezier(0.2, 0.8, 0.4, 1)',
                    boxShadow: isSelected
                      ? '0 0 16px rgba(255, 216, 138, 0.9)'
                      : '2px 2px 0px var(--border-color)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <span className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                    {n.label}
                  </span>
                  <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>{n.note.split(' ')[0]}</span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.62rem',
                      opacity: 0.6
                    }}
                  >
                    [{n.key}]
                  </span>
                </button>
              );
            })}
          </div>

          {/* 8-Step Interactive Sequencer Grid */}
          <div
            className="sequencer-grid-panel"
            style={{
              backgroundColor: 'var(--bg-main)',
              borderRadius: '14px',
              border: '1.5px solid var(--border-color)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}
            >
              <div
                className="font-mono"
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: 'var(--text-main)'
                }}
              >
                <Disc size={13} color="var(--color-gold)" />
                <span>8-STEP LULLABY LOOP</span>
                {isLooping && (
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#4caf50',
                      boxShadow: '0 0 6px #4caf50'
                    }}
                  />
                )}
              </div>

              {/* Preset buttons */}
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleApplyPreset('pipLullaby')}
                  className="retro-btn"
                  style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem' }}
                >
                  Pip Anthem
                </button>
                <button
                  onClick={() => handleApplyPreset('starlightChimney')}
                  className="retro-btn"
                  style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem' }}
                >
                  Starlight
                </button>
                <button
                  onClick={() => handleApplyPreset('velvetWaltz')}
                  className="retro-btn"
                  style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem' }}
                >
                  Waltz
                </button>
              </div>
            </div>

            {/* 8 Step Buttons */}
            <div
              role="region"
              aria-label="8-step melody sequencer"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gap: '0.35rem'
              }}
            >
              {pattern.map((noteIdx, stepIdx) => {
                const isCurrent = currentStep === stepIdx;
                const noteObj = noteIdx !== null ? BASE_NOTES[noteIdx] : null;

                return (
                  <button
                    key={stepIdx}
                    onClick={() => handleStepClick(stepIdx)}
                    className="sequencer-step-tile"
                    aria-label={`Step ${stepIdx + 1}: ${noteObj ? noteObj.label : 'Rest'}. Click to cycle note.`}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.6rem 0.2rem',
                      borderRadius: '8px',
                      border: isCurrent
                        ? '2px solid var(--color-gold)'
                        : '1px solid var(--border-color)',
                      backgroundColor: isCurrent
                        ? 'rgba(255, 216, 138, 0.35)'
                        : noteObj
                          ? 'var(--bg-surface)'
                          : 'rgba(0,0,0,0.04)',
                      boxShadow: isCurrent ? '0 0 10px rgba(255, 216, 138, 0.7)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.12s ease',
                      minHeight: '56px'
                    }}
                  >
                    <span
                      className="font-mono"
                      style={{
                        fontSize: '0.62rem',
                        opacity: 0.6,
                        marginBottom: '2px'
                      }}
                    >
                      {stepIdx + 1}
                    </span>
                    <span
                      className="font-serif"
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        color: noteObj ? 'var(--color-berry)' : 'var(--text-muted)'
                      }}
                    >
                      {noteObj ? noteObj.label : '—'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sequencer Toolbar: Play/Stop, Tempo, Clear */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginTop: '0.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={handleToggleLoop}
                  className="retro-btn"
                  style={{
                    backgroundColor: isLooping ? 'var(--color-cocoa)' : 'var(--color-berry)',
                    color: '#ffffff',
                    borderColor: isLooping ? 'var(--color-cocoa)' : 'var(--color-berry)',
                    padding: '0.45rem 1rem',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontWeight: 'bold'
                  }}
                  aria-label={isLooping ? 'Stop sequencer loop' : 'Start playing lullaby loop'}
                >
                  {isLooping ? <Square size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
                  <span>{isLooping ? 'Stop Loop' : 'Play Loop'}</span>
                </button>

                <button
                  onClick={handleClearPattern}
                  className="retro-btn"
                  style={{
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.74rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: 'var(--text-muted)'
                  }}
                  title="Clear all steps to rests"
                >
                  <RotateCcw size={12} />
                  <span>Clear</span>
                </button>
              </div>

              {/* Tempo Switcher */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  RHYTHM:
                </span>
                {(['sleepy', 'dreamy', 'starlight'] as TempoMode[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleSetTempo(t)}
                    className="retro-btn"
                    style={{
                      fontSize: '0.68rem',
                      padding: '0.2rem 0.5rem',
                      backgroundColor: tempo === t ? 'var(--color-gold)' : 'transparent',
                      color: tempo === t ? '#3b2512' : 'var(--text-muted)',
                      borderColor: tempo === t ? 'var(--color-gold)' : 'var(--border-color)',
                      fontWeight: tempo === t ? 'bold' : 'normal'
                    }}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Note Tape History */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
              paddingTop: '0.4rem',
              borderTop: '1px solid var(--border-color)'
            }}
          >
            <div
              className="font-mono"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.72rem',
                color: 'var(--text-muted)'
              }}
            >
              <Sparkles size={12} color="var(--color-gold)" />
              <span style={{ opacity: 0.7 }}>HARMONIC LOG:</span>
              {melodyHistory.length === 0 ? (
                <span style={{ fontStyle: 'italic', opacity: 0.5 }}>press chime or play loop</span>
              ) : (
                melodyHistory.map((note, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '0.12rem 0.35rem',
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

            <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              KEYBOARD: [1-6] NOTES | [SPACE] LOOP
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LullabyLab;
