import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { Sparkles, ArrowDown, BedDouble, Compass, Wand2, Star } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface HeroSectionProps {
  onOpenSecret?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenSecret }) => {
  const [isNodding, setIsNodding] = useState(false);
  const [stardustBurst, setStardustBurst] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);
  const [secretHint, setSecretHint] = useState<string | null>(null);
  const [isSleepy, setIsSleepy] = useState(false);
  const [lanternIgnited, setLanternIgnited] = useState(false);
  const [musicBoxPlaying, setMusicBoxPlaying] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const portraitColRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const idleTimerRef = useRef<number | null>(null);

  // Play a gentle 3-note lullaby arpeggio for music box diagnostic
  const handlePlayMusicBoxChime = () => {
    if (musicBoxPlaying) return;
    setMusicBoxPlaying(true);
    soundEngine.playMusicBoxNote(523.25, 0.8);
    setTimeout(() => soundEngine.playMusicBoxNote(659.25, 0.9), 160);
    setTimeout(() => soundEngine.playMusicBoxNote(783.99, 1.2), 320);
    setTimeout(() => setMusicBoxPlaying(false), 1200);
  };

  const handleToggleSleepyMode = () => {
    soundEngine.playClick(isSleepy ? 520 : 380);
    setIsSleepy((prev) => !prev);
  };

  // Subtle entrance reveal on mount & Inactivity idle loop
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0.85, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }

    const resetIdle = () => {
      setIsSleepy(false);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => {
        setIsSleepy(true);
      }, 12000);
    };

    window.addEventListener('pointermove', resetIdle, { passive: true });
    window.addEventListener('keydown', resetIdle, { passive: true });
    idleTimerRef.current = window.setTimeout(() => setIsSleepy(true), 12000);

    return () => {
      window.removeEventListener('pointermove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Fine-pointer mouse movement handler: Direct CSS variables, zero React re-render thrashing
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const isFine = window.matchMedia('(pointer: fine)').matches;
    if (!isFine || !portraitColRef.current) return;
    const rect = portraitColRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    portraitColRef.current.style.setProperty('--pip-tilt-x', `${(x * 16).toFixed(2)}deg`);
    portraitColRef.current.style.setProperty('--pip-tilt-y', `${(-y * 16).toFixed(2)}deg`);
  };

  const handleMouseLeave = () => {
    if (!portraitColRef.current) return;
    portraitColRef.current.style.setProperty('--pip-tilt-x', '0deg');
    portraitColRef.current.style.setProperty('--pip-tilt-y', '0deg');
  };

  // Touch alternative for mobile & tablets
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current || !portraitColRef.current || e.touches.length !== 1) return;
    const rect = portraitColRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const dx = Math.max(-1, Math.min(1, (touch.clientX - rect.left) / rect.width - 0.5));
    const dy = Math.max(-1, Math.min(1, (touch.clientY - rect.top) / rect.height - 0.5));
    portraitColRef.current.style.setProperty('--pip-tilt-x', `${(dx * 12).toFixed(2)}deg`);
    portraitColRef.current.style.setProperty('--pip-tilt-y', `${(-dy * 12).toFixed(2)}deg`);
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
    if (portraitColRef.current) {
      portraitColRef.current.style.setProperty('--pip-tilt-x', '0deg');
      portraitColRef.current.style.setProperty('--pip-tilt-y', '0deg');
    }
  };

  // Coordinated hover on primary action buttons
  const handleButtonHover = (leanAngle: string) => {
    if (portraitColRef.current) {
      portraitColRef.current.style.setProperty('--pip-lean', leanAngle);
      portraitColRef.current.style.setProperty('--pip-halo-scale', '1.18');
    }
  };

  const handleButtonLeave = () => {
    if (portraitColRef.current) {
      portraitColRef.current.style.setProperty('--pip-lean', '0deg');
      portraitColRef.current.style.setProperty('--pip-halo-scale', '1');
    }
  };

  // Tap Pip for sleepy nod gesture
  const handlePortraitTap = () => {
    if (isNodding) return;
    setIsNodding(true);
    soundEngine.playClick(520);
    soundEngine.playMusicBoxNote(659.25, 1.2);
    setTimeout(() => setIsNodding(false), 550);
  };

  // Starlight action
  const handleWhisperStardust = () => {
    soundEngine.playMusicBoxNote(783.99, 1.6);
    setStardustBurst(true);
    setTimeout(() => setStardustBurst(false), 1400);
  };

  // Starlight lantern click reaction
  const handleLanternClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (lanternIgnited) return;
    setLanternIgnited(true);
    soundEngine.playClick(620);
    soundEngine.playMusicBoxNote(587.33, 1.4);
    setTimeout(() => setLanternIgnited(false), 1600);
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
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3.5rem 1.5rem 4rem',
        overflow: 'hidden'
      }}
    >
      {/* Warm atmospheric paper grain & celestial radial lighting */}
      <div className="hero-warm-glow" />

      {/* Background Celestial Astrolabe Coordinate Grid */}
      <div className="hero-astrolabe-grid" aria-hidden="true">
        <svg
          viewBox="0 0 900 900"
          style={{ width: '100%', height: '100%' }}
          fill="none"
          stroke="currentColor"
        >
          {/* Concentric Astrolabe Brass Rings */}
          <circle cx="450" cy="450" r="420" stroke="var(--color-gold)" strokeWidth="1" strokeDasharray="3 4" />
          <circle cx="450" cy="450" r="340" stroke="var(--color-gold)" strokeWidth="0.8" />
          <circle cx="450" cy="450" r="260" stroke="var(--color-berry)" strokeWidth="0.8" strokeDasharray="6 6" />
          <circle cx="450" cy="450" r="180" stroke="var(--color-gold)" strokeWidth="0.8" />
          <circle cx="450" cy="450" r="100" stroke="var(--color-berry)" strokeWidth="0.6" strokeDasharray="2 3" />

          {/* Cardinal & Equatorial Lines */}
          <line x1="30" y1="450" x2="870" y2="450" stroke="var(--color-gold)" strokeWidth="0.75" />
          <line x1="450" y1="30" x2="450" y2="870" stroke="var(--color-gold)" strokeWidth="0.75" />
          <line x1="150" y1="150" x2="750" y2="750" stroke="var(--color-gold)" strokeWidth="0.5" strokeDasharray="4 8" />
          <line x1="150" y1="750" x2="750" y2="150" stroke="var(--color-gold)" strokeWidth="0.5" strokeDasharray="4 8" />

          {/* Celestial Astrolabe Ticks & Coordinates */}
          <text x="460" y="55" fill="var(--color-gold)" fontSize="11" fontFamily="var(--font-mono)" letterSpacing="0.1em">
            DEC: +43° 21' 08"
          </text>
          <text x="730" y="445" fill="var(--color-gold)" fontSize="11" fontFamily="var(--font-mono)" letterSpacing="0.1em">
            RA: 23h 59m 42s
          </text>
          <text x="210" y="445" fill="var(--color-gold)" fontSize="11" fontFamily="var(--font-mono)" letterSpacing="0.1em">
            ZENITH: 432 Hz
          </text>
          <text x="460" y="860" fill="var(--color-gold)" fontSize="11" fontFamily="var(--font-mono)" letterSpacing="0.1em">
            NADIR: DAWN_ROUTE
          </text>
        </svg>
      </div>

      {/* Floating celestial decorative star icons */}
      <div className="hero-celestial-layer" aria-hidden="true">
        <span className="hero-star star-1">✦</span>
        <span className="hero-star star-2">★</span>
        <span className="hero-star star-3">✦</span>
        <span className="hero-star star-4">✧</span>
      </div>

      <div
        ref={containerRef}
        className="hero-container"
        style={{
          maxWidth: '1280px',
          width: '100%',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Retro 1999 DreamOS Terminal Top Bezel Strip */}
        <div className="dream-terminal-bezel font-mono">
          <div className="terminal-led-group">
            <span className="terminal-led led-amber" title="Clock Sync: Synchronized to 23:59" />
            <span className="terminal-led led-green" title="Slumber Daemon: Online" />
            <span style={{ fontWeight: 700, letterSpacing: '0.04em' }}>
              PIP://MIDNIGHT_TERMINAL_V1.99
            </span>
          </div>
          <div className="terminal-metrics-group">
            <span className="terminal-chip">KERNEL: VELVET_OS</span>
            <span className="terminal-chip">FREQ: 432 Hz</span>
            <span className="terminal-chip" style={{ color: '#10b981' }}>
              BUFFER: READY
            </span>
          </div>
        </div>

        {/* Asymmetrical 2-Column Editorial Poster Grid */}
        <div className="hero-grid">
          {/* Left Column: Asymmetric Editorial Composition */}
          <div className="hero-text-col" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Subtle monospaced metadata badge */}
            <div className="hero-canon-badge-wrap" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
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
                ATTIC BENCH • CANON NO. 01
              </span>
            </div>

            {/* Majestic Editorial Headline with deliberate poetic breaks */}
            <h1
              className="font-serif hero-headline"
              style={{
                fontSize: 'clamp(2.6rem, 5vw, 4.3rem)',
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

            {/* Storybook Archival Card / Marginalia */}
            <div className="hero-story-index-card">
              <div className="hero-story-header font-mono">
                <span>✦ ATTIC BEDTIME DISPATCH ✦</span>
                <span style={{ opacity: 0.8 }}>23:59:42 MIDNIGHT</span>
              </div>
              <p
                style={{
                  fontSize: 'clamp(0.98rem, 1.4vw, 1.12rem)',
                  lineHeight: 1.6,
                  color: 'var(--text-main)',
                  margin: 0,
                  marginBottom: '0.55rem'
                }}
              >
                Meet <strong>Pip</strong>, the Skull Baby with soft glowing eye sockets, a starry bedtime
                nightcap with a soft pink bow, and a gentle crooked smile.
              </p>
              <p
                style={{
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                  color: 'var(--text-muted)',
                  margin: 0
                }}
              >
                From the quiet attics of Midnight Nursery, Pip calibrates 432 Hz lullaby chimes, tends
                sleepy starlight lanterns, and dispatches sweet slumber over rooftops before the dawn.
              </p>
            </div>

            {/* Interactive Slumber Diagnostics Console Strip */}
            <div className="hero-console-bar" role="toolbar" aria-label="Bedtime Diagnostics Console">
              <button
                type="button"
                onClick={handleLanternClick}
                className={`console-key-btn ${lanternIgnited ? 'active-indicator' : ''}`}
                title="Ignite Pip's lantern to gather golden starlight"
              >
                <Sparkles size={12} color="var(--color-gold)" />
                <span>LANTERN: {lanternIgnited ? 'IGNITED ✦' : 'BURNING'}</span>
              </button>

              <button
                type="button"
                onClick={handlePlayMusicBoxChime}
                className={`console-key-btn ${musicBoxPlaying ? 'active-indicator' : ''}`}
                title="Play 432 Hz lullaby chime calibration"
              >
                <span>♪</span>
                <span>CHIME: {musicBoxPlaying ? '432 Hz [PLAYING]' : '432 Hz (TUNED)'}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleSleepyMode}
                className={`console-key-btn ${isSleepy ? 'active-indicator' : ''}`}
                title="Toggle Pip's awake or sleepy state"
              >
                <span>{isSleepy ? '✦ z Z' : '✧ 99'}</span>
                <span>STATE: {isSleepy ? 'SLEEPY' : 'READY'}</span>
              </button>
            </div>

            {/* Prominent Action Callouts */}
            <div
              className="hero-actions-bar"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
                marginTop: '0.4rem'
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
                onMouseEnter={() => handleButtonHover('-3deg')}
                onMouseLeave={handleButtonLeave}
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
                onMouseEnter={() => handleButtonHover('3deg')}
                onMouseLeave={handleButtonLeave}
              >
                <Compass size={17} color="var(--color-berry)" />
                <span>Read Origin Story</span>
              </a>

              <button
                onClick={handleWhisperStardust}
                onMouseEnter={() => handleButtonHover('-2deg')}
                onMouseLeave={handleButtonLeave}
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
            ref={portraitColRef}
            onMouseMove={handleMouseMove}
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
              className={`pip-master-artwork ${isSleepy ? 'pip-sleepy' : ''}`}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '380px',
                aspectRatio: '682 / 1024',
                transform: isNodding
                  ? 'translateY(10px) rotate(2.5deg) scale(0.97)'
                  : 'rotateY(var(--pip-tilt-x, 0deg)) rotateX(var(--pip-tilt-y, 0deg)) rotate(var(--pip-lean, 0deg))',
                transition: 'transform 0.22s cubic-bezier(0.25, 1, 0.5, 1)',
                cursor: 'pointer',
                zIndex: 2
              }}
              title="Click or tap Pip to say hello"
              aria-label="Pip the Skull Baby, official centerpiece portrait. Tap to greet Pip."
            >
              {/* Sleepy idle Zzz floating glyph */}
              {isSleepy && (
                <div className="pip-sleepy-glyph" aria-hidden="true">
                  <span>✦</span>
                  <span className="sleepy-z1">z</span>
                  <span className="sleepy-z2">Z</span>
                </div>
              )}

              {/* Interactive Starlight Lantern Click Target */}
              <button
                type="button"
                className={`pip-lantern-hotspot ${lanternIgnited ? 'ignited' : ''}`}
                onClick={handleLanternClick}
                title="Touch Pip's Bedtime Lantern"
                aria-label="Touch Pip's Bedtime Lantern for warm starlight glow"
              >
                <span className="lantern-pulse-ring" />
                <span className="lantern-center-spark">✧</span>
              </button>

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
                  filter: lanternIgnited
                    ? 'drop-shadow(0 20px 45px rgba(255, 216, 138, 0.6)) drop-shadow(0 0 65px rgba(255, 230, 160, 0.85))'
                    : 'drop-shadow(0 20px 35px rgba(92, 64, 51, 0.16)) drop-shadow(0 0 50px rgba(255, 216, 138, 0.55))',
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
              <div className="hero-canon-stamp font-mono">
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
      </div>
    </section>
  );
};
