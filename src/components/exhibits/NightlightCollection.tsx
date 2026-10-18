import React, { useState, useEffect } from 'react';
import { Lamp, Sparkles, SunDim } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';
import type { LanternVariant } from '../../types';

const LANTERNS: LanternVariant[] = [
  {
    id: 'starlight',
    name: 'Starlight Dream',
    glowColor: '#ffd88a',
    textColor: '#5c4033',
    ambientFilter: 'drop-shadow(0 0 25px rgba(255, 216, 138, 0.85)) drop-shadow(0 0 50px rgba(255, 216, 138, 0.4))',
    description: 'Infused with golden constellation dust. Best for children afraid of shadows.',
    vibe: 'WARM // 2700K'
  },
  {
    id: 'lavender',
    name: 'Lavender Slumber',
    glowColor: '#c4b5fd',
    textColor: '#4c1d95',
    ambientFilter: 'drop-shadow(0 0 25px rgba(196, 181, 253, 0.9)) drop-shadow(0 0 55px rgba(139, 92, 246, 0.45))',
    description: 'Scented with dream thyme and twilight lavender petals. Deepens REM sleep.',
    vibe: 'CALM // 450nm'
  },
  {
    id: 'amber',
    name: 'Hearth Amber',
    glowColor: '#fdba74',
    textColor: '#7c2d12',
    ambientFilter: 'drop-shadow(0 0 25px rgba(253, 186, 116, 0.9)) drop-shadow(0 0 60px rgba(234, 88, 12, 0.4))',
    description: 'Simulates the gentle crackle of an autumn nursery fireplace.',
    vibe: 'COZY // 2200K'
  },
  {
    id: 'celestial',
    name: 'Moonlit Aurora',
    glowColor: '#6ee7b7',
    textColor: '#064e3b',
    ambientFilter: 'drop-shadow(0 0 25px rgba(110, 231, 183, 0.9)) drop-shadow(0 0 55px rgba(16, 185, 129, 0.45))',
    description: 'Soft greenish-blue waves for dreamers who wish to fly over silent oceans.',
    vibe: 'AURORA // 520nm'
  }
];

export const NightlightCollection: React.FC = () => {
  const [selected, setSelected] = useState<LanternVariant>(LANTERNS[0]);
  const [brightness, setBrightness] = useState<number>(85);

  // Sync ambient root glow when lantern or brightness changes
  useEffect(() => {
    const alphaHex = Math.round((brightness / 100) * 120)
      .toString(16)
      .padStart(2, '0');
    document.documentElement.style.setProperty('--glow-color', `${selected.glowColor}${alphaHex}`);
  }, [selected, brightness]);

  const handleSelect = (lantern: LanternVariant) => {
    setSelected(lantern);
    soundEngine.playClick(580);
    soundEngine.playMusicBoxNote(784, 0.8);
  };

  return (
    <div
      className="retro-window"
      style={{
        boxShadow: `0 15px 40px -10px ${selected.glowColor}40`
      }}
    >
      <div className="retro-window-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lamp size={14} color="var(--color-berry)" />
          <span>EXHIBIT 02: NIGHTLIGHT_COLLECTION.APP</span>
        </div>
        <span style={{ color: 'var(--color-berry)' }}>LANTERN CALIBRATION</span>
      </div>

      <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <h3 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--text-heading)' }}>
              Interactive Dream Lanterns
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Every sleepy room needs a guardian lamp. Select a wavelength below to cast a soothing hue
              over the nursery canvas.
            </p>
          </div>

          {/* Brightness dimmer slider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--bg-retro-panel)',
              padding: '0.4rem 0.8rem',
              borderRadius: '999px',
              border: '1px solid var(--border-color)'
            }}
          >
            <SunDim size={15} color="var(--text-muted)" />
            <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              LUMENS:
            </span>
            <input
              type="range"
              min="30"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              aria-label="Adjust lantern brightness"
              style={{
                width: '80px',
                accentColor: 'var(--color-berry)',
                cursor: 'pointer'
              }}
            />
            <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
              {brightness}%
            </span>
          </div>
        </div>

        {/* Live Interactive Lantern Display */}
        <div
          style={{
            position: 'relative',
            borderRadius: '16px',
            backgroundColor: 'var(--bg-surface)',
            border: `2px solid ${selected.glowColor}80`,
            padding: '2.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            minHeight: '260px',
            transition: 'border-color 0.4s ease'
          }}
        >
          {/* Dynamic background ambient glow */}
          <div
            style={{
              position: 'absolute',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              backgroundColor: selected.glowColor,
              opacity: (brightness / 100) * 0.5,
              filter: 'blur(55px)',
              transition: 'all 0.4s ease',
              pointerEvents: 'none'
            }}
          />

          {/* Official Dream Lantern Image */}
          <div
            style={{
              position: 'relative',
              width: '180px',
              height: '180px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src="/assets/pip_dream_lantern.png"
              alt="Pip's glowing starlight dream lantern"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: `${selected.ambientFilter}`,
                opacity: brightness / 100,
                transition: 'filter 0.4s ease, opacity 0.2s ease'
              }}
            />
          </div>

          {/* Active lantern metadata readout */}
          <div
            style={{
              marginTop: '1.25rem',
              textAlign: 'center',
              zIndex: 1
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--text-heading)'
              }}
            >
              <Sparkles size={14} color={selected.glowColor} />
              <span>{selected.name}</span>
              <span
                className="font-mono"
                style={{
                  padding: '0.1rem 0.45rem',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-retro-panel)',
                  fontSize: '0.72rem',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-muted)'
                }}
              >
                {selected.vibe}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem', maxWidth: '380px' }}>
              {selected.description}
            </p>
          </div>
        </div>

        {/* Lantern Switcher Buttons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.75rem'
          }}
        >
          {LANTERNS.map((lantern) => {
            const isCurrent = selected.id === lantern.id;
            return (
              <button
                key={lantern.id}
                onClick={() => handleSelect(lantern)}
                aria-pressed={isCurrent}
                style={{
                  background: isCurrent ? 'var(--bg-card)' : 'var(--bg-surface)',
                  border: `2px solid ${isCurrent ? 'var(--color-berry)' : 'var(--border-color)'}`,
                  borderRadius: '10px',
                  padding: '0.75rem 0.6rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: isCurrent ? `2px 2px 0 ${lantern.glowColor}` : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: lantern.glowColor,
                    boxShadow: `0 0 8px ${lantern.glowColor}`,
                    flexShrink: 0
                  }}
                />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-heading)' }}>
                  {lantern.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
