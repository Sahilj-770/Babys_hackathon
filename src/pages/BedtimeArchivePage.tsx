import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BookmarkCheck,
  Sparkles,
  Volume2,
  Trash2,
  Copy,
  Check,
  Moon
} from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';
import { getAllSavedTickets, deleteSavedTicket } from '../utils/dreamStorage';
import type { SavedDreamTicket } from '../components/exhibits/DreamForge';

interface StoryChapter {
  id: number;
  act: string;
  title: string;
  subtitle: string;
  story: string;
  wordCount: number;
  color: string;
  noteFreq: number;
  noteName: string;
  assetImg: string;
  bgGlow: string;
}

const CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    act: 'CHAPTER I',
    title: 'The Lost Starlight Lantern',
    subtitle: 'When the nursery lost its golden glow',
    story:
      'Before Pip wore the starry nightcap, Midnight Nursery was quiet and pitch-black. Restless babies tossed in cribs as shadows lengthened across creaking hardwood floors. Pip stumbled upon a hollowed brass lantern buried under discarded music sheets. When Pip touched the glass, a tiny constellation ignited inside, illuminating Pip\'s soft glowing eye sockets with gentle warmth instead of fear. That night, the first baby slept soundly.',
    wordCount: 65,
    color: '#ffd88a',
    noteFreq: 523.25,
    noteName: '523 Hz (Lantern Ember)',
    assetImg: '/assets/pip_dream_lantern.png',
    bgGlow: 'radial-gradient(circle at 30% 50%, rgba(255, 216, 138, 0.25) 0%, transparent 60%)'
  },
  {
    id: 2,
    act: 'CHAPTER II',
    title: 'The Dream-Engine Invention',
    subtitle: 'Gears, velvet ribbons, and 432Hz chimes',
    story:
      'One lantern wasn\'t enough for an entire town of sleepless dreamers. In a dusty nursery alcove, Pip gathered antique clockwork cogs, cotton clouds, and a brass music-box cylinder. Tinkering until dawn with sleepy determination, Pip built DreamOS \'99—a whimsical contraption that could translate whispered lullabies into sweet lavender dreams. The tiny crooked smile formed: Pip was officially the nursery\'s first Junior Dream Engineer.',
    wordCount: 63,
    color: '#ffb3ba',
    noteFreq: 659.25,
    noteName: '659 Hz (Music Box Core)',
    assetImg: '/assets/pip_lullaby_box.png',
    bgGlow: 'radial-gradient(circle at 30% 50%, rgba(255, 179, 186, 0.25) 0%, transparent 60%)'
  },
  {
    id: 3,
    act: 'CHAPTER III',
    title: 'First Flight Across the Rooftops',
    subtitle: 'Slumber delivered to quiet chimney pots',
    story:
      'At midnight sharp, Pip loaded the velvet pouch with fresh slumber vials. Stepping onto a buoyant cumulus cloud, Pip drifted over sleeping chimney stacks, weather vanes, and quiet cobblestone alleys. Pip tapped every rooftop with starlight dust, leaving each home wrapped in calm, velvet silence. Looking back at the moon, Pip finally pulled the nightcap low and curled up for a well-earned nap.',
    wordCount: 63,
    color: '#c4b5fd',
    noteFreq: 783.99,
    noteName: '784 Hz (Midnight Cloud)',
    assetImg: '/assets/pip_avatar_cloud.png',
    bgGlow: 'radial-gradient(circle at 30% 50%, rgba(196, 181, 253, 0.25) 0%, transparent 60%)'
  }
];

