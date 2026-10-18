import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Compass,
  Heart,
  Smile,
  Check,
  BookmarkCheck,
  RotateCcw,
  Share2,
  Wand2,
  Moon,
  Cloud,
  Waves,
  Trees
} from 'lucide-react';
import soundEngine from '../../audio/soundEngine';

// ============================================================================
// Types & Definitions
// ============================================================================

export type WorldId = 'rooftops' | 'garden' | 'ocean' | 'woodland';
export type CompanionId = 'kitten' | 'moth' | 'whale' | 'sprite';
export type FeelingId = 'peaceful' | 'wonder' | 'courage' | 'cozy';

interface WorldOption {
  id: WorldId;
  name: string;
  tagline: string;
  colors: [string, string, string, string]; // [deepSky, midSky, accent1, accent2]
  icon: typeof Moon;
}

interface CompanionOption {
  id: CompanionId;
  name: string;
  subtitle: string;
  description: string;
}

interface FeelingOption {
  id: FeelingId;
  name: string;
  tone: string;
  auraColor: string;
  glowRgba: string;
}

interface SavedDreamTicket {
  id: string;
  title: string;
  world: WorldId;
  companion: CompanionId;
  feeling: FeelingId;
  story: string;
  colors: [string, string, string, string];
  timestamp: string;
}

const WORLDS: WorldOption[] = [
  {
    id: 'rooftops',
    name: 'Moonlit Rooftops',
    tagline: 'Silhouetted slate tiles & glowing gables',
    colors: ['#050718', '#1a224a', '#ffd88a', '#ff9e7d'],
    icon: Moon
  },
  {
    id: 'garden',
    name: 'Lavender Cloud Garden',
    tagline: 'Pillow clouds & floating blossom petals',
    colors: ['#160e29', '#412b6b', '#c4b5fd', '#fbcfe8'],
    icon: Cloud
  },
  {
    id: 'ocean',
    name: 'Starlight Ocean',
    tagline: 'Bioluminescent ripples & seafoam stars',
    colors: ['#021324', '#093758', '#38bdf8', '#7dd3fc'],
    icon: Waves
  },
  {
    id: 'woodland',
    name: 'Sleepy Woodland',
    tagline: 'Mossy hollows & dancing firefly lanterns',
    colors: ['#061a10', '#133e24', '#86efac', '#fef08a'],
    icon: Trees
  }
];

const COMPANIONS: CompanionOption[] = [
  {
    id: 'kitten',
    name: 'A Floating Kitten',
    subtitle: 'Curled on a velvet cloud',
    description: 'Purrs at 432 Hz and kneads sleepy stardust before curling tight.'
  },
  {
    id: 'moth',
    name: 'A Sleepy Moon Moth',
    subtitle: 'Wings dusted in lunar silver',
    description: 'Drifts silently on nocturnal thermals, leaving glowing silver pollen.'
  },
  {
    id: 'whale',
    name: 'A Tiny Cloud Whale',
    subtitle: 'Gliding through twilight mist',
    description: 'Spouts golden constellation spray while navigating velvet breezes.'
  },
  {
    id: 'sprite',
    name: "Pip's Lantern Sprite",
    subtitle: 'A dancing spark of starlight',
    description: 'Bounces merrily with a warm brass ring, chasing away scary shadows.'
  }
];

const FEELINGS: FeelingOption[] = [
  {
    id: 'peaceful',
    name: 'Peaceful',
    tone: 'Slow lullaby rhythm & deep lavender calm',
    auraColor: '#c4b5fd',
    glowRgba: 'rgba(196, 181, 253, 0.45)'
  },
  {
    id: 'wonder',
    name: 'Wonder',
    tone: 'Glittering constellation sparks & quiet awe',
    auraColor: '#ffd88a',
    glowRgba: 'rgba(255, 216, 138, 0.55)'
  },
  {
    id: 'courage',
    name: 'Courage',
    tone: 'Steadfast dawn-rose warmth & gentle bravery',
    auraColor: '#fb7185',
    glowRgba: 'rgba(251, 113, 133, 0.45)'
  },
  {
    id: 'cozy',
    name: 'Cozy',
    tone: 'Honeyed hearth embers & soft velvet blankets',
    auraColor: '#fbbf24',
    glowRgba: 'rgba(251, 191, 36, 0.5)'
  }
];

