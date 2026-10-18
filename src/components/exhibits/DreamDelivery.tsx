import React, { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle2, Sliders, Moon } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundEngine } from '../../audio/soundEngine';
import type { DreamDeliveryStop } from '../../types';

const STOPS: DreamDeliveryStop[] = [
  { id: 1, label: 'Clover Cottage', recipient: 'Baby Leo', dreamType: 'Warm Milk & Kitten Paws', x: 80, y: 150 },
  { id: 2, label: 'Clocktower Attic', recipient: 'Grandma Martha', dreamType: 'Old Garden Roses & Vinyl Records', x: 260, y: 80 },
  { id: 3, label: 'Lighthouse Loft', recipient: 'Sailor Finn', dreamType: 'Gentle Harbor Waves & Starlight', x: 440, y: 140 },
  { id: 4, label: 'Moonrise Nursery', recipient: 'Pip & Friends', dreamType: 'Sugar Clouds & Velvet Bedtime', x: 620, y: 90 }
];

interface DreamDeliveryProps {
  onDreamDelivered?: () => void;
}

export const DreamDelivery: React.FC<DreamDeliveryProps> = ({ onDreamDelivered }) => {
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [sliderProgress, setSliderProgress] = useState(15);
  const [isDelivering, setIsDelivering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pipCoords, setPipCoords] = useState({ x: 80, y: 150 });
  const [pathLength, setPathLength] = useState(650);

  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  // Measure path length on mount
  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);
      const startPt = pathRef.current.getPointAtLength(0);
      setPipCoords({ x: startPt.x, y: startPt.y });
    }
  }, []);

  // Compute exact coordinates along SVG path when progress changes
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
          end: 'bottom 35%',
          scrub: 1.2,
          onUpdate: (self) => {
            if (isDragging) return;
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
  }, [isDragging]);

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
      soundEngine.playCelebrationChime();
      if (onDreamDelivered) onDreamDelivered();
    }, 700);
  };

  const handleSelectStop = (index: number) => {
    setCurrentStopIndex(index);
    setSliderProgress((index / (STOPS.length - 1)) * 100);
    soundEngine.playClick(500 + index * 60);
  };

  return (
    <div
      id="dream-delivery"
      ref={containerRef}
      className="dream-delivery-exhibit"
      style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #090b20 0%, #060818 100%)',
        borderRadius: '24px',
        border: '1.5px solid rgba(119, 125, 255, 0.3)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
        padding: '2.5rem',
        color: '#ffffff',
        overflow: 'hidden'
      }}
    >
      {/* Background Starfield */}
      <div className="midnight-celestial-stars" style={{ opacity: 0.55 }} />

      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Exhibit Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div
              className="font-mono"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.3rem 0.85rem',
                backgroundColor: 'rgba(255, 216, 138, 0.12)',
                borderRadius: '999px',
                border: '1px solid rgba(255, 216, 138, 0.3)',
                color: '#ffd88a',
                fontSize: '0.74rem',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem'
              }}
            >
              <Moon size={13} color="#ffd88a" />
              <span>EXHIBIT 03 // ROOFTOP FLIGHTPATH</span>
            </div>
            <h3 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', margin: 0, color: '#fff8f1' }}>
              Midnight Rooftop Flightpath
            </h3>
            <p style={{ fontSize: '0.94rem', color: '#c9ceff', margin: '0.4rem 0 0', maxWidth: '640px' }}>
              Glide with Pip across sleeping chimneys. Drag the flight scrubber or dispatch sweet dreams to each home.
            </p>
          </div>

          {/* Quick Dispatch Action Button */}
          <button
            onClick={handleDispatchNext}
            disabled={isDelivering}
            className="retro-btn"
            style={{
              backgroundColor: '#ffd88a',
              color: '#34221a',
              borderColor: '#ffd88a',
              boxShadow: '3px 3px 0px #a34063',
              padding: '0.75rem 1.4rem',
              fontSize: '0.9rem',
              fontWeight: 700
            }}
          >
            <Send size={15} color="#a34063" />
            <span>{isDelivering ? 'Dispatching...' : 'Send Sweet Dream'}</span>
          </button>
        </div>

        {/* Illustrated Rooftop Panorama & SVG Flight Path Stage */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '280px',
            borderRadius: '18px',
            backgroundColor: '#04050d',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden'
          }}
        >
          {/* Subtle moon in corner */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '35px',
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              backgroundColor: '#ffd88a',
              boxShadow: '0 0 25px rgba(255, 216, 138, 0.65)'
            }}
          />

          <svg
            viewBox="0 0 700 240"
            style={{ width: '100%', height: '100%' }}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="delivery-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffd88a" />
                <stop offset="50%" stopColor="#ffb3ba" />
                <stop offset="100%" stopColor="#c4b5fd" />
              </linearGradient>
              <filter id="pip-glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background silhouettes of sleeping roofs */}
            <path
              d="M0 240 L0 180 L70 140 L140 180 L200 150 L270 190 L380 120 L480 180 L560 140 L640 180 L700 150 L700 240 Z"
              fill="#0b0e24"
            />
            {/* Foreground roofs */}
            <path
              d="M0 240 L0 200 L50 160 L100 200 L110 150 L125 150 L125 200 L170 170 L240 210 L300 160 L380 210 L410 160 L430 160 L430 210 L500 180 L580 220 L640 170 L700 200 L700 240 Z"
              fill="#060714"
            />

            {/* Glowing Windows */}
            <rect x="65" y="185" width="10" height="14" rx="2" fill="#ffd88a" opacity="0.9" />
            <rect x="180" y="195" width="12" height="15" rx="2" fill="#ffd88a" opacity="0.85" />
            <rect x="330" y="185" width="10" height="14" rx="2" fill="#ffd88a" opacity="0.9" />
            <rect x="520" y="195" width="12" height="16" rx="2" fill="#ffd88a" opacity="0.95" />

            {/* Luminous SVG Bezier Flightpath */}
            <path
              ref={pathRef}
              id="delivery-path"
              d="M 80 150 Q 170 60, 260 80 T 440 140 T 620 90"
              fill="none"
              stroke="url(#delivery-line-grad)"
              strokeWidth="3.5"
              strokeDasharray="6 6"
              filter="url(#pip-glow)"
            />

            {/* Stop Location Waypoints */}
            {STOPS.map((stop, idx) => {
              const isPassed = currentStopIndex >= idx;
              return (
                <g
                  key={stop.id}
                  onClick={() => handleSelectStop(idx)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={stop.x}
                    cy={stop.y}
                    r={currentStopIndex === idx ? 8 : 5}
                    fill={isPassed ? '#ffd88a' : '#777dff'}
                    filter="url(#pip-glow)"
                  />
                  <text
                    x={stop.x}
                    y={stop.y + 22}
                    textAnchor="middle"
                    fill="#c9ceff"
                    fontSize="10"
                    fontFamily="var(--font-mono)"
                  >
                    {stop.label.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Real-time Smooth Pip Cloud Marker */}
          <div
            style={{
              position: 'absolute',
              left: `${(pipCoords.x / 700) * 100}%`,
              top: `${(pipCoords.y / 240) * 100}%`,
              transform: 'translate(-50%, -75%)',
              pointerEvents: 'none',
              transition: isDragging ? 'none' : 'all 0.15s ease-out',
              filter: 'drop-shadow(0 0 16px rgba(255, 216, 138, 0.9))',
              zIndex: 10
            }}
          >
            <img
              src="/assets/pip_avatar_cloud.png"
              alt="Pip on the bedtime dream delivery cloud"
              style={{ width: '64px', height: '64px', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Flight Scrubber & Stop Telemetry */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
          {/* Scrubber bar */}
          <div className="rooftop-scrubber-bar">
            <Sliders size={16} color="#ffd88a" />
            <input
              type="range"
              min="0"
              max="100"
              value={sliderProgress}
              aria-label="Rooftop flightpath progress scrubber"
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onTouchStart={() => setIsDragging(true)}
              onTouchEnd={() => setIsDragging(false)}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setSliderProgress(val);
                const nearest = Math.min(
                  STOPS.length - 1,
                  Math.max(0, Math.round((val / 100) * (STOPS.length - 1)))
                );
                setCurrentStopIndex(nearest);
              }}
              style={{
                width: '100%',
                accentColor: '#ffd88a',
                cursor: 'pointer'
              }}
            />
            <span className="font-mono" style={{ fontSize: '0.78rem', color: '#ffd88a', minWidth: '42px' }}>
              {sliderProgress}%
            </span>
          </div>

          {/* Active Stop Card */}
          <div
            style={{
              padding: '0.85rem 1.25rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 216, 138, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <CheckCircle2 size={18} color="#ffd88a" />
            </div>
            <div>
              <div className="font-mono" style={{ fontSize: '0.72rem', color: '#ffd88a' }}>
                CURRENT TARGET: {activeStop.label.toUpperCase()}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff8f1' }}>
                {activeStop.recipient} • <span style={{ fontStyle: 'italic', fontWeight: 400, color: '#c9ceff' }}>"{activeStop.dreamType}"</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
