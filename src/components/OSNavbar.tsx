import React, { useState } from 'react';
import { Volume2, VolumeX, Sun, Moon, Radio, Sparkles } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';
import type { ThemeMode } from '../types';

interface OSNavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  chaosMode: boolean;
  onToggleChaos: () => void;
  onOpenSecret: () => void;
}

export const OSNavbar: React.FC<OSNavbarProps> = ({
  theme,
  onToggleTheme,
  isMuted,
  onToggleMute,
  chaosMode,
  onToggleChaos,
  onOpenSecret
}) => {
  const [secretClicks, setSecretClicks] = useState(0);
  const [secretHint, setSecretHint] = useState<string | null>(null);

  const handleSecretStarClick = () => {
    const next = secretClicks + 1;
    setSecretClicks(next);
    if (next < 3) {
      soundEngine.playClick(440 + next * 110);
      setSecretHint(`✦ ${3 - next}`);
      setTimeout(() => setSecretHint(null), 2500);
    } else {
      setSecretClicks(0);
      setSecretHint(null);
      soundEngine.playCelebrationChime();
      onOpenSecret();
    }
  };
  return (
    <header className="dream-header">
      <div className="dream-header-container">
        {/* Brand & Daemon State */}
        <div className="dream-brand-group">
          <a
            href="#top"
            className="dream-brand-link"
            onClick={() => soundEngine.playClick(500)}
          >
            <span className="dream-brand-badge font-mono">
              PIP://99
            </span>
            <span className="font-serif dream-brand-title">
              Midnight Nursery
            </span>
          </a>

          {/* Live system state tag */}
          <div className="dream-daemon-tag font-mono">
            <span className="dream-daemon-dot" />
            <span className="dream-daemon-text">DREAM_DAEMON</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main Navigation" className="dream-nav">
          <a href="#about" onClick={() => soundEngine.playClick(440)}>
            About Pip
          </a>
          <a href="#exhibits" onClick={() => soundEngine.playClick(480)}>
            Dream Labs
          </a>
          <a href="#story" onClick={() => soundEngine.playClick(520)}>
            Origin Story
          </a>
          <a href="#credits" onClick={() => soundEngine.playClick(560)}>
            Credits
          </a>
        </nav>

        {/* Action Controls Strip */}
        <div className="dream-controls-strip">
          {/* Secret Easter Egg star (Requires 3 clicks) */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {secretHint && (
              <span
                className="font-mono"
                style={{
                  position: 'absolute',
                  top: '-18px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '0.65rem',
                  color: 'var(--color-gold)',
                  backgroundColor: 'var(--color-midnight)',
                  padding: '0.1rem 0.35rem',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                  border: '1px solid var(--color-gold)'
                }}
              >
                {secretHint}
              </span>
            )}
            <button
              onClick={handleSecretStarClick}
              title="Click secret star 3 times to unlock hidden chamber"
              aria-label="Secret Easter Egg Star"
              className="dream-secret-btn"
            >
              <Sparkles size={16} fill="currentColor" />
            </button>
          </div>

          {/* Chaos Mode Toggle */}
          <button
            onClick={() => {
              soundEngine.playClick(chaosMode ? 320 : 640);
              onToggleChaos();
            }}
            className={`retro-btn dream-tool-btn ${chaosMode ? 'active-chaos' : ''}`}
            title="Toggle 1999 CRT Scanlines and Retro Chaos Mode"
            aria-label="Toggle Retro Chaos Mode"
          >
            <Radio size={13} />
            <span className="font-mono btn-text">{chaosMode ? '99:CRT' : 'CRT'}</span>
          </button>

          {/* Day / Midnight Mode Toggle */}
          <button
            onClick={() => {
              soundEngine.playClick(theme === 'daydream' ? 380 : 540);
              onToggleTheme();
            }}
            className="retro-btn dream-tool-btn"
            title={`Switch to ${theme === 'daydream' ? 'Midnight' : 'Daydream'} mode`}
            aria-label="Toggle Theme Mode"
          >
            {theme === 'daydream' ? <Moon size={13} /> : <Sun size={13} />}
            <span className="font-mono btn-text">{theme === 'daydream' ? 'Night' : 'Day'}</span>
          </button>

          {/* Reliable Mute Button */}
          <button
            onClick={() => {
              onToggleMute();
              if (isMuted) {
                soundEngine.playMusicBoxNote(523.25);
              }
            }}
            className={`retro-btn dream-tool-btn ${isMuted ? 'muted-btn' : ''}`}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? (
              <>
                <VolumeX size={13} color="var(--color-berry)" />
                <span className="font-mono btn-text">Muted</span>
              </>
            ) : (
              <>
                <Volume2 size={13} />
                <span className="font-mono btn-text">Sound</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
