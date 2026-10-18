import { useState, useEffect } from 'react';
import { Lamp, SunDim } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';
import type { LanternVariant } from '../../types';

const LANTERNS: LanternVariant[] = [
  {
    id: 'starlight',
    name: 'Starlight Dream',
    glowColor: '#ffd88a',
    textColor: '#5c4033',
    ambientFilter: 'drop-shadow(0 0 35px rgba(255, 216, 138, 0.95)) drop-shadow(0 0 70px rgba(255, 216, 138, 0.5))',
    description: 'Infused with golden constellation dust. Best for dreamers afraid of nighttime shadows.',
    vibe: 'WARM // 2700K'
  },
  {
    id: 'lavender',
    name: 'Lavender Slumber',
    glowColor: '#c4b5fd',
    textColor: '#4c1d95',
    ambientFilter: 'drop-shadow(0 0 35px rgba(196, 181, 253, 0.95)) drop-shadow(0 0 70px rgba(139, 92, 246, 0.5))',
    description: 'Scented with dream thyme and twilight petals. Deepens calming REM sleep waves.',
    vibe: 'CALM // 450nm'
  },
  {
    id: 'amber',
    name: 'Hearth Amber',
    glowColor: '#fdba74',
    textColor: '#7c2d12',
    ambientFilter: 'drop-shadow(0 0 35px rgba(253, 186, 116, 0.95)) drop-shadow(0 0 75px rgba(234, 88, 12, 0.45))',
    description: 'Simulates the gentle, comforting crackle of an autumn nursery hearth fireplace.',
    vibe: 'COZY // 2200K'
  },
  {
    id: 'celestial',
    name: 'Moonlit Aurora',
    glowColor: '#6ee7b7',
    textColor: '#064e3b',
    ambientFilter: 'drop-shadow(0 0 35px rgba(110, 231, 183, 0.95)) drop-shadow(0 0 70px rgba(16, 185, 129, 0.5))',
    description: 'Soft greenish-blue nocturnal waves for quiet flights over sleeping oceans.',
    vibe: 'AURORA // 520nm'
  }
];

