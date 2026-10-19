import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Sun, Moon, Radio, Sparkles, Compass } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';
import type { ThemeMode } from '../types';
import {
  getUnlockedCount,
  PASSPORT_EVENT_NAME,
  STAR_FRAGMENTS,
  type StarFragmentId
} from '../utils/passportStorage';

interface OSNavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  chaosMode: boolean;
  onToggleChaos: () => void;
  onOpenSecret: () => void;
  onOpenPassport: () => void;
  isArcadeUnlocked?: boolean;
}

export const OSNavbar: React.FC<OSNavbarProps> = ({
  theme,
  onToggleTheme,
  isMuted,
  onToggleMute,
  chaosMode,
  onToggleChaos,
  onOpenSecret,
  onOpenPassport,
  isArcadeUnlocked = false
}) => {
  const [secretClicks, setSecretClicks] = useState(0);
  const [secretHint, setSecretHint] = useState<string | null>(null);
  const [unlockedCount, setUnlockedCount] = useState<number>(() => getUnlockedCount());
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  // Listen for passport updates
  useEffect(() => {
    const handleUpdate = (e: Event) => {
      setUnlockedCount(getUnlockedCount());
      const customEvent = e as CustomEvent<{ fragmentId?: StarFragmentId }>;
      if (customEvent.detail && customEvent.detail.fragmentId) {
        const frag = STAR_FRAGMENTS[customEvent.detail.fragmentId];
        if (frag) {
          soundEngine.playCelebrationChime();
          setToastMsg(`✦ Star Fragment Discovered: ${frag.name}!`);
          setTimeout(() => setToastMsg(null), 3800);
        }
      }
    };

    window.addEventListener(PASSPORT_EVENT_NAME, handleUpdate);
    return () => window.removeEventListener(PASSPORT_EVENT_NAME, handleUpdate);
  }, []);

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
      // Also navigate to secret arcade
      navigate('/secret-arcade');
    }
  };

  return (
    <header className="dream-header">
      <div className="dream-header-container">
        {/* Brand & Daemon State */}
        <div className="dream-brand-group">
          <Link
            to="/"
            className="dream-brand-link"
            onClick={() => soundEngine.playClick(500)}
          >
            <span className="dream-brand-badge font-mono">
              PIP://99
            </span>
            <span className="font-serif dream-brand-title">
              Midnight Nursery
            </span>
          </Link>

          {/* Live system state tag */}
          <div className="dream-daemon-tag font-mono">
            <span className="dream-daemon-dot" />
            <span className="dream-daemon-text">DREAM_DAEMON</span>
          </div>
        </div>

        {/* Multi-Page Navigation Links */}
        <nav aria-label="Main Navigation" className="dream-nav">
          <NavLink
            to="/"
            end
            onClick={() => soundEngine.playClick(440)}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Nursery
          </NavLink>
          <NavLink
            to="/dream-forge"
            onClick={() => soundEngine.playClick(480)}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Dream Forge
          </NavLink>
          <NavLink
            to="/atlas"
            onClick={() => soundEngine.playClick(520)}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Midnight Atlas
          </NavLink>
          <NavLink
            to="/archive"
            onClick={() => soundEngine.playClick(560)}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Bedtime Archive
          </NavLink>
          {isArcadeUnlocked && (
            <NavLink
              to="/secret-arcade"
              onClick={() => soundEngine.playClick(600)}
              className={({ isActive }) => (isActive ? 'active secret-nav-link' : 'secret-nav-link')}
              style={{ color: '#ffd88a' }}
            >
              ★ Arcade
            </NavLink>
          )}
        </nav>

        {/* Action Controls Strip */}
        <div className="dream-controls-strip">
          {/* Constellation Passport Button */}
          <button
            onClick={() => {
              soundEngine.playMusicBoxNote(659.25);
              onOpenPassport();
            }}
            className="retro-btn dream-tool-btn passport-nav-pill"
            style={{
              backgroundColor: unlockedCount === 4 ? 'rgba(255, 216, 138, 0.25)' : undefined,
              borderColor: unlockedCount > 0 ? 'var(--color-gold)' : undefined
            }}
            title="Open Constellation Passport & Celestial Map"
            aria-label={`Constellation Passport, ${unlockedCount} of 4 fragments unlocked`}
          >
            <Compass size={13} color="var(--color-gold)" />
            <span className="font-mono btn-text">✦ {unlockedCount}/4</span>
          </button>

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

      {/* Toast Notification for Star Fragment Discovery */}
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: '72px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#1c142b',
            color: '#ffd88a',
            border: '1.5px solid var(--color-gold)',
            borderRadius: '999px',
            padding: '0.45rem 1.25rem',
            fontFamily: 'monospace',
            fontSize: '0.78rem',
            boxShadow: '0 8px 30px rgba(0,0,0,0.6), 0 0 20px rgba(255, 216, 138, 0.4)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            pointerEvents: 'none'
          }}
        >
          <span>{toastMsg}</span>
        </div>
      )}
    </header>
  );
};
