import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, BookmarkCheck, Moon } from 'lucide-react';
import { DreamForge } from '../components/exhibits/DreamForge';
import { soundEngine } from '../audio/soundEngine';

export const DreamForgePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="dream-forge-page" style={{ position: 'relative', minHeight: '100vh', padding: '2rem 1.5rem 5rem' }}>
      {/* Background Cosmic Atmosphere */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 20%, rgba(196, 181, 253, 0.12) 0%, rgba(5, 7, 24, 0) 70%)',
          zIndex: 0
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Navigation Breadcrumb */}
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
              to="/atlas"
              onClick={() => soundEngine.playClick(520)}
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

            <Link
              to="/archive"
              onClick={() => soundEngine.playClick(580)}
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
              <BookmarkCheck size={14} color="var(--color-berry)" />
              <span className="font-mono">Bedtime Archive</span>
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
            <Sparkles size={14} color="var(--color-gold)" />
            <span>DREAM ENGINE 1.99 // PERSONALIZED SLUMBER CALIBRATION</span>
            <Sparkles size={14} color="var(--color-gold)" />
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
            The Dream Forge
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
            Select a slumber world, a loyal companion, and tonight's guiding feeling. Watch Pip's
            calibrated dream machine forge an original bedtime vignette, complete with harmonic audio
            frequencies and a collectible dream ticket.
          </p>
        </header>

        {/* Full Interactive Dream Forge Workbench */}
        <main>
          <DreamForge />
        </main>
      </div>
    </div>
  );
};

export default DreamForgePage;
