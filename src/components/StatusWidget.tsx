import React, { useEffect, useState } from 'react';
import { Sparkles, Moon, Activity, Gauge, Plus } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface StatusWidgetProps {
  initialCount?: number;
}

export const StatusWidget: React.FC<StatusWidgetProps> = ({ initialCount = 19994 }) => {
  const [dreamsDelivered, setDreamsDelivered] = useState(initialCount);
  const [isResonating, setIsResonating] = useState(false);

  // Periodic automatic local dream tick (~every 6s)
  useEffect(() => {
    const interval = setInterval(() => {
      setDreamsDelivered((prev) => prev + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleManualDispatch = () => {
    setDreamsDelivered((prev) => prev + 1);
    soundEngine.playClick(720);
  };

  const handleTuneFrequency = () => {
    setIsResonating(true);
    soundEngine.playMusicBoxNote(432.0, 1.5);
    setTimeout(() => setIsResonating(false), 1200);
  };

  // Convert number to digit array with comma separators for mechanical drums
  const formattedString = dreamsDelivered.toLocaleString('en-US');

  return (
    <div
      style={{
        maxWidth: '1100px',
        margin: '0 auto 3rem',
        padding: '0 1.5rem'
      }}
    >
      <div
        className="retro-window"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          padding: '1.25rem 1.75rem',
          alignItems: 'center'
        }}
      >
        {/* Animated Mechanical Odometer Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              padding: '0.65rem',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-retro-panel)',
              border: '1px solid var(--border-color)',
              color: 'var(--color-berry)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Gauge size={22} />
          </div>

          <div style={{ flex: 1 }}>
            <div
              className="font-mono"
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.04em'
              }}
            >
              LOCAL LOG // CANON BUFFER
            </div>

            {/* Tumbler Drum Display */}
            <div
              aria-live="polite"
              aria-label={`Local dreams delivered counter: ${dreamsDelivered}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-surface)',
                border: '1.5px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.15rem 0.5rem',
                margin: '0.2rem 0'
              }}
            >
              {formattedString.split('').map((char, index) => {
                if (char === ',') {
                  return (
                    <span
                      key={`comma-${index}`}
                      className="font-mono"
                      style={{
                        fontSize: '1.4rem',
                        fontWeight: 700,
                        color: 'var(--color-berry)',
                        padding: '0 0.1rem',
                        lineHeight: '32px'
                      }}
                    >
                      ,
                    </span>
                  );
                }

                const digitVal = parseInt(char, 10);
                return (
                  <div
                    key={`slot-${index}`}
                    style={{
                      height: '32px',
                      width: '18px',
                      overflow: 'hidden',
                      display: 'inline-block',
                      position: 'relative'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        transform: `translateY(-${digitVal * 10}%)`,
                        transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)'
                      }}
                    >
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                        <span
                          key={n}
                          className="font-mono"
                          style={{
                            height: '32px',
                            lineHeight: '32px',
                            display: 'block',
                            textAlign: 'center',
                            fontSize: '1.35rem',
                            fontWeight: 700,
                            color: 'var(--text-heading)'
                          }}
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tactile Odometer Tick Trigger */}
            <div>
              <button
                onClick={handleManualDispatch}
                className="retro-btn"
                style={{
                  fontSize: '0.68rem',
                  padding: '0.15rem 0.45rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  cursor: 'pointer'
                }}
                title="Dispatch one extra dream vial locally"
                aria-label="Dispatch one extra dream vial locally"
              >
                <Plus size={10} color="var(--color-berry)" />
                <span>Tick Odometer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Slumber Frequency Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              padding: '0.65rem',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-retro-panel)',
              border: '1px solid var(--border-color)',
              color: '#4ade80',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Activity size={22} className={isResonating ? 'chime-active' : ''} />
          </div>
          <div>
            <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              BEDTIME FREQUENCY
            </div>
            <div
              className="font-mono"
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: isResonating ? 'var(--color-berry)' : 'var(--text-heading)',
                transition: 'color 0.3s ease'
              }}
            >
              432.0 Hz [HARMONIC]
            </div>
            <button
              onClick={handleTuneFrequency}
              className="retro-btn"
              style={{
                fontSize: '0.68rem',
                padding: '0.15rem 0.45rem',
                marginTop: '0.2rem',
                cursor: 'pointer'
              }}
              title="Tune to 432 Hz frequency"
              aria-label="Tune to 432 Hz harmonic frequency"
            >
              <span>{isResonating ? '✦ Resonating...' : 'Tune Frequency'}</span>
            </button>
          </div>
        </div>

        {/* Nursery Sleep Mode Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              padding: '0.65rem',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-retro-panel)',
              border: '1px solid var(--border-color)',
              color: 'var(--color-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Moon size={22} />
          </div>
          <div>
            <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              NURSERY COZINESS
            </div>
            <div
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: 'var(--text-heading)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span>Maximum Velvet</span>
              <Sparkles size={14} color="var(--color-gold)" />
            </div>
            <span
              className="font-mono"
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                backgroundColor: 'var(--bg-retro-panel)',
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                display: 'inline-block',
                marginTop: '0.2rem'
              }}
            >
              SLEEP DAEMON: CALM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusWidget;
