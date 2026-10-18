import React from 'react';
import { ArrowUp, Sparkles, Heart, ShieldCheck, Terminal } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    soundEngine.playClick(600);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="credits"
      style={{
        backgroundColor: 'var(--bg-retro-panel)',
        borderTop: '2px solid var(--border-color)',
        padding: '3.5rem 1.5rem 2.5rem',
        marginTop: '4rem'
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem'
        }}
      >
        {/* Top bar with back to top */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                padding: '0.25rem 0.5rem',
                backgroundColor: 'var(--color-berry)',
                color: '#ffffff',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)'
              }}
            >
              MIDNIGHT NURSERY
            </span>
            <span className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-heading)' }}>
              Pip: DreamOS '99
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="retro-btn"
            style={{ fontSize: '0.85rem' }}
            title="Return to the top of the nursery"
          >
            <ArrowUp size={15} />
            <span>Back to Nursery Bed</span>
          </button>
        </div>

        {/* Attribution & Official Assets Credit Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem'
          }}
        >
          {/* Character & Lore Canon */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Heart size={16} color="var(--color-berry)" />
              <strong style={{ color: 'var(--text-heading)', fontSize: '0.95rem' }}>
                Official Character Canon
              </strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <strong>Pip the Skull Baby</strong> is the Junior Dream Engineer at Midnight Nursery.
              Featuring a smooth round skull, soft glowing eye sockets, a starry bedtime nightcap with a pink bow,
              and a tiny crooked smile. Designed with warmth, coziness, and bedtime comfort.
            </p>
          </div>

          {/* Official Art Assets Credit */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <ShieldCheck size={16} color="var(--color-berry)" />
              <strong style={{ color: 'var(--text-heading)', fontSize: '0.95rem' }}>
                Official Assets Provided
              </strong>
            </div>
            <ul
              style={{
                listStyle: 'none',
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                lineHeight: 1.8,
                fontFamily: 'var(--font-mono)'
              }}
            >
              <li>• pip_portrait.png (Hero centerpiece)</li>
              <li>• pip_avatar_cloud.png (Rooftop dispatch)</li>
              <li>• pip_lullaby_box.png (Music box exhibit)</li>
              <li>• pip_dream_lantern.png (Nightlight collection)</li>
            </ul>
          </div>

          {/* Third-Party & Tech Attribution */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Terminal size={16} color="var(--color-berry)" />
              <strong style={{ color: 'var(--text-heading)', fontSize: '0.95rem' }}>
                Built Fresh for Hackathon
              </strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Built with React 19, TypeScript, Vite, Web Audio API, GSAP + ScrollTrigger, Lucide Icons, and Canvas Confetti.
              No fake guestbooks, no AI wrappers. 100% handmade web craftsmanship.
            </p>
          </div>
        </div>

        {/* Handmade Sign-off */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
          className="font-mono"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={14} color="var(--color-gold)" />
            <span>Sweet dreams are calibrated nightly at 00:00:00 PST.</span>
          </div>

          <div>
            <span>© 1999–2026 MIDNIGHT NURSERY SYSTEM // ALL DREAMS RESERVED</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
