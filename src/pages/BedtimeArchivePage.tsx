import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { soundEngine } from '../audio/soundEngine';
import { getAllSavedTickets, deleteSavedTicket } from '../utils/dreamStorage';
import { unlockFragment } from '../utils/passportStorage';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { CHAPTERS } from '../types/archive';
import type { SavedDreamTicket } from '../components/exhibits/DreamForge';
import { ArchiveDesktopView } from '../components/archive/ArchiveDesktopView';
import { ArchiveMobileView } from '../components/archive/ArchiveMobileView';

export const BedtimeArchivePage: React.FC = () => {
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);
  const [savedTickets, setSavedTickets] = useState<SavedDreamTicket[]>(() => getAllSavedTickets());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const isMobile = useMediaQuery('(max-width: 860px)');
  const bookCardRef = useRef<HTMLDivElement>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Unlock Story Star when reaching Chapter III
  useEffect(() => {
    if (activeChapterIdx === 2) {
      unlockFragment('story');
    }
  }, [activeChapterIdx]);

  // Chapter change handler with physical page turn sound & 3D GSAP transition
  const goToChapter = useCallback(
    (index: number) => {
      if (index === activeChapterIdx) return;
      const direction = index > activeChapterIdx ? 1 : -1;
      setActiveChapterIdx(index);
      soundEngine.playPageTurn();
      soundEngine.playMusicBoxNote(CHAPTERS[index].noteFreq, 1.2);

      if (bookCardRef.current) {
        gsap.fromTo(
          bookCardRef.current,
          {
            opacity: 0,
            rotateY: direction * 10,
            transformPerspective: 1200,
            scale: 0.98
          },
          {
            opacity: 1,
            rotateY: 0,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out'
          }
        );
      }
    },
    [activeChapterIdx]
  );

  // Keyboard navigation: Left/Right arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement).tagName.toLowerCase())) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (activeChapterIdx < CHAPTERS.length - 1) {
          goToChapter(activeChapterIdx + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (activeChapterIdx > 0) {
          goToChapter(activeChapterIdx - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeChapterIdx, goToChapter]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (deltaX < -50 && activeChapterIdx < CHAPTERS.length - 1) {
      goToChapter(activeChapterIdx + 1);
    } else if (deltaX > 50 && activeChapterIdx > 0) {
      goToChapter(activeChapterIdx - 1);
    }
    setTouchStartX(null);
  };

  const handleCopyTicket = (ticket: SavedDreamTicket) => {
    const text = `✦ Pip: DreamOS '99 — ${ticket.title} ✦\nWorld: ${ticket.world} | Companion: ${ticket.companion} | Tone: ${ticket.feeling}\nFrequency: ${ticket.frequency} [432 Hz Calibrated]\n\n"${ticket.story}"`;
    navigator.clipboard.writeText(text);
    setCopiedId(ticket.id);
    soundEngine.playClick(650);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDeleteTicket = (id: string) => {
    deleteSavedTicket(id);
    setSavedTickets(getAllSavedTickets());
    soundEngine.playClick(320);
  };

  return (
    <div
      className="bedtime-archive-page"
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: isMobile ? '1.25rem 0.75rem 4rem' : '2rem 1.5rem 5rem'
      }}
    >
      {isMobile ? (
        <ArchiveMobileView
          chapters={CHAPTERS}
          activeChapterIdx={activeChapterIdx}
          savedTickets={savedTickets}
          copiedId={copiedId}
          bookCardRef={bookCardRef}
          onGoToChapter={goToChapter}
          onCopyTicket={handleCopyTicket}
          onDeleteTicket={handleDeleteTicket}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />
      ) : (
        <ArchiveDesktopView
          chapters={CHAPTERS}
          activeChapterIdx={activeChapterIdx}
          savedTickets={savedTickets}
          copiedId={copiedId}
          bookCardRef={bookCardRef}
          onGoToChapter={goToChapter}
          onCopyTicket={handleCopyTicket}
          onDeleteTicket={handleDeleteTicket}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />
      )}
    </div>
  );
};

export default BedtimeArchivePage;
