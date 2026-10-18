import React, { useEffect, useState } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  symbol: string;
}

const SPARKLE_COLORS = ['#ffd88a', '#ffb3ba', '#bae1ff', '#baffc9', '#e8dff5'];
const SPARKLE_SYMBOLS = ['✦', '★', '✧', '•'];

interface SparkleTrailProps {
  enabled?: boolean;
}

export const SparkleTrail: React.FC<SparkleTrailProps> = ({ enabled = true }) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    if (!enabled) return;

    // Explicitly disable for coarse pointers (touch screens, mobile, tablets)
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const isFine = window.matchMedia('(pointer: fine)').matches;
    if (isCoarse || !isFine) return;

    // Explicitly disable for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let idCounter = 0;
    let lastTime = 0;
    const THROTTLE_MS = 38; // ~26 fps throttle for buttery smoothness without layout thrashing

    const handlePointerMove = (e: PointerEvent) => {
      // Ignore simulated pointer events or touch pointers
      if (e.pointerType === 'touch') return;

      const now = performance.now();
      if (now - lastTime < THROTTLE_MS) return;
      lastTime = now;

      const currentId = idCounter++;
      const newSparkle: Sparkle = {
        id: currentId,
        x: e.clientX,
        y: e.clientY,
        color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
        size: Math.floor(Math.random() * 8) + 8,
        symbol: SPARKLE_SYMBOLS[Math.floor(Math.random() * SPARKLE_SYMBOLS.length)]
      };

      setSparkles((prev) => [...prev.slice(-14), newSparkle]);

      // Automatically decay and clean up each sparkle node after 650ms
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== currentId));
      }, 650);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [enabled]);

  if (!enabled || sparkles.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        overflow: 'hidden'
      }}
    >
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="sparkle-trail-particle"
          style={{
            position: 'absolute',
            left: `${s.x}px`,
            top: `${s.y}px`,
            color: s.color,
            fontSize: `${s.size}px`,
            transform: 'translate(-50%, -50%)',
            textShadow: `0 0 8px ${s.color}`,
            lineHeight: 1,
            userSelect: 'none'
          }}
        >
          {s.symbol}
        </span>
      ))}
    </div>
  );
};

export default SparkleTrail;
