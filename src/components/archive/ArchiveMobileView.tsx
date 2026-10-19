import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookmarkCheck,
  Sparkles,
  Volume2,
  Trash2,
  Copy,
  Check,
  Moon
} from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';
import type { ArchiveViewProps } from '../../types/archive';

export const ArchiveMobileView: React.FC<ArchiveViewProps> = ({
  chapters,
  activeChapterIdx,
  savedTickets,
  copiedId,
  bookCardRef,
  onGoToChapter,
  onCopyTicket,
  onDeleteTicket,
  onTouchStart,
  onTouchEnd
}) => {
  const activeChapter = chapters[activeChapterIdx];

  return (
    <div
      className="archive-mobile-reader"
      style={{
        maxWidth: '540px',
        margin: '0 auto',
        padding: '0 0.5rem',
        position: 'relative',
        zIndex: 1
      }}
    >
      {/* 1. Mobile Utility Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          gap: '0.5rem'
        }}
      >
        <Link
          to="/"
          onClick={() => soundEngine.playClick(440)}
          className="retro-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.85rem',
            fontSize: '0.8rem',
            backgroundColor: 'var(--bg-retro-panel)',
            color: 'var(--text-main)',
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={14} />
          <span>Nursery</span>
        </Link>

        {/* Global Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link
            to="/dream-forge"
            onClick={() => soundEngine.playClick(500)}
            className="retro-btn"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.76rem',
              backgroundColor: 'var(--bg-retro-panel)',
              color: 'var(--text-main)',
              textDecoration: 'none'
            }}
          >
            <Sparkles size={13} color="var(--color-gold)" />
            <span>Forge</span>
          </Link>

          <Link
            to="/atlas"
            onClick={() => soundEngine.playClick(560)}
            className="retro-btn"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.76rem',
              backgroundColor: 'var(--bg-retro-panel)',
              color: 'var(--text-main)',
              textDecoration: 'none'
            }}
          >
            <Moon size={13} color="var(--color-gold)" />
            <span>Atlas</span>
          </Link>
        </div>
      </div>

      {/* 2. Pocket Bedside Header */}
      <div
        className="retro-panel"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1.5px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.25rem',
          marginBottom: '1.25rem',
          boxShadow: 'var(--shadow-soft)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <img
            src="/assets/pip_portrait.png"
            alt="Pip reading bedside book"
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: `2px solid ${activeChapter.color}`,
              background: '#1b123d',
              flexShrink: 0
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              className="font-mono"
              style={{
                fontSize: '0.68rem',
                color: 'var(--color-berry)',
                letterSpacing: '0.08em',
                marginBottom: '0.2rem'
              }}
            >
              PIP'S BEDSIDE TOME // 432 Hz
            </div>
            <h1
              className="font-serif"
              style={{
                fontSize: '1.5rem',
                color: 'var(--text-heading)',
                margin: '0 0 0.2rem 0',
                lineHeight: 1.2
              }}
            >
              The Bedtime Reader
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
              Swipe or tap below to turn Pip's illuminated origin stories.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Handheld Chapter Progress Rail */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          marginBottom: '1.25rem'
        }}
      >
        {chapters.map((ch, idx) => {
          const isSelected = activeChapterIdx === idx;
          const isPassed = activeChapterIdx >= idx;
          return (
            <button
              key={ch.id}
              onClick={() => onGoToChapter(idx)}
              className="retro-btn"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.55rem 0.4rem',
                borderRadius: '12px',
                backgroundColor: isSelected ? ch.color : 'var(--bg-surface)',
                color: isSelected ? '#26160f' : 'var(--text-main)',
                border: isSelected ? `2px solid ${ch.color}` : '1px solid var(--border-color)',
                boxShadow: isSelected ? `0 4px 14px ${ch.color}50` : 'none',
                minHeight: '44px',
                transition: 'all 0.2s ease',
                touchAction: 'manipulation'
              }}
              aria-label={`Jump to ${ch.act}: ${ch.title}`}
            >
              <span style={{ fontSize: '0.72rem', fontWeight: 700, fontFamily: 'monospace' }}>
                {isPassed ? '★ ' : '☆ '}{ch.act}
              </span>
              <span
                style={{
                  fontSize: '0.66rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '100%'
                }}
              >
                {ch.title.split(' ')[1] || ch.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Single-Column Focused Bedside Story Card */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ marginBottom: '2rem' }}
      >
        <article
          ref={bookCardRef}
          className="retro-panel"
          style={{
            position: 'relative',
            backgroundColor: 'var(--bg-surface)',
            border: `2px solid ${activeChapter.color}90`,
            borderRadius: '20px',
            padding: '1.5rem 1.25rem',
            boxShadow: `0 12px 35px -8px ${activeChapter.color}35`,
            overflow: 'hidden'
          }}
        >
          {/* Subtle Corner Accents */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '28px',
              height: '4px',
              backgroundColor: activeChapter.color
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '28px',
              backgroundColor: activeChapter.color
            }}
          />

          {/* Chapter Metadata Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              gap: '0.5rem'
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: '0.72rem',
                color: 'var(--color-berry)',
                fontWeight: 700,
                letterSpacing: '0.06em'
              }}
            >
              {activeChapter.act} • {activeChapter.subtitle.toUpperCase()}
            </span>

            <span
              className="font-mono"
              style={{
                fontSize: '0.66rem',
                color: 'var(--text-muted)',
                backgroundColor: 'var(--bg-retro-panel)',
                padding: '0.15rem 0.5rem',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                flexShrink: 0
              }}
            >
              {activeChapter.wordCount} WORDS
            </span>
          </div>

          {/* Official Character Illustration for Phone Screens */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '220px',
              aspectRatio: '1 / 1',
              margin: '0 auto 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '80%',
                height: '80%',
                borderRadius: '50%',
                backgroundColor: activeChapter.color,
                filter: 'blur(35px)',
                opacity: 0.4,
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
                filter: `drop-shadow(0 10px 20px ${activeChapter.color}45)`
              }}
            />
          </div>

          {/* Audio Chime Resonator Button */}
          <button
            onClick={() => soundEngine.playMusicBoxNote(activeChapter.noteFreq, 1.4)}
            className="retro-btn"
            style={{
              width: '100%',
              padding: '0.6rem 1rem',
              fontSize: '0.78rem',
              backgroundColor: 'var(--bg-retro-panel)',
              borderColor: `${activeChapter.color}80`,
              color: 'var(--text-main)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              borderRadius: '12px',
              marginBottom: '1.25rem',
              minHeight: '44px'
            }}
            title={`Resonate chapter frequency: ${activeChapter.noteName}`}
          >
            <Volume2 size={14} color="var(--color-gold)" />
            <span className="font-mono">RESONATE CHIME ({activeChapter.noteName})</span>
          </button>

          {/* Narrative Story Typography */}
          <h2
            className="font-serif"
            style={{
              fontSize: '1.55rem',
              color: 'var(--text-heading)',
              margin: '0 0 0.75rem 0',
              lineHeight: 1.2
            }}
          >
            {activeChapter.title}
          </h2>

          <p
            style={{
              fontSize: '1.02rem',
              lineHeight: 1.7,
              color: 'var(--text-main)',
              margin: '0 0 1.5rem 0'
            }}
          >
            "{activeChapter.story}"
          </p>

          {/* Mobile Page Turn Action Controls */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              gap: '0.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-color)'
            }}
          >
            <button
              onClick={() => onGoToChapter(activeChapterIdx - 1)}
              disabled={activeChapterIdx === 0}
              className="retro-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                padding: '0.6rem 0.75rem',
                fontSize: '0.82rem',
                opacity: activeChapterIdx === 0 ? 0.35 : 1,
                cursor: activeChapterIdx === 0 ? 'not-allowed' : 'pointer',
                minHeight: '46px',
                borderRadius: '10px'
              }}
            >
              <ArrowLeft size={14} />
              <span>Prev</span>
            </button>

            <span
              className="font-mono"
              style={{
                fontSize: '0.74rem',
                color: 'var(--text-muted)',
                textAlign: 'center',
                padding: '0 0.4rem',
                whiteSpace: 'nowrap'
              }}
            >
              ACT {activeChapterIdx + 1} / {chapters.length}
            </span>

            <button
              onClick={() => onGoToChapter(activeChapterIdx + 1)}
              disabled={activeChapterIdx === chapters.length - 1}
              className="retro-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                padding: '0.6rem 0.75rem',
                fontSize: '0.82rem',
                opacity: activeChapterIdx === chapters.length - 1 ? 0.35 : 1,
                cursor: activeChapterIdx === chapters.length - 1 ? 'not-allowed' : 'pointer',
                minHeight: '46px',
                borderRadius: '10px'
              }}
            >
              <span>Next</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </article>
      </div>

      {/* 5. Mobile Bedside Preserved Tickets Drawer */}
      <section style={{ padding: '1rem 0 3rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <BookmarkCheck size={16} color="var(--color-gold)" />
            <h3 className="font-serif" style={{ fontSize: '1.35rem', color: 'var(--text-heading)', margin: 0 }}>
              Bedside Tickets ({savedTickets.length})
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
              fontSize: '0.78rem',
              padding: '0.4rem 0.85rem'
            }}
          >
            <Sparkles size={12} />
            <span>Weave</span>
          </Link>
        </div>

        {savedTickets.length === 0 ? (
          <div
            style={{
              padding: '2rem 1.25rem',
              borderRadius: '16px',
              border: '1.5px dashed var(--border-color)',
              backgroundColor: 'var(--bg-surface)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <Sparkles size={28} color="var(--color-gold)" />
            <h4 className="font-serif" style={{ fontSize: '1.15rem', color: 'var(--text-heading)', margin: 0 }}>
              Your Shelf is Empty
            </h4>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.84rem', lineHeight: 1.5 }}>
              Visit the Dream Forge to weave a bedtime ticket and preserve it here.
            </p>
            <Link
              to="/dream-forge"
              className="retro-btn"
              style={{
                backgroundColor: 'var(--color-gold)',
                color: '#26160f',
                borderColor: 'var(--color-gold)',
                fontWeight: 700,
                marginTop: '0.25rem',
                padding: '0.45rem 1.1rem',
                fontSize: '0.82rem'
              }}
            >
              <span>Go to Dream Forge →</span>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {savedTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bedtime-ticket-card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  borderRadius: '14px',
                  backgroundColor: 'var(--bg-surface)'
                }}
              >
                {/* Decorative Ticket Scallops */}
                <div className="ticket-scallop-left" aria-hidden="true" />
                <div className="ticket-scallop-right" aria-hidden="true" />

                {/* Top Bar with Palette Swatches & ID */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--color-berry)', fontWeight: 700 }}>
                    TICKET #{ticket.id}
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {ticket.colors.map((c, ci) => (
                      <div
                        key={ci}
                        style={{
                          width: '11px',
                          height: '11px',
                          borderRadius: '50%',
                          backgroundColor: c,
                          border: '1px solid rgba(0,0,0,0.1)'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-serif" style={{ fontSize: '1.15rem', color: 'var(--text-heading)', margin: '0 0 0.35rem 0' }}>
                    {ticket.title}
                  </h4>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    <span className="font-mono" style={{ fontSize: '0.65rem', padding: '0.12rem 0.45rem', borderRadius: '4px', backgroundColor: 'var(--bg-retro-panel)', border: '1px solid var(--border-color)' }}>
                      {ticket.world}
                    </span>
                    <span className="font-mono" style={{ fontSize: '0.65rem', padding: '0.12rem 0.45rem', borderRadius: '4px', backgroundColor: 'var(--bg-retro-panel)', border: '1px solid var(--border-color)' }}>
                      {ticket.companion}
                    </span>
                    <span className="font-mono" style={{ fontSize: '0.65rem', padding: '0.12rem 0.45rem', borderRadius: '4px', backgroundColor: 'var(--bg-retro-panel)', border: '1px solid var(--border-color)' }}>
                      {ticket.feeling}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
                  "{ticket.story}"
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.65rem',
                    borderTop: '1px dashed var(--border-color)',
                    marginTop: '0.25rem'
                  }}
                >
                  <button
                    onClick={() => soundEngine.playMusicBoxNote(523.25, 1.2)}
                    className="retro-btn"
                    style={{ padding: '0.3rem 0.55rem', fontSize: '0.7rem' }}
                    title="Resonate ticket frequency"
                  >
                    <Volume2 size={12} color="var(--color-gold)" />
                    <span className="font-mono">{ticket.frequency}</span>
                  </button>

                  <div style={{ display: 'flex', gap: '0.45rem' }}>
                    <button
                      onClick={() => onCopyTicket(ticket)}
                      className="retro-btn"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem' }}
                      title="Copy ticket story"
                    >
                      {copiedId === ticket.id ? <Check size={12} color="#86efac" /> : <Copy size={12} />}
                      <span>{copiedId === ticket.id ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() => onDeleteTicket(ticket.id)}
                      className="retro-btn"
                      style={{ padding: '0.3rem 0.55rem', fontSize: '0.72rem', color: 'var(--color-berry)' }}
                      title="Remove ticket"
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
  );
};