// Custom Bedtime Story Matrix Generator
function generateBedtimeStory(world: WorldId, companion: CompanionId, feeling: FeelingId): { title: string; story: string } {
  const titles: Record<string, string> = {
    'rooftops-kitten-peaceful': 'The Velvet Rooftop Lullaby',
    'rooftops-kitten-wonder': 'The Chimney-Top Constellation Cat',
    'rooftops-kitten-courage': 'The Brave Little Roof Prowler',
    'rooftops-kitten-cozy': 'The Kitten by the Chimney Hearth',

    'rooftops-moth-peaceful': 'Silver Wings Over Sleeping Gables',
    'rooftops-moth-wonder': 'The Lantern-Catcher of Clocktower',
    'rooftops-moth-courage': 'The Nightflight Across the Spires',
    'rooftops-moth-cozy': 'A Velvet Moth in the Attic Flue',

    'rooftops-whale-peaceful': 'The Low Tide of Midnight Chimneys',
    'rooftops-whale-wonder': 'The Star-Spouting Cloud Whale',
    'rooftops-whale-courage': 'The Guardian of the Slate Roofs',
    'rooftops-whale-cozy': 'Velvet Breaches Above the Nursery',

    'rooftops-sprite-peaceful': 'The Lantern Sprite’s Quiet Watch',
    'rooftops-sprite-wonder': 'A Trail of Gold Along the Eaves',
    'rooftops-sprite-courage': 'The Fearless Beacon of Midnight',
    'rooftops-sprite-cozy': 'The Warmest Wick on Clover Lane',

    'garden-kitten-peaceful': 'The Purring Cloud Petal',
    'garden-kitten-wonder': 'The Kitten Who Chased Falling Comets',
    'garden-kitten-courage': 'The Cloud-Jumper of Lavender Hill',
    'garden-kitten-cozy': 'A Nap in the Cumulus Blossom',

    'garden-moth-peaceful': 'The Lavender Moon Dance',
    'garden-moth-wonder': 'Stardust Pollen in the Twilight',
    'garden-moth-courage': 'Wings Against the Evening Breeze',
    'garden-moth-cozy': 'The Cocoon of Scented Dreams',

    'garden-whale-peaceful': 'Drifting Across the Lilac Fog',
    'garden-whale-wonder': 'The Whale that Sprinkled Petals',
    'garden-whale-courage': 'Through the High Purple Clouds',
    'garden-whale-cozy': 'The Gentle Giant of the Soft Sky',

    'garden-sprite-peaceful': 'A Floating Ember in the Bloom',
    'garden-sprite-wonder': 'Kindling the Star-Buds',
    'garden-sprite-courage': 'The Guard of the Lavender Gate',
    'garden-sprite-cozy': 'The Tea-Light in the Petal Alcove',

    'ocean-kitten-peaceful': 'The Kitten and the Bioluminescent Tide',
    'ocean-kitten-wonder': 'Fishing for Fallen Starlight',
    'ocean-kitten-courage': 'The Little Sailor of Seafoam Bay',
    'ocean-kitten-cozy': 'Curled on a Coral Pillow',

    'ocean-moth-peaceful': 'Skimming the Phosphor Waves',
    'ocean-moth-wonder': 'The Lighthouse Moth of the Deep',
    'ocean-moth-courage': 'Navigating the Oceanic Squall',
    'ocean-moth-cozy': 'Shelter Beneath the Nautilus Shell',

    'ocean-whale-peaceful': 'The Deep Blue Slumber Song',
    'ocean-whale-wonder': 'The Whale that Swallowed a Star',
    'ocean-whale-courage': 'Voyage to the Sunken Moon',
    'ocean-whale-cozy': 'The Warm Current of Midnight Bay',

    'ocean-sprite-peaceful': 'The Floating Lantern Buoy',
    'ocean-sprite-wonder': 'Sparkles on the Coral Reef',
    'ocean-sprite-courage': 'Piercing the Deepest Dark',
    'ocean-sprite-cozy': 'A Beacon in the Warm Lagoon',

    'woodland-kitten-peaceful': 'The Mossy Hollow Nap',
    'woodland-kitten-wonder': 'The Kitten and the Firefly Tree',
    'woodland-kitten-courage': 'The Brave Cub of Bramble Wood',
    'woodland-kitten-cozy': 'Tucked Inside the Ancient Oak',

    'woodland-moth-peaceful': 'Whispers Through the Pine Needles',
    'woodland-moth-wonder': 'The Silver Path to the Hidden Glen',
    'woodland-moth-courage': 'Flight of the Forest Sentinel',
    'woodland-moth-cozy': 'Resting on Velvet Lichen',

    'woodland-whale-peaceful': 'The Cloud Whale of the Forest Mist',
    'woodland-whale-wonder': 'Gliding Over the Emerald Canopy',
    'woodland-whale-courage': 'The Mountain Wind Guide',
    'woodland-whale-cozy': 'Resting in the Canopy Cradle',

    'woodland-sprite-peaceful': 'The Firefly Friend of the Glade',
    'woodland-sprite-wonder': 'Kindling the Hollow Constellation',
    'woodland-sprite-courage': 'Light Through the Deep Briars',
    'woodland-sprite-cozy': 'The Campfire Glow of Pip’s Acorn'
  };

  const key = `${world}-${companion}-${feeling}`;
  const title = titles[key] || 'The Bespoke Bedtime Dream';

  const companionNames: Record<CompanionId, string> = {
    kitten: 'a soft sleeping kitten curled upon a velvet cloud',
    moth: 'a gentle moon moth with wings dusted in lunar silver',
    whale: 'a tiny cloud whale swimming serenely through twilight',
    sprite: "Pip's cheerful lantern sprite, dancing with starlight"
  };

  const worldVistas: Record<WorldId, string> = {
    rooftops: 'over quiet moonlit rooftops and chimney tops',
    garden: 'through the scented mists of Lavender Cloud Garden',
    ocean: 'across the glowing phosphorescent ripples of Starlight Ocean',
    woodland: 'beneath the rustling green boughs of Sleepy Woodland'
  };

  const feelingClosings: Record<FeelingId, string> = {
    peaceful:
      'A calm 432 Hz frequency settles in your chest, washing away every worry as slow, soothing sleep draws close.',
    wonder:
      'Glimmering constellation dust floats from the sky, filling your thoughts with boundless quiet magic until morning arrives.',
    courage:
      'A steadfast golden warmth wraps around you like a protective wool coat, reminding you that night is always friendly.',
    cozy:
      'Wrapped in the gentle warmth of nursery blankets, you close your eyes knowing you are safe, sleepy, and loved.'
  };

  const story = `Tonight, you journey ${worldVistas[world]} guided by ${companionNames[companion]}. Together you watch the quiet hours unfold with tender stillness. ${feelingClosings[feeling]}`;

  return { title, story };
}

