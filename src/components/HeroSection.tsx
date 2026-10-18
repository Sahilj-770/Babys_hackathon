import React, { useRef, useState } from 'react';
import { Sparkles, ArrowDown, BedDouble, Compass, Wand2, Star } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface HeroSectionProps {
  onOpenSecret?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenSecret }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isNodding, setIsNodding] = useState(false);
  const [stardustBurst, setStardustBurst] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);
  const [secretHint, setSecretHint] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Fine-pointer mouse movement handler for organic parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const isFine = window.matchMedia('(pointer: fine)').matches;
    if (!isFine || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 18, y: -y * 18 });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTilt({ x: 0, y: 0 });
  };

  // Touch alternative for mobile & tablets
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
    setTilt({ x: dx * 14, y: -dy * 14 });
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
    setTilt({ x: 0, y: 0 });
  };

  // Tap Pip for sleepy nod gesture
  const handlePortraitTap = () => {
    if (isNodding) return;
    setIsNodding(true);
    soundEngine.playClick(520);
    soundEngine.playMusicBoxNote(659.25, 1.2);
    setTimeout(() => setIsNodding(false), 550);
  };

  // Stardust action
  const handleWhisperStardust = () => {
    soundEngine.playMusicBoxNote(783.99, 1.6);
    setStardustBurst(true);
    setTimeout(() => setStardustBurst(false), 1400);
  };

  // 3-click secret star Easter egg
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

  return (
    <section
      id="about"
      className="hero-editorial-section"
      style={{
        position: 'relative',
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        padding: '5rem 1.5rem 4rem',
        overflow: 'hidden'
      }}
    >
      {/* Warm atmospheric paper grain & celestial radial lighting */}
      <div className="hero-warm-glow" />

      {/* Floating celestial decorative star icons */}
      <div className="hero-celestial-layer" aria-hidden="true">
        <span className="hero-star star-1">✦</span>
        <span className="hero-star star-2">★</span>
        <span className="hero-star star-3">✦</span>
        <span className="hero-star star-4">✧</span>
      </div>

      <div
        className="hero-container"
        style={{
          maxWidth: '1240px',
          width: '100%',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
          gap: '3rem',
          alignItems: 'center'
        }}
      >
        {/* Left Column: Asymmetric Editorial Composition */}
        <div className="hero-text-col" style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          {/* Subtle monospaced metadata badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div
              className="font-mono hero-canon-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.95rem',
                backgroundColor: 'rgba(163, 64, 99, 0.08)',
                border: '1px solid rgba(163, 64, 99, 0.25)',
                borderRadius: '999px',
                fontSize: '0.76rem',
                color: 'var(--color-berry)',
                letterSpacing: '0.04em'
              }}
            >
              <Sparkles size={13} color="var(--color-berry)" />
              <span>PIP // JUNIOR DREAM ENGINEER</span>
            </div>

            <span
              className="font-mono"
              style={{
                fontSize: '0.74rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.05em'
              }}
            >
              MIDNIGHT NURSERY • V1.99
            </span>
          </div>

          {/* Majestic Editorial Headline with deliberate poetic breaks */}
          <h1
            className="font-serif hero-headline"
            style={{
              fontSize: 'clamp(2.6rem, 5.2vw, 4.4rem)',
              lineHeight: 1.08,
              color: 'var(--text-heading)',
              letterSpacing: '-0.02em',
              fontWeight: 700,
              margin: 0
            }}
          >
            "I build the dreams <br />
            <span style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--color-berry)' }}>
              you fall asleep
            </span>{' '}
            inside."
          </h1>

          {/* Refined Character Introduction */}
          <div style={{ maxWidth: '580px' }}>
            <p
              style={{
                fontSize: 'clamp(1.02rem, 1.5vw, 1.2rem)',
                lineHeight: 1.6,
                color: 'var(--text-muted)',
                marginBottom: '0.75rem'
              }}
            >
              Meet <strong>Pip</strong>, the Skull Baby with soft glowing eye sockets, a starry bedtime
              nightcap with a soft pink bow, and a gentle crooked smile.
            </p>
            <p
              style={{
                fontSize: '0.94rem',
                lineHeight: 1.55,
                color: 'var(--text-main)',
                opacity: 0.85
              }}
            >
              From the quiet attics of Midnight Nursery, Pip calibrates 432 Hz lullaby chimes, tends
              sleepy starlight lanterns, and dispatches sweet slumber over rooftops before the dawn.
            </p>
          </div>

          {/* Tactile System Telemetry Capsule */}
          <div
            className="hero-telemetry-capsule font-mono"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1.25rem',
              padding: '0.6rem 1.1rem',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 4px 14px rgba(92, 64, 51, 0.05)',
              width: 'fit-content',
              fontSize: '0.72rem',
              color: 'var(--text-muted)'
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#4ade80',
                  boxShadow: '0 0 6px #4ade80'
                }}
              />
              EYES: SOFT GLOW
            </span>
            <span style={{ opacity: 0.4 }}>|</span>
            <span>HEART: GENTLE</span>
            <span style={{ opacity: 0.4 }}>|</span>
            <span>FREQ: 432 Hz</span>
          </div>

          {/* Prominent Action Callouts */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginTop: '0.5rem'
            }}
          >
            <a
              href="#awakening"
              className="retro-btn hero-primary-btn"
              style={{
                backgroundColor: 'var(--color-berry)',
                color: '#ffffff',
                borderColor: 'var(--color-berry)',
                boxShadow: '4px 4px 0px var(--color-cocoa)',
                padding: '0.85rem 1.65rem',
                fontSize: '0.96rem'
              }}
              onClick={() => soundEngine.playMusicBoxNote(523.25)}
            >
              <BedDouble size={18} />
              <span>Explore Dream Labs</span>
              <ArrowDown size={15} />
            </a>

            <a
              href="#story"
              className="retro-btn"
              style={{
                padding: '0.85rem 1.45rem',
                fontSize: '0.96rem',
                backgroundColor: 'var(--bg-surface)'
              }}
              onClick={() => soundEngine.playClick(480)}
            >
              <Compass size={17} color="var(--color-berry)" />
              <span>Read Origin Story</span>
            </a>

            <button
              onClick={handleWhisperStardust}
              className="retro-btn hero-whisper-btn"
              style={{
                padding: '0.85rem 1.15rem',
                fontSize: '0.85rem',
                backgroundColor: 'transparent',
                borderColor: 'var(--color-gold)',
                color: 'var(--text-main)'
              }}
              title="Whisper gentle starlight to Pip"
              aria-label="Whisper starlight to Pip"
            >
              <Wand2 size={15} color="var(--color-berry)" />
              <span>Whisper Stardust</span>
            </button>
          </div>
        </div>

        {/* Right Column: Unboxed Large Pip Centerpiece Artwork */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="hero-visual-col"
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '1200px',
            touchAction: 'pan-y'
          }}
        >
          {/* Multi-layered celestial aureole glow behind Pip */}
          <div
            className={`pip-radiant-halo ${stardustBurst ? 'burst-active' : ''}`}
            aria-hidden="true"
          />

          {/* Organic Stardust orbital particles */}
          <div className="pip-orbital-ring" aria-hidden="true">
            <span className="orbit-star o1">✦</span>
            <span className="orbit-star o2">★</span>
            <span className="orbit-star o3">✧</span>
            <span className="orbit-star o4">✦</span>
          </div>

          {/* Unboxed Large Pip Artwork Anchor */}
          <div
            onClick={handlePortraitTap}
            className="pip-master-artwork"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '380px',
              aspectRatio: '682 / 1024',
              transform: isNodding
                ? 'translateY(10px) rotate(2.5deg) scale(0.97)'
                : `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
              transition: isHovering
                ? 'transform 0.12s ease-out'
                : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              cursor: 'pointer',
              zIndex: 2
            }}
            title="Click or tap Pip to say hello"
            aria-label="Pip the Skull Baby, official centerpiece portrait. Tap to greet Pip."
          >
            {/* Soft atmospheric base cloud layer */}
            <div
              className="pip-cloud-drift-base"
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '92%',
                height: '48px',
                borderRadius: '999px',
                background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.7) 0%, rgba(255, 248, 241, 0.3) 50%, transparent 80%)',
                filter: 'blur(10px)',
                zIndex: 1,
                pointerEvents: 'none'
              }}
            />

            <img
              src="/assets/pip_portrait.png"
              alt="Pip the Skull Baby, wearing a starry bedtime nightcap with a pink ribbon and a gentle smile"
              className="pip-portrait-main"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                position: 'relative',
                zIndex: 2,
                filter:
                  'drop-shadow(0 20px 35px rgba(92, 64, 51, 0.16)) drop-shadow(0 0 50px rgba(255, 216, 138, 0.55))',
                transition: 'filter 0.4s ease'
              }}
            />
          </div>

          {/* Floating Tactile Bedtime Stamp & Secret Easter Egg Star */}
          <div
            style={{
              position: 'relative',
              marginTop: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              zIndex: 3
            }}
          >
            <div
              className="font-mono hero-status-tag"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.95rem',
                backgroundColor: 'var(--bg-surface)',
                border: '1.5px solid var(--border-color)',
                borderRadius: '999px',
                fontSize: '0.74rem',
                color: 'var(--text-main)',
                boxShadow: '0 4px 12px rgba(92, 64, 51, 0.08)'
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-gold)',
                  boxShadow: '0 0 8px var(--color-gold)'
                }}
              />
              <span>DREAM ENGINEER // CANON NO. 01</span>
            </div>

            {/* Secret Easter Egg 3-click trigger */}
            {onOpenSecret && (
              <div style={{ position: 'relative' }}>
                {secretHint && (
                  <span
                    className="font-mono"
                    style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%) translateY(-6px)',
                      fontSize: '0.68rem',
                      color: 'var(--color-gold)',
                      backgroundColor: 'var(--color-midnight)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '6px',
                      whiteSpace: 'nowrap',
                      border: '1px solid var(--color-gold)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}
                  >
                    {secretHint}
                  </span>
                )}
                <button
                  onClick={handleSecretStarClick}
                  className="hero-secret-star-btn"
                  title="Click secret star 3 times to unlock hidden chamber"
                  aria-label="Secret Easter Egg Star"
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--color-gold)',
                    boxShadow: '0 2px 8px rgba(92, 64, 51, 0.06)'
                  }}
                >
                  <Star size={15} fill="currentColor" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
