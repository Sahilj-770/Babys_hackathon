import React, { useEffect, useRef } from 'react';
import { Compass, Volume2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundEngine } from '../../audio/soundEngine';

gsap.registerPlugin(ScrollTrigger);

interface Scene {
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
}

const SCENES: Scene[] = [
  {
    id: 1,
    act: 'ACT I',
    title: 'The Lost Starlight Lantern',
    subtitle: 'When the nursery lost its golden glow',
    story:
      'Before Pip wore the starry nightcap, Midnight Nursery was quiet and pitch-black. Restless babies tossed in cribs as shadows lengthened across creaking hardwood floors. Pip stumbled upon a hollowed brass lantern buried under discarded music sheets. When Pip touched the glass, a tiny constellation ignited inside, illuminating Pip\'s soft glowing eye sockets with gentle warmth instead of fear. That night, the first baby slept soundly.',
    wordCount: 65,
    color: '#ffd88a',
    noteFreq: 523.25,
    noteName: '523 Hz (Lantern Ember)',
    assetImg: '/assets/pip_dream_lantern.png'
  },
  {
    id: 2,
    act: 'ACT II',
    title: 'The Dream-Engine Invention',
    subtitle: 'Gears, velvet ribbons, and 432Hz chimes',
    story:
      'One lantern wasn\'t enough for an entire town of sleepless dreamers. In a dusty nursery alcove, Pip gathered antique clockwork cogs, cotton clouds, and a brass music-box cylinder. Tinkering until dawn with sleepy determination, Pip built DreamOS \'99—a whimsical contraption that could translate whispered lullabies into sweet lavender dreams. The tiny crooked smile formed: Pip was officially the nursery\'s first Junior Dream Engineer.',
    wordCount: 63,
    color: '#ffb3ba',
    noteFreq: 659.25,
    noteName: '659 Hz (Music Box Core)',
    assetImg: '/assets/pip_lullaby_box.png'
  },
  {
    id: 3,
    act: 'ACT III',
    title: 'First Flight Across the Rooftops',
    subtitle: 'Slumber delivered to quiet chimney pots',
    story:
      'At midnight sharp, Pip loaded the velvet pouch with fresh slumber vials. Stepping onto a buoyant cumulus cloud, Pip drifted over sleeping chimney stacks, weather vanes, and quiet cobblestone alleys. Pip tapped every rooftop with starlight dust, leaving each home wrapped in calm, velvet silence. Looking back at the moon, Pip finally pulled the nightcap low and curled up for a well-earned nap.',
    wordCount: 63,
    color: '#c4b5fd',
    noteFreq: 783.99,
    noteName: '784 Hz (Midnight Cloud)',
    assetImg: '/assets/pip_avatar_cloud.png'
  }
];