// Safe LocalStorage helpers
const STORAGE_KEY = 'pip_dreamos_saved_dream_ticket_v1';

function getStoredDream(): SavedDreamTicket | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.title && parsed.world && parsed.companion && parsed.feeling) {
      return parsed as SavedDreamTicket;
    }
  } catch {
    // Graceful fallback for private browsing / blocked storage
  }
  return null;
}

function saveDreamToStorage(ticket: SavedDreamTicket): boolean {
  try {
    if (typeof window === 'undefined') return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ticket));
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// Main DreamForge Component
// ============================================================================

export const DreamForge: React.FC = () => {
  const [selectedWorld, setSelectedWorld] = useState<WorldId>('rooftops');
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionId>('kitten');
  const [selectedFeeling, setSelectedFeeling] = useState<FeelingId>('peaceful');

  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [savedTicket, setSavedTicket] = useState<SavedDreamTicket | null>(() => getStoredDream());
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);
  const [isCopiedFeedback, setIsCopiedFeedback] = useState(false);

  const currentWorldObj = WORLDS.find((w) => w.id === selectedWorld)!;
  const currentCompanionObj = COMPANIONS.find((c) => c.id === selectedCompanion)!;
  const currentFeelingObj = FEELINGS.find((f) => f.id === selectedFeeling)!;

  const { title: dreamTitle, story: dreamStory } = generateBedtimeStory(
    selectedWorld,
    selectedCompanion,
    selectedFeeling
  );

  const handleSelectWorld = (worldId: WorldId) => {
    setSelectedWorld(worldId);
    soundEngine.playClick(460);
  };

  const handleSelectCompanion = (comp: CompanionId) => {
    setSelectedCompanion(comp);
    soundEngine.playClick(520);
  };

  const handleSelectFeeling = (feel: FeelingId) => {
    setSelectedFeeling(feel);
    soundEngine.playClick(580);
  };

  const handleForgeDream = () => {
    soundEngine.playForgeSpark();
    setActiveStep(4);

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.65 },
        colors: currentWorldObj.colors,
        disableForReducedMotion: true
      });
    } catch {
      // Confetti fallback
    }
  };

  const handleSaveDreamLocally = () => {
    const ticket: SavedDreamTicket = {
      id: `DRM-99-${Math.floor(1000 + Math.random() * 9000)}`,
      title: dreamTitle,
      world: selectedWorld,
      companion: selectedCompanion,
      feeling: selectedFeeling,
      story: dreamStory,
      colors: currentWorldObj.colors,
      timestamp: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    };

    saveDreamToStorage(ticket);
    setSavedTicket(ticket);
    setIsSavedFeedback(true);
    soundEngine.playCelebrationChime();
    setTimeout(() => setIsSavedFeedback(false), 3000);
  };

  const handleCopyTicket = async () => {
    const ticketText = `✨ DREAMOS '99 // BEDTIME DREAM TICKET ✨\n` +
      `Title: "${dreamTitle}"\n` +
      `World: ${currentWorldObj.name}\n` +
      `Companion: ${currentCompanionObj.name}\n` +
      `Feeling: ${currentFeelingObj.name} (${currentFeelingObj.tone})\n` +
      `Palette: ${currentWorldObj.colors.join(', ')}\n\n` +
      `Bedtime Story:\n"${dreamStory}"\n\n` +
      `* Calibrated with care by Pip, Junior Dream Engineer at Midnight Nursery *`;

    soundEngine.playClick(540);

    if (navigator.share) {
      try {
        await navigator.share({
          title: dreamTitle,
          text: ticketText
        });
        setIsCopiedFeedback(true);
        setTimeout(() => setIsCopiedFeedback(false), 2500);
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(ticketText);
        setIsCopiedFeedback(true);
        setTimeout(() => setIsCopiedFeedback(false), 2500);
      } catch {
        // Fallback
      }
    }
  };

  const handleLoadSavedDream = () => {
    if (!savedTicket) return;
    setSelectedWorld(savedTicket.world);
    setSelectedCompanion(savedTicket.companion);
    setSelectedFeeling(savedTicket.feeling);
    setActiveStep(4);
    soundEngine.playForgeSpark();
  };

  return (
    <div
      id="dream-forge"
      className="dream-forge-root"
      style={{
        borderRadius: '24px',
        border: '1.5px solid var(--border-color)',
        backgroundColor: 'var(--bg-surface)',
        boxShadow: 'var(--shadow-soft)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Decorative Machine Header Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          padding: '1.25rem 1.75rem',
          backgroundColor: 'var(--bg-retro-panel)',
          borderBottom: '1.5px solid var(--border-color)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-berry)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(163, 64, 99, 0.3)'
            }}
          >
            <Wand2 size={18} />
          </div>
          <div>
            <span
              className="font-mono"
              style={{
                fontSize: '0.7rem',
                color: 'var(--accent-color)',
                fontWeight: 700,
                letterSpacing: '0.05em'
              }}
            >
              OPERATIONAL WORKBENCH // SPEC-FORGE-99
            </span>
            <h3
              className="font-serif"
              style={{
                margin: 0,
                fontSize: '1.35rem',
                color: 'var(--text-heading)',
                lineHeight: 1.2
              }}
            >
              The Dream Forge
            </h3>
          </div>
        </div>

        {/* Step Navigation Tabs */}
        <div
          role="tablist"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: 'var(--bg-surface)',
            padding: '0.3rem',
            borderRadius: '999px',
            border: '1px solid var(--border-color)'
          }}
        >
          <button
            role="tab"
            aria-selected={activeStep === 1}
            onClick={() => {
              setActiveStep(1);
              soundEngine.playClick(440);
            }}
            className="retro-btn"
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeStep === 1 ? 'var(--color-berry)' : 'transparent',
              color: activeStep === 1 ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            1. World
          </button>
          <button
            role="tab"
            aria-selected={activeStep === 2}
            onClick={() => {
              setActiveStep(2);
              soundEngine.playClick(480);
            }}
            className="retro-btn"
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeStep === 2 ? 'var(--color-berry)' : 'transparent',
              color: activeStep === 2 ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            2. Companion
          </button>
          <button
            role="tab"
            aria-selected={activeStep === 3}
            onClick={() => {
              setActiveStep(3);
              soundEngine.playClick(520);
            }}
            className="retro-btn"
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeStep === 3 ? 'var(--color-berry)' : 'transparent',
              color: activeStep === 3 ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            3. Feeling
          </button>
          <button
            role="tab"
            aria-selected={activeStep === 4}
            onClick={() => {
              setActiveStep(4);
              soundEngine.playForgeSpark();
            }}
            className="retro-btn"
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeStep === 4 ? 'var(--color-gold)' : 'transparent',
              color: activeStep === 4 ? '#26160f' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            ✨ Ticket
          </button>
        </div>
      </div>

      {/* Main Content Layout: Interactive Controls on left, Live Diorama Preview on right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          padding: '2rem'
        }}
      >
        {/* ================================================================== */}
        {/* LEFT COLUMN: Controls / Wizard */}
        {/* ================================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* STEP 1: CHOOSE A WORLD */}
          {activeStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass size={18} color="var(--accent-color)" />
                <h4 className="font-serif" style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)' }}>
                  Step 1: Choose Your Dream Realm
                </h4>
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                Where should your thoughts drift as your eyes grow heavy? Pick the nocturnal setting.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                {WORLDS.map((w) => {
                  const Icon = w.icon;
                  const isSelected = selectedWorld === w.id;
                  return (
                    <button
                      key={w.id}
                      onClick={() => handleSelectWorld(w.id)}
                      className="retro-btn"
                      aria-pressed={isSelected}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        borderRadius: '14px',
                        border: isSelected ? '2px solid var(--accent-color)' : '1.5px solid var(--border-color)',
                        backgroundColor: isSelected ? 'var(--bg-retro-panel)' : 'var(--bg-card)',
                        boxShadow: isSelected ? '0 0 16px rgba(163, 64, 99, 0.18)' : 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          background: `linear-gradient(135deg, ${w.colors[0]}, ${w.colors[1]})`,
                          border: `1.5px solid ${w.colors[2]}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: w.colors[2],
                          flexShrink: 0
                        }}
                      >
                        <Icon size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-heading)' }}>
                            {w.name}
                          </span>
                          {/* Mini color swatches */}
                          <div style={{ display: 'flex', gap: '3px' }}>
                            {w.colors.map((c, idx) => (
                              <span
                                key={idx}
                                style={{
                                  width: '9px',
                                  height: '9px',
                                  borderRadius: '50%',
                                  backgroundColor: c,
                                  border: '1px solid rgba(255,255,255,0.4)'
                                }}
                              />
                            ))}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{w.tagline}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  onClick={() => {
                    setActiveStep(2);
                    soundEngine.playClick(480);
                  }}
                  className="retro-btn"
                  style={{
                    padding: '0.65rem 1.35rem',
                    borderRadius: '10px',
                    backgroundColor: 'var(--color-berry)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(163, 64, 99, 0.3)'
                  }}
                >
                  Next: Choose Companion →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CHOOSE A COMPANION */}
          {activeStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Smile size={18} color="var(--accent-color)" />
                <h4 className="font-serif" style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)' }}>
                  Step 2: Choose Your Sleep Companion
                </h4>
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                Who will guide your spirit and keep away restless thoughts? Choose a friendly bedtime ally.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                {COMPANIONS.map((c) => {
                  const isSelected = selectedCompanion === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleSelectCompanion(c.id)}
                      className="retro-btn"
                      aria-pressed={isSelected}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.85rem',
                        padding: '1rem',
                        borderRadius: '14px',
                        border: isSelected ? '2px solid var(--accent-color)' : '1.5px solid var(--border-color)',
                        backgroundColor: isSelected ? 'var(--bg-retro-panel)' : 'var(--bg-card)',
                        boxShadow: isSelected ? '0 0 16px rgba(163, 64, 99, 0.18)' : 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          backgroundColor: isSelected ? 'var(--color-berry)' : 'var(--bg-surface)',
                          color: isSelected ? '#ffffff' : 'var(--text-main)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1.5px solid var(--border-color)',
                          fontSize: '1.1rem',
                          flexShrink: 0
                        }}
                      >
                        {c.id === 'kitten' && '🐱'}
                        {c.id === 'moth' && '🦋'}
                        {c.id === 'whale' && '🐋'}
                        {c.id === 'sprite' && '✨'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-heading)' }}>
                          {c.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--accent-color)', fontWeight: 600 }}>
                          {c.subtitle}
                        </div>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {c.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <button
                  onClick={() => {
                    setActiveStep(1);
                    soundEngine.playClick(440);
                  }}
                  className="retro-btn"
                  style={{
                    padding: '0.65rem 1.2rem',
                    borderRadius: '10px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-main)',
                    border: '1.5px solid var(--border-color)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  ← Back to World
                </button>
                <button
                  onClick={() => {
                    setActiveStep(3);
                    soundEngine.playClick(520);
                  }}
                  className="retro-btn"
                  style={{
                    padding: '0.65rem 1.35rem',
                    borderRadius: '10px',
                    backgroundColor: 'var(--color-berry)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(163, 64, 99, 0.3)'
                  }}
                >
                  Next: Choose Feeling →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CHOOSE A FEELING */}
          {activeStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Heart size={18} color="var(--accent-color)" />
                <h4 className="font-serif" style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)' }}>
                  Step 3: Choose Tonight's Bedtime Feeling
                </h4>
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                What emotional atmosphere should color your slumber? The lantern's resonance tunes to this frequency.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {FEELINGS.map((f) => {
                  const isSelected = selectedFeeling === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => handleSelectFeeling(f.id)}
                      className="retro-btn"
                      aria-pressed={isSelected}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '0.4rem',
                        padding: '1rem',
                        borderRadius: '14px',
                        border: isSelected ? `2px solid ${f.auraColor}` : '1.5px solid var(--border-color)',
                        backgroundColor: isSelected ? 'var(--bg-retro-panel)' : 'var(--bg-card)',
                        boxShadow: isSelected ? `0 0 16px ${f.glowRgba}` : 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%' }}>
                        <span
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: f.auraColor,
                            boxShadow: `0 0 8px ${f.auraColor}`
                          }}
                        />
                        <span style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-heading)' }}>
                          {f.name}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                        {f.tone}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <button
                  onClick={() => {
                    setActiveStep(2);
                    soundEngine.playClick(480);
                  }}
                  className="retro-btn"
                  style={{
                    padding: '0.65rem 1.2rem',
                    borderRadius: '10px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-main)',
                    border: '1.5px solid var(--border-color)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  ← Back to Companion
                </button>
                <button
                  onClick={handleForgeDream}
                  className="retro-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    backgroundColor: 'var(--color-gold)',
                    color: '#26160f',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 18px rgba(255, 216, 138, 0.55)'
                  }}
                >
                  <Sparkles size={16} />
                  Forge Tonight's Dream!
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: BESPOKE DREAM TICKET */}
          {activeStep === 4 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                backgroundColor: 'var(--bg-surface)',
                border: '2px dashed var(--accent-color)',
                borderRadius: '18px',
                padding: '1.5rem',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  className="font-mono"
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--accent-color)',
                    fontWeight: 700,
                    backgroundColor: 'var(--bg-retro-panel)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '6px'
                  }}
                >
                  TICKET: #DRM-99-432-881
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Midnight Nursery Calibrated
                </span>
              </div>

              <div>
                <h4
                  className="font-serif"
                  style={{
                    margin: 0,
                    fontSize: '1.5rem',
                    color: 'var(--text-heading)',
                    lineHeight: 1.2
                  }}
                >
                  "{dreamTitle}"
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.72rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                      backgroundColor: 'var(--bg-retro-panel)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    Realm: {currentWorldObj.name}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.72rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                      backgroundColor: 'var(--bg-retro-panel)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    Ally: {currentCompanionObj.name}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.72rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                      backgroundColor: currentFeelingObj.glowRgba,
                      color: 'var(--text-main)',
                      border: `1px solid ${currentFeelingObj.auraColor}`
                    }}
                  >
                    Tone: {currentFeelingObj.name}
                  </span>
                </div>
              </div>

              {/* Bedtime Story Vignette */}
              <div
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '1px solid var(--border-color)'
                }}
              >
                <p
                  className="font-serif"
                  style={{
                    margin: 0,
                    fontSize: '0.98rem',
                    lineHeight: 1.6,
                    color: 'var(--text-main)',
                    fontStyle: 'italic'
                  }}
                >
                  "{dreamStory}"
                </p>
              </div>

              {/* Dream Color Palette Swatches */}
              <div>
                <span
                  className="font-mono"
                  style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}
                >
                  CHROMATIC SLEEP HARMONY:
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {currentWorldObj.colors.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      <span
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '4px',
                          backgroundColor: c,
                          border: '1px solid rgba(0,0,0,0.15)',
                          display: 'inline-block'
                        }}
                      />
                      <span style={{ color: 'var(--text-muted)' }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ticket Actions */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button
                  onClick={handleSaveDreamLocally}
                  className="retro-btn"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.65rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: isSavedFeedback ? '#22c55e' : 'var(--color-berry)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
                  }}
                >
                  {isSavedFeedback ? <BookmarkCheck size={16} /> : <BookmarkCheck size={16} />}
                  {isSavedFeedback ? 'Saved to Browser Journal!' : 'Save Dream Locally'}
                </button>

                <button
                  onClick={handleCopyTicket}
                  className="retro-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.65rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-main)',
                    border: '1.5px solid var(--border-color)',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  {isCopiedFeedback ? <Check size={16} color="#22c55e" /> : <Share2 size={16} />}
                  {isCopiedFeedback ? 'Copied Ticket!' : 'Share / Copy'}
                </button>

                <button
                  onClick={() => {
                    setActiveStep(1);
                    soundEngine.playClick(440);
                  }}
                  className="retro-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  <RotateCcw size={14} />
                  New Dream
                </button>
              </div>

              {savedTicket && (
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    marginTop: '0.25rem'
                  }}
                >
                  Last saved in nursery memory: <strong>{savedTicket.title}</strong>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================================================================== */}
        {/* RIGHT COLUMN: Live Diorama Dream Preview */}
        {/* ================================================================== */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 0.5rem'
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.04em'
              }}
            >
              REAL-TIME DIORAMA // 432_HZ_OPTICS
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: '0.72rem',
                color: currentFeelingObj.auraColor,
                backgroundColor: 'rgba(0,0,0,0.6)',
                padding: '0.15rem 0.55rem',
                borderRadius: '999px'
              }}
            >
              ● LIVE SIMULATION
            </span>
          </div>

          {/* Diorama Container */}
          <div
            className="diorama-viewport"
            style={{
              position: 'relative',
              width: '100%',
              minHeight: '380px',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              border: `2px solid ${currentWorldObj.colors[2]}40`,
              transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* 1. Dynamic World Backdrop Layer */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(180deg, ${currentWorldObj.colors[0]} 0%, ${currentWorldObj.colors[1]} 100%)`,
                transition: 'background 0.6s ease'
              }}
            />

            {/* World Specific Scenery */}
            {selectedWorld === 'rooftops' && (
              <svg
                viewBox="0 0 500 300"
                preserveAspectRatio="none"
                style={{ position: 'absolute', bottom: 0, width: '100%', height: '140px', opacity: 0.95 }}
              >
                {/* Moon */}
                <circle cx="420" cy="40" r="26" fill="#ffd88a" opacity="0.9" filter="drop-shadow(0 0 12px #ffd88a)" />
                <circle cx="430" cy="36" r="24" fill={currentWorldObj.colors[0]} />

                {/* Stars */}
                <circle cx="60" cy="40" r="1.5" fill="#ffffff" opacity="0.8" />
                <circle cx="150" cy="70" r="1.8" fill="#ffd88a" opacity="0.9" />
                <circle cx="280" cy="35" r="1.5" fill="#ffffff" opacity="0.7" />
                <circle cx="360" cy="80" r="2" fill="#ffd88a" opacity="0.85" />

                {/* Chimneys & Gable Silhouettes */}
                <path
                  d="M 0 300 L 0 200 L 60 140 L 120 200 L 190 150 L 260 210 L 340 130 L 420 200 L 500 160 L 500 300 Z"
                  fill="#03040c"
                />
                {/* Glowing Windows */}
                <rect x="75" y="210" width="12" height="16" rx="2" fill="#ffd88a" opacity="0.95" />
                <rect x="210" y="225" width="14" height="18" rx="2" fill="#ffd88a" opacity="0.9" />
                <rect x="365" y="200" width="12" height="16" rx="2" fill="#ffd88a" opacity="0.95" />
              </svg>
            )}

            {selectedWorld === 'garden' && (
              <svg
                viewBox="0 0 500 300"
                preserveAspectRatio="none"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.85 }}
              >
                {/* Pastel Cloud Blooms */}
                <path
                  d="M -20 240 Q 50 160 140 220 Q 220 140 320 210 Q 420 130 520 220 L 520 300 L -20 300 Z"
                  fill="#2b1a45"
                  opacity="0.85"
                />
                <path
                  d="M 30 260 Q 120 190 220 240 Q 320 180 430 250 L 500 300 L 0 300 Z"
                  fill="#3d2661"
                  opacity="0.9"
                />
                {/* Floating Blossom Petals */}
                <circle cx="80" cy="90" r="4" fill="#fbcfe8" opacity="0.75" />
                <circle cx="160" cy="140" r="5" fill="#c4b5fd" opacity="0.8" />
                <circle cx="340" cy="80" r="4.5" fill="#fbcfe8" opacity="0.75" />
                <circle cx="420" cy="130" r="4" fill="#c4b5fd" opacity="0.8" />
              </svg>
            )}

            {selectedWorld === 'ocean' && (
              <svg
                viewBox="0 0 500 300"
                preserveAspectRatio="none"
                style={{ position: 'absolute', bottom: 0, width: '100%', height: '150px', opacity: 0.9 }}
              >
                {/* Deep Waves with Bioluminescent crests */}
                <path
                  d="M 0 100 Q 120 60 250 90 T 500 80 L 500 300 L 0 300 Z"
                  fill="#031b33"
                  opacity="0.75"
                />
                <path
                  d="M 0 130 Q 130 90 270 120 T 500 110 L 500 300 L 0 300 Z"
                  fill="#042647"
                  opacity="0.85"
                />
                {/* Luminous crest strokes */}
                <path
                  d="M 0 130 Q 130 90 270 120 T 500 110"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  opacity="0.8"
                />
                {/* Phosphor Plankton Motes */}
                <circle cx="110" cy="180" r="2.5" fill="#7dd3fc" opacity="0.85" />
                <circle cx="280" cy="210" r="2" fill="#38bdf8" opacity="0.9" />
                <circle cx="410" cy="170" r="2.5" fill="#7dd3fc" opacity="0.8" />
              </svg>
            )}

            {selectedWorld === 'woodland' && (
              <svg
                viewBox="0 0 500 300"
                preserveAspectRatio="none"
                style={{ position: 'absolute', bottom: 0, width: '100%', height: '170px', opacity: 0.95 }}
              >
                {/* Tree Trunks & Forest Silhouettes */}
                <path
                  d="M 0 300 L 40 140 L 70 300 L 140 110 L 190 300 L 290 80 L 350 300 L 430 120 L 470 300 L 500 300 Z"
                  fill="#04120b"
                />
                <path
                  d="M 20 300 L 90 170 L 160 300 L 240 140 L 320 300 L 400 160 L 480 300 Z"
                  fill="#081f13"
                  opacity="0.9"
                />
                {/* Fireflies with glowing halos */}
                <circle cx="110" cy="110" r="3" fill="#fef08a" opacity="0.9" filter="drop-shadow(0 0 6px #fef08a)" />
                <circle cx="220" cy="80" r="2.5" fill="#86efac" opacity="0.95" filter="drop-shadow(0 0 6px #86efac)" />
                <circle cx="360" cy="100" r="3" fill="#fef08a" opacity="0.85" filter="drop-shadow(0 0 6px #fef08a)" />
              </svg>
            )}

            {/* 2. Feeling Atmosphere & Glowing Aura Ring */}
            <div
              style={{
                position: 'absolute',
                width: '240px',
                height: '240px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${currentFeelingObj.glowRgba} 0%, transparent 70%)`,
                filter: 'blur(30px)',
                pointerEvents: 'none',
                transition: 'all 0.6s ease'
              }}
            />

            {/* 3. Center Animated Companion Sprite */}
            <div
              style={{
                position: 'relative',
                zIndex: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                filter: `drop-shadow(0 8px 24px ${currentFeelingObj.auraColor}80)`
              }}
            >
              {/* Companion Illustrated Graphic */}
              {selectedCompanion === 'kitten' && (
                <div style={{ textAlign: 'center' }}>
                  <svg width="120" height="100" viewBox="0 0 120 100" style={{ overflow: 'visible' }}>
                    {/* Cloud Bed */}
                    <path
                      d="M 20 70 Q 10 50 30 45 Q 45 25 70 35 Q 90 20 100 45 Q 115 55 105 75 Q 95 90 60 85 Q 30 90 20 70 Z"
                      fill="#ffffff"
                      opacity="0.92"
                    />
                    {/* Sleeping Cat Body */}
                    <ellipse cx="62" cy="52" rx="26" ry="18" fill="#fed7aa" />
                    {/* Cat Head */}
                    <circle cx="48" cy="45" r="14" fill="#fed7aa" />
                    {/* Ears */}
                    <polygon points="40,36 36,24 46,32" fill="#fca5a5" />
                    <polygon points="50,33 58,23 58,35" fill="#fca5a5" />
                    {/* Sleeping Eyes */}
                    <path d="M 42 45 Q 45 48 48 45" fill="none" stroke="#78350f" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M 50 45 Q 53 48 56 45" fill="none" stroke="#78350f" strokeWidth="1.8" strokeLinecap="round" />
                    {/* Curled Tail */}
                    <path d="M 85 54 Q 96 46 92 38" fill="none" stroke="#fed7aa" strokeWidth="5" strokeLinecap="round" />
                    {/* Floating Zzz */}
                    <text x="75" y="26" fill="#ffd88a" fontSize="12" fontFamily="var(--font-mono)" fontWeight="700">z</text>
                    <text x="86" y="18" fill="#ffd88a" fontSize="15" fontFamily="var(--font-mono)" fontWeight="700">Z</text>
                  </svg>
                </div>
              )}

              {selectedCompanion === 'moth' && (
                <div style={{ textAlign: 'center' }}>
                  <svg width="120" height="100" viewBox="0 0 120 100" style={{ overflow: 'visible' }}>
                    {/* Moth Left Wing */}
                    <ellipse cx="44" cy="46" rx="28" ry="19" fill="#e0e7ff" opacity="0.88" transform="rotate(-25 44 46)" />
                    <circle cx="44" cy="46" r="6" fill="#ffd88a" opacity="0.75" />
                    {/* Moth Right Wing */}
                    <ellipse cx="76" cy="46" rx="28" ry="19" fill="#e0e7ff" opacity="0.88" transform="rotate(25 76 46)" />
                    <circle cx="76" cy="46" r="6" fill="#ffd88a" opacity="0.75" />
                    {/* Lower Wings */}
                    <ellipse cx="48" cy="62" rx="16" ry="12" fill="#c7d2fe" opacity="0.8" transform="rotate(-15 48 62)" />
                    <ellipse cx="72" cy="62" rx="16" ry="12" fill="#c7d2fe" opacity="0.8" transform="rotate(15 72 62)" />
                    {/* Fluffy Body */}
                    <ellipse cx="60" cy="52" rx="7" ry="18" fill="#4338ca" />
                    {/* Antennae */}
                    <path d="M 58 35 Q 50 18 42 16" fill="none" stroke="#ffd88a" strokeWidth="1.8" strokeLinecap="round" />
                    <circle cx="42" cy="16" r="2.5" fill="#ffd88a" />
                    <path d="M 62 35 Q 70 18 78 16" fill="none" stroke="#ffd88a" strokeWidth="1.8" strokeLinecap="round" />
                    <circle cx="78" cy="16" r="2.5" fill="#ffd88a" />
                  </svg>
                </div>
              )}

              {selectedCompanion === 'whale' && (
                <div style={{ textAlign: 'center' }}>
                  <svg width="130" height="100" viewBox="0 0 130 100" style={{ overflow: 'visible' }}>
                    {/* Spouting Stardust */}
                    <circle cx="56" cy="16" r="3" fill="#ffd88a" />
                    <circle cx="50" cy="24" r="2" fill="#c4b5fd" />
                    <circle cx="64" cy="22" r="2.5" fill="#ffd88a" />
                    {/* Whale Body */}
                    <path
                      d="M 25 55 Q 35 30 75 35 Q 105 40 115 58 Q 120 75 85 75 Q 40 75 25 55 Z"
                      fill="#bae6fd"
                    />
                    {/* Whale Belly */}
                    <path d="M 35 60 Q 60 75 88 72 Q 80 65 35 60 Z" fill="#f0f9ff" />
                    {/* Tail Flukes */}
                    <path d="M 25 55 Q 12 40 8 45 Q 16 55 10 65 Q 18 68 25 55 Z" fill="#7dd3fc" />
                    {/* Sleeping Eye */}
                    <path d="M 92 52 Q 95 55 98 52" fill="none" stroke="#0369a1" strokeWidth="2" strokeLinecap="round" />
                    {/* Flipper */}
                    <ellipse cx="68" cy="62" rx="12" ry="6" fill="#7dd3fc" transform="rotate(15 68 62)" />
                  </svg>
                </div>
              )}

              {selectedCompanion === 'sprite' && (
                <div style={{ textAlign: 'center' }}>
                  <svg width="110" height="100" viewBox="0 0 110 100" style={{ overflow: 'visible' }}>
                    {/* Brass Ring */}
                    <circle cx="55" cy="24" r="10" fill="none" stroke="#ffd88a" strokeWidth="3" />
                    {/* Glowing Sprite Core */}
                    <circle cx="55" cy="55" r="22" fill="#ffd88a" opacity="0.95" />
                    <circle cx="55" cy="55" r="14" fill="#ffffff" />
                    {/* Cheerful Happy Eyes & Smile */}
                    <circle cx="50" cy="53" r="2.5" fill="#78350f" />
                    <circle cx="60" cy="53" r="2.5" fill="#78350f" />
                    <path d="M 52 59 Q 55 62 58 59" fill="none" stroke="#78350f" strokeWidth="1.8" strokeLinecap="round" />
                    {/* Orbiting Sparks */}
                    <circle cx="28" cy="46" r="3" fill="#ffd88a" opacity="0.8" />
                    <circle cx="82" cy="65" r="3.5" fill="#ffb3ba" opacity="0.85" />
                    <circle cx="65" cy="80" r="2.5" fill="#c4b5fd" opacity="0.8" />
                  </svg>
                </div>
              )}

              {/* Companion Name Tag */}
              <div
                className="font-mono"
                style={{
                  marginTop: '0.75rem',
                  padding: '0.25rem 0.85rem',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(5, 7, 24, 0.78)',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${currentFeelingObj.auraColor}`,
                  color: currentFeelingObj.auraColor,
                  fontSize: '0.74rem',
                  letterSpacing: '0.04em'
                }}
              >
                {currentCompanionObj.name} • {currentFeelingObj.name}
              </div>
            </div>

            {/* Bottom Status Ticker inside Diorama */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '12px',
                right: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 6
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: '0.68rem',
                  color: 'rgba(255,255,255,0.7)',
                  backgroundColor: 'rgba(0,0,0,0.45)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '6px'
                }}
              >
                {currentWorldObj.name}
              </span>
              <span
                className="font-mono"
                style={{
                  fontSize: '0.68rem',
                  color: '#ffd88a',
                  backgroundColor: 'rgba(0,0,0,0.45)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '6px'
                }}
              >
                432 Hz RESONANCE
              </span>
            </div>
          </div>

          {/* Quick-Action Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.25rem 0.5rem'
            }}
          >
            {savedTicket ? (
              <button
                onClick={handleLoadSavedDream}
                className="retro-btn"
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--accent-color)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                Recall saved: "{savedTicket.title}"
              </button>
            ) : (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                No dream saved yet tonight.
              </span>
            )}

            <button
              onClick={handleForgeDream}
              className="retro-btn"
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--accent-color)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Sparkles size={13} />
              Instant Forge Preview →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamForge;
