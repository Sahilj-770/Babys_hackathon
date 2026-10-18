import React, { useEffect, useRef } from 'react';
import { Compass, BookOpen, Heart, Moon, Volume2, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundEngine } from '../../audio/soundEngine';

gsap.registerPlugin(ScrollTrigger);

interface Scene {
  id: number;
  act: string;
  title: string;
  tagline: string;
  story: string;
  wordCount: number;
  highlight: string;
  color: string;
  noteFreq: number;
  noteName: string;
  assetImg: string;
}

const SCENES: Scene[] = [
  {
    id: 1,
    act: 'SCENE I',
    title: 'The Lost Starlight Lantern',
    tagline: 'When the nursery lost its golden glow',
    story: 'Before Pip wore the starry nightcap, Midnight Nursery was quiet and pitch-black. Restless babies tossed in cribs as shadows lengthened across creaking hardwood floors. Pip stumbled upon a hollowed brass lantern buried under discarded music sheets. When Pip touched the glass, a tiny constellation ignited inside, illuminating Pip\'s soft glowing eye sockets with gentle warmth instead of fear. That night, the first baby slept soundly.',
    wordCount: 69,
    highlight: '69 words (under 150 canon limit)',
    color: '#ffd88a',
    noteFreq: 523.25, // C5
    noteName: '523 Hz (Warm Glow)',
    assetImg: '/assets/pip_dream_lantern.png'
  },
  {
    id: 2,
    act: 'SCENE II',
    title: 'The Dream-Engine Invention',
    tagline: 'Gears, velvet ribbons, and 432Hz chimes',
    story: 'One lantern wasn\'t enough for an entire town of sleepless dreamers. In a dusty nursery alcove, Pip gathered antique clockwork cogs, cotton clouds, and a brass music-box cylinder. Tinkering until dawn with sleepy determination, Pip built DreamOS \'99—a whimsical contraption that could translate whispered lullabies into sweet lavender dreams. The tiny crooked smile formed: Pip was officially the nursery\'s first Junior Dream Engineer.',
    wordCount: 67,
    highlight: '67 words (under 150 canon limit)',
    color: '#ffb3ba',
    noteFreq: 659.25, // E5
    noteName: '659 Hz (Clockwork Lullaby)',
    assetImg: '/assets/pip_lullaby_box.png'
  },
  {
    id: 3,
    act: 'SCENE III',
    title: 'First Flight Across the Rooftops',
    tagline: 'Slumber delivered to chimney pots',
    story: 'At midnight sharp, Pip loaded the velvet pouch with fresh slumber vials. Stepping onto a buoyant cumulus cloud, Pip drifted over sleeping chimney stacks, weather vanes, and quiet cobblestone alleys. Pip tapped every rooftop with starlight dust, leaving each home wrapped in calm, velvet silence. Looking back at the moon, Pip finally pulled the nightcap low and curled up for a well-earned nap.',
    wordCount: 68,
    highlight: '68 words (under 150 canon limit)',
    color: '#bae1ff',
    noteFreq: 783.99, // G5
    noteName: '784 Hz (Moonlit Cloud)',
    assetImg: '/assets/pip_avatar_cloud.png'
  }
];

