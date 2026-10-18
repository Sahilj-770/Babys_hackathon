import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Gamepad2,
  Trophy,
  Timer,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Star,
  Cloud,
  Moon,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface FallingObject {
  id: number;
  type: 'star' | 'cloud' | 'lantern' | 'spark';
  points: number;
  label: string;
  x: number; // percentage (5 - 90%)
  y: number; // percentage (0 - 85%)
  speed: number;
  color: string;
}

const HIGH_SCORE_KEY = 'pip_dreamos_arcade_highscore_v1';

export const SecretArcadePage: React.FC = () => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'victory' | 'gameover'>('idle');
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(HIGH_SCORE_KEY);
        return stored ? parseInt(stored, 10) : 110;
      }
    } catch {
      // ignore
    }
    return 110;
  });
  const [fallingItems, setFallingItems] = useState<FallingObject[]>([]);
  const nextIdRef = useRef<number>(1);
  const scoreRef = useRef<number>(0);

  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const finishGame = useCallback(() => {
    const finalScore = scoreRef.current;
    if (finalScore >= 80) {
      setGameState('victory');
      soundEngine.playCelebrationChime();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ffd88a', '#ff9e7d', '#c4b5fd', '#86efac']
      });
    } else {
      setGameState('gameover');
      soundEngine.playClick(280);
    }

    setHighScore((prev) => {
      if (finalScore > prev) {
        try {
          localStorage.setItem(HIGH_SCORE_KEY, finalScore.toString());
        } catch {
          // ignore
        }
        return finalScore;
      }
      return prev;
    });
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, finishGame]);

  // Object Spawner Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawner = setInterval(() => {
      setFallingItems((prev) => {
        if (prev.length >= 6) return prev;
        const types: Array<{ type: 'star' | 'cloud' | 'lantern' | 'spark'; points: number; label: string; color: string }> = [
          { type: 'star', points: 10, label: '+10 Star', color: '#ffd88a' },
          { type: 'cloud', points: 15, label: '+15 Cloud', color: '#ffffff' },
          { type: 'lantern', points: 20, label: '+20 Lantern', color: '#ffb3ba' },
          { type: 'spark', points: 25, label: '+25 Constellation', color: '#c4b5fd' }
        ];
        const pick = types[Math.floor(Math.random() * types.length)];
        const newItem: FallingObject = {
          id: nextIdRef.current++,
          type: pick.type,
          points: pick.points,
          label: pick.label,
          x: Math.floor(8 + Math.random() * 80),
          y: Math.floor(10 + Math.random() * 65),
          speed: 1,
          color: pick.color
        };
        return [...prev, newItem];
      });
    }, 750);

    return () => clearInterval(spawner);
  }, [gameState]);

  // Start game handler
  const handleStartGame = () => {
    scoreRef.current = 0;
    setScore(0);
    setTimeLeft(20);
    setFallingItems([]);
    setGameState('playing');
    soundEngine.playClick(580);
    soundEngine.playMusicBoxNote(523.25, 1.0);
  };

  // Catch object click
  const handleCatchItem = (id: number, points: number) => {
    soundEngine.playCatchBubble(440 + points * 18);
    setScore((s) => {
      const next = s + points;
      scoreRef.current = next;
      return next;
    });
    setFallingItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div
      className="secret-arcade-page"
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: '2rem 1.5rem 5rem',
        backgroundColor: '#04050f',
        color: '#fff8f1'
      }}
    >
      {/* Background Retro Grid / Scanlines */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(119, 125, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(119, 125, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Navigation Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <Link
            to="/"
            onClick={() => soundEngine.playClick(440)}
            className="retro-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 1rem',
              fontSize: '0.82rem',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#ffd88a',
              textDecoration: 'none',
              borderColor: 'rgba(255, 216, 138, 0.4)'
            }}
          >
            <ArrowLeft size={14} />
            <span className="font-mono">Return to Nursery</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              className="font-mono"
              style={{
                fontSize: '0.75rem',
                color: '#ffd88a',
                backgroundColor: 'rgba(255, 216, 138, 0.15)',
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                border: '1px solid rgba(255, 216, 138, 0.4)'
              }}
            >
              ★ SECRET ROOM UNLOCKED
            </span>
          </div>
        </div>

        {/* Arcade Cabinet Frame */}
        <div
          style={{
            borderRadius: '24px',
            border: '2px solid rgba(255, 216, 138, 0.5)',
            backgroundColor: '#07091d',
            boxShadow: '0 0 40px rgba(255, 216, 138, 0.25), 0 25px 60px rgba(0, 0, 0, 0.8)',
            overflow: 'hidden'
          }}
        >
          {/* Arcade Cabinet Marquee Header */}
          <div
            style={{
              padding: '1.25rem 2rem',
              backgroundColor: '#0c0f2b',
              borderBottom: '2px solid rgba(255, 216, 138, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 216, 138, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #ffd88a'
                }}
              >
                <Gamepad2 size={20} color="#ffd88a" />
              </div>
              <div>
                <h1 className="font-mono" style={{ fontSize: '1.15rem', color: '#ffd88a', margin: 0, letterSpacing: '0.08em' }}>
                  PIP_ARCADE_99 // CATCH-A-DREAM
                </h1>
                <span style={{ fontSize: '0.74rem', color: '#a3a8d8' }}>
                  Tactile 20s Bedtime Mini-Game • Web Audio Pops
                </span>
              </div>
            </div>

            {/* Score & Telemetry Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                className="font-mono"
                style={{
                  padding: '0.35rem 0.85rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <Trophy size={14} color="#ffd88a" />
                <span>HIGH: {highScore}</span>
              </div>

              <div
                className="font-mono"
                style={{
                  padding: '0.35rem 0.85rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <Timer size={14} color="#86efac" />
                <span>TIME: {timeLeft}s</span>
              </div>
            </div>
          </div>

          {/* Interactive Screen Stage */}
          <div
            ref={gameAreaRef}
            style={{
              position: 'relative',
              width: '100%',
              height: '420px',
              backgroundColor: '#02030a',
              overflow: 'hidden',
              cursor: gameState === 'playing' ? 'crosshair' : 'default',
              userSelect: 'none'
            }}
          >
            {/* Twinkling ambient star background */}
            <div className="midnight-celestial-stars" style={{ opacity: 0.6 }} />

            {/* Distant Nursery Rooftops Silhouette */}
            <svg
              viewBox="0 0 800 120"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '90px',
                pointerEvents: 'none'
              }}
              preserveAspectRatio="none"
            >
              <path
                d="M0 120 L0 80 L60 50 L120 80 L180 60 L240 90 L300 40 L360 80 L440 60 L500 90 L560 50 L620 80 L700 45 L800 80 L800 120 Z"
                fill="#070a1e"
              />
            </svg>

            {/* In-Game Falling / Floating Dream Targets */}
            {gameState === 'playing' &&
              fallingItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleCatchItem(item.id, item.points)}
                  style={{
                    position: 'absolute',
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    transform: 'translate(-50%, -50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    transition: 'transform 0.15s ease',
                    animation: 'float 2s ease-in-out infinite'
                  }}
                  title={`Catch ${item.label}`}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      border: `1.5px solid ${item.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 0 20px ${item.color}`,
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    {item.type === 'star' && <Star size={20} color={item.color} fill={item.color} />}
                    {item.type === 'cloud' && <Cloud size={20} color={item.color} fill={item.color} />}
                    {item.type === 'lantern' && <Sparkles size={20} color={item.color} />}
                    {item.type === 'spark' && <Zap size={20} color={item.color} />}
                  </div>

                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.68rem',
                      color: item.color,
                      fontWeight: 700,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      padding: '0.1rem 0.35rem',
                      borderRadius: '4px'
                    }}
                  >
                    +{item.points}
                  </span>
                </button>
              ))}

            {/* Overlay: Ready to Play (idle) */}
            {gameState === 'idle' && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(4, 6, 22, 0.85)',
                  textAlign: 'center',
                  padding: '2rem'
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 216, 138, 0.15)',
                    border: '2px solid #ffd88a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    boxShadow: '0 0 30px rgba(255, 216, 138, 0.4)'
                  }}
                >
                  <Sparkles size={32} color="#ffd88a" />
                </div>

                <h2 className="font-serif" style={{ fontSize: '2rem', color: '#fff8f1', margin: '0 0 0.5rem 0' }}>
                  Catch Pip's Bedtime Stars
                </h2>

                <p style={{ color: '#c9ceff', maxWidth: '440px', fontSize: '0.94rem', lineHeight: 1.55, margin: '0 0 1.5rem 0' }}>
                  Click or tap floating stars, clouds, and lanterns before the 20-second bedtime timer expires. Reach 80 points to win Pip's Dream Master badge!
                </p>

                <button
                  onClick={handleStartGame}
                  className="retro-btn"
                  style={{
                    backgroundColor: '#ffd88a',
                    color: '#26160f',
                    borderColor: '#ffd88a',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    padding: '0.85rem 2.2rem',
                    boxShadow: '0 0 30px rgba(255, 216, 138, 0.6)'
                  }}
                >
                  <Sparkles size={16} />
                  <span>START MINI-GAME (20s)</span>
                </button>
              </div>
            )}

            {/* Overlay: Victory */}
            {gameState === 'victory' && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(4, 6, 22, 0.9)',
                  textAlign: 'center',
                  padding: '2rem'
                }}
              >
                <CheckCircle2 size={54} color="#86efac" style={{ marginBottom: '0.75rem' }} />
                <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#86efac', margin: '0 0 0.35rem 0' }}>
                  Sweet Dreams Achieved!
                </h2>
                <div className="font-mono" style={{ fontSize: '1.1rem', color: '#ffd88a', marginBottom: '0.75rem' }}>
                  FINAL SCORE: {score} / 80 TARGET
                </div>
                <p style={{ color: '#c9ceff', maxWidth: '420px', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                  You caught enough slumber motes to fill tonight's nursery lanterns. Pip smiles with quiet contentment.
                </p>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={handleStartGame}
                    className="retro-btn"
                    style={{
                      backgroundColor: '#ffd88a',
                      color: '#26160f',
                      borderColor: '#ffd88a',
                      fontWeight: 700,
                      padding: '0.65rem 1.4rem'
                    }}
                  >
                    <RotateCcw size={14} />
                    <span>Play Again</span>
                  </button>

                  <Link
                    to="/"
                    className="retro-btn"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff8f1',
                      borderColor: 'rgba(255, 255, 255, 0.25)',
                      padding: '0.65rem 1.4rem',
                      textDecoration: 'none'
                    }}
                  >
                    <span>Return to Nursery</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Overlay: Game Over (Under 80 pts) */}
            {gameState === 'gameover' && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(4, 6, 22, 0.9)',
                  textAlign: 'center',
                  padding: '2rem'
                }}
              >
                <Moon size={48} color="#ffd88a" style={{ marginBottom: '0.75rem' }} />
                <h2 className="font-serif" style={{ fontSize: '2rem', color: '#fff8f1', margin: '0 0 0.35rem 0' }}>
                  Time's Up!
                </h2>
                <div className="font-mono" style={{ fontSize: '1rem', color: '#ffb3ba', marginBottom: '0.75rem' }}>
                  SCORE: {score} (Needed 80 pts)
                </div>
                <p style={{ color: '#c9ceff', maxWidth: '400px', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                  The midnight clock chimed before the lanterns were fully filled. Try again to reach the bedtime quota!
                </p>

                <button
                  onClick={handleStartGame}
                  className="retro-btn"
                  style={{
                    backgroundColor: '#ffd88a',
                    color: '#26160f',
                    borderColor: '#ffd88a',
                    fontWeight: 700,
                    padding: '0.65rem 1.5rem'
                  }}
                >
                  <RotateCcw size={14} />
                  <span>Try Again</span>
                </button>
              </div>
            )}
          </div>

          {/* Arcade Cabinet Control Footer */}
          <div
            style={{
              padding: '1.25rem 2rem',
              backgroundColor: '#0c0f2b',
              borderTop: '2px solid rgba(255, 216, 138, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div className="font-mono" style={{ fontSize: '0.8rem', color: '#c9ceff' }}>
              CURRENT SCORE:{' '}
              <span style={{ color: '#ffd88a', fontSize: '1.1rem', fontWeight: 700 }}>{score}</span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {gameState === 'playing' && (
                <button
                  onClick={() => {
                    setGameState('idle');
                    setFallingItems([]);
                  }}
                  className="retro-btn"
                  style={{
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.76rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <span>Pause / Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecretArcadePage;
