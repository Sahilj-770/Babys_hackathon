import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, X, Award, Disc, PartyPopper } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface EasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EasterEggModal: React.FC<EasterEggModalProps> = ({ isOpen, onClose }) => {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const triggerRestrainedConfetti = () => {
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
  };

  useEffect(() => {
    if (isOpen) {
      soundEngine.playCelebrationChime();
      triggerRestrainedConfetti();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onCloseRef.current();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="easter-egg-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(9, 11, 32, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 10001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
      onClick={onClose}
    >
      <div
        className="retro-window"
        style={{
          maxWidth: '520px',
          width: '100%',
          backgroundColor: 'var(--bg-surface)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px var(--glow-color)',
          border: '2px solid var(--color-gold)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="retro-window-header"
          style={{ backgroundColor: 'var(--color-gold)', color: '#5c4033' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} />
            <span className="font-mono" style={{ fontSize: '0.78rem', fontWeight: 700 }}>
              PIP_SECRET_OBSERVATORY.EXE [UNLOCKED]
            </span>
          </div>
          <button
            onClick={onClose}
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
            <X size={16} />
          </button>
        </div>

        <div
          style={{
            padding: '2rem 1.75rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem'
          }}
        >
          <div
            style={{
              width: '84px',
              height: '84px',
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
            <Award size={46} />
          </div>

          <div>
            <span
              className="font-mono"
              style={{
                fontSize: '0.74rem',
                backgroundColor: 'var(--bg-retro-panel)',
                padding: '0.25rem 0.75rem',
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
              style={{ fontSize: '1.85rem', color: 'var(--text-heading)', marginTop: '0.65rem' }}
            >
              Pip's Hidden Attic Observatory
            </h3>
          </div>

          <p
            style={{
              fontSize: '0.94rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
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
              padding: '0.9rem 1.1rem',
              backgroundColor: 'var(--bg-retro-panel)',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              textAlign: 'left'
            }}
          >
            <Disc size={28} color="var(--color-berry)" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.78rem' }}>
              <div className="font-mono" style={{ fontWeight: 700, color: 'var(--text-heading)' }}>
                NURSERY_JOURNAL_1999.LOG
              </div>
              <div style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                "Always remember to smile softly before switching off the nightlight. Sweet dreams are guaranteed." — Pip
              </div>
            </div>
          </div>

          {/* Modal Action Controls */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => {
                soundEngine.playCelebrationChime();
                triggerRestrainedConfetti();
              }}
              className="retro-btn"
              style={{
                padding: '0.55rem 1.1rem',
                fontSize: '0.82rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer'
              }}
              title="Trigger more stardust confetti"
            >
              <PartyPopper size={14} color="var(--color-berry)" />
              <span>Celebrate Again</span>
            </button>

            <button
              onClick={onClose}
              className="retro-btn"
              style={{
                backgroundColor: 'var(--color-berry)',
                color: '#ffffff',
                borderColor: 'var(--color-berry)',
                padding: '0.55rem 1.5rem',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              Tuck Secret Away
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EasterEggModal;
