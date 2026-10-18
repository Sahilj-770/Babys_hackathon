import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { BootScreen } from './components/BootScreen';
import { SharedLayout } from './components/layout/SharedLayout';
import { NurseryHome } from './pages/NurseryHome';
import { DreamForgePage } from './pages/DreamForgePage';
import { MidnightAtlasPage } from './pages/MidnightAtlasPage';
import { BedtimeArchivePage } from './pages/BedtimeArchivePage';
import { SecretArcadePage } from './pages/SecretArcadePage';

import './App.css';

// Register GSAP plugins safely
gsap.registerPlugin(ScrollTrigger);

export function App() {
  const [booted, setBooted] = useState(() => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      return true;
    }
    return false;
  });

  // Global ESC key listener to skip boot sequence
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !booted) {
        setBooted(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [booted]);

  return (
    <>
      {/* Skippable Theatrical Boot Screen on initial Nursery Home visit */}
      {!booted && (
        <BootScreen onEnter={() => setBooted(true)} />
      )}

      <BrowserRouter>
        <Routes>
          <Route element={<SharedLayout />}>
            <Route path="/" element={<NurseryHome />} />
            <Route path="/dream-forge" element={<DreamForgePage />} />
            <Route path="/atlas" element={<MidnightAtlasPage />} />
            <Route path="/archive" element={<BedtimeArchivePage />} />
            <Route path="/secret-arcade" element={<SecretArcadePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