export const BedtimeArchivePage: React.FC = () => {
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);
  const [savedTickets, setSavedTickets] = useState<SavedDreamTicket[]>(() => getAllSavedTickets());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const bookCardRef = useRef<HTMLDivElement>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const activeChapter = CHAPTERS[activeChapterIdx];

  // Chapter change handler with physical page turn sound & 3D GSAP transition
  const goToChapter = useCallback(
    (index: number) => {
      if (index === activeChapterIdx) return;
      const direction = index > activeChapterIdx ? 1 : -1;
      setActiveChapterIdx(index);
      soundEngine.playPageTurn();
      soundEngine.playMusicBoxNote(CHAPTERS[index].noteFreq, 1.2);

      if (bookCardRef.current) {
        gsap.fromTo(
          bookCardRef.current,
          {
            opacity: 0,
            rotateY: direction * 10,
            transformPerspective: 1200,
            scale: 0.98
          },
          {
            opacity: 1,
            rotateY: 0,
            scale: 1,
            duration: 0.55,
            ease: 'power2.out'
          }
        );
      }
    },
    [activeChapterIdx]
  );

  // Keyboard navigation: Left/Right arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement).tagName.toLowerCase())) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (activeChapterIdx < CHAPTERS.length - 1) {
          goToChapter(activeChapterIdx + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (activeChapterIdx > 0) {
          goToChapter(activeChapterIdx - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeChapterIdx, goToChapter]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (deltaX < -50 && activeChapterIdx < CHAPTERS.length - 1) {
      goToChapter(activeChapterIdx + 1);
    } else if (deltaX > 50 && activeChapterIdx > 0) {
      goToChapter(activeChapterIdx - 1);
    }
    setTouchStartX(null);
  };

  const handleCopyTicket = (ticket: SavedDreamTicket) => {
    const text = `✦ Pip: DreamOS '99 — ${ticket.title} ✦\nWorld: ${ticket.world} | Companion: ${ticket.companion} | Tone: ${ticket.feeling}\nFrequency: ${ticket.frequency} [432 Hz Calibrated]\n\n"${ticket.story}"`;
    navigator.clipboard.writeText(text);
    setCopiedId(ticket.id);
    soundEngine.playClick(650);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDeleteTicket = (id: string) => {
    deleteSavedTicket(id);
    setSavedTickets(getAllSavedTickets());
    soundEngine.playClick(320);
  };

  return (
    <div
      className="bedtime-archive-page"
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: '2rem 1.5rem 5rem'
      }}
    >
      <div style={{ maxWidth: '1160px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
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
              backgroundColor: 'var(--bg-retro-panel)',
              color: 'var(--text-main)',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={14} />
            <span className="font-mono">Back to Nursery Home</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              to="/dream-forge"
              onClick={() => soundEngine.playClick(500)}
              className="retro-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.95rem',
                fontSize: '0.82rem',
                backgroundColor: 'var(--bg-retro-panel)',
                color: 'var(--text-main)',
                textDecoration: 'none'
              }}
            >
              <Sparkles size={14} color="var(--color-gold)" />
              <span className="font-mono">Dream Forge</span>
            </Link>

            <Link
              to="/atlas"
              onClick={() => soundEngine.playClick(560)}
              className="retro-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.95rem',
                fontSize: '0.82rem',
                backgroundColor: 'var(--bg-retro-panel)',
                color: 'var(--text-main)',
                textDecoration: 'none'
              }}
            >
              <Moon size={14} color="var(--color-gold)" />
              <span className="font-mono">Midnight Atlas</span>
            </Link>
          </div>
        </div>

        {/* Page Hero Header */}
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div
            className="font-mono"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 1rem',
              borderRadius: '999px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-retro-panel)',
              color: 'var(--color-berry)',
              fontSize: '0.78rem',
              letterSpacing: '0.08em',
              marginBottom: '0.75rem'
            }}
          >
            <BookOpen size={14} color="var(--color-berry)" />
            <span>CANON STORYBOOK & TICKET VAULT // ARCHIVE 1999</span>
            <BookOpen size={14} color="var(--color-berry)" />
          </div>

          <h1
            className="font-serif"
            style={{
              fontSize: 'clamp(2.4rem, 4.8vw, 3.8rem)',
              color: 'var(--text-heading)',
              lineHeight: 1.1,
              margin: '0 0 0.8rem 0'
            }}
          >
            The Bedtime Archive
          </h1>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '1.08rem',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6
            }}
          >
            Turn the pages of Pip's illustrated origins and inspect your locally preserved Dream Tickets.
            Each storybook chapter is strictly concise, illustrated with Pip's official artifacts, and accompanied by harmonic chimes.
          </p>
        </header>

        {/* ====================================================================
            Illustrated Physical Storybook Tome
            ==================================================================== */}
        <div style={{ marginBottom: '4.5rem' }}>
          {/* Chapter Constellation Journey Tracker */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.85rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap'
            }}
          >
            {CHAPTERS.map((ch, idx) => {
              const isSelected = activeChapterIdx === idx;
              const isPassed = activeChapterIdx >= idx;
              return (
                <button
                  key={ch.id}
                  onClick={() => goToChapter(idx)}
                  className="retro-btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.45rem 1.15rem',
                    fontSize: '0.82rem',
                    borderRadius: '999px',
                    backgroundColor: isSelected ? ch.color : 'var(--bg-retro-panel)',
                    color: isSelected ? '#26160f' : 'var(--text-main)',
                    borderColor: isSelected ? ch.color : 'var(--border-color)',
                    fontWeight: isSelected ? 700 : 500,
                    boxShadow: isSelected ? `0 0 16px ${ch.color}55` : 'none',
                    transition: 'all 0.25s ease'
                  }}
                  title={`Switch to ${ch.act}: ${ch.title}`}
                >
                  <span style={{ color: isPassed ? '#ffd88a' : 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {isPassed ? '★' : '☆'}
                  </span>
                  <span>{ch.act}: {ch.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          <div
            className="storybook-wrapper"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Paper pages stack depth beneath */}
            <div className="storybook-pages-stack" aria-hidden="true" />

            {/* Silk Bookmark Ribbon dangling from top */}
            <div
              className="storybook-ribbon"
              style={{ backgroundColor: activeChapter.color }}
              title={`Active Bookmark: ${activeChapter.act}`}
              aria-hidden="true"
            />

            {/* Physical Storybook Tome Card */}
            <article
              ref={bookCardRef}
              className="storybook-tome"
              style={{
                borderColor: `${activeChapter.color}66`,
                boxShadow: `0 24px 60px -15px ${activeChapter.color}35`,
                padding: 'clamp(2rem, 4.5vw, 3.5rem)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '3rem',
                alignItems: 'center',
                minHeight: '480px'
              }}
            >
              {/* Center Book Spine Gutter / Crease */}
              <div className="storybook-gutter" aria-hidden="true" />

              {/* Decorative Antique Gilded Book Corners */}
              <svg
                aria-hidden="true"
                style={{ position: 'absolute', top: 12, left: 12, width: 28, height: 28, pointerEvents: 'none', opacity: 0.7 }}
                viewBox="0 0 28 28"
              >
                <path d="M 0 20 L 0 0 L 20 0 M 6 0 L 6 6 L 0 6" fill="none" stroke={activeChapter.color} strokeWidth="1.8" />
              </svg>
              <svg
                aria-hidden="true"
                style={{ position: 'absolute', top: 12, right: 12, width: 28, height: 28, pointerEvents: 'none', opacity: 0.7 }}
                viewBox="0 0 28 28"
              >
                <path d="M 28 20 L 28 0 L 8 0 M 22 0 L 22 6 L 28 6" fill="none" stroke={activeChapter.color} strokeWidth="1.8" />
              </svg>

              {/* Chapter Environmental Atmospheric Effects */}
              {activeChapter.id === 1 && (
                /* Chapter 1: Floating Starlight Dust Motes & Candle Ember Glow */
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    backgroundImage:
                      'radial-gradient(1.5px 1.5px at 15% 25%, #ffd88a, transparent), ' +
                      'radial-gradient(2px 2px at 45% 65%, #ffffff, transparent), ' +
                      'radial-gradient(1.5px 1.5px at 75% 35%, #ffd88a, transparent), ' +
                      'radial-gradient(2px 2px at 85% 75%, #fde68a, transparent)',
                    opacity: 0.75
                  }}
                />
              )}

              {activeChapter.id === 2 && (
                /* Chapter 2: Rotating Clockwork Gears & Lullaby Waves */
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    opacity: 0.18,
                    overflow: 'hidden'
                  }}
                >
                  <svg viewBox="0 0 400 400" style={{ position: 'absolute', right: '-40px', bottom: '-40px', width: '220px', height: '220px' }}>
                    <circle cx="200" cy="200" r="140" fill="none" stroke="#ffb3ba" strokeWidth="4" strokeDasharray="12 8" />
                    <circle cx="200" cy="200" r="90" fill="none" stroke="#ffb3ba" strokeWidth="2.5" />
                    <line x1="200" y1="50" x2="200" y2="350" stroke="#ffb3ba" strokeWidth="2" />
                    <line x1="50" y1="200" x2="350" y2="200" stroke="#ffb3ba" strokeWidth="2" />
                  </svg>
                </div>
              )}

              {activeChapter.id === 3 && (
                /* Chapter 3: Nighttime Rooftop Silhouette & Cloud Mist */
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '90px',
                    pointerEvents: 'none',
                    opacity: 0.22
                  }}
                >
                  <svg viewBox="0 0 600 90" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                    <path d="M 0 90 L 0 50 L 50 20 L 100 50 L 160 30 L 220 70 L 300 25 L 380 60 L 460 20 L 540 50 L 600 35 L 600 90 Z" fill="#c4b5fd" />
                  </svg>
                </div>
              )}

              {/* Left Page: Unboxed Official Character Illustration */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '300px',
                    aspectRatio: '1 / 1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* Luminous Glow Filter */}
                  <div
                    style={{
                      position: 'absolute',
                      width: '85%',
                      height: '85%',
                      borderRadius: '50%',
                      backgroundColor: activeChapter.color,
                      filter: 'blur(50px)',
                      opacity: 0.45,
                      pointerEvents: 'none'
                    }}
                  />

                  <img
                    src={activeChapter.assetImg}
                    alt={activeChapter.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      position: 'relative',
                      zIndex: 2,
                      filter: `drop-shadow(0 18px 32px ${activeChapter.color}55)`
                    }}
                  />
                </div>

                {/* Harmonic Audio Strike Button */}
                <button
                  onClick={() => soundEngine.playMusicBoxNote(activeChapter.noteFreq, 1.4)}
                  className="retro-btn"
                  style={{
                    marginTop: '1.25rem',
                    padding: '0.45rem 1.15rem',
                    fontSize: '0.78rem',
                    backgroundColor: 'var(--bg-retro-panel)',
                    borderColor: `${activeChapter.color}80`,
                    color: 'var(--text-main)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  title={`Resonate chapter frequency: ${activeChapter.noteName}`}
                >
                  <Volume2 size={13} color={activeChapter.color} />
                  <span className="font-mono">RESONATE CHIME ({activeChapter.noteName})</span>
                </button>
              </div>

              {/* Right Page: Illustrated Storybook Narrative */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.76rem',
                      color: activeChapter.color,
                      letterSpacing: '0.08em',
                      fontWeight: 700
                    }}
                  >
                    {activeChapter.act} • {activeChapter.subtitle.toUpperCase()}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      backgroundColor: 'var(--bg-retro-panel)',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    {activeChapter.wordCount} WORDS [CONCISE CANON]
                  </span>
                </div>

                <h2
                  className="font-serif"
                  style={{
                    fontSize: 'clamp(1.9rem, 3.4vw, 2.6rem)',
                    color: 'var(--text-heading)',
                    lineHeight: 1.15,
                    margin: 0
                  }}
                >
                  {activeChapter.title}
                </h2>

                <p
                  style={{
                    fontSize: '1.1rem',
                    lineHeight: 1.75,
                    color: 'var(--text-main)',
                    margin: 0
                  }}
                >
                  "{activeChapter.story}"
                </p>

                {/* Page Turn Controls */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid var(--border-color)',
                    marginTop: '0.5rem'
                  }}
                >
                  <button
                    onClick={() => goToChapter(activeChapterIdx - 1)}
                    disabled={activeChapterIdx === 0}
                    className="retro-btn"
                    style={{
                      padding: '0.45rem 1rem',
                      fontSize: '0.82rem',
                      opacity: activeChapterIdx === 0 ? 0.4 : 1,
                      cursor: activeChapterIdx === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <ArrowLeft size={14} />
                    <span>Previous Act</span>
                  </button>

                  <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    ACT {activeChapterIdx + 1} OF {CHAPTERS.length}
                  </span>

                  <button
                    onClick={() => goToChapter(activeChapterIdx + 1)}
                    disabled={activeChapterIdx === CHAPTERS.length - 1}
                    className="retro-btn"
                    style={{
                      padding: '0.45rem 1rem',
                      fontSize: '0.82rem',
                      opacity: activeChapterIdx === CHAPTERS.length - 1 ? 0.4 : 1,
                      cursor: activeChapterIdx === CHAPTERS.length - 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <span>Next Act</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>

        {/* ====================================================================
            Bedside Shelf of Locally Preserved Dream Tickets
            ==================================================================== */}
        <section
          style={{
            padding: '2.5rem 0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div
                className="font-mono"
                style={{
                  fontSize: '0.74rem',
                  color: 'var(--color-gold)',
                  letterSpacing: '0.06em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  marginBottom: '0.25rem'
                }}
              >
                <BookmarkCheck size={14} color="var(--color-gold)" />
                <span>NURSERY BEDSIDE SHELF // TICKET VAULT</span>
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.9rem', color: 'var(--text-heading)', margin: 0 }}>
                Saved Dream Tickets Shelf
              </h3>
            </div>

            <Link
              to="/dream-forge"
              onClick={() => soundEngine.playClick(500)}
              className="retro-btn"
              style={{
                backgroundColor: 'var(--color-berry)',
                color: '#ffffff',
                borderColor: 'var(--color-berry)',
                fontSize: '0.85rem',
                padding: '0.55rem 1.25rem'
              }}
            >
              <Sparkles size={14} />
              <span>Weave New Dream</span>
            </Link>
          </div>

          {/* Wooden Bedside Shelf Plank */}
          <div className="bedside-shelf-plank" aria-hidden="true" />

          {/* Ticket Cards Grid or Empty State */}
          {savedTickets.length === 0 ? (
            <div
              style={{
                padding: '3.5rem 2rem',
                borderRadius: '20px',
                border: '1.5px dashed var(--border-color)',
                backgroundColor: 'var(--bg-retro-panel)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <Sparkles size={38} color="var(--color-gold)" />
              <h4 className="font-serif" style={{ fontSize: '1.45rem', color: 'var(--text-heading)', margin: 0 }}>
                Your Bedside Shelf is Empty
              </h4>
              <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: 0, fontSize: '0.96rem', lineHeight: 1.6 }}>
                You haven't pinned any bedtime tickets yet tonight. Visit the Dream Forge to blend a celestial world, companion, and feeling, then preserve your ticket here.
              </p>
              <Link
                to="/dream-forge"
                className="retro-btn"
                style={{
                  backgroundColor: 'var(--color-gold)',
                  color: '#26160f',
                  borderColor: 'var(--color-gold)',
                  fontWeight: 700,
                  marginTop: '0.5rem',
                  padding: '0.6rem 1.35rem'
                }}
              >
                <span>Enter the Dream Forge →</span>
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.75rem'
              }}
            >
              {savedTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bedtime-ticket-card"
                  style={{
                    padding: '1.6rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  {/* Decorative Ticket Scallop Notches */}
                  <div className="ticket-scallop-left" aria-hidden="true" />
                  <div className="ticket-scallop-right" aria-hidden="true" />

                  {/* Top Bar with Palette Swatches & ID */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--color-berry)', fontWeight: 700 }}>
                      TICKET #{ticket.id}
                    </span>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {ticket.colors.map((c, ci) => (
                        <div
                          key={ci}
                          style={{
                            width: '13px',
                            height: '13px',
                            borderRadius: '50%',
                            backgroundColor: c,
                            border: '1px solid rgba(0,0,0,0.1)'
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif" style={{ fontSize: '1.3rem', color: 'var(--text-heading)', margin: '0 0 0.4rem 0' }}>
                      {ticket.title}
                    </h4>
                    <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                      <span className="font-mono" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--bg-retro-panel)', border: '1px solid var(--border-color)' }}>
                        {ticket.world}
                      </span>
                      <span className="font-mono" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--bg-retro-panel)', border: '1px solid var(--border-color)' }}>
                        {ticket.companion}
                      </span>
                      <span className="font-mono" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--bg-retro-panel)', border: '1px solid var(--border-color)' }}>
                        {ticket.feeling}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0, fontStyle: 'italic' }}>
                    "{ticket.story}"
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.85rem', borderTop: '1px dashed var(--border-color)', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        onClick={() => soundEngine.playMusicBoxNote(523.25, 1.2)}
                        className="retro-btn"
                        style={{ padding: '0.3rem 0.55rem', fontSize: '0.7rem' }}
                        title="Resonate ticket frequency"
                      >
                        <Volume2 size={12} color="var(--color-gold)" />
                        <span className="font-mono">{ticket.frequency}</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.45rem' }}>
                      <button
                        onClick={() => handleCopyTicket(ticket)}
                        className="retro-btn"
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.72rem' }}
                        title="Copy ticket story to clipboard"
                      >
                        {copiedId === ticket.id ? <Check size={12} color="#86efac" /> : <Copy size={12} />}
                        <span>{copiedId === ticket.id ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteTicket(ticket.id)}
                        className="retro-btn"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem', color: 'var(--color-berry)' }}
                        title="Remove ticket from bedside shelf"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default BedtimeArchivePage;
