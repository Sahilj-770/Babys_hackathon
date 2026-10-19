import type React from 'react';
import type { SavedDreamTicket } from '../components/exhibits/DreamForge';

export interface StoryChapter {
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
  bgGlow: string;
}

export const CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    act: 'CHAPTER I',
    title: 'The Lost Starlight Lantern',
    subtitle: 'When the nursery lost its golden glow',
    story:
      'Before Pip wore the starry nightcap, Midnight Nursery was quiet and pitch-black. Restless babies tossed in cribs as shadows lengthened across creaking hardwood floors. Pip stumbled upon a hollowed brass lantern buried under discarded music sheets. When Pip touched the glass, a tiny constellation ignited inside, illuminating Pip\'s soft glowing eye sockets with gentle warmth instead of fear. That night, the first baby slept soundly.',
    wordCount: 65,
    color: '#ffd88a',
    noteFreq: 523.25,
    noteName: '523 Hz (Lantern Ember)',
    assetImg: '/assets/pip_dream_lantern.png',
    bgGlow: 'radial-gradient(circle at 30% 50%, rgba(255, 216, 138, 0.25) 0%, transparent 60%)'
  },
  {
    id: 2,
    act: 'CHAPTER II',
    title: 'The Dream-Engine Invention',
    subtitle: 'Gears, velvet ribbons, and 432Hz chimes',
    story:
      'One lantern wasn\'t enough for an entire town of sleepless dreamers. In a dusty nursery alcove, Pip gathered antique clockwork cogs, cotton clouds, and a brass music-box cylinder. Tinkering until dawn with sleepy determination, Pip built DreamOS \'99—a whimsical contraption that could translate whispered lullabies into sweet lavender dreams. The tiny crooked smile formed: Pip was officially the nursery\'s first Junior Dream Engineer.',
    wordCount: 63,
    color: '#ffb3ba',
    noteFreq: 659.25,
    noteName: '659 Hz (Music Box Core)',
    assetImg: '/assets/pip_lullaby_box.png',
    bgGlow: 'radial-gradient(circle at 30% 50%, rgba(255, 179, 186, 0.25) 0%, transparent 60%)'
  },
  {
    id: 3,
    act: 'CHAPTER III',
    title: 'First Flight Across the Rooftops',
    subtitle: 'Slumber delivered to quiet chimney pots',
    story:
      'At midnight sharp, Pip loaded the velvet pouch with fresh slumber vials. Stepping onto a buoyant cumulus cloud, Pip drifted over sleeping chimney stacks, weather vanes, and quiet cobblestone alleys. Pip tapped every rooftop with starlight dust, leaving each home wrapped in calm, velvet silence. Looking back at the moon, Pip finally pulled the nightcap low and curled up for a well-earned nap.',
    wordCount: 63,
    color: '#c4b5fd',
    noteFreq: 783.99,
    noteName: '784 Hz (Midnight Cloud)',
    assetImg: '/assets/pip_avatar_cloud.png',
    bgGlow: 'radial-gradient(circle at 30% 50%, rgba(196, 181, 253, 0.25) 0%, transparent 60%)'
  }
];

export interface ArchiveViewProps {
  chapters: StoryChapter[];
  activeChapterIdx: number;
  savedTickets: SavedDreamTicket[];
  copiedId: string | null;
  bookCardRef?: React.RefObject<HTMLDivElement | null>;
  onGoToChapter: (index: number) => void;
  onCopyTicket: (ticket: SavedDreamTicket) => void;
  onDeleteTicket: (id: string) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
}
