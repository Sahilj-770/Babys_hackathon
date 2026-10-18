import React, { useState, useEffect } from 'react';
import { Terminal, Moon, Play } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface BootScreenProps {
  onEnter: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onEnter }) => {
  const [bootStep, setBootStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const bootSequence = [
      'BIOS 1.99.0 DreamOS Core Initialized...',
      'Checking Memory: 640KB Nursery RAM OK...',
      'Mounting /dev/starlight-lantern...',
      'Loading Pip Soundbox Module (WebAudio v1)...',
      'Syncing Lullaby Frequency: 432 Hz [STABLE]...',
      'Midnight Nursery daemon running on PID 077...',
      'Ready. Press ENTER or Click to Wake Up.'
    ];

    let timer: ReturnType<typeof setTimeout>;
    if (bootStep < bootSequence.length) {
      timer = setTimeout(() => {
        setLogs((prev) => [...prev, bootSequence[bootStep]]);
        setBootStep((prev) => prev + 1);
        soundEngine.playClick(600 + bootStep * 60);
      }, 260);
    }

    return () => clearTimeout(timer);
  }, [bootStep]);

  const handleStart = () => {
    soundEngine.playMusicBoxNote(523.25);
    onEnter();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#090b20',
        color: '#ffd88a',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        fontFamily: 'var(--font-mono)'
      }}
    >
      <div
        style={{
          maxWidth: '680px',
          width: '100%',
          backgroundColor: '#0f1430',
          border: '1.5px solid #777dff',
          borderRadius: '12px',
          padding: '1.75rem',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 25px rgba(119,125,255,0.25)'
        }}
      >
        {/* Terminal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(119,125,255,0.3)',
            paddingBottom: '0.75rem',
            marginBottom: '1rem',
            color: '#777dff',
            fontSize: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Terminal size={18} />
            <span>MIDNIGHT NURSERY // DREAMOS '99</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Moon size={16} />
            <span>V1.99.4-STABLE</span>
          </div>
        </div>

        {/* Boot Terminal Logs */}
        <div
          style={{
            minHeight: '190px',
            fontSize: '0.88rem',
            lineHeight: '1.7',
            color: '#eaeaff'
          }}
        >
          {logs.map((log, index) => (
            <div key={index} style={{ opacity: 0.95 }}>
              <span style={{ color: '#ffd88a', marginRight: '0.5rem' }}>&gt;</span>
              {log}
            </div>
          ))}
          {bootStep < 7 && (
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '14px',
                backgroundColor: '#ffd88a',
                marginLeft: '4px',
                verticalAlign: 'middle',
                animation: 'blink 0.8s infinite'
              }}
            />
          )}
        </div>

        {/* Action button */}
        <div
          style={{
            marginTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            borderTop: '1px solid rgba(119,125,255,0.3)',
            paddingTop: '1rem'
          }}
        >
          <span style={{ fontSize: '0.75rem', color: '#9ba0d8' }}>
            [ESC] or button to skip boot sequence
          </span>

          <button
            onClick={handleStart}
            className="retro-btn"
            style={{
              background: '#777dff',
              color: '#ffffff',
              border: '1.5px solid #ffd88a',
              boxShadow: '3px 3px 0px #ffd88a',
              cursor: 'pointer'
            }}
          >
            <Play size={16} fill="currentColor" />
            <span>Enter the Nursery</span>
          </button>
        </div>
      </div>
    </div>
  );
};
