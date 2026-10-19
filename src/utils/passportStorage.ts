export type StarFragmentId = 'lullaby' | 'rooftop' | 'story' | 'dream';

export interface StarFragment {
  id: StarFragmentId;
  name: string;
  symbol: string;
  title: string;
  location: string;
  rune: string;
  frequency: string;
  hint: string;
  flavor: string;
}

export const STAR_FRAGMENTS: Record<StarFragmentId, StarFragment> = {
  lullaby: {
    id: 'lullaby',
    name: 'Lullaby Star',
    symbol: '✧',
    title: 'The Harmonic Weaver',
    location: 'Lullaby Lab',
    rune: '♪ 432.0 Hz',
    frequency: '432 Hz Solfeggio',
    hint: 'Humming quietly near the music box and soothing chimes...',
    flavor: 'A luminous amber starlight fragment attuned to gentle sleep frequencies.'
  },
  rooftop: {
    id: 'rooftop',
    name: 'Rooftop Star',
    symbol: '★',
    title: 'Night Sky Pilot',
    location: 'Dream Delivery',
    rune: '☁ 528.0 Hz',
    frequency: '528 Hz Stardust',
    hint: 'Hovering above sleepy chimneys and moonlit rooftops...',
    flavor: 'A cool indigo star plucked from the highest drift of the night sky.'
  },
  story: {
    id: 'story',
    name: 'Story Star',
    symbol: '✦',
    title: 'Keeper of Origins',
    location: 'Bedtime Archive',
    rune: '📖 396.0 Hz',
    frequency: '396 Hz Origin',
    hint: 'Guarded by Chapter III of the bedtime archives...',
    flavor: 'A warm rose-gold starlight fragment inscribed with the Nursery’s first dawn.'
  },
  dream: {
    id: 'dream',
    name: 'Dream Star',
    symbol: '✪',
    title: 'Master Dreamwright',
    location: 'Dream Forge',
    rune: '✨ 639.0 Hz',
    frequency: '639 Hz Harmony',
    hint: 'Formed when a child designs their tonight dream ticket...',
    flavor: 'A brilliant crystalline starlight core glowing with pure imagination.'
  }
};

export const PASSPORT_STORAGE_KEY = 'pip_dreamos_passport_v1';
export const PASSPORT_EVENT_NAME = 'pip-passport-updated';

export interface ConstellationPassportData {
  version: 1;
  unlockedFragmentIds: StarFragmentId[];
  unlockedTimestamps: Record<string, string>;
  completedAt?: string;
}

const DEFAULT_PASSPORT: ConstellationPassportData = {
  version: 1,
  unlockedFragmentIds: [],
  unlockedTimestamps: {}
};

export function getPassportData(): ConstellationPassportData {
  if (typeof window === 'undefined') return DEFAULT_PASSPORT;
  try {
    const raw = localStorage.getItem(PASSPORT_STORAGE_KEY);
    if (!raw) return DEFAULT_PASSPORT;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === 1 && Array.isArray(parsed.unlockedFragmentIds)) {
      return parsed as ConstellationPassportData;
    }
  } catch (err) {
    console.warn('[PassportStorage] Failed to read passport data:', err);
  }
  return DEFAULT_PASSPORT;
}

export interface UnlockResult {
  newlyUnlocked: boolean;
  allCompleted: boolean;
  fragment: StarFragment;
}

export function unlockFragment(id: StarFragmentId): UnlockResult {
  const current = getPassportData();
  const fragment = STAR_FRAGMENTS[id];
  const alreadyHas = current.unlockedFragmentIds.includes(id);

  if (alreadyHas) {
    return {
      newlyUnlocked: false,
      allCompleted: current.unlockedFragmentIds.length === 4,
      fragment
    };
  }

  const updatedIds = [...current.unlockedFragmentIds, id];
  const allCompleted = updatedIds.length === 4;
  const nowIso = new Date().toISOString();

  const nextData: ConstellationPassportData = {
    version: 1,
    unlockedFragmentIds: updatedIds,
    unlockedTimestamps: {
      ...current.unlockedTimestamps,
      [id]: nowIso
    },
    completedAt: allCompleted ? (current.completedAt || nowIso) : current.completedAt
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(nextData));
      window.dispatchEvent(
        new CustomEvent(PASSPORT_EVENT_NAME, {
          detail: {
            fragmentId: id,
            allCompleted,
            unlockedCount: updatedIds.length
          }
        })
      );
    } catch (err) {
      console.warn('[PassportStorage] Failed to persist unlocked fragment:', err);
    }
  }

  return {
    newlyUnlocked: true,
    allCompleted,
    fragment
  };
}

export function isFragmentUnlocked(id: StarFragmentId): boolean {
  const data = getPassportData();
  return data.unlockedFragmentIds.includes(id);
}

export function getUnlockedCount(): number {
  const data = getPassportData();
  return data.unlockedFragmentIds.length;
}

export function resetPassport(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(PASSPORT_STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent(PASSPORT_EVENT_NAME, {
        detail: {
          fragmentId: null,
          allCompleted: false,
          unlockedCount: 0
        }
      })
    );
  } catch (err) {
    console.warn('[PassportStorage] Failed to reset passport:', err);
  }
}