export const OriginStory: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

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
          gsap.utils.toArray<HTMLElement>('.origin-storybook-act').forEach((actEl) => {
            gsap.fromTo(
              actEl,
              { opacity: 0, y: 50 },
              {
                opacity: 1,
                y: 0,
                duration: 0.9,
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
        }
      }
    );

    return () => mm.revert();
  }, []);

  const handlePlaySceneChime = (scene: Scene) => {
    soundEngine.playMusicBoxNote(scene.noteFreq, 1.4);
  };

  return (
    <section
      id="story"
      ref={containerRef}
      className="origin-story-section"
      style={{
        position: 'relative',
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '5rem 1.5rem',
        zIndex: 2
      }}
    >
      {/* Editorial Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div
          className="font-mono"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.95rem',
            backgroundColor: 'rgba(255, 216, 138, 0.12)',
            borderRadius: '999px',
            border: '1px solid rgba(255, 216, 138, 0.3)',
            color: '#ffd88a',
            fontSize: '0.78rem',
            marginBottom: '0.85rem'
          }}
        >
          <Compass size={13} color="#ffd88a" />
          <span>CANON CHRONICLES // 3 ILLUSTRATED ACTS</span>
        </div>
        <h2
          className="font-serif"
          style={{
            fontSize: 'clamp(2.4rem, 4.4vw, 3.6rem)',
            color: '#fff8f1',
            margin: 0,
            textShadow: '0 2px 25px rgba(255, 216, 138, 0.35)'
          }}
        >
          How Pip Became the Dream Engineer
        </h2>
        <p
          style={{
            color: '#c9ceff',
            maxWidth: '620px',
            margin: '0.75rem auto 0',
            fontSize: '1.05rem',
            lineHeight: 1.6
          }}
        >
          A three-part bedtime journey through the quiet founding of Midnight Nursery. Each chapter is
          under 150 words and accompanied by Pip's resonant acoustic harmonic.
        </p>
      </div>

      {/* Storybook Acts Stream */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4.5rem',
          position: 'relative'
        }}
      >
        {/* Constellation thread line down the center on desktop */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '40px',
            bottom: '40px',
            width: '2px',
            background: 'linear-gradient(180deg, rgba(255, 216, 138, 0.3) 0%, rgba(196, 181, 253, 0.4) 50%, rgba(255, 216, 138, 0.1) 100%)',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
          className="story-thread-line"
        />

        {SCENES.map((scene, idx) => {
          const isEven = idx % 2 === 1;
          return (
            <article
              key={scene.id}
              id={`act-${scene.id}`}
              className="origin-storybook-act"
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2.5rem',
                alignItems: 'center',
                backgroundColor: 'rgba(9, 11, 32, 0.85)',
                backdropFilter: 'blur(16px)',
                borderRadius: '24px',
                border: `1.5px solid ${scene.color}35`,
                padding: '2.5rem',
                boxShadow: `0 20px 45px -10px ${scene.color}25`,
                transition: 'all 0.4s ease'
              }}
            >
              {/* Image Column */}
              <div
                style={{
                  order: isEven ? 2 : 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                {/* Colored Halo */}
                <div
                  style={{
                    position: 'absolute',
                    width: '75%',
                    height: '75%',
                    borderRadius: '50%',
                    backgroundColor: scene.color,
                    filter: 'blur(45px)',
                    opacity: 0.35,
                    pointerEvents: 'none'
                  }}
                />

                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '260px',
                    aspectRatio: '1 / 1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img
                    src={scene.assetImg}
                    alt={scene.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      WebkitMaskImage:
                        'radial-gradient(ellipse 65% 68% at 50% 50%, black 42%, rgba(0,0,0,0.7) 62%, transparent 84%)',
                      maskImage:
                        'radial-gradient(ellipse 65% 68% at 50% 50%, black 42%, rgba(0,0,0,0.7) 62%, transparent 84%)',
                      filter: `drop-shadow(0 10px 25px ${scene.color}50)`,
                      position: 'relative',
                      zIndex: 1
                    }}
                  />
                </div>
              </div>

              {/* Narrative Content Column */}
              <div
                style={{
                  order: isEven ? 1 : 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.74rem',
                      color: scene.color,
                      letterSpacing: '0.08em',
                      fontWeight: 700
                    }}
                  >
                    {scene.act} • {scene.subtitle.toUpperCase()}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.68rem',
                      color: '#a3a8d8',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px'
                    }}
                  >
                    {scene.wordCount} WORDS [STRICT &lt; 150]
                  </span>
                </div>

                <h3
                  className="font-serif"
                  style={{
                    fontSize: 'clamp(1.7rem, 2.6vw, 2.2rem)',
                    color: '#fff8f1',
                    margin: 0,
                    lineHeight: 1.2
                  }}
                >
                  {scene.title}
                </h3>

                <p
                  style={{
                    fontSize: '1.02rem',
                    lineHeight: 1.65,
                    color: '#eaeaff',
                    fontStyle: 'normal'
                  }}
                >
                  "{scene.story}"
                </p>

                {/* Scene Chime Action Button */}
                <div style={{ paddingTop: '0.5rem' }}>
                  <button
                    onClick={() => handlePlaySceneChime(scene)}
                    className="retro-btn"
                    style={{
                      backgroundColor: 'rgba(255, 248, 241, 0.1)',
                      color: '#ffd88a',
                      borderColor: `${scene.color}60`,
                      fontSize: '0.82rem',
                      padding: '0.5rem 1rem'
                    }}
                    title={`Play harmonic frequency for ${scene.title}`}
                  >
                    <Volume2 size={14} color={scene.color} />
                    <span className="font-mono">PLAY HARMONIC ({scene.noteName})</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
