import React, { useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import gsap from 'gsap';
import { Sparkles, Moon, Compass, ArrowRight } from 'lucide-react';

import { HeroSection } from '../components/HeroSection';
import { CinematicScrollSequence } from '../components/CinematicScrollSequence';
import { StatusWidget } from '../components/StatusWidget';
import { LullabyLab } from '../components/exhibits/LullabyLab';
import { NightlightCollection } from '../components/exhibits/NightlightCollection';
import { DreamDelivery } from '../components/exhibits/DreamDelivery';
import { OriginStory } from '../components/story/OriginStory';
import { soundEngine } from '../audio/soundEngine';

interface OutletContextType {
  onOpenSecret?: () => void;
}

interface NurseryHomeProps {
  onOpenSecret?: () => void;
}

export const NurseryHome: React.FC<NurseryHomeProps> = ({ onOpenSecret: propOnOpenSecret }) => {
  const context = useOutletContext<OutletContextType | null>();
  const onOpenSecret = propOnOpenSecret || context?.onOpenSecret || (() => {});
  // GSAP reversible fade-in for sections
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      {
        isNormalMotion: '(prefers-reduced-motion: no-preference)',
        isReducedMotion: '(prefers-reduced-motion: reduce)'
      },
      (context) => {
        const { isNormalMotion } = context.conditions as { isNormalMotion: boolean };

        if (isNormalMotion) {
          gsap.utils.toArray<HTMLElement>('.gsap-fade-in').forEach((el) => {
            gsap.fromTo(
              el,
              { opacity: 0, y: 36 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: el,
                  start: 'top 85%',
                  end: 'bottom 15%',
                  toggleActions: 'play none none reverse'
                }
              }
            );
          });
        } else {
          gsap.set('.gsap-fade-in', { opacity: 1, y: 0 });
        }
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <div>
      {/* ACT I: THE NURSERY — Editorial Hero starring large unboxed Pip */}
      <HeroSection onOpenSecret={onOpenSecret} />

      {/* ACT II & III: THE AWAKENING & THE DREAM REALM — Signature GSAP Scroll Sequence */}
      <CinematicScrollSequence />

      {/* MULTI-PAGE WORLD EXPEDITION PORTALS */}
      <section
        style={{
          maxWidth: '1160px',
          margin: '0 auto',
          padding: '2.5rem 1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Portal 1: Dream Forge */}
        <Link
          to="/dream-forge"
          onClick={() => soundEngine.playClick(500)}
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '20px',
            border: '1.5px solid var(--border-color)',
            padding: '2rem',
            boxShadow: 'var(--shadow-soft)',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1.25rem',
            transition: 'all 0.25s ease'
          }}
          className="world-portal-card"
        >
          <div>
            <div
              className="font-mono"
              style={{
                fontSize: '0.72rem',
                color: 'var(--color-berry)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                marginBottom: '0.5rem'
              }}
            >
              <Sparkles size={13} color="var(--color-gold)" />
              <span>DREAM WORLD // PAGE 02</span>
            </div>
            <h3 className="font-serif" style={{ fontSize: '1.65rem', color: 'var(--text-heading)', margin: '0 0 0.4rem 0' }}>
              The Dream Forge
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
              Blend a personalized dream world, nocturnal companion, and guiding emotion. Generates an original bedtime ticket with live frequency tuning.
            </p>
          </div>

          <div
            className="font-mono"
            style={{
              fontSize: '0.82rem',
              color: 'var(--color-berry)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontWeight: 700
            }}
          >
            <span>Enter The Forge</span>
            <ArrowRight size={14} />
          </div>
        </Link>

        {/* Portal 2: Midnight Atlas */}
        <Link
          to="/atlas"
          onClick={() => soundEngine.playClick(540)}
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '20px',
            border: '1.5px solid var(--border-color)',
            padding: '2rem',
            boxShadow: 'var(--shadow-soft)',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1.25rem',
            transition: 'all 0.25s ease'
          }}
          className="world-portal-card"
        >
          <div>
            <div
              className="font-mono"
              style={{
                fontSize: '0.72rem',
                color: 'var(--color-gold)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                marginBottom: '0.5rem'
              }}
            >
              <Moon size={13} color="var(--color-gold)" />
              <span>DREAM WORLD // PAGE 03</span>
            </div>
            <h3 className="font-serif" style={{ fontSize: '1.65rem', color: 'var(--text-heading)', margin: '0 0 0.4rem 0' }}>
              The Midnight Atlas
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
              A full-screen illustrated radar map spanning 6 delivery sectors across town. Track Pip’s flight, inspect resident orders, and dispatch slumber.
            </p>
          </div>

          <div
            className="font-mono"
            style={{
              fontSize: '0.82rem',
              color: 'var(--color-gold)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontWeight: 700
            }}
          >
            <span>Open Midnight Map</span>
            <ArrowRight size={14} />
          </div>
        </Link>

        {/* Portal 3: Bedtime Archive */}
        <Link
          to="/archive"
          onClick={() => soundEngine.playClick(580)}
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '20px',
            border: '1.5px solid var(--border-color)',
            padding: '2rem',
            boxShadow: 'var(--shadow-soft)',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1.25rem',
            transition: 'all 0.25s ease'
          }}
          className="world-portal-card"
        >
          <div>
            <div
              className="font-mono"
              style={{
                fontSize: '0.72rem',
                color: 'var(--color-berry)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                marginBottom: '0.5rem'
              }}
            >
              <Compass size={13} color="var(--color-berry)" />
              <span>DREAM WORLD // PAGE 04</span>
            </div>
            <h3 className="font-serif" style={{ fontSize: '1.65rem', color: 'var(--text-heading)', margin: '0 0 0.4rem 0' }}>
              The Bedtime Archive
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
              Pip's three origin-story scenes turned into an illustrated interactive storybook with audio harmonics, plus your bedside shelf of saved tickets.
            </p>
          </div>

          <div
            className="font-mono"
            style={{
              fontSize: '0.82rem',
              color: 'var(--color-berry)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontWeight: 700
            }}
          >
            <span>Read Storybook & Shelf</span>
            <ArrowRight size={14} />
          </div>
        </Link>
      </section>

      {/* 3 PREVIEWS: LULLABY LAB, NIGHTLIGHT COLLECTION, DREAM DELIVERY */}
      <section
        id="exhibits"
        style={{
          maxWidth: '1160px',
          margin: '0 auto',
          padding: '3rem 1.5rem 4.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '3.5rem'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <span
            className="font-mono"
            style={{
              fontSize: '0.78rem',
              padding: '0.35rem 0.95rem',
              backgroundColor: 'var(--bg-retro-panel)',
              borderRadius: '999px',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)'
            }}
          >
            PROJECT PREVIEWS // 3 CORE EXPERIENCES
          </span>
          <h2
            className="font-serif"
            style={{
              fontSize: 'clamp(2.2rem, 4.2vw, 3.2rem)',
              color: 'var(--text-heading)',
              marginTop: '0.75rem'
            }}
          >
            Operational Dream Labs
          </h2>
          <p
            style={{
              color: 'var(--text-muted)',
              maxWidth: '640px',
              margin: '0.5rem auto 0',
              fontSize: '1.05rem',
              lineHeight: 1.55
            }}
          >
            Interact with Pip's core bedtime inventions right here, or venture into the dedicated full-screen pages.
          </p>
        </div>

        {/* Preview 1: Lullaby Lab */}
        <div className="gsap-fade-in">
          <LullabyLab />
        </div>

        {/* Preview 2: Nightlight Collection */}
        <div className="gsap-fade-in">
          <NightlightCollection />
        </div>

        {/* Preview 3: Dream Delivery with link to full Atlas */}
        <div className="gsap-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <DreamDelivery />
          <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            <Link
              to="/atlas"
              onClick={() => soundEngine.playClick(560)}
              className="retro-btn"
              style={{
                backgroundColor: 'rgba(255, 216, 138, 0.2)',
                borderColor: '#ffd88a',
                color: '#ffd88a',
                padding: '0.65rem 1.5rem',
                fontSize: '0.9rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Moon size={15} color="#ffd88a" />
              <span>Launch Full-Screen Midnight Atlas Map (6 Sectors) →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ACT IV: BEDTIME & CHRONICLES — Origin Story & Midnight Realm */}
      <section className="midnight-realm-wrapper" aria-label="Midnight Dream Realm Origin Story">
        <div className="midnight-celestial-stars" />
        <OriginStory />
        <div style={{ textAlign: 'center', paddingBottom: '3rem' }}>
          <Link
            to="/archive"
            onClick={() => soundEngine.playClick(540)}
            className="retro-btn"
            style={{
              backgroundColor: 'rgba(255, 248, 241, 0.1)',
              borderColor: 'rgba(255, 216, 138, 0.5)',
              color: '#ffd88a',
              padding: '0.75rem 1.8rem',
              fontSize: '0.92rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Compass size={15} color="#ffd88a" />
            <span>Open Illustrated Bedtime Storybook & Saved Tickets →</span>
          </Link>
        </div>
      </section>

      {/* Live Odometer & Nursery Diagnostic bar */}
      <section style={{ padding: '3rem 1.5rem 1rem' }}>
        <StatusWidget />
      </section>
    </div>
  );
};

export default NurseryHome;
