export interface Destination {
  id: number;
  name: string;
  resident: string;
  dreamType: string;
  description: string;
  coords: { x: number; y: number };
  frequency: number;
  freqLabel: string;
  status: 'pending' | 'delivered';
}

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: 1,
    name: 'Clover Cottage',
    resident: 'Baby Leo',
    dreamType: 'Warm Milk & Kitten Paws',
    description: 'A cozy thatched cottage with ivy on the eaves. Baby Leo is tossing restlessly in his wooden crib.',
    coords: { x: 90, y: 220 },
    frequency: 432.0,
    freqLabel: '432.0 Hz (Delta Calm)',
    status: 'delivered'
  },
  {
    id: 2,
    name: 'Clocktower Attic',
    resident: 'Grandma Martha',
    dreamType: 'Old Garden Roses & Vinyl Records',
    description: 'High above the quiet cobblestones where pendulum gears click gently in 3/4 waltz time.',
    coords: { x: 260, y: 110 },
    frequency: 440.0,
    freqLabel: '440.0 Hz (Nostalgia)',
    status: 'pending'
  },
  {
    id: 3,
    name: 'Lighthouse Loft',
    resident: 'Sailor Finn',
    dreamType: 'Gentle Harbor Waves & Starlight',
    description: 'Perched on the sleepy rocky headland where distant foghorns sound like quiet lullabies.',
    coords: { x: 440, y: 190 },
    frequency: 428.2,
    freqLabel: '428.2 Hz (Ocean Tide)',
    status: 'pending'
  },
  {
    id: 4,
    name: 'Moonrise Nursery',
    resident: 'Pip & Friends',
    dreamType: 'Sugar Clouds & Velvet Bedtime',
    description: 'The attic headquarters of DreamOS 99, where sleepy teddy bears guard the constellation maps.',
    coords: { x: 620, y: 95 },
    frequency: 436.5,
    freqLabel: '436.5 Hz (Cumulus)',
    status: 'pending'
  },
  {
    id: 5,
    name: 'Celestial Observatory',
    resident: 'Astronomer Luna',
    dreamType: 'Comets & Silver Nebulas',
    description: 'A brass dome turned toward the Milky Way. Starlight charts flutter against the open telescope slit.',
    coords: { x: 790, y: 165 },
    frequency: 528.0,
    freqLabel: '528.0 Hz (Starlight Core)',
    status: 'pending'
  },
  {
    id: 6,
    name: 'Whisper Willow',
    resident: 'Woodland Fawns',
    dreamType: 'Moss Pillows & Firefly Sparks',
    description: 'A clearing at the edge of the sleepy pines. Dew gathers on spiderwebs that shine like silver lace.',
    coords: { x: 930, y: 225 },
    frequency: 432.0,
    freqLabel: '432.0 Hz (Pine Slumber)',
    status: 'pending'
  }
];