export const OriginStory: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger choreography for the 3 sequential acts
  useEffect(() => {
    if (!containerRef.current) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isNormalMotion: '(prefers-reduced-motion: no-preference)',
        isReducedMotion: '(prefers-reduced-motion: reduce)'
      },
      (context) => {
        const { isNormalMotion } = context.conditions as { isNormalMotion: boolean };

        if (isNormalMotion) {
          // Reversible smooth scroll entrance for each story act
          gsap.utils.toArray<HTMLElement>('.origin-scroll-act').forEach((actEl) => {
            gsap.fromTo(
              actEl,
              { opacity: 0, y: 44, scale: 0.97 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.85,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: actEl,
                  start: 'top 82%',
                  end: 'bottom 18%',
                  toggleActions: 'play none none reverse'
                }
              }
            );
          });
        } else {
          // Accessible reduced motion
          gsap.set('.origin-scroll-act', { opacity: 1, y: 0, scale: 1 });
        }
      }
    );

    return () => mm.revert();
  }, []);

  const scrollToAct = (id: number) => {
    const el = document.getElementById(`story-act-${id}`);
    if (el) {
      soundEngine.playClick(440 + id * 60);
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section id="story" ref={containerRef} style={{ width: '100%' }}>
      {/* Editorial Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.95rem',
            backgroundColor: 'var(--bg-retro-panel)',
            border: '1px solid var(--border-color)',
            borderRadius: '999px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            marginBottom: '1rem'
          }}
          className="font-mono"
        >
          <BookOpen size={13} color="var(--color-berry)" />
          <span>CANON CHRONICLES // 3 REVERSIBLE ACTS</span>
        </div>

        <h2
          className="font-serif"
          style={{
            fontSize: 'clamp(2rem, 4.2vw, 3.2rem)',
            color: 'var(--text-heading)',
            lineHeight: 1.15,
            maxWidth: '850px',
            margin: '0 auto'
          }}
        >
          How a Sleepy Skull Baby Became a Dream Engineer
        </h2>
        <p
          className="story-lead-desc"
          style={{
            maxWidth: '640px',
            margin: '0.75rem auto 1.5rem',
            fontSize: '1.02rem',
            lineHeight: 1.6
          }}
        >
          Scroll downward through the midnight nursery archives. Each chapter unfolds in under 150 words,
          illuminating Pip's gentle mythology of lanterns, clockwork lullabies, and rooftop clouds.
        </p>

        {/* Quick-Jump Navigation Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0.6rem',
            marginTop: '0.5rem'
          }}
        >
          {SCENES.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToAct(s.id)}
              className="retro-btn"
              style={{
                fontSize: '0.78rem',
                padding: '0.35rem 0.8rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer'
              }}
            >
              <span style={{ color: s.color }}>✦</span>
              <span>{s.act}: {s.title.split(' ')[1] || s.title}</span>
              <ArrowRight size={12} />
            </button>
          ))}
        </div>
      </div>

      {/* Sequential 3-Act Scroll Timeline */}
      <div className="story-timeline-track">
        {SCENES.map((scene, idx) => (
          <article
            key={scene.id}
            id={`story-act-${scene.id}`}
            className="retro-window origin-scroll-act story-act-card"
            style={{
              borderColor: 'var(--border-color)',
              overflow: 'hidden'
            }}
          >
            {/* Act Window Header */}
            <div className="retro-window-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Compass size={14} color="var(--color-berry)" />
                <span className="font-mono" style={{ fontSize: '0.75rem' }}>
                  ORIGIN_ACT_{scene.id}.LOG // {scene.act}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  className="font-mono"
                  style={{
                    fontSize: '0.7rem',
                    color: scene.color,
                    fontWeight: 700
                  }}
                >
                  {scene.highlight}
                </span>
              </div>
            </div>

            {/* Act Content Grid */}
            <div
              style={{
                padding: '2.25rem 1.75rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2.25rem',
                alignItems: 'center'
              }}
            >
              {/* Asset Showcase with Ambient Lantern Bloom */}
              <div
                style={{
                  position: 'relative',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-retro-panel)',
                  border: '1.5px solid var(--border-color)',
                  padding: '2rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  order: idx % 2 === 1 ? 2 : 1
                }}
              >
                {/* Scene-specific colored lantern bloom */}
                <div
                  style={{
                    position: 'absolute',
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    backgroundColor: scene.color,
                    opacity: 0.35,
                    filter: 'blur(35px)',
                    pointerEvents: 'none'
                  }}
                />

                <img
                  src={scene.assetImg}
                  alt={scene.title}
                  style={{
                    width: '190px',
                    height: '190px',
                    objectFit: 'contain',
                    position: 'relative',
                    zIndex: 1,
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))',
                    transition: 'transform 0.4s ease'
                  }}
                />

                <div
                  className="font-mono"
                  style={{
                    marginTop: '1.25rem',
                    fontSize: '0.72rem',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-muted)'
                  }}
                >
                  <span>OFFICIAL ASSET // ARCHIVE NO. 0{scene.id}</span>
                </div>
              </div>

              {/* Narrative Content */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  order: idx % 2 === 1 ? 1 : 2
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: 'var(--color-berry)',
                      letterSpacing: '0.08em'
                    }}
                  >
                    {scene.act} • {scene.tagline.toUpperCase()}
                  </span>
                </div>

                <h3
                  className="font-serif"
                  style={{
                    fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)',
                    color: 'var(--text-heading)',
                    lineHeight: 1.2
                  }}
                >
                  {scene.title}
                </h3>

                <p
                  style={{
                    fontSize: '1.02rem',
                    lineHeight: 1.7,
                    color: 'var(--text-main)',
                    backgroundColor: 'var(--bg-surface)',
                    padding: '1.25rem 1.4rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    margin: 0
                  }}
                >
                  "{scene.story}"
                </p>

                {/* Interactive Audio Harmonic Button */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginTop: '0.25rem'
                  }}
                >
                  <button
                    onClick={() => soundEngine.playMusicBoxNote(scene.noteFreq, 1.4)}
                    className="retro-btn"
                    style={{
                      fontSize: '0.78rem',
                      padding: '0.4rem 0.85rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      cursor: 'pointer',
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: scene.color
                    }}
                    title={`Play ${scene.title} bedtime harmonic frequency`}
                    aria-label={`Play ${scene.title} bedtime harmonic frequency`}
                  >
                    <Volume2 size={13} color="var(--color-berry)" />
                    <span>Play Scene Harmonic ({scene.noteName})</span>
                  </button>

                  <span
                    className="font-mono"
                    style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}
                  >
                    Words: {scene.wordCount} / 150 limit
                  </span>
                </div>
              </div>
            </div>

            {/* Act Reassurance Footer */}
            <div
              style={{
                padding: '0.65rem 1.25rem',
                backgroundColor: 'var(--bg-retro-panel)',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.72rem',
                color: 'var(--text-muted)'
              }}
              className="font-mono"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Heart size={12} color="var(--color-berry)" />
                <span>CANON: Gentle, sleepy, non-scary mythology</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Moon size={12} color="var(--color-gold)" />
                <span>REVERSIBLE SCROLL CHOREOGRAPHY</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default OriginStory;