export const NightlightCollection: React.FC = () => {
  const [selected, setSelected] = useState<LanternVariant>(LANTERNS[0]);
  const [brightness, setBrightness] = useState<number>(85);

  // Synchronize dynamic global glow color with the document
  useEffect(() => {
    const alphaHex = Math.round((brightness / 100) * 140)
      .toString(16)
      .padStart(2, '0');
    document.documentElement.style.setProperty('--glow-color', `${selected.glowColor}${alphaHex}`);
  }, [selected, brightness]);

  const handleSelect = (lantern: LanternVariant) => {
    setSelected(lantern);
    soundEngine.playClick(580);
    soundEngine.playMusicBoxNote(784, 1.1);
  };

  return (
    <div
      id="nightlight-collection"
      className="nightlight-exhibit-chamber"
      style={{
        position: 'relative',
        background: `radial-gradient(circle at 50% 40%, ${selected.glowColor}25 0%, var(--bg-surface) 75%)`,
        borderRadius: '24px',
        border: `1.5px solid ${selected.glowColor}55`,
        boxShadow: `0 20px 50px -15px ${selected.glowColor}40`,
        padding: '3rem 2rem',
        overflow: 'hidden',
        transition: 'all 0.6s ease'
      }}
    >
      {/* Background celestial constellation ring */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          border: `1px dashed ${selected.glowColor}30`,
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
          gap: '2rem'
        }}
      >
        {/* Exhibit Header */}
        <div>
          <div
            className="font-mono"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.95rem',
              backgroundColor: `${selected.glowColor}20`,
              borderRadius: '999px',
              border: `1px solid ${selected.glowColor}60`,
              color: 'var(--text-main)',
              fontSize: '0.74rem',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem'
            }}
          >
            <Lamp size={13} color="var(--color-berry)" />
            <span>EXHIBIT 02 // ATMOSPHERIC LIGHTING</span>
          </div>
          <h3
            className="font-serif"
            style={{
              fontSize: 'clamp(1.9rem, 3.4vw, 2.6rem)',
              color: 'var(--text-heading)',
              margin: 0
            }}
          >
            The Celestial Nightlight Collection
          </h3>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--text-muted)',
              maxWidth: '620px',
              margin: '0.65rem auto 0',
              lineHeight: 1.6
            }}
          >
            Select a soothing dream spectrum below. The lantern's optical aura synchronizes directly
            with the nursery canvas, washing the entire scene in radiant starlight.
          </p>
        </div>

        {/* Centerpiece: Large Radiant Lantern Artwork */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '340px',
            aspectRatio: '1024 / 914',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          onClick={() => soundEngine.playMusicBoxNote(880, 1.2)}
          title="Click to bathe in gentle lantern glow"
        >
          {/* Intense breathing radial aura */}
          <div
            style={{
              position: 'absolute',
              width: '85%',
              height: '85%',
              borderRadius: '50%',
              backgroundColor: selected.glowColor,
              filter: 'blur(45px)',
              opacity: (brightness / 100) * 0.75,
              transition: 'all 0.5s ease',
              zIndex: 0
            }}
          />

          <img
            src="/assets/pip_dream_lantern.png"
            alt="Pip's glowing starlight dream lantern"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              WebkitMaskImage:
                'radial-gradient(ellipse 65% 70% at 50% 50%, black 45%, rgba(0,0,0,0.7) 65%, transparent 86%)',
              maskImage:
                'radial-gradient(ellipse 65% 70% at 50% 50%, black 45%, rgba(0,0,0,0.7) 65%, transparent 86%)',
              filter: selected.ambientFilter,
              position: 'relative',
              zIndex: 1,
              transform: 'scale(1.02)',
              transition: 'filter 0.5s ease, transform 0.3s ease'
            }}
          />
        </div>

        {/* Selected Spectrum Metadata Readout */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            padding: '0.5rem 1.25rem',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '999px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
          }}
          className="font-mono"
        >
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)' }}>
            {selected.name}
          </span>
          <span style={{ opacity: 0.3 }}>•</span>
          <span style={{ fontSize: '0.74rem', color: 'var(--color-berry)' }}>{selected.vibe}</span>
          <span style={{ opacity: 0.3 }}>•</span>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            LUMENS: {brightness}%
          </span>
        </div>

        {/* 4 Interactive Lantern Crystal Selection Buttons */}
        <div
          role="radiogroup"
          aria-label="Select dream lantern spectrum"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            width: '100%',
            maxWidth: '840px'
          }}
        >
          {LANTERNS.map((lantern) => {
            const isCurrent = selected.id === lantern.id;
            return (
              <button
                key={lantern.id}
                role="radio"
                aria-checked={isCurrent}
                onClick={() => handleSelect(lantern)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '1.1rem 1rem',
                  borderRadius: '16px',
                  backgroundColor: isCurrent ? 'var(--bg-surface)' : 'var(--bg-retro-panel)',
                  border: isCurrent
                    ? `2px solid ${lantern.glowColor}`
                    : '1.5px solid var(--border-color)',
                  boxShadow: isCurrent ? `0 8px 24px ${lantern.glowColor}50` : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.25s ease'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    marginBottom: '0.35rem',
                    width: '100%'
                  }}
                >
                  <span
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      backgroundColor: lantern.glowColor,
                      boxShadow: `0 0 10px ${lantern.glowColor}`,
                      display: 'inline-block',
                      flexShrink: 0
                    }}
                  />
                  <span
                    className="font-serif"
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: 'var(--text-heading)'
                    }}
                  >
                    {lantern.name}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '0.78rem',
                    lineHeight: 1.45,
                    color: 'var(--text-muted)',
                    margin: 0
                  }}
                >
                  {lantern.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Lumens Brightness Dimmer Control */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            backgroundColor: 'var(--bg-surface)',
            padding: '0.65rem 1.4rem',
            borderRadius: '999px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 4px 12px rgba(92, 64, 51, 0.05)',
            width: 'fit-content'
          }}
        >
          <SunDim size={16} color="var(--color-berry)" />
          <span className="font-mono" style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            DIMMER:
          </span>
          <input
            type="range"
            min="30"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
            aria-label="Lantern brightness lumens slider"
            style={{
              accentColor: 'var(--color-berry)',
              cursor: 'pointer',
              width: '140px'
            }}
          />
          <span className="font-mono" style={{ fontSize: '0.78rem', fontWeight: 700 }}>
            {brightness}%
          </span>
        </div>
      </div>
    </div>
  );
};
