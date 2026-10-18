import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, ArrowDown, BedDouble, Terminal, Wand2 } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface HeroSectionProps {
  onOpenSecret?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenSecret }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isNodding, setIsNodding] = useState(false);
  const [awakeningStage, setAwakeningStage] = useState<0 | 1 | 2>(0);
  const [stardustBurst, setStardustBurst] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);
  const [secretHint, setSecretHint] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Signature 5-10 second awakening sequence on mount
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setAwakeningStage(1);
    }, 1600);

    const timer2 = setTimeout(() => {
      setAwakeningStage(2);
    }, 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleAwakenClick = () => {
    soundEngine.playMusicBoxNote(659.25, 1.4);
    setStardustBurst(true);
    setAwakeningStage(2);
    setTimeout(() => setStardustBurst(false), 1200);
  };

  // Fine-pointer mouse movement handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const isFine = window.matchMedia('(pointer: fine)').matches;
    if (!isFine || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 14, y: -y * 14 });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTilt({ x: 0, y: 0 });
  };

  // Safe Touch Alternative: Touch drag tilts Pip gently
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current || !containerRef.current || e.touches.length !== 1) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const dx = Math.max(-1, Math.min(1, (touch.clientX - rect.left) / rect.width - 0.5));
    const dy = Math.max(-1, Math.min(1, (touch.clientY - rect.top) / rect.height - 0.5));
    setTilt({ x: dx * 12, y: -dy * 12 });
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
    setTilt({ x: 0, y: 0 });
  };

  // Safe Touch Alternative: Tap Pip to give a gentle sleepy nod
  const handlePortraitTap = () => {
    if (isNodding) return;
    setIsNodding(true);
    soundEngine.playClick(520);
    setTimeout(() => setIsNodding(false), 500);
  };

  // Hidden Easter Egg: 3 clicks on secret star unlocks chamber
  const handleSecretStarClick = () => {
    const next = secretClicks + 1;
    setSecretClicks(next);
    if (next < 3) {
      soundEngine.playClick(440 + next * 110);
      setSecretHint(`✦ ${3 - next} more click${3 - next === 1 ? '' : 's'}...`);
      setTimeout(() => setSecretHint(null), 2500);
    } else {
      setSecretClicks(0);
      setSecretHint(null);
      soundEngine.playCelebrationChime();
      if (onOpenSecret) onOpenSecret();
    }
  };

  const getStatusText = () => {
    if (awakeningStage === 0) return '● DAEMON BOOTING // SLEEPY EMBER GLOW';
    if (awakeningStage === 1) return '✦ LANTERN IGNITING // 432 Hz TUNING...';
    return '★ ONLINE // EYES GLOWING SOFTLY • HEART GENTLE';
  };

  return (
    <section
      id="about"
      style={{
        position: 'relative',
        padding: '1.25rem 1.25rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      {/* Background ambient radial lantern aura */}
      <div className={`ambient-lantern-glow stage-${awakeningStage}`} />

      {/* Editorial OS Eyebrow */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.3rem 0.85rem',
          backgroundColor: 'var(--bg-retro-panel)',
          border: '1px solid var(--border-color)',
          borderRadius: '999px',
          marginBottom: '0.75rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          zIndex: 1
        }}
        className="font-mono"
      >
        <Sparkles size={13} color="var(--color-berry)" />
        <span>TRACK 1 PORTFOLIO // JUNIOR DREAM ENGINEER</span>
      </div>

      {/* Main Headline */}
      <h1
        className="font-serif"
        style={{
          fontSize: 'clamp(1.9rem, 4.2vw, 3.4rem)',
          lineHeight: 1.15,
          color: 'var(--text-heading)',
          maxWidth: '920px',
          marginBottom: '0.75rem',
          fontWeight: 700,
          zIndex: 1
        }}
      >
        "I build the dreams you fall asleep inside."
      </h1>

      <p
        style={{
          fontSize: 'clamp(0.92rem, 1.4vw, 1.15rem)',
          color: 'var(--text-muted)',
          maxWidth: '680px',
          lineHeight: 1.5,
          marginBottom: '1.5rem',
          zIndex: 1
        }}
      >
        Meet <strong>Pip</strong>, the Skull Baby with soft glowing eye sockets, a starry bedtime nightcap,
        and a gentle crooked smile. Nestled in Midnight Nursery, Pip calibrates bedtime frequencies,
        tends sleepy starlight lanterns, and dispatches sweet slumber across quiet rooftops.
      </p>

      {/* Pip Interactive Centerpiece Window */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`retro-window hero-pip-window awakening-stage-${awakeningStage}`}
        style={{
          maxWidth: '460px',
          width: '100%',
          perspective: '1000px',
          marginBottom: '1.5rem',
          zIndex: 1,
          transition: 'all 0.5s ease',
          touchAction: 'pan-y'
        }}
      >
        <div className="retro-window-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
            <span style={{ marginLeft: '0.35rem', fontSize: '0.72rem' }}>PIP_PORTRAIT.IMG</span>
          </div>

          {/* Secret star easter egg trigger on window title (Requires 3 clicks) */}
          {onOpenSecret && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {secretHint && (
                <span
                  className="font-mono"
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--color-gold)',
                    backgroundColor: 'rgba(92, 64, 51, 0.25)',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '4px'
                  }}
                >
                  {secretHint}
                </span>
              )}
              <button
                onClick={handleSecretStarClick}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)'
                }}
                title="Tap secret star 3 times to unlock hidden chamber"
                aria-label="Secret Easter Egg Star"
              >
                <Sparkles size={12} fill="currentColor" />
                <span>CANON V1</span>
              </button>
            </div>
          )}
        </div>

        <div
          style={{
            padding: '1.25rem 1rem',
            background: 'radial-gradient(circle at center, var(--glow-color) 0%, transparent 70%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          {/* Subtle cursor-responsive & touch-responsive portrait with signature awakening halo */}
          <div
            onClick={handlePortraitTap}
            style={{
              position: 'relative',
              width: '190px',
              height: '190px',
              maxWidth: '65vw',
              maxHeight: '65vw',
              transform: isNodding
                ? 'translateY(6px) rotate(2deg) scale(0.98)'
                : `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
              transition: isHovering
                ? 'transform 0.1s ease-out'
                : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Click or tap Pip to say hello"
            aria-label="Pip portrait centerpiece. Click or tap to say hello"
          >
            {/* Soft Ambient Glow under Pip - scales dynamically during the first 5-10s */}
            <div
              className={`pip-halo-layer ${stardustBurst ? 'stardust-burst' : ''}`}
              style={{
                position: 'absolute',
                width: awakeningStage === 2 ? '180px' : awakeningStage === 1 ? '160px' : '130px',
                height: awakeningStage === 2 ? '180px' : awakeningStage === 1 ? '160px' : '130px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-gold)',
                filter: 'blur(30px)',
                opacity: awakeningStage === 2 ? 0.5 : awakeningStage === 1 ? 0.35 : 0.2,
                transition: 'all 0.8s ease',
                zIndex: 0
              }}
            />

            {/* Floating Stardust Particles */}
            {awakeningStage > 0 && (
              <div className="pip-stardust-container">
                <span className="pip-stardust s1">✦</span>
                <span className="pip-stardust s2">★</span>
                <span className="pip-stardust s3">✦</span>
              </div>
            )}

            <img
              src="/assets/pip_portrait.png"
              alt="Pip the Skull Baby, wearing a starry bedtime nightcap with a pink ribbon, smiling sleepily"
              className={`pip-portrait-img stage-${awakeningStage}`}
              style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter:
                  awakeningStage === 2
                    ? 'drop-shadow(0 0 16px rgba(255, 216, 138, 0.6)) drop-shadow(0 10px 20px rgba(92,64,51,0.2))'
                    : 'drop-shadow(0 10px 20px rgba(92,64,51,0.2))',
                transition: 'filter 0.8s ease'
              }}
            />
          </div>

          {/* Interactive Pip Caption & Awakening Trigger */}
          <div
            style={{
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}
          >
            <div
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-retro-panel)',
                border: '1px solid var(--border-color)',
                fontSize: '0.74rem',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-mono)',
                transition: 'all 0.3s ease'
              }}
            >
              <span>{getStatusText()}</span>
            </div>

            <button
              onClick={handleAwakenClick}
              className="retro-btn"
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.72rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                cursor: 'pointer',
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--color-gold)'
              }}
              title="Send a whisper of starlight to Pip"
              aria-label="Whisper starlight to Pip"
            >
              <Wand2 size={12} color="var(--color-berry)" />
              <span>Whisper Stardust</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Action Callouts - Now fully visible above the 900px fold */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          zIndex: 1
        }}
      >
        <a
          href="#exhibits"
          className="retro-btn"
          style={{
            backgroundColor: 'var(--color-berry)',
            color: '#ffffff',
            borderColor: 'var(--color-berry)',
            boxShadow: '3px 3px 0px var(--color-cocoa)',
            padding: '0.65rem 1.4rem',
            fontSize: '0.9rem'
          }}
          onClick={() => soundEngine.playMusicBoxNote(587.33)}
        >
          <BedDouble size={16} />
          <span>Explore Dream Labs</span>
          <ArrowDown size={14} />
        </a>

        <a
          href="#story"
          className="retro-btn"
          style={{
            padding: '0.65rem 1.3rem',
            fontSize: '0.9rem'
          }}
          onClick={() => soundEngine.playClick(460)}
        >
          <Terminal size={16} />
          <span>Read Pip's Origin Story</span>
        </a>
      </div>
    </section>
  );
};
