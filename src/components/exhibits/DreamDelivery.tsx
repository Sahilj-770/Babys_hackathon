import React, { useState, useEffect, useRef } from 'react';
import { Send, MapPin, CheckCircle2, Sliders } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundEngine } from '../../audio/soundEngine';
import type { DreamDeliveryStop } from '../../types';

const STOPS: DreamDeliveryStop[] = [
  { id: 1, label: 'Clover Cottage', recipient: 'Baby Leo', dreamType: 'Warm Milk & Kitten Paws', x: 70, y: 140 },
  { id: 2, label: 'Clocktower Attic', recipient: 'Grandma Martha', dreamType: 'Old Garden Roses & Vinyl Records', x: 230, y: 70 },
  { id: 3, label: 'Lighthouse Loft', recipient: 'Sailor Finn', dreamType: 'Gentle Harbor Waves & Starlight', x: 390, y: 130 },
  { id: 4, label: 'Moonrise Nursery', recipient: 'Pip & Friends', dreamType: 'Sugar Clouds & Velvet Bedtime', x: 530, y: 80 }
];

interface DreamDeliveryProps {
  onDreamDelivered?: () => void;
}

export const DreamDelivery: React.FC<DreamDeliveryProps> = ({ onDreamDelivered }) => {
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [sliderProgress, setSliderProgress] = useState(0); // 0 to 100
  const [isDelivering, setIsDelivering] = useState(false);
  const [deliveredCount, setDeliveredCount] = useState(4);
  const [pathLength, setPathLength] = useState(520);
  const [pipCoords, setPipCoords] = useState({ x: 70, y: 140 });

  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const isDraggingRef = useRef(false);

  // Measure path length on mount & resize
  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);
      const startPt = pathRef.current.getPointAtLength(0);
      setPipCoords({ x: startPt.x, y: startPt.y });
    }
  }, []);

  // Compute exact position along SVG path whenever sliderProgress changes
  useEffect(() => {
    if (pathRef.current && pathLength > 0) {
      const distance = (sliderProgress / 100) * pathLength;
      const pt = pathRef.current.getPointAtLength(distance);
      setPipCoords({ x: pt.x, y: pt.y });
    }
  }, [sliderProgress, pathLength]);

  // GSAP ScrollTrigger to tie route progress to scroll position (reversible)
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
        if (!isNormalMotion) return;

        const st = ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'bottom 30%',
          scrub: 1.2,
          onUpdate: (self) => {
            if (isDraggingRef.current) return;
            const p = Math.round(self.progress * 100);
            setSliderProgress(p);
            const nearest = Math.min(
              STOPS.length - 1,
              Math.max(0, Math.round((p / 100) * (STOPS.length - 1)))
            );
            setCurrentStopIndex(nearest);
          }
        });

        return () => st.kill();
      }
    );

    return () => mm.revert();
  }, []);

  const activeStop = STOPS[currentStopIndex];

  const handleDispatchNext = () => {
    if (isDelivering) return;
    setIsDelivering(true);
    soundEngine.playClick(440);

    const nextIndex = (currentStopIndex + 1) % STOPS.length;

    setTimeout(() => {
      setCurrentStopIndex(nextIndex);
      setSliderProgress((nextIndex / (STOPS.length - 1)) * 100);
      setIsDelivering(false);
      setDeliveredCount((prev) => prev + 1);
      soundEngine.playMusicBoxNote(880, 1.2);
      if (onDreamDelivered) onDreamDelivered();
    }, 600);
  };

  const handleSelectStop = (idx: number) => {
    setCurrentStopIndex(idx);
    setSliderProgress((idx / (STOPS.length - 1)) * 100);
    soundEngine.playClick(500 + idx * 50);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSliderProgress(val);
    const nearestIndex = Math.round((val / 100) * (STOPS.length - 1));
    if (nearestIndex !== currentStopIndex) {
      setCurrentStopIndex(nearestIndex);
      soundEngine.playClick(440 + nearestIndex * 40);
    }
  };

  return (
    <div ref={containerRef} className="retro-window">
      <div className="retro-window-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={14} color="var(--color-berry)" />
          <span>EXHIBIT 03: ROOFTOP_DELIVERY_ROUTE.MAP</span>
        </div>
        <span style={{ color: 'var(--color-berry)' }}>ROOFTOP FLIGHTPATH [SCROLL-LINKED]</span>
      </div>

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              backgroundColor: '#fff8f1',
              border: '2px solid var(--color-gold)',
              boxShadow: '0 0 12px rgba(255, 216, 138, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0
            }}
          >
            <img
              src="/assets/pip_avatar_cloud.png"
              alt="Pip floating gently on a midnight bedtime cloud"
              style={{ width: '90%', height: '90%', objectFit: 'contain' }}
            />
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <h3 className="font-serif" style={{ fontSize: '1.35rem', color: 'var(--text-heading)' }}>
              Midnight Rooftop Flightpath
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              An illustrated town delivery route. As you scroll, Pip glides along the curved flightpath,
              dropping personalized sweet dreams down each quiet chimney. You can also drag the scrubber or dispatch manually.
            </p>
          </div>
        </div>

        {/* Illustrated SVG Rooftop Route Map */}
        <div
          style={{
            position: 'relative',
            borderRadius: '16px',
            backgroundColor: '#0c102a',
            border: '1.5px solid var(--border-color)',
            padding: '0.75rem',
            overflow: 'hidden',
            minHeight: '200px'
          }}
        >
          <svg
            viewBox="0 0 600 200"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          >
            <defs>
              <clipPath id="cloudAvatarClip">
                <circle cx="20" cy="20" r="18" />
              </clipPath>
            </defs>

            {/* Soft night sky stars */}
            <circle cx="45" cy="35" r="1.5" fill="#ffd88a" className="star-point" />
            <circle cx="120" cy="20" r="1" fill="#ffffff" className="star-point" />
            <circle cx="180" cy="45" r="1.5" fill="#ffd88a" className="star-point" />
            <circle cx="310" cy="25" r="1.2" fill="#ffffff" className="star-point" />
            <circle cx="450" cy="35" r="1.5" fill="#ffd88a" className="star-point" />
            <circle cx="560" cy="20" r="1" fill="#ffffff" className="star-point" />

            {/* Rooftop Silhouettes */}
            <path
              d="M 10 200 L 40 150 L 100 150 L 120 200 L 160 200 L 210 110 L 260 110 L 290 200 L 330 200 L 370 140 L 420 140 L 460 200 L 490 200 L 530 115 L 570 150 L 590 200 Z"
              fill="#141a3d"
            />
            {/* Chimney details */}
            <rect x="75" y="130" width="16" height="20" fill="#20295c" />
            <rect x="225" y="90" width="18" height="20" fill="#20295c" />
            <rect x="385" y="120" width="16" height="20" fill="#20295c" />
            <rect x="525" y="95" width="18" height="20" fill="#20295c" />

            {/* Cozy Glowing Window Squares */}
            <rect x="65" y="165" width="14" height="18" rx="2" fill="#ffd88a" opacity={currentStopIndex === 0 ? '1' : '0.55'} />
            <rect x="230" y="130" width="16" height="22" rx="2" fill="#ffd88a" opacity={currentStopIndex === 1 ? '1' : '0.55'} />
            <rect x="390" y="160" width="14" height="18" rx="2" fill="#ffd88a" opacity={currentStopIndex === 2 ? '1' : '0.55'} />
            <rect x="525" y="135" width="16" height="20" rx="2" fill="#ffd88a" opacity={currentStopIndex === 3 ? '1' : '0.55'} />

            {/* Flightpath Curve (Base track) */}
            <path
              ref={pathRef}
              id="rooftopFlightPath"
              d="M 70 140 Q 150 50, 230 70 T 390 130 T 530 80"
              fill="none"
              stroke="#262f68"
              strokeWidth="2.5"
              strokeDasharray="6,6"
              opacity="0.8"
            />

            {/* Active glowing starlight trace along path */}
            <path
              d="M 70 140 Q 150 50, 230 70 T 390 130 T 530 80"
              fill="none"
              stroke="#ffd88a"
              strokeWidth="3.5"
              strokeDasharray={pathLength}
              strokeDashoffset={pathLength * (1 - sliderProgress / 100)}
              style={{
                filter: 'drop-shadow(0 0 5px rgba(255, 216, 138, 0.85))',
                transition: isDelivering ? 'stroke-dashoffset 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none'
              }}
            />

            {/* Delivery Station Checkpoints */}
            {STOPS.map((stop, idx) => {
              const isPastOrCurrent = idx <= currentStopIndex;
              const isCurrent = idx === currentStopIndex;
              return (
                <g key={stop.id} style={{ cursor: 'pointer' }} onClick={() => handleSelectStop(idx)}>
                  <circle
                    cx={stop.x}
                    cy={stop.y}
                    r={isCurrent ? 12 : 8}
                    fill={isCurrent ? '#ffd88a' : isPastOrCurrent ? '#777dff' : '#1e2454'}
                    stroke="#090b20"
                    strokeWidth="2"
                    style={{ transition: 'all 0.3s ease' }}
                  />
                  {isCurrent && (
                    <circle
                      cx={stop.x}
                      cy={stop.y}
                      r="18"
                      fill="none"
                      stroke="#ffd88a"
                      strokeWidth="1.5"
                      opacity="0.75"
                    />
                  )}
                  <text
                    x={stop.x}
                    y={stop.y - 16}
                    fill={isCurrent ? '#ffd88a' : '#eaeaff'}
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    #{stop.id}
                  </text>
                </g>
              );
            })}

            {/* Pip's Cloud Avatar Medallion on route (Circular, glowing badge) */}
            <g
              transform={`translate(${pipCoords.x - 20}, ${pipCoords.y - 20})`}
              style={{
                transition: isDelivering ? 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'transform 0.08s ease-out'
              }}
            >
              {/* Outer starlight halo */}
              <circle cx="20" cy="20" r="24" fill="rgba(255, 216, 138, 0.35)" filter="blur(5px)" />
              {/* Golden circular frame */}
              <circle cx="20" cy="20" r="19" fill="#fff8f1" stroke="#ffd88a" strokeWidth="2" />
              {/* Masked avatar image inside badge */}
              <image
                href="/assets/pip_avatar_cloud.png"
                x="1"
                y="1"
                width="38"
                height="38"
                clipPath="url(#cloudAvatarClip)"
              />
            </g>
          </svg>
        </div>

        {/* Route Scrubber Slider (Zero mobile overflow) */}
        <div className="rooftop-scrubber-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
            <Sliders size={14} color="var(--color-berry)" />
            <span className="font-mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              ROUTE:
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderProgress}
            onChange={handleSliderChange}
            onMouseDown={() => { isDraggingRef.current = true; }}
            onMouseUp={() => { isDraggingRef.current = false; }}
            onTouchStart={() => { isDraggingRef.current = true; }}
            onTouchEnd={() => { isDraggingRef.current = false; }}
            aria-label="Scrub Pip along rooftop route"
            style={{
              flex: 1,
              minWidth: '80px',
              accentColor: 'var(--color-berry)',
              cursor: 'pointer'
            }}
          />
          <span className="font-mono" style={{ fontSize: '0.74rem', fontWeight: 700, minWidth: '32px', textAlign: 'right' }}>
            {Math.round(sliderProgress)}%
          </span>
        </div>

        {/* Current Destination Status & Dispatch Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            backgroundColor: 'var(--bg-retro-panel)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <CheckCircle2 size={15} color="var(--color-berry)" />
              <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                TARGET:
              </span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-heading)' }}>
                {activeStop.label} ({activeStop.recipient})
              </strong>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '1.25rem' }}>
              Payload: <em>{activeStop.dreamType}</em>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Delivered: {deliveredCount}
            </span>
            <button
              onClick={handleDispatchNext}
              disabled={isDelivering}
              className="retro-btn"
              style={{
                backgroundColor: 'var(--color-berry)',
                color: '#ffffff',
                borderColor: 'var(--color-berry)',
                padding: '0.5rem 1rem',
                fontSize: '0.82rem'
              }}
            >
              <Send size={13} />
              <span>{isDelivering ? 'Dispatching...' : 'Send Sweet Dream'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
