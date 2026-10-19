import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { soundEngine } from '../audio/soundEngine';
import { unlockFragment } from '../utils/passportStorage';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { INITIAL_DESTINATIONS, type Destination } from '../types/atlas';
import { AtlasDesktopView } from '../components/atlas/AtlasDesktopView';
import { AtlasMobileView } from '../components/atlas/AtlasMobileView';

export const MidnightAtlasPage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [selectedIdx, setSelectedIdx] = useState<number>(1);
  const [flightProgress, setFlightProgress] = useState<number>(0);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [pipPosition, setPipPosition] = useState<{ x: number; y: number }>({ x: 90, y: 220 });
  const [pathLength, setPathLength] = useState<number>(1000);

  const isMobile = useMediaQuery('(max-width: 860px)');
  const pathRef = useRef<SVGPathElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const pipMarkerRef = useRef<SVGGElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Initialize and measure flight path
  useEffect(() => {
    window.scrollTo(0, 0);
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);
      const pt = pathRef.current.getPointAtLength(0);
      setPipPosition({ x: pt.x, y: pt.y });
    }
  }, []);

  // Update Pip coordinates when scrubber or progress changes
  const updatePipAtProgress = useCallback(
    (progressFraction: number) => {
      if (!pathRef.current || pathLength <= 0) return;
      const dist = Math.max(0, Math.min(pathLength, progressFraction * pathLength));
      const pt = pathRef.current.getPointAtLength(dist);
      setPipPosition({ x: pt.x, y: pt.y });
      if (pipMarkerRef.current) {
        pipMarkerRef.current.setAttribute('transform', `translate(${pt.x}, ${pt.y})`);
      }
    },
    [pathLength]
  );

  const activeDestination = destinations[selectedIdx];

  // 1. Select destination (inspect dwelling and dossier, Pip remains at previous position)
  const handleSelectDestination = (index: number) => {
    setSelectedIdx(index);
    soundEngine.playClick(440 + index * 40);
    unlockFragment('rooftop');
  };

  // 2. Dispatch dream action (Pip takes off and flies along the path to the selected destination)
  const handleDispatchDream = () => {
    if (isDispatching) return;
    setIsDispatching(true);
    soundEngine.playClick(580);
    soundEngine.playMusicBoxNote(activeDestination.frequency, 1.4);

    const targetProgress = (selectedIdx / (destinations.length - 1)) * 100;
    const startProgress = flightProgress;
    const isSameSpot = Math.abs(startProgress - targetProgress) < 0.5;

    // Animate progress with GSAP direct DOM update to eliminate React 19 re-render thrash
    const obj = { val: isSameSpot ? Math.max(0, targetProgress - 6) : startProgress };
    
    gsap.to(obj, {
      val: targetProgress,
      duration: isSameSpot ? 0.7 : 1.4,
      ease: 'power2.inOut',
      onUpdate: () => {
        // Direct DOM update during flight
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${obj.val}%`;
        }
        if (pathRef.current && pathLength > 0 && pipMarkerRef.current) {
          const dist = Math.max(0, Math.min(pathLength, (obj.val / 100) * pathLength));
          const pt = pathRef.current.getPointAtLength(dist);
          pipMarkerRef.current.setAttribute('transform', `translate(${pt.x}, ${pt.y})`);
        }
      },
      onComplete: () => {
        setIsDispatching(false);
        setFlightProgress(Math.round(targetProgress));
        updatePipAtProgress(targetProgress / 100);
        soundEngine.playCelebrationChime();

        // Mark as delivered
        setDestinations((prev) =>
          prev.map((d, i) => (i === selectedIdx ? { ...d, status: 'delivered' } : d))
        );

        // Gentle celebratory confetti burst
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.65 },
            colors: ['#ffd88a', '#c4b5fd', '#ffb3ba', '#bae1ff']
          });
        } catch {
          // graceful fallback
        }
      }
    });
  };

  // Reset entire route
  const handleResetRoute = () => {
    setDestinations((prev) =>
      prev.map((d, i) => (i === 0 ? { ...d, status: 'delivered' } : { ...d, status: 'pending' }))
    );
    setSelectedIdx(0);
    setFlightProgress(0);
    updatePipAtProgress(0);
    soundEngine.playClick(320);
  };

  return (
    <div
      className="midnight-atlas-page"
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: isMobile ? '1.25rem 0.75rem 4rem' : '2rem 1.5rem 5rem',
        backgroundColor: '#050718',
        color: '#fff8f1'
      }}
    >
      {/* Background Starfield */}
      <div className="midnight-celestial-stars" style={{ opacity: 0.8 }} />

      {isMobile ? (
        <AtlasMobileView
          destinations={destinations}
          selectedIdx={selectedIdx}
          flightProgress={flightProgress}
          isDispatching={isDispatching}
          pipPosition={pipPosition}
          onSelectDestination={handleSelectDestination}
          onDispatchDream={handleDispatchDream}
          onResetRoute={handleResetRoute}
        />
      ) : (
        <AtlasDesktopView
          destinations={destinations}
          selectedIdx={selectedIdx}
          flightProgress={flightProgress}
          isDispatching={isDispatching}
          pipPosition={pipPosition}
          pathRef={pathRef}
          mapContainerRef={mapContainerRef}
          pipMarkerRef={pipMarkerRef}
          progressBarRef={progressBarRef}
          onSelectDestination={handleSelectDestination}
          onDispatchDream={handleDispatchDream}
          onResetRoute={handleResetRoute}
        />
      )}
    </div>
  );
};

export default MidnightAtlasPage;
