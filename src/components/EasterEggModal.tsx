import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, X, Award, Disc, PartyPopper, Play, RotateCcw, Timer, Trophy } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface EasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FallingDreamObject {
  id: number;
  x: number; // percentage (8% to 88%)
  y: number; // pixels from top of arena
  speed: number; // px per frame
  type: 'star' | 'cloud' | 'vial' | 'lantern';
  points: number;
  label: string;
  emoji: string;
  caught: boolean;
}

export const EasterEggModal: React.FC<EasterEggModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'journal' | 'game'>('journal');
  
  // Game states: 'idle' | 'playing' | 'won' | 'gameover'
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isPaused, setIsPaused] = useState(false);
  const [objects, setObjects] = useState<FallingDreamObject[]>([]);

  const nextObjectIdRef = useRef(1);
  const animationFrameRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);

  const WIN_SCORE_THRESHOLD = 80;

  const triggerRestrainedConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffd88a', '#a34063', '#777dff', '#ffb3ba', '#bae1ff'],
        disableForReducedMotion: true
      });
    } catch {
      // Graceful fallback
    }
  }, []);

  const handleClose = useCallback(() => {
    setGameState('idle');
    setObjects([]);
    setTimeLeft(20);
    setScore(0);
    onClose();
  }, [onClose]);

  // Keyboard escape listener
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') handleClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleClose]);

  // Initial greeting sound on open
  useEffect(() => {
    if (isOpen) {
      soundEngine.playCelebrationChime();
      triggerRestrainedConfetti();
    }
  }, [isOpen, triggerRestrainedConfetti]);

  // Handle visibility change (pause game loop if tab is hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
        lastFrameTimeRef.current = null;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Spawn falling dream objects
  const spawnObject = useCallback(() => {
    const types: Array<{ type: 'star' | 'cloud' | 'vial' | 'lantern'; points: number; label: string; emoji: string }> = [
      { type: 'star', points: 10, label: 'Bedtime Star', emoji: '⭐' },
      { type: 'cloud', points: 15, label: 'Dream Cloud', emoji: '☁️' },
      { type: 'vial', points: 20, label: 'Slumber Vial', emoji: '🧪' },
      { type: 'lantern', points: 25, label: 'Lantern Sprite', emoji: '✨' }
    ];

    const pick = types[Math.floor(Math.random() * types.length)];
    const x = Math.floor(8 + Math.random() * 80); // between 8% and 88%
    const speed = 1.3 + Math.random() * 1.5; // capped sensible movement: 1.3 - 2.8 px/frame

    const newObj: FallingDreamObject = {
      id: nextObjectIdRef.current++,
      x,
      y: -30,
      speed,
      type: pick.type,
      points: pick.points,
      label: pick.label,
      emoji: pick.emoji,
      caught: false
    };

    setObjects((prev) => [...prev, newObj]);
  }, []);

  // Catch object handler
  const handleCatchObject = (id: number, points: number) => {
    soundEngine.playCatchBubble(1 + (points / 25) * 0.5);
    setScore((prev) => prev + points);
    setObjects((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, caught: true } : obj))
    );
  };

  // Start 20s Round
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(20);
    setIsPaused(false);
    setObjects([]);
    lastFrameTimeRef.current = null;
    soundEngine.playForgeSpark();
  };

  // Timer loop for countdown with direct win/loss transition
  useEffect(() => {
    if (gameState !== 'playing' || isPaused) return;

    const timerId = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          setScore((currentScore) => {
            if (currentScore >= WIN_SCORE_THRESHOLD) {
              setGameState('won');
              soundEngine.playCelebrationChime();
              triggerRestrainedConfetti();
            } else {
              setGameState('gameover');
              soundEngine.playClick(320);
            }
            return currentScore;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [gameState, isPaused, triggerRestrainedConfetti]);

  // Spawner loop
  useEffect(() => {
    if (gameState !== 'playing' || isPaused) return;

    spawnTimerRef.current = window.setInterval(() => {
      spawnObject();
    }, 750);

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [gameState, isPaused, spawnObject]);

  // Main Animation Frame Movement Loop
  useEffect(() => {
    if (gameState !== 'playing' || isPaused) return;

    const arenaHeight = 280;

    const updateFrame = () => {
      setObjects((prev) =>
        prev
          .map((obj) => ({
            ...obj,
            y: obj.y + obj.speed
          }))
          // Keep objects until they fall past arena height or are caught
          .filter((obj) => obj.y < arenaHeight + 40 && !obj.caught)
      );

      animationFrameRef.current = requestAnimationFrame(updateFrame);
    };

    animationFrameRef.current = requestAnimationFrame(updateFrame);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameState, isPaused]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="easter-egg-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(9, 11, 32, 0.82)',
        backdropFilter: 'blur(10px)',
        zIndex: 10001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem'
      }}
      onClick={handleClose}
    >
      <div
        className="retro-window"
        style={{
          maxWidth: '560px',
          width: '100%',
          backgroundColor: 'var(--bg-surface)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 40px var(--glow-color)',
          border: '2px solid var(--color-gold)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Window Titlebar */}
        <div
          className="retro-window-header"
          style={{
            backgroundColor: 'var(--color-gold)',
            color: '#5c4033',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.65rem 1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} />
            <span className="font-mono" style={{ fontSize: '0.78rem', fontWeight: 700 }}>
              PIP_SECRET_OBSERVATORY.EXE [1999]
            </span>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#5c4033',
              display: 'flex',
              padding: '0.2rem'
            }}
            aria-label="Close secret observatory"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher: Journal vs Catch-a-Dream Mini-Game */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-retro-panel)',
            borderBottom: '1px solid var(--border-color)',
            padding: '0.35rem 1rem',
            gap: '0.5rem'
          }}
        >
          <button
            onClick={() => {
              setActiveTab('journal');
              soundEngine.playClick(440);
            }}
            className="retro-btn"
            style={{
              padding: '0.3rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.74rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'journal' ? 'var(--color-berry)' : 'transparent',
              color: activeTab === 'journal' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            ★ Secret Journal
          </button>

          <button
            onClick={() => {
              setActiveTab('game');
              soundEngine.playClick(520);
            }}
            className="retro-btn"
            style={{
              padding: '0.3rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.74rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'game' ? 'var(--color-gold)' : 'transparent',
              color: activeTab === 'game' ? '#26160f' : 'var(--text-muted)'
            }}
          >
            🎮 Catch-a-Dream Mini-Game
          </button>
        </div>

        {/* ================================================================== */}
        {/* VIEW 1: SECRET JOURNAL & OBSERVATORY LORE */}
        {/* ================================================================== */}
        {activeTab === 'journal' && (
          <div
            style={{
              padding: '1.75rem 1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.15rem'
            }}
          >
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 216, 138, 0.25)',
                border: '2px solid var(--color-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-gold)',
                boxShadow: '0 0 20px rgba(255, 216, 138, 0.4)'
              }}
            >
              <Award size={42} />
            </div>

            <div>
              <span
                className="font-mono"
                style={{
                  fontSize: '0.72rem',
                  backgroundColor: 'var(--bg-retro-panel)',
                  padding: '0.2rem 0.7rem',
                  borderRadius: '999px',
                  border: '1px solid var(--border-color)',
                  color: 'var(--color-berry)',
                  fontWeight: 700
                }}
              >
                ★ SECRET ROOM DISCOVERED ★
              </span>
              <h3
                id="easter-egg-title"
                className="font-serif"
                style={{ fontSize: '1.75rem', color: 'var(--text-heading)', marginTop: '0.5rem', marginBottom: '0.25rem' }}
              >
                Pip's Hidden Attic Observatory
              </h3>
            </div>

            <p
              style={{
                fontSize: '0.92rem',
                color: 'var(--text-muted)',
                lineHeight: 1.55,
                maxWidth: '420px',
                margin: 0
              }}
            >
              You found the hidden constellation star! Pip created this secret room back in 1999
              to test bedtime dreams before sending them across the quiet rooftop chimneys.
            </p>

            {/* Secret Journal Log from 1999 */}
            <div
              style={{
                width: '100%',
                padding: '0.85rem 1.1rem',
                backgroundColor: 'var(--bg-retro-panel)',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                textAlign: 'left'
              }}
            >
              <Disc size={26} color="var(--color-berry)" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.78rem' }}>
                <div className="font-mono" style={{ fontWeight: 700, color: 'var(--text-heading)' }}>
                  NURSERY_JOURNAL_1999.LOG
                </div>
                <div style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  "Always remember to smile softly before switching off the nightlight. Sweet dreams are guaranteed." — Pip
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  setActiveTab('game');
                  startGame();
                }}
                className="retro-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.6rem 1.35rem',
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-gold)',
                  color: '#26160f',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(255, 216, 138, 0.45)'
                }}
              >
                <Play size={14} />
                <span>Play Catch-a-Dream (20s)</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playCelebrationChime();
                  triggerRestrainedConfetti();
                }}
                className="retro-btn"
                style={{
                  padding: '0.6rem 1rem',
                  fontSize: '0.82rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer'
                }}
              >
                <PartyPopper size={14} color="var(--color-berry)" />
                <span>Celebrate</span>
              </button>

              <button
                onClick={handleClose}
                className="retro-btn"
                style={{
                  backgroundColor: 'var(--color-berry)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.6rem 1.25rem',
                  fontSize: '0.82rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Tuck Secret Away
              </button>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* VIEW 2: CATCH-A-DREAM MINI-GAME */}
        {/* ================================================================== */}
        {activeTab === 'game' && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}
          >
            {/* Game Dashboard: Score, Timer & Target */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.85rem',
                backgroundColor: 'var(--bg-retro-panel)',
                borderRadius: '10px',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Timer size={16} color="var(--accent-color)" />
                <span className="font-mono" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  TIME: {String(timeLeft).padStart(2, '0')}s
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Trophy size={16} color="var(--color-gold)" />
                <span className="font-mono" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  SCORE: {score} / {WIN_SCORE_THRESHOLD}
                </span>
              </div>

              <span
                className="font-mono"
                style={{
                  fontSize: '0.7rem',
                  color: isPaused ? '#ef4444' : '#22c55e',
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '6px'
                }}
              >
                {isPaused ? 'PAUSED' : gameState === 'playing' ? '● LIVE' : 'READY'}
              </span>
            </div>

            {/* Interactive Game Arena */}
            <div
              className="catch-a-dream-arena"
              style={{
                position: 'relative',
                width: '100%',
                height: '280px',
                borderRadius: '14px',
                backgroundColor: '#050718',
                border: '1.5px solid rgba(255, 216, 138, 0.35)',
                overflow: 'hidden',
                boxShadow: 'inset 0 0 35px rgba(0,0,0,0.8)'
              }}
            >
              {/* Starfield Backdrop in Arena */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'radial-gradient(1px 1px at 40px 30px, #ffffff, transparent), ' +
                    'radial-gradient(1.5px 1.5px at 160px 80px, #ffd88a, transparent), ' +
                    'radial-gradient(1px 1px at 320px 40px, #c4b5fd, transparent), ' +
                    'radial-gradient(1.5px 1.5px at 440px 110px, #ffffff, transparent)',
                  backgroundSize: '300px 180px',
                  opacity: 0.6
                }}
              />

              {/* Arena Rooftop Silhouette at bottom */}
              <svg
                viewBox="0 0 500 80"
                preserveAspectRatio="none"
                style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50px', opacity: 0.9 }}
              >
                <path d="M 0 80 L 0 40 L 70 20 L 140 45 L 210 25 L 300 50 L 380 20 L 450 45 L 500 30 L 500 80 Z" fill="#03040c" />
                <rect x="80" y="45" width="8" height="12" rx="2" fill="#ffd88a" opacity="0.9" />
                <rect x="230" y="48" width="9" height="13" rx="2" fill="#ffd88a" opacity="0.85" />
                <rect x="395" y="44" width="8" height="12" rx="2" fill="#ffd88a" opacity="0.9" />
              </svg>

              {/* IDLE / START OVERLAY */}
              {gameState === 'idle' && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(5, 7, 24, 0.78)',
                    padding: '1.5rem',
                    textAlign: 'center',
                    zIndex: 10
                  }}
                >
                  <Sparkles size={32} color="#ffd88a" />
                  <h4 className="font-serif" style={{ color: '#ffffff', margin: '0.5rem 0 0.25rem', fontSize: '1.25rem' }}>
                    Catch-a-Dream Challenge
                  </h4>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', maxWidth: '340px', lineHeight: 1.45, margin: '0 0 1rem' }}>
                    Click or tap falling bedtime objects before they disappear past the chimneys. Score 80+ in 20 seconds!
                  </p>
                  <button
                    onClick={startGame}
                    className="retro-btn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.65rem 1.4rem',
                      borderRadius: '10px',
                      backgroundColor: 'var(--color-gold)',
                      color: '#26160f',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(255, 216, 138, 0.5)'
                    }}
                  >
                    <Play size={16} />
                    Start 20s Round
                  </button>
                </div>
              )}

              {/* WIN STATE OVERLAY */}
              {gameState === 'won' && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(5, 7, 24, 0.88)',
                    padding: '1.5rem',
                    textAlign: 'center',
                    zIndex: 10
                  }}
                >
                  <Award size={40} color="#ffd88a" />
                  <span className="font-mono" style={{ color: '#ffd88a', fontSize: '0.74rem', marginTop: '0.4rem', fontWeight: 700 }}>
                    ★ NIGHTTIME CALIBRATION COMPLETE! ★
                  </span>
                  <h4 className="font-serif" style={{ color: '#ffffff', margin: '0.25rem 0 0.4rem', fontSize: '1.35rem' }}>
                    You Hold the Night Together!
                  </h4>
                  <p style={{ color: '#fbcfe8', fontSize: '0.85rem', maxWidth: '360px', lineHeight: 1.45, fontStyle: 'italic', margin: '0 0 1rem' }}>
                    "You caught every drifting starlight mote! The nursery dreams are tucked in velvet calm tonight." — Pip
                  </p>
                  <div style={{ display: 'flex', gap: '0.65rem' }}>
                    <button
                      onClick={startGame}
                      className="retro-btn"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.55rem 1.15rem',
                        borderRadius: '8px',
                        backgroundColor: 'var(--color-gold)',
                        color: '#26160f',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <RotateCcw size={14} />
                      Play Again
                    </button>
                    <button
                      onClick={() => setActiveTab('journal')}
                      className="retro-btn"
                      style={{
                        padding: '0.55rem 1rem',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                        color: '#ffffff',
                        border: '1.5px solid rgba(255,255,255,0.4)',
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    >
                      Back to Journal
                    </button>
                  </div>
                </div>
              )}

              {/* GAMEOVER STATE OVERLAY */}
              {gameState === 'gameover' && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(5, 7, 24, 0.88)',
                    padding: '1.5rem',
                    textAlign: 'center',
                    zIndex: 10
                  }}
                >
                  <div style={{ fontSize: '2rem' }}>🌙</div>
                  <h4 className="font-serif" style={{ color: '#ffffff', margin: '0.4rem 0 0.25rem', fontSize: '1.25rem' }}>
                    Dawn Arrived Gently!
                  </h4>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', maxWidth: '340px', lineHeight: 1.45, margin: '0 0 1rem' }}>
                    You scored {score} / {WIN_SCORE_THRESHOLD} points. "The slumber clouds were slippery tonight! Pip has another dream jar ready."
                  </p>
                  <div style={{ display: 'flex', gap: '0.65rem' }}>
                    <button
                      onClick={startGame}
                      className="retro-btn"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.55rem 1.15rem',
                        borderRadius: '8px',
                        backgroundColor: 'var(--color-gold)',
                        color: '#26160f',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <RotateCcw size={14} />
                      Try Again
                    </button>
                    <button
                      onClick={() => setActiveTab('journal')}
                      className="retro-btn"
                      style={{
                        padding: '0.55rem 1rem',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                        color: '#ffffff',
                        border: '1.5px solid rgba(255,255,255,0.4)',
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    >
                      Back to Journal
                    </button>
                  </div>
                </div>
              )}

              {/* Falling Dream Objects */}
              {objects.map((obj) => (
                <button
                  key={obj.id}
                  onClick={() => handleCatchObject(obj.id, obj.points)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCatchObject(obj.id, obj.points);
                    }
                  }}
                  aria-label={`Catch ${obj.label} for ${obj.points} points`}
                  style={{
                    position: 'absolute',
                    top: `${obj.y}px`,
                    left: `${obj.x}%`,
                    transform: 'translate(-50%, 0)',
                    background: 'none',
                    border: 'none',
                    padding: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: 5,
                    filter: 'drop-shadow(0 0 8px #ffd88a)',
                    transition: 'transform 0.1s ease'
                  }}
                >
                  <span style={{ fontSize: '1.6rem', userSelect: 'none' }}>{obj.emoji}</span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.65rem',
                      color: '#ffd88a',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      padding: '1px 4px',
                      borderRadius: '4px'
                    }}
                  >
                    +{obj.points}
                  </span>
                </button>
              ))}
            </div>

            {/* Bottom Controls / Exit */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Tip: Click or tap any object to catch it.
              </span>
              <button
                onClick={handleClose}
                className="retro-btn"
                style={{
                  padding: '0.45rem 1.1rem',
                  fontSize: '0.78rem',
                  backgroundColor: 'transparent',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Exit Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EasterEggModal;
