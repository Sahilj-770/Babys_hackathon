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
  Trees,
  Volume2,
  RefreshCw,
  CheckCircle2,
  Radio,
  Mail,
  Download,
  X
} from 'lucide-react';
import soundEngine from '../../audio/soundEngine';
import { unlockFragment } from '../../utils/passportStorage';
import { generatePostcardDataUrl, downloadDataUrl } from '../../utils/postcardCanvas';

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
  channel: string;
  colors: [string, string, string, string]; // [deepSky, midSky, accent1, accent2]
  icon: typeof Moon;
  resonanceFreq: number;
}

interface CompanionOption {
  id: CompanionId;
  name: string;
  subtitle: string;
  description: string;
  channel: string;
  frequencyVoice: number;
}

interface FeelingOption {
  id: FeelingId;
  name: string;
  tone: string;
  auraColor: string;
  glowRgba: string;
  channel: string;
  frequencyMod: number;
}

export interface SavedDreamTicket {
  id: string;
  title: string;
  world: WorldId;
  companion: CompanionId;
  feeling: FeelingId;
  story: string;
  colors: [string, string, string, string];
  timestamp: string;
  frequency: string;
}

// 4 Canonical Worlds
const WORLDS: WorldOption[] = [
  {
    id: 'rooftops',
    name: 'Moonlit Rooftops',
    tagline: 'Silhouetted slate tiles & glowing gables',
    channel: 'CH-01 // COLD VAPOR & SLATE',
    colors: ['#050718', '#1a224a', '#ffd88a', '#ff9e7d'],
    icon: Moon,
    resonanceFreq: 432.0
  },
  {
    id: 'garden',
    name: 'Lavender Cloud Garden',
    tagline: 'Pillow clouds & floating blossom petals',
    channel: 'CH-02 // CUMULUS & PETALS',
    colors: ['#160e29', '#412b6b', '#c4b5fd', '#fbcfe8'],
    icon: Cloud,
    resonanceFreq: 436.5
  },
  {
    id: 'ocean',
    name: 'Starlight Ocean',
    tagline: 'Bioluminescent ripples & seafoam stars',
    channel: 'CH-03 // PHOSPHOR TIDES',
    colors: ['#021324', '#093758', '#38bdf8', '#7dd3fc'],
    icon: Waves,
    resonanceFreq: 428.2
  },
  {
    id: 'woodland',
    name: 'Sleepy Woodland',
    tagline: 'Mossy hollows & dancing firefly lanterns',
    channel: 'CH-04 // PINE CANOPY & MOSS',
    colors: ['#061a10', '#133e24', '#86efac', '#fef08a'],
    icon: Trees,
    resonanceFreq: 440.0
  }
];

// 4 Canonical Companions
const COMPANIONS: CompanionOption[] = [
  {
    id: 'kitten',
    name: 'Floating Kitten',
    subtitle: 'Curled on a velvet cloud',
    description: 'Purrs at 432 Hz and kneads sleepy stardust before curling tight into a fluffy ball.',
    channel: 'ALLY-A // PURR CONDUIT',
    frequencyVoice: 523.25
  },
  {
    id: 'moth',
    name: 'Moon Moth',
    subtitle: 'Wings dusted in lunar silver',
    description: 'Drifts silently on nocturnal thermals, leaving trails of glowing silver dream pollen.',
    channel: 'ALLY-B // LUNAR THERMAL',
    frequencyVoice: 587.33
  },
  {
    id: 'whale',
    name: 'Cloud Whale',
    subtitle: 'Gliding through twilight mist',
    description: 'Spouts golden constellation spray while navigating deep velvet breezes across the heavens.',
    channel: 'ALLY-C // CELESTIAL BREACH',
    frequencyVoice: 659.25
  },
  {
    id: 'sprite',
    name: 'Lantern Sprite',
    subtitle: 'A dancing spark of starlight',
    description: "Bounces merrily with Pip's warm brass ring, banishing scary shadows with gentle laughter.",
    channel: 'ALLY-D // PIP STARLET',
    frequencyVoice: 783.99
  }
];

// 4 Canonical Feelings
const FEELINGS: FeelingOption[] = [
  {
    id: 'peaceful',
    name: 'Peaceful',
    tone: 'Slow lullaby rhythm & deep lavender calm',
    auraColor: '#c4b5fd',
    glowRgba: 'rgba(196, 181, 253, 0.45)',
    channel: 'TONE-01 // DELTA WAVE CALM',
    frequencyMod: 0.98
  },
  {
    id: 'wonder',
    name: 'Wonder',
    tone: 'Glittering constellation sparks & quiet awe',
    auraColor: '#ffd88a',
    glowRgba: 'rgba(255, 216, 138, 0.55)',
    channel: 'TONE-02 // ASTRAL RADIANCE',
    frequencyMod: 1.05
  },
  {
    id: 'courage',
    name: 'Courage',
    tone: 'Steadfast dawn-rose warmth & gentle bravery',
    auraColor: '#fb7185',
    glowRgba: 'rgba(251, 113, 133, 0.45)',
    channel: 'TONE-03 // ROSY EMBERS',
    frequencyMod: 1.02
  },
  {
    id: 'cozy',
    name: 'Cozy',
    tone: 'Honeyed hearth embers & soft velvet blankets',
    auraColor: '#fbbf24',
    glowRgba: 'rgba(251, 191, 36, 0.5)',
    channel: 'TONE-04 // NURSERY HEARTH',
    frequencyMod: 0.95
  }
];

// Matrix of original bedtime stories & titles with regeneration variations
interface StoryVignette {
  titles: string[];
  stories: string[];
}

const STORY_DATABASE: Record<string, StoryVignette> = {
  'rooftops-kitten-peaceful': {
    titles: ['The Velvet Rooftop Lullaby', 'Purrs Over Midnight Slate'],
    stories: [
      'Above the quiet chimneys, a warm ginger kitten curls beside you on a silver-edged cloud. The distant clocktower chimes in soft 432 Hz harmonies, and every rooftop window gently fades into velvety sleep.',
      'A sleepy kitten kneads the woolly edges of the chimney smoke before curling tight against your chest. Slumber falls over the slate gables like a heavy velvet blanket, tranquil and undisturbed.'
    ]
  },
  'rooftops-kitten-wonder': {
    titles: ['The Chimney-Top Constellation Cat', 'Stardust on Whiskered Eaves'],
    stories: [
      'From the highest weather vane, the kitten reaches out a soft paw and taps a falling star. Golden dust sprinkles down every chimney flue, turning every sleeper’s quiet dreams into marvelous celestial adventures.',
      'You sit together atop the moonlit tiles while the kitten playfully bats at orbiting star-motes. The night is vast, luminous, and brimming with gentle secrets waiting to be discovered.'
    ]
  },
  'rooftops-kitten-courage': {
    titles: ['The Brave Little Roof Prowler', 'Guardian of the Clover Spires'],
    stories: [
      'With fearless golden eyes and an encouraging soft purr, the kitten walks ahead along the narrow roof ridge. The night holds no monsters here—only quiet friendly shadows guarding the sleeping nursery below.',
      'A warm reassuring warmth wraps around you as the little kitten perches proudly beside you on the steeple. Whatever tomorrow brings, tonight you are safe, strong, and watched over by gentle paws.'
    ]
  },
  'rooftops-kitten-cozy': {
    titles: ['The Kitten by the Chimney Hearth', 'Wool & Warm Slate Dreams'],
    stories: [
      'Curled inside the warm alcove of a brick chimney, you wrap in flannel while the kitten snoozes softly in your lap. The winter breeze hums gently outside, making your warm shelter feel impossibly safe and sweet.',
      'Warm brick, fragrant woodsmoke, and a soft purring head nestled in the crook of your arm. The city sleeps beneath, and everything in your world is wrapped in flannel warmth.'
    ]
  },

  'rooftops-moth-peaceful': {
    titles: ['Silver Wings Over Sleeping Gables', 'The Clocktower Moth Glide'],
    stories: [
      'A majestic moon moth with wings of luminous pearl glides silently through the night breeze above the streetlamps. Its gentle wingbeats slow your breath into the deep, sweet rhythm of peaceful rest.',
      'Drifting on midnight thermals over steep dormers, the moon moth scatters calm silver dust. Sleep enters your room through the cracked window, cool, fragrant, and profoundly restful.'
    ]
  },
  'rooftops-moth-wonder': {
    titles: ['The Lantern-Catcher of Clocktower', 'Luminous Spire Flight'],
    stories: [
      'The moon moth circles the great glass dial of the town clock, illuminating forgotten clockwork constellations. Each tick releases a floating spark that blossoms into an unexpected, wondrous dream.',
      'Following the moth’s iridescent wingtips, you glide above spires and gargoyles that smile softly in the moonlight. The sky opens into an endless ocean of quiet magic.'
    ]
  },
  'rooftops-moth-courage': {
    titles: ['The Nightflight Across the Spires', 'The Silver Vanguard'],
    stories: [
      'Through mist and shifting winds, the moth’s silver glow cuts a steadfast beam across the rooftops. It flies steadily onward, reminding you that even the gentlest creatures possess wings that conquer the dark.',
      'With wings that reflect the starlight, your moth guide hovers fearlessly over the deepest chasms of the city. You feel a quiet, unshakeable courage settle warmly in your heart.'
    ]
  },
  'rooftops-moth-cozy': {
    titles: ['A Velvet Moth in the Attic Flue', 'The Moon-Cocoon Slumber'],
    stories: [
      'Tucked under the eaves where dry timber smells of cedar and old paper, the moth rests its wings beside your pillow. The gentle flutter sounds like rain upon glass, lulling you into deep nursery comfort.',
      'Nestled into a snug rooftop attic nook, you watch the sleepy moth fold its silver wings like curtains against the cold. The blankets are pulled up high, and warmth fills every corner.'
    ]
  },

  'rooftops-whale-peaceful': {
    titles: ['The Low Tide of Midnight Chimneys', 'The Whale Over Sleeping Streets'],
    stories: [
      'A tiny cloud whale glides between the chimney stacks, moving with the slow grace of a peaceful ocean tide. Its gentle breathing echoes like distant surf, soothing your mind into tranquil slumber.',
      'Drifting across the rooftop valleys, the little whale hums a deep bass lullaby that vibrates at 432 Hz. Every restless thought sinks gently into the quiet darkness.'
    ]
  },
  'rooftops-whale-wonder': {
    titles: ['The Star-Spouting Cloud Whale', 'Aurora Above the Dormers'],
    stories: [
      'With a joyful breath, the cloud whale spouts a geyser of liquid starlight into the night air. The droplets freeze into glowing constellation crystals that drift downward like gentle incandescent snow.',
      'The tiny whale breaches through a lavender fog bank, trailing ribbons of celestial fire over the slates. You gaze upward with wide wonder, knowing you are witnessing pure bedtime magic.'
    ]
  },
  'rooftops-whale-courage': {
    titles: ['The Guardian of the Slate Roofs', 'The Fearless Leviathan'],
    stories: [
      'Steady as an ancient flagship, the whale swims through the darkest corridors of the night. Beside its loyal presence, the vast midnight feels welcoming and free, a wide sky made for brave dreamers.',
      'The cloud whale swims abreast with you, its kind eye glowing with steadfast ancient calm. No fear can survive beside such a gentle, titanic bedtime companion.'
    ]
  },
  'rooftops-whale-cozy': {
    titles: ['Velvet Breaches Above the Nursery', 'Cradled in Cloud Flukes'],
    stories: [
      'The cloud whale rests its soft belly upon a bank of warm attic steam, curling its tail into a snug hammock. Wrapped in wool and starlight mist, you sink into the softest sleep imaginable.',
      'A warm downy breeze rolls off the whale’s flanks as it curls over the chimney tops like a friendly roof. You close your eyes, tucked into velvet warmth.'
    ]
  },

  'rooftops-sprite-peaceful': {
    titles: ["The Lantern Sprite's Quiet Watch", 'A Brass Flame at Rest'],
    stories: [
      "Pip's lantern sprite lowers its golden wick to a gentle ember glow. It perches on the windowsill, casting amber circles on the floorboards until your heavy eyelids gently drift shut.",
      'The sprite dances slowly in place, tracing slow circles of soft candlelight in the attic air. The lullaby chime rings one final sweet note, and stillness reigns supreme.'
    ]
  },
  'rooftops-sprite-wonder': {
    titles: ['A Trail of Gold Along the Eaves', 'Spark-Dance in the Star-Mist'],
    stories: [
      'The lively sprite skips from chimney to chimney, igniting hidden star-motes tucked beneath the slate tiles. The whole town roofscape suddenly glimmers like an upside-down universe.',
      "With a joyful flip, the sprite draws luminous golden runes in the air that spell out sweet dreams. Every sparkle bursts into a tiny chime that delights your sleepy imagination."
    ]
  },
  'rooftops-sprite-courage': {
    titles: ['The Fearless Beacon of Midnight', 'The Starlight Sentinel'],
    stories: [
      'Holding Pip’s brass ring high, the lantern sprite shines a warm golden circle through the deepest midnight shadows. It stands guard with a brave smile, ensuring no bad dreams dare approach.',
      'The sprite blazes with steadfast warmth, banishing every creeping doubt with its radiant starlight beam. You stand tall and peaceful, knowing the night is your sanctuary.'
    ]
  },
  'rooftops-sprite-cozy': {
    titles: ['The Warmest Wick on Clover Lane', 'Honey Glow in the Gables'],
    stories: [
      'The sprite tucks itself directly inside your brass bedside nightlamp, bathing the wooden room in rich honey-amber light. The sheets are soft, the stove is warm, and slumber is effortless.',
      'Radiating the comforting warmth of roasted chestnuts and toasted marshmallows, the sprite settles beside your pillow. Deep contentment wraps you in snug embrace.'
    ]
  },

  'garden-kitten-peaceful': {
    titles: ['The Purring Cloud Petal', 'Lavender Slumber Bloom'],
    stories: [
      'In a meadow of buoyant lavender clouds, the kitten curls inside an oversized night-blossom. Scented purple mist floats past, and the slow rhythm of purring washes every worry into quiet sleep.',
      'Petals of lilac and jasmine drift down from above, landing softly upon the kitten’s sleeping brow. Your breathing syncs with its calm chest, drifting into tranquil rest.'
    ]
  },
  'garden-kitten-wonder': {
    titles: ['The Kitten Who Chased Falling Comets', 'Blossoms of the Milky Way'],
    stories: [
      'The kitten leaps between floating blossom petals, batting at shimmering comet-tails that smell of lavender honey. Each touch releases a shower of sparkling violet fireworks.',
      'You float through the cloud garden as luminous nocturnal flowers open, revealing tiny singing stars cradled inside their pastel petals. The kitten rolls in starry pollen with pure delight.'
    ]
  },
  'garden-kitten-courage': {
    titles: ['The Cloud-Jumper of Lavender Hill', 'The Little Brave Gardener'],
    stories: [
      'Bounding ahead over floating cumulus islands, the kitten shows you that the open sky is safe and soft. With each confident leap, your own spirit feels light, joyful, and completely free.',
      'The kitten stands bravely at the edge of a towering lavender thunderhead, purring away the storm until only gentle rose-gold blossoms remain. You feel calm strength flowing through your veins.'
    ]
  },
  'garden-kitten-cozy': {
    titles: ['A Nap in the Cumulus Blossom', 'Velvet Petal Burrow'],
    stories: [
      'You burrow into the center of a gigantic downy cloud peony, the kitten tucked firmly against your heart. The petals fold shut around you both like a warm fragrant quilt.',
      'Surrounded by soft pastel clouds that mold to your body like warm dough, you and the sleepy kitten sink into blissful, uninterrupted comfort.'
    ]
  },

  'garden-moth-peaceful': {
    titles: ['The Lavender Moon Dance', 'Wings of Night-Blooming Jasmine'],
    stories: [
      'The moon moth glides from one sleeping blossom to the next, never making a sound. The fragrance of twilight lavender and night-blooming jasmine fills the cool air, bringing heavy sweet slumber.',
      'Soft wings sweep gently across your forehead, brushing away the fatigue of the long day. You close your eyes to the soothing fragrance of midnight flora.'
    ]
  },
  'garden-moth-wonder': {
    titles: ['Stardust Pollen in the Twilight', 'The Garden of Living Constellations'],
    stories: [
      'As the moth drinks from the glowing nectar of starlight orchids, its wings emit waves of iridescent pastel dust. The whole garden glows with the hidden luminescence of the cosmos.',
      'The moth leads you to the center of the cloud garden where an ancient star-tree bears fruit made of pure captured dreams. Magic hangs in the air like spun sugar.'
    ]
  },
  'garden-moth-courage': {
    titles: ['Wings Against the Evening Breeze', 'Flight of the Lilac Sentinel'],
    stories: [
      'Navigating crosswinds above the lilac clouds, the moth flies straight toward the dawn star with graceful determination. Watching its steady wings, you know you can face anything with quiet grace.',
      'The moth shields a tender night-bud from the frost, warming it with the steady silver light of its wings. Its quiet resilience fills your heart with gentle courage.'
    ]
  },
  'garden-moth-cozy': {
    titles: ['The Cocoon of Scented Dreams', 'Spun Silk & Violet Blankets'],
    stories: [
      'The gentle moth weaves a soft cocoon of luminescent silk around your floating cloud hammock. It feels like the softest cashmere blanket in the universe, scented with sweet lilac.',
      'Tucked inside a nest of downy blossom petals, you watch the moth fold its wings like velvet drapes across the window of your cloud. You are completely safe and warm.'
    ]
  },

  'garden-whale-peaceful': {
    titles: ['Drifting Across the Lilac Fog', 'Song of the Cloud Shallows'],
    stories: [
      'The cloud whale swims through dense banks of lavender fog, pushing gentle waves of violet air that rock you to sleep. Its deep, resonant song vibrates like a cosmic nursery music box.',
      'Gliding through pastures of floating white clover, the little whale leaves a calm wake where all thoughts slow down and quiet rest takes hold.'
    ]
  },
  'garden-whale-wonder': {
    titles: ['The Whale that Sprinkled Petals', 'The Great Sky Float'],
    stories: [
      'From its blowhole, the cloud whale showers millions of glowing rose-gold rosebuds that float weightlessly in the twilight. You reach out and catch one, watching it glow in your palm.',
      'The whale surfaces through a cloud-lake filled with floating lanterns and lotus blossoms, singing a melody composed of pure wonder and starlight.'
    ]
  },
  'garden-whale-courage': {
    titles: ['Through the High Purple Clouds', 'The Cloud Navigator'],
    stories: [
      'Riding alongside the great whale’s fin, you soar above the highest storm clouds into clear, serene starlight. You realize how vast and beautiful the night is, with nothing to fear.',
      'The whale cuts through mist banks with serene purpose, showing you that the path ahead is always gentle when guided by love and calm resolve.'
    ]
  },
  'garden-whale-cozy': {
    titles: ['The Gentle Giant of the Soft Sky', 'The Cloud Whale Cradle'],
    stories: [
      'The whale curls its broad flukes into a buoyant cradle filled with downy thistle fluff. Nestled inside, you drift across the sky as comfortably as an infant in a rocking bassinet.',
      'Warm currents of air scented with honeysuckle roll from the whale’s sleek sides. Wrapped in heavy quilts, you sink into the sweetest slumber of the year.'
    ]
  },

  'garden-sprite-peaceful': {
    titles: ['A Floating Ember in the Bloom', 'The Garden Nightlight'],
    stories: [
      'Pip’s sprite nestles inside a bell-flower, dimming its warm lantern to a soft twilight glow. The blossom slowly closes its petals around the light, signaling bedtime for all creatures.',
      'The sprite floats over the garden path, extinguishing each tiny dandelion-lamp with a whispered thank-you. The quiet garden settles into unbroken peace.'
    ]
  },
  'garden-sprite-wonder': {
    titles: ['Kindling the Star-Buds', 'Sparkles in the Petal Alcove'],
    stories: [
      'With a tap of its brass wand, the sprite wakes up glowing fire-lilies that float into the sky like tiny hot-air lanterns. The entire cloud garden transforms into a festival of quiet wonder.',
      'The sprite dips its toes into a pool of dew, creating concentric ripples that illuminate hidden star maps floating beneath the water lilies.'
    ]
  },
  'garden-sprite-courage': {
    titles: ['The Guard of the Lavender Gate', 'The Valiant Spark'],
    stories: [
      'Standing watch at the entrance to the cloud sanctuary, the sprite holds its golden lantern high. Its warm light ensures that only kind, beautiful dreams may enter your garden tonight.',
      'The sprite fearlessly leads the way through unfamiliar twilight thickets, filling every path with friendly golden radiance. You follow with lighthearted confidence.'
    ]
  },
  'garden-sprite-cozy': {
    titles: ['The Tea-Light in the Petal Alcove', 'Chamomile & Starlight Embers'],
    stories: [
      'The sprite perches on a teapot-shaped acorn cup, warming a gentle brew of chamomile and moon-water. The steam warms your cheeks as you slip under your soft velvet quilt.',
      'Radiating the warm comforting aroma of honeyed tea and fresh lavender, the sprite curls up on your bedside saucer. Total peaceful warmth surrounds you.'
    ]
  },

  'ocean-kitten-peaceful': {
    titles: ['The Kitten and the Bioluminescent Tide', 'Seafoam & Whisker Dreams'],
    stories: [
      'Curled upon a raft of glowing sea-glass, the kitten sleeps as gentle phosphorescent ripples rock you under a canopy of stars. The sound of soft water washing against sand lulls you to sleep.',
      'Bioluminescent blue waves lap softly against the coral shore. The kitten’s soft rhythmic purr mingles with the ocean swell, carrying you away into deep calm.'
    ]
  },
  'ocean-kitten-wonder': {
    titles: ['Fishing for Fallen Starlight', 'The Phosphor Cat of the Deep'],
    stories: [
      'The kitten dips its white paw into the water, and schools of glowing translucent dream-fish gather around, leaping into the air like shooting stars.',
      'You sail across a mirror ocean that reflects the Milky Way so clearly that you seem to float in the heart of space. The kitten gazes in wide-eyed wonder at the swimming constellations.'
    ]
  },
  'ocean-kitten-courage': {
    titles: ['The Little Sailor of Seafoam Bay', 'The Brave Helmsman Cat'],
    stories: [
      'Standing at the prow of your little shell boat, the kitten keeps watch with cheerful bravery. No dark water can frighten you when your loyal first mate is smiling.',
      'The kitten paws at the gentle sea spray, showing you that the ocean is a playground of wonder, not a place of fear. You feel proud and calm inside.'
    ]
  },
  'ocean-kitten-cozy': {
    titles: ['Curled on a Coral Pillow', 'The Nautilus Shell Hammock'],
    stories: [
      'Tucked inside the mother-of-pearl chamber of a giant nautilus shell lined with warm blankets, you and the kitten snuggle while the waves hum outside.',
      'The salt breeze is warm and gentle, and the kitten’s fur is soft as down. Wrapped in an emerald blanket, you drift off to the rhythmic swell of the sea.'
    ]
  },

  'ocean-moth-peaceful': {
    titles: ['Skimming the Phosphor Waves', 'The Deep Tide Moth'],
    stories: [
      'The silver moth glides an inch above the calm, glass-like water, trailing delicate ripples that glow like strings of pearls. The vast stillness of the sea brings absolute tranquility.',
      'A gentle sea mist settles over the nocturnal waters. The moth folds its wings upon the mast, and sleep washes over you in slow, rhythmic waves.'
    ]
  },
  'ocean-moth-wonder': {
    titles: ['The Lighthouse Moth of the Deep', 'Pearl Trails on the Sea'],
    stories: [
      'Guided by the moth’s glowing wings, you discover underwater gardens of glowing anemones that pulse with harmonic music. The deep ocean is filled with secret celestial beauty.',
      'The moth’s wings reflect the green and gold auroras dancing on the horizon. Phosphorescent jellyfish rise to greet it like floating lanterns.'
    ]
  },
  'ocean-moth-courage': {
    titles: ['Navigating the Oceanic Squall', 'The Silver Beacon at Sea'],
    stories: [
      'When the sea wind rises, the little moth flies straight and true, its light never flickering. You learn that quiet grace is stronger than any storm.',
      'The moth guides your vessel safely past jagged reefs into a tranquil sheltered lagoon. Your heart swells with quiet gratitude and steadfast peace.'
    ]
  },
  'ocean-moth-cozy': {
    titles: ['Shelter Beneath the Nautilus Shell', 'Warm Lagoon Slumber'],
    stories: [
      'Resting upon a dry, sun-warmed sandbar in a calm lagoon, you listen to the distant reef while the moth rests beside you. The air is warm, the bedding is dry, and sleep is profound.',
      'Surrounded by soft dune grasses and the gentle lap of warm waves, you cuddle deep into your sleeping bag. The moth keeps watch from a piece of smooth driftwood.'
    ]
  },

  'ocean-whale-peaceful': {
    titles: ['The Deep Blue Slumber Song', 'The Low Hum of the Abyssal Sea'],
    stories: [
      'The tiny cloud whale swims alongside you through calm sapphire waters, humming an ancient lullaby that calms every sea creature for miles around.',
      'Floating upon the calm sea, you listen to the whale’s slow, deep breathing. Each breath releases a cloud of warm, soothing mist that blankets the waters in sleep.'
    ]
  },
  'ocean-whale-wonder': {
    titles: ['The Whale that Swallowed a Star', 'The Sunken Constellation'],
    stories: [
      'Deep beneath the bioluminescent waves, the whale illuminates an underwater city of crystal spires. Inside its belly glows a captured fallen star, warming the ocean with golden light.',
      'The whale breaches into the night sky, its belly gleaming with glowing stardust that paints a new constellation across the southern horizon.'
    ]
  },
  'ocean-whale-courage': {
    titles: ['Voyage to the Sunken Moon', 'The Deep Sea Voyager'],
    stories: [
      'Together you dive into the deep, friendly waters where giant friendly turtles and glowing rays swim alongside. The deep ocean holds no terror—only boundless peaceful wonder.',
      'The whale leads you fearlessly through towering kelp forests that glow in emerald shades, showing you the gentle beauty hidden in the depths.'
    ]
  },
  'ocean-whale-cozy': {
    titles: ['The Warm Current of Midnight Bay', 'The Whale-Fluke Blanket'],
    stories: [
      'Floating in a warm, sheltered ocean spring heated by gentle submarine geysers, the whale curls around your raft like a loving mother. You sink into heavenly warmth.',
      'Wrapped in dry fleece upon a catamaran deck, you listen to the whale’s rhythmic surfacing. The ocean rocks you like a cradle until dawn.'
    ]
  },

  'ocean-sprite-peaceful': {
    titles: ['The Floating Lantern Buoy', 'Candle on the Glass Sea'],
    stories: [
      'Pip’s sprite perches atop a bobbing glass float, casting a steady amber glow across the glassy calm waters. The gentle swell lulls your mind into deep, dreamless rest.',
      'The sprite dims its starlight to match the gentle glow of the sea plankton. Silence and serenity envelop the entire ocean.'
    ]
  },
  'ocean-sprite-wonder': {
    titles: ['Sparkles on the Coral Reef', 'The Sunken Star-Lantern'],
    stories: [
      'The sprite dives beneath the surface without extinguishing, illuminating coral castles that gleam in magenta, azure, and gold. The underwater world sparkles like an emerald chest.',
      'Skipping across the wave crests, the sprite leaves footprints of glowing amber fire that float for minutes before melting into the sea.'
    ]
  },
  'ocean-sprite-courage': {
    titles: ['Piercing the Deepest Dark', 'The Beacon of Safe Harbor'],
    stories: [
      'When midnight mist obscures the horizon, the sprite’s brass lantern blazes like a miniature lighthouse, showing the safe path home across the waves.',
      'Holding fast to Pip’s golden ring, the sprite stands bravely at the bow, proving that even a tiny spark can conquer the widest ocean night.'
    ]
  },
  'ocean-sprite-cozy': {
    titles: ['A Beacon in the Warm Lagoon', 'Hearth-Glow on the Shoreline'],
    stories: [
      'On a quiet tropical beach, the sprite lights a tiny driftwood fire that smells of cedar and sea-salt. Tucked into dry blankets, you drift off watching the embers dance.',
      'The sprite settles in a warm hollow of driftwood beside your pillow, radiating the warmth of a cozy fireplace. The gentle ocean murmurs your bedtime song.'
    ]
  },

  'woodland-kitten-peaceful': {
    titles: ['The Mossy Hollow Nap', 'Ferns & Whisker Slumber'],
    stories: [
      'Under the roots of a giant grandmother oak, you and the sleepy kitten settle into a bed of emerald velvet moss. The wind in the pine needles above plays a quiet lullaby.',
      'Pine scent and cool forest earth fill the night air. The kitten curls into your neck with a soft sigh, and peaceful slumber claims the quiet woods.'
    ]
  },
  'woodland-kitten-wonder': {
    titles: ['The Kitten and the Firefly Tree', 'Glowing Acorn Glade'],
    stories: [
      'The kitten bats playfully at a glowing firefly that lands upon an ancient acorn. Instantly, the entire oak tree illuminates with thousands of dancing green and gold lanterns.',
      'Following the kitten along a path of bioluminescent mushrooms, you enter a secret woodland glade where the stream sparkles with liquid silver starlight.'
    ]
  },
  'woodland-kitten-courage': {
    titles: ['The Brave Cub of Bramble Wood', 'The Little Forest Scout'],
    stories: [
      'With whiskers twitching and tail held high, the little kitten walks fearlessly past the deepest berry brambles. The forest whispers its blessings, and you walk with quiet strength.',
      'The kitten perches atop a mossy boulder, greeting the night owl with a friendly purr. You feel completely at home under the wide, protective canopy.'
    ]
  },
  'woodland-kitten-cozy': {
    titles: ['Tucked Inside the Ancient Oak', 'The Hollow Hearth Bed'],
    stories: [
      'Inside the hollow trunk of a friendly cedar, lined with down feathers and dry fern leaves, you snuggle with the purring kitten away from the cool night wind.',
      'The crackle of a small, safe forest stove and the rhythmic purr of the kitten warm your sleeping hollow. You are as cozy as a woodland creature in winter.'
    ]
  },

  'woodland-moth-peaceful': {
    titles: ['Whispers Through the Pine Needles', 'The Cedar Grove Flight'],
    stories: [
      'The moon moth weaves through the pine branches, brushing the needles with a soft sound like distant rain. The resinous scent of cedar soothes your spirit into deep rest.',
      'Floating silently above the sleeping forest floor, the moth settles on a velvet shelf mushroom. The woods are hushed, tranquil, and deeply restful.'
    ]
  },
  'woodland-moth-wonder': {
    titles: ['The Silver Path to the Hidden Glen', 'Moon-Dust on the Fern Fronds'],
    stories: [
      'The moth’s wings leave a trail of silver pollen that makes every fern and blossom glow in delicate moonlight. It guides you to a hidden glade where dream-fawns sleep.',
      'Resting atop a giant birch, the moth reflects the northern lights dancing above the treeline. The forest below holds its breath in silent awe.'
    ]
  },
  'woodland-moth-courage': {
    titles: ['Flight of the Forest Sentinel', 'The Silver Guide Through the Briars'],
    stories: [
      'Through dense dark thickets where paths are lost, the silver moth flies ahead like an unwavering compass. You follow with steady steps, trusting its quiet guidance.',
      'The moth flies directly over the tallest mountain pine, showing you the wide open sky waiting beyond the woods. You feel capable, calm, and free.'
    ]
  },
  'woodland-moth-cozy': {
    titles: ['Resting on Velvet Lichen', 'The Pine Hollow Snuggery'],
    stories: [
      'Tucked under the low eaves of a forest shelter covered in soft green lichen, you watch the moth rest on a twig. The wool blankets are thick, and the forest is quiet.',
      'Surrounded by the comforting scent of pine needles and dry birch bark, you sink into your flannel nest. The moth folds its wings like a little night curtain.'
    ]
  },

  'woodland-whale-peaceful': {
    titles: ['The Cloud Whale of the Forest Mist', 'Drifting Over Sleeping Oaks'],
    stories: [
      'A gentle cloud whale swims through the morning mist clinging to the canopy, brushing the tree crowns with soft strokes. Its low, singing whistle calms the entire woodland.',
      'Floating between the tall trunks of ancient redwoods, the little whale brings a blanket of cool, soothing fog that invites the deepest slumber.'
    ]
  },
  'woodland-whale-wonder': {
    titles: ['Gliding Over the Emerald Canopy', 'The Forest Sky Breaches'],
    stories: [
      'The whale leaps playfully above the sea of green leaves, spouting a fountain of glowing golden pollen that settles over the forest like stardust.',
      'Carried on the back of the friendly whale, you soar above misty valleys where waterfalls of starlight tumble into glowing forest pools.'
    ]
  },
  'woodland-whale-courage': {
    titles: ['The Mountain Wind Guide', 'The Forest Sky Vanguard'],
    stories: [
      'Together you rise above the dense woods into the crisp, clean mountain air. Looking down at the peaceful dark wilderness, you feel immense bravery and quiet peace.',
      'The whale cuts through the mountain clouds with steady grace, showing you that the sky belongs to those who trust the gentle journey of sleep.'
    ]
  },
  'woodland-whale-cozy': {
    titles: ['Resting in the Canopy Cradle', 'The Tree-Top Cloud Snuggery'],
    stories: [
      'The whale rests nestled into the crown of a giant cedar, its soft flanks providing a warm, buoyant bed among the pine cones. You sleep among the stars and tree tops.',
      'Wrapped in down blankets in a treehouse platform, you listen to the whale’s gentle, regular breathing above the roof. Safe and warm in your elevated sanctuary.'
    ]
  },

  'woodland-sprite-peaceful': {
    titles: ['The Firefly Friend of the Glade', 'The Pine Cone Nightlight'],
    stories: [
      'Pip’s sprite perches on a pine cone, dimming its warm lantern to an ember glow that matches the blinking fireflies. The peaceful symphony of crickets guides you to sleep.',
      'The sprite hangs its little brass lantern from an acorn stem, casting a steady, reassuring light over the forest floor as sleep gently takes you away.'
    ]
  },
  'woodland-sprite-wonder': {
    titles: ['Kindling the Hollow Constellation', 'The Bioluminescent Glade'],
    stories: [
      'With a cheerful touch of its brass ring, the sprite lights up hollows inside ancient trees, revealing secret gnome libraries and sleeping fairy bakeries.',
      'The sprite dances with the fireflies, choreographing a constellation in the clearing that mirrors the Big Dipper in living golden sparks.'
    ]
  },
  'woodland-sprite-courage': {
    titles: ['Light Through the Deep Briars', 'The Fearless Beacon of the Woods'],
    stories: [
      'When shadows in the thicket seem tall, the sprite shines its lantern with brilliant, honest warmth, revealing they are only friendly mossy stumps and gentle ferns.',
      'The sprite marches proudly ahead with Pip’s emblem glowing on its chest, banishing every worry with cheerful, unwavering starlight.'
    ]
  },
  'woodland-sprite-cozy': {
    titles: ["The Campfire Glow of Pip's Acorn", 'The Forest Bedtime Hearth'],
    stories: [
      'The sprite kindles a tiny, safe hearth inside a hollow birch stump, warming a thimble of sweet blueberry tea. The warm glow fills your shelter with absolute coziness.',
      'Snuggled in a woolly forest sleeping bag, you watch the sprite’s warm ember dance against the cedar walls. Deep contentment and safe sleep wrap you tight.'
    ]
  }
};

// Procedural generator with variant support
function generateBedtimeStory(
  world: WorldId,
  companion: CompanionId,
  feeling: FeelingId,
  variantIndex: number = 0
): { title: string; story: string } {
  const key = `${world}-${companion}-${feeling}`;
  const entry = STORY_DATABASE[key];
  if (entry) {
    const titles = entry.titles;
    const stories = entry.stories;
    const tIndex = variantIndex % titles.length;
    const sIndex = variantIndex % stories.length;
    return { title: titles[tIndex], story: stories[sIndex] };
  }

  // Fallback
  return {
    title: 'The Calibrated Slumber Journey',
    story: `Tonight, your thoughts drift through ${world} guided by a faithful ${companion}. Wrapped in a soothing ${feeling} atmosphere, your breath slows down to the calming 432 Hz frequency of sweet, restful sleep.`
  };
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

function createSavedTicket(
  title: string,
  world: WorldId,
  companion: CompanionId,
  feeling: FeelingId,
  story: string,
  colors: [string, string, string, string],
  resonanceFreq: number
): SavedDreamTicket {
  const randomId = Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const dateStr = now.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  return {
    id: `DRM-99-${randomId}`,
    title,
    world,
    companion,
    feeling,
    story,
    colors,
    timestamp: dateStr,
    frequency: `${resonanceFreq.toFixed(1)} Hz`
  };
}

// ============================================================================
// Main DreamForge Component
// ============================================================================

export const DreamForge: React.FC = () => {
  const [selectedWorld, setSelectedWorld] = useState<WorldId>('rooftops');
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionId>('kitten');
  const [selectedFeeling, setSelectedFeeling] = useState<FeelingId>('peaceful');

  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [storyVariantIndex, setStoryVariantIndex] = useState(0);

  const [savedTicket, setSavedTicket] = useState<SavedDreamTicket | null>(() => getStoredDream());
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);
  const [isCopiedFeedback, setIsCopiedFeedback] = useState(false);
  const [isForgingAnimation, setIsForgingAnimation] = useState(false);
  const [isPostcardModalOpen, setIsPostcardModalOpen] = useState(false);
  const [postcardPreviewUrl, setPostcardPreviewUrl] = useState<string | null>(null);
  const [isGeneratingPostcard, setIsGeneratingPostcard] = useState(false);

  const currentWorldObj = WORLDS.find((w) => w.id === selectedWorld)!;
  const currentCompanionObj = COMPANIONS.find((c) => c.id === selectedCompanion)!;
  const currentFeelingObj = FEELINGS.find((f) => f.id === selectedFeeling)!;

  const { title: dreamTitle, story: dreamStory } = generateBedtimeStory(
    selectedWorld,
    selectedCompanion,
    selectedFeeling,
    storyVariantIndex
  );

  // Generate bedtime dream postcard via HTML5 Canvas
  const handleOpenPostcard = async () => {
    soundEngine.playClick(560);
    setIsGeneratingPostcard(true);
    try {
      const url = await generatePostcardDataUrl({
        title: dreamTitle,
        worldName: currentWorldObj.name,
        companionName: currentCompanionObj.name,
        feelingName: currentFeelingObj.name,
        story: dreamStory,
        frequency: `${currentWorldObj.resonanceFreq.toFixed(1)} Hz`,
        timestamp: 'Tonight',
        colors: currentWorldObj.colors
      });
      setPostcardPreviewUrl(url);
      setIsPostcardModalOpen(true);
      soundEngine.playMusicBoxNote(659.25, 1.2);
    } catch (err) {
      console.warn('[Postcard] Failed to generate canvas postcard:', err);
    } finally {
      setIsGeneratingPostcard(false);
    }
  };

  const handleDownloadPostcard = () => {
    if (!postcardPreviewUrl) return;
    soundEngine.playCelebrationChime();
    const cleanFilename = `pip-dream-postcard-${dreamTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
    downloadDataUrl(postcardPreviewUrl, cleanFilename);
  };

  // Sound feedback on World change
  const handleSelectWorld = (worldId: WorldId) => {
    setSelectedWorld(worldId);
    const worldObj = WORLDS.find((w) => w.id === worldId);
    if (worldObj) {
      soundEngine.playMusicBoxNote(worldObj.resonanceFreq, 0.8);
    } else {
      soundEngine.playClick(460);
    }
  };

  // Sound feedback on Companion change
  const handleSelectCompanion = (comp: CompanionId) => {
    setSelectedCompanion(comp);
    const compObj = COMPANIONS.find((c) => c.id === comp);
    if (compObj) {
      soundEngine.playMusicBoxNote(compObj.frequencyVoice, 0.9);
    } else {
      soundEngine.playClick(520);
    }
  };

  // Sound feedback on Feeling change
  const handleSelectFeeling = (feel: FeelingId) => {
    setSelectedFeeling(feel);
    const feelObj = FEELINGS.find((f) => f.id === feel);
    if (feelObj) {
      soundEngine.playMusicBoxNote(440 * feelObj.frequencyMod, 1.0);
    } else {
      soundEngine.playClick(580);
    }
  };

  // Forge or Regenerate Dream Action
  const handleForgeDream = (isRegenerate: boolean = false) => {
    setIsForgingAnimation(true);
    soundEngine.playForgeSpark();

    if (isRegenerate) {
      setStoryVariantIndex((prev) => prev + 1);
    }

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

    setTimeout(() => {
      setIsForgingAnimation(false);
      setActiveStep(4);
      unlockFragment('dream');
    }, 450);
  };

  // Reset all selections to default
  const handleResetSelections = () => {
    soundEngine.playClick(440);
    setSelectedWorld('rooftops');
    setSelectedCompanion('kitten');
    setSelectedFeeling('peaceful');
    setStoryVariantIndex(0);
    setActiveStep(1);
  };

  // Save ticket to browser localStorage
  const handleSaveDreamLocally = () => {
    const ticket = createSavedTicket(
      dreamTitle,
      selectedWorld,
      selectedCompanion,
      selectedFeeling,
      dreamStory,
      currentWorldObj.colors,
      currentWorldObj.resonanceFreq
    );

    const success = saveDreamToStorage(ticket);
    if (success) {
      setSavedTicket(ticket);
      setIsSavedFeedback(true);
      soundEngine.playCelebrationChime();
      setTimeout(() => setIsSavedFeedback(false), 3000);
    }
  };

  // Copy Ticket text to clipboard / native share
  const handleCopyTicket = async () => {
    const ticketText =
      `╔════════════════════════════════════════════════════════╗\n` +
      `║   ✨ MIDNIGHT NURSERY // OFFICIAL BEDTIME PASS ✨      ║\n` +
      `║                 DREAMOS '99 SPEC-FORGE                 ║\n` +
      `╠════════════════════════════════════════════════════════╣\n` +
      `  DREAM TITLE : "${dreamTitle}"\n` +
      `  REALM       : ${currentWorldObj.name}\n` +
      `  SLEEP ALLY  : ${currentCompanionObj.name}\n` +
      `  RESONANCE   : ${currentFeelingObj.name} (${currentFeelingObj.tone})\n` +
      `  FREQUENCY   : ${currentWorldObj.resonanceFreq.toFixed(1)} Hz\n` +
      `  PALETTE     : ${currentWorldObj.colors.join(' • ')}\n` +
      `──────────────────────────────────────────────────────────\n` +
      `  BEDTIME VIGNETTE:\n` +
      `  "${dreamStory}"\n` +
      `──────────────────────────────────────────────────────────\n` +
      `  * Calibrated by Pip with sweet dreams guaranteed *     \n` +
      `╚════════════════════════════════════════════════════════╝`;

    soundEngine.playClick(540);

    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(ticketText);
        setIsCopiedFeedback(true);
        setTimeout(() => setIsCopiedFeedback(false), 2500);
        return;
      } catch {
        // Fallback below
      }
    }

    // Fallback using textarea
    try {
      const textarea = document.createElement('textarea');
      textarea.value = ticketText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setIsCopiedFeedback(true);
      setTimeout(() => setIsCopiedFeedback(false), 2500);
    } catch {
      // Graceful fallback
    }
  };

  // Restore saved dream from storage
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
      className="dream-forge-apparatus"
      role="region"
      aria-label="The Dream Forge — The Personalised Dream Creator Machine"
      style={{
        borderRadius: '26px',
        border: '2px solid var(--border-color)',
        backgroundColor: 'var(--bg-surface)',
        boxShadow: 'var(--shadow-soft), 0 0 35px rgba(255, 216, 138, 0.08)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* ==================================================================== */}
      {/* RETRO MACHINE CHASSIS HEADER & ANALOG FREQUENCY GAUGES               */}
      {/* ==================================================================== */}
      <div
        className="machine-top-chassis"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          padding: '1.25rem 1.75rem',
          backgroundColor: 'var(--bg-retro-panel)',
          borderBottom: '2px solid var(--border-color)',
          position: 'relative'
        }}
      >
        {/* Brass Screws / Rivets decoration */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-berry)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 10px rgba(163, 64, 99, 0.35)',
              border: '1.5px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <Wand2 size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                className="font-mono"
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--accent-color)',
                  fontWeight: 700,
                  letterSpacing: '0.06em'
                }}
              >
                APPARATUS № 99-DF // CALIBRATION CHAMBER
              </span>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  boxShadow: '0 0 8px #22c55e',
                  display: 'inline-block'
                }}
                title="Operational and Calibrated"
              />
            </div>
            <h3
              className="font-serif"
              style={{
                margin: '0.15rem 0 0',
                fontSize: '1.45rem',
                color: 'var(--text-heading)',
                lineHeight: 1.2
              }}
            >
              The Dream Forge
            </h3>
          </div>
        </div>

        {/* Analog Vacuum Tube & Resonator Telemetry Capsule */}
        <div
          className="font-mono"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.45rem 0.95rem',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            fontSize: '0.72rem',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span
              style={{
                width: '10px',
                height: '14px',
                borderRadius: '5px',
                backgroundColor: '#ffd88a',
                boxShadow: '0 0 10px #ffd88a',
                display: 'inline-block',
                border: '1px solid #78350f'
              }}
            />
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
              {currentWorldObj.resonanceFreq.toFixed(1)} Hz
            </span>
          </div>
          <span style={{ opacity: 0.35 }}>|</span>
          <span style={{ display: 'none', md: 'inline' } as React.CSSProperties}>
            STAGE: {activeStep === 4 ? 'TICKET ISSUED' : `INSPECTION ${activeStep}/3`}
          </span>
          <span style={{ opacity: 0.35 }}>|</span>
          <span style={{ color: currentFeelingObj.auraColor, fontWeight: 700 }}>
            {currentFeelingObj.name.toUpperCase()}
          </span>
        </div>

        {/* 4 Stage Channel Selector Tabs */}
        <div
          role="tablist"
          aria-label="Dream Forge Channels"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: 'var(--bg-surface)',
            padding: '0.3rem',
            borderRadius: '999px',
            border: '1.5px solid var(--border-color)'
          }}
        >
          <button
            role="tab"
            aria-selected={activeStep === 1}
            aria-controls="forge-panel-world"
            onClick={() => {
              setActiveStep(1);
              soundEngine.playClick(440);
            }}
            className="retro-btn"
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 700,
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
            aria-controls="forge-panel-companion"
            onClick={() => {
              setActiveStep(2);
              soundEngine.playClick(480);
            }}
            className="retro-btn"
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 700,
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
            aria-controls="forge-panel-feeling"
            onClick={() => {
              setActiveStep(3);
              soundEngine.playClick(520);
            }}
            className="retro-btn"
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 700,
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
            aria-controls="forge-panel-ticket"
            onClick={() => {
              handleForgeDream(false);
            }}
            className="retro-btn"
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeStep === 4 ? 'var(--color-gold)' : 'transparent',
              color: activeStep === 4 ? '#26160f' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
              boxShadow: activeStep === 4 ? '0 2px 10px rgba(255, 216, 138, 0.5)' : 'none'
            }}
          >
            ✨ Ticket
          </button>
        </div>
      </div>

      {/* Persistent Saved Dream Recall Banner (If stored in browser memory) */}
      {savedTicket && activeStep !== 4 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.55rem 1.75rem',
            backgroundColor: 'rgba(255, 216, 138, 0.15)',
            borderBottom: '1px solid var(--border-color)',
            fontSize: '0.8rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <BookmarkCheck size={16} color="var(--accent-color)" />
            <span style={{ color: 'var(--text-main)' }}>
              Saved in browser journal: <strong>"{savedTicket.title}"</strong> ({savedTicket.timestamp})
            </span>
          </div>
          <button
            onClick={handleLoadSavedDream}
            className="retro-btn"
            style={{
              padding: '0.25rem 0.75rem',
              fontSize: '0.74rem',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--accent-color)',
              borderColor: 'var(--border-color)',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Inspect Saved Ticket →
          </button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* APPARATUS BODY: Left Controls & Right Live Ocular Viewport            */}
      {/* ==================================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          padding: '2rem'
        }}
      >
        {/* ================================================================== */}
        {/* LEFT COLUMN: Physical Calibration Controls                          */}
        {/* ================================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* STEP 1: CHOOSE A WORLD */}
          {activeStep === 1 && (
            <div id="forge-panel-world" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass size={20} color="var(--accent-color)" />
                <div>
                  <h4
                    className="font-serif"
                    style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-heading)' }}
                  >
                    Channel I: Choose Your Dream Realm
                  </h4>
                  <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    NOCTURNAL VISTA & COLOR HARMONY
                  </span>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Where should your thoughts wander as your eyes grow heavy? Each realm casts its own palette and
                nighttime landscape into the live apparatus.
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
                      aria-label={`Select realm ${w.name}: ${w.tagline}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        borderRadius: '16px',
                        border: isSelected ? '2px solid var(--accent-color)' : '1.5px solid var(--border-color)',
                        backgroundColor: isSelected ? 'var(--bg-retro-panel)' : 'var(--bg-card)',
                        boxShadow: isSelected ? '0 0 20px rgba(163, 64, 99, 0.22)' : 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '12px',
                          background: `linear-gradient(135deg, ${w.colors[0]}, ${w.colors[1]})`,
                          border: `1.5px solid ${w.colors[2]}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: w.colors[2],
                          flexShrink: 0,
                          boxShadow: isSelected ? `0 0 12px ${w.colors[2]}80` : 'none'
                        }}
                      >
                        <Icon size={22} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-heading)' }}>
                            {w.name}
                          </span>
                          {/* Mini Chromatic Swatches */}
                          <div style={{ display: 'flex', gap: '3px' }}>
                            {w.colors.map((c, idx) => (
                              <span
                                key={idx}
                                style={{
                                  width: '9px',
                                  height: '9px',
                                  borderRadius: '50%',
                                  backgroundColor: c,
                                  border: '1px solid rgba(255,255,255,0.5)'
                                }}
                              />
                            ))}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{w.tagline}</span>
                        <div
                          className="font-mono"
                          style={{ fontSize: '0.66rem', color: 'var(--accent-color)', marginTop: '0.2rem' }}
                        >
                          {w.channel} • {w.resonanceFreq.toFixed(1)} Hz
                        </div>
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
                    padding: '0.7rem 1.45rem',
                    borderRadius: '12px',
                    backgroundColor: 'var(--color-berry)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(163, 64, 99, 0.35)'
                  }}
                >
                  Tune Companion Conduit →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CHOOSE A COMPANION */}
          {activeStep === 2 && (
            <div id="forge-panel-companion" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Smile size={20} color="var(--accent-color)" />
                <div>
                  <h4
                    className="font-serif"
                    style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-heading)' }}
                  >
                    Channel II: Choose Your Sleep Companion
                  </h4>
                  <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    BEDTIME ALLY & SOOTHING HARMONIC
                  </span>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Who will guide your thoughts and keep away nighttime worries? Each companion brings their own gentle
                movement and calming presence.
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
                      aria-label={`Select companion ${c.name}: ${c.subtitle}`}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.95rem',
                        padding: '1rem',
                        borderRadius: '16px',
                        border: isSelected ? '2px solid var(--accent-color)' : '1.5px solid var(--border-color)',
                        backgroundColor: isSelected ? 'var(--bg-retro-panel)' : 'var(--bg-card)',
                        boxShadow: isSelected ? '0 0 20px rgba(163, 64, 99, 0.22)' : 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          backgroundColor: isSelected ? 'var(--color-berry)' : 'var(--bg-surface)',
                          color: isSelected ? '#ffffff' : 'var(--text-main)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1.5px solid var(--border-color)',
                          fontSize: '1.25rem',
                          flexShrink: 0
                        }}
                      >
                        {c.id === 'kitten' && '🐱'}
                        {c.id === 'moth' && '🦋'}
                        {c.id === 'whale' && '🐋'}
                        {c.id === 'sprite' && '✨'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-heading)' }}>
                          {c.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--accent-color)', fontWeight: 600 }}>
                          {c.subtitle}
                        </div>
                        <p style={{ margin: '0.3rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
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
                    padding: '0.65rem 1.25rem',
                    borderRadius: '12px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-main)',
                    border: '1.5px solid var(--border-color)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  ← Realm Tuner
                </button>
                <button
                  onClick={() => {
                    setActiveStep(3);
                    soundEngine.playClick(520);
                  }}
                  className="retro-btn"
                  style={{
                    padding: '0.7rem 1.45rem',
                    borderRadius: '12px',
                    backgroundColor: 'var(--color-berry)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(163, 64, 99, 0.35)'
                  }}
                >
                  Tune Harmonic Feeling →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CHOOSE A FEELING */}
          {activeStep === 3 && (
            <div id="forge-panel-feeling" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Heart size={20} color="var(--accent-color)" />
                <div>
                  <h4
                    className="font-serif"
                    style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-heading)' }}
                  >
                    Channel III: Choose Bedtime Feeling
                  </h4>
                  <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    EMOTIONAL ATMOSPHERE & RESONANCE AURA
                  </span>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                What atmosphere should wrap your slumber? The lantern’s core aura will physically attune to this
                frequency.
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
                      aria-label={`Select feeling ${f.name}: ${f.tone}`}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '0.45rem',
                        padding: '1.1rem',
                        borderRadius: '16px',
                        border: isSelected ? `2px solid ${f.auraColor}` : '1.5px solid var(--border-color)',
                        backgroundColor: isSelected ? 'var(--bg-retro-panel)' : 'var(--bg-card)',
                        boxShadow: isSelected ? `0 0 20px ${f.glowRgba}` : 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', width: '100%' }}>
                        <span
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: f.auraColor,
                            boxShadow: `0 0 10px ${f.auraColor}`
                          }}
                        />
                        <span style={{ fontWeight: 700, fontSize: '1.02rem', color: 'var(--text-heading)' }}>
                          {f.name}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
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
                    padding: '0.65rem 1.25rem',
                    borderRadius: '12px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-main)',
                    border: '1.5px solid var(--border-color)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  ← Companion Conduit
                </button>
                <button
                  onClick={() => handleForgeDream(false)}
                  className="retro-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.6rem',
                    borderRadius: '12px',
                    backgroundColor: 'var(--color-gold)',
                    color: '#26160f',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.94rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(255, 216, 138, 0.65)'
                  }}
                >
                  <Sparkles size={17} />
                  Forge Bedtime Dream!
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: THE PERSONALIZED BEDTIME TICKET */}
          {activeStep === 4 && (
            <div
              id="forge-panel-ticket"
              className="bedtime-ticket-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                backgroundColor: 'var(--bg-surface)',
                border: '2px dashed var(--accent-color)',
                borderRadius: '20px',
                padding: '1.75rem',
                position: 'relative',
                boxShadow: '0 8px 30px rgba(92, 64, 51, 0.08)'
              }}
            >
              {/* Ticket Top Notch Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--accent-color)',
                      fontWeight: 700,
                      backgroundColor: 'var(--bg-retro-panel)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    TICKET: #DRM-99-432-881
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      color: '#22c55e',
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontWeight: 600
                    }}
                  >
                    ● VALIDATED
                  </span>
                </div>
                <span className="font-mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  MIDNIGHT NURSERY SPEC
                </span>
              </div>

              {/* Title & Ingredients Pills */}
              <div>
                <h4
                  className="font-serif"
                  style={{
                    margin: '0.25rem 0',
                    fontSize: '1.65rem',
                    color: 'var(--text-heading)',
                    lineHeight: 1.2
                  }}
                >
                  "{dreamTitle}"
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.65rem' }}>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.74rem',
                      padding: '0.25rem 0.65rem',
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
                      fontSize: '0.74rem',
                      padding: '0.25rem 0.65rem',
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
                      fontSize: '0.74rem',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '999px',
                      backgroundColor: currentFeelingObj.glowRgba,
                      color: 'var(--text-main)',
                      border: `1px solid ${currentFeelingObj.auraColor}`
                    }}
                  >
                    Resonance: {currentFeelingObj.name}
                  </span>
                </div>
              </div>

              {/* Original Bedtime Story Vignette */}
              <div
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  border: '1px solid var(--border-color)',
                  position: 'relative'
                }}
              >
                <div
                  className="font-mono"
                  style={{
                    fontSize: '0.66rem',
                    color: 'var(--accent-color)',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    letterSpacing: '0.04em'
                  }}
                >
                  BEDTIME VIGNETTE // 432 HZ CALIBRATION
                </div>
                <p
                  className="font-serif"
                  style={{
                    margin: 0,
                    fontSize: '1.02rem',
                    lineHeight: 1.65,
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
                  style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}
                >
                  CHROMATIC HARMONY PALETTE:
                </span>
                <div style={{ display: 'flex', gap: '0.55rem', alignItems: 'center', flexWrap: 'wrap' }}>
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
                          width: '18px',
                          height: '18px',
                          borderRadius: '5px',
                          backgroundColor: c,
                          border: '1px solid rgba(0,0,0,0.2)',
                          display: 'inline-block'
                        }}
                      />
                      <span style={{ color: 'var(--text-muted)' }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Working Ticket Actions */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginTop: '0.5rem' }}>
                {/* 1. Save Locally to Browser Storage */}
                <button
                  onClick={handleSaveDreamLocally}
                  className="retro-btn"
                  aria-label="Save this dream to browser localStorage journal"
                  style={{
                    flex: '1 1 160px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    padding: '0.7rem 1.1rem',
                    borderRadius: '12px',
                    backgroundColor: isSavedFeedback ? '#22c55e' : 'var(--color-berry)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
                  }}
                >
                  {isSavedFeedback ? <CheckCircle2 size={16} /> : <BookmarkCheck size={16} />}
                  {isSavedFeedback ? 'Saved in Browser Journal!' : 'Save Dream Locally'}
                </button>

                {/* 1b. Bedtime Postcard Export (.PNG) */}
                <button
                  onClick={handleOpenPostcard}
                  disabled={isGeneratingPostcard}
                  className="retro-btn dream-postcard-btn"
                  aria-label="Export high-resolution vintage bedtime postcard as PNG"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    padding: '0.7rem 1.15rem',
                    borderRadius: '12px',
                    backgroundColor: 'var(--color-gold)',
                    color: '#3b2512',
                    border: '1.5px solid #ffffff',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(255, 216, 138, 0.4)'
                  }}
                >
                  <Mail size={16} />
                  <span>{isGeneratingPostcard ? 'Rendering...' : 'Bedtime Postcard (.PNG)'}</span>
                </button>

                {/* 2. Copy Ticket Text to Clipboard */}
                <button
                  onClick={handleCopyTicket}
                  className="retro-btn"
                  aria-label="Copy formatted dream ticket to clipboard"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.7rem 1.1rem',
                    borderRadius: '12px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-main)',
                    border: '1.5px solid var(--border-color)',
                    fontWeight: 600,
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  {isCopiedFeedback ? <Check size={16} color="#22c55e" /> : <Share2 size={16} />}
                  {isCopiedFeedback ? 'Copied to Clipboard! ✨' : 'Copy Ticket'}
                </button>

                {/* 3. Regenerate Dream Variation */}
                <button
                  onClick={() => handleForgeDream(true)}
                  className="retro-btn"
                  aria-label="Regenerate this dream with another poetic story variation"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.7rem 1rem',
                    borderRadius: '12px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-main)',
                    border: '1.5px solid var(--border-color)',
                    fontWeight: 600,
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={15} />
                  Regenerate
                </button>

                {/* 4. Reset & Create Another Dream */}
                <button
                  onClick={handleResetSelections}
                  className="retro-btn"
                  aria-label="Reset selections and start a new dream"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.7rem 0.95rem',
                    borderRadius: '12px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  <RotateCcw size={14} />
                  Reset
                </button>
              </div>

              {/* Privacy Notice regarding local storage */}
              <div
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                  marginTop: '0.35rem'
                }}
              >
                * Stored safely in this browser session only. Never transmitted to any external server. *
              </div>
            </div>
          )}
        </div>

        {/* ================================================================== */}
        {/* RIGHT COLUMN: Live Ocular Diorama Dream Preview                     */}
        {/* ================================================================== */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}
        >
          {/* Header Telemetry */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 0.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Radio size={14} color="var(--accent-color)" />
              <span
                className="font-mono"
                style={{
                  fontSize: '0.74rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.04em'
                }}
              >
                REAL-TIME OCULAR DIORAMA // 432_HZ
              </span>
            </div>
            <span
              className="font-mono"
              style={{
                fontSize: '0.72rem',
                color: currentFeelingObj.auraColor,
                backgroundColor: 'rgba(0,0,0,0.6)',
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                border: `1px solid ${currentFeelingObj.auraColor}60`
              }}
            >
              ● LIVE SIMULATION
            </span>
          </div>

          {/* Diorama Inset Frame / Apparatus Chamber */}
          <div
            className="diorama-viewport"
            style={{
              position: 'relative',
              width: '100%',
              minHeight: '400px',
              borderRadius: '22px',
              overflow: 'hidden',
              boxShadow: isForgingAnimation
                ? `0 0 50px ${currentFeelingObj.auraColor}, inset 0 0 50px rgba(0,0,0,0.6)`
                : 'inset 0 0 50px rgba(0,0,0,0.6), 0 12px 35px rgba(0,0,0,0.2)',
              transform: isForgingAnimation ? 'scale(1.02)' : 'scale(1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              border: `2.5px solid ${currentWorldObj.colors[2]}55`,
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
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

            {/* WORLD SPECIFIC SCENERY SVG LAYERS */}

            {/* Realm 1: Moonlit Rooftops */}
            {selectedWorld === 'rooftops' && (
              <svg
                viewBox="0 0 500 300"
                preserveAspectRatio="none"
                style={{ position: 'absolute', bottom: 0, width: '100%', height: '150px', opacity: 0.95 }}
              >
                {/* Crescent Moon */}
                <circle cx="420" cy="40" r="26" fill="#ffd88a" opacity="0.9" filter="drop-shadow(0 0 12px #ffd88a)" />
                <circle cx="430" cy="36" r="24" fill={currentWorldObj.colors[0]} />

                {/* Twinkling Constellation Stars */}
                <circle cx="60" cy="40" r="1.5" fill="#ffffff" opacity="0.8" />
                <circle cx="150" cy="70" r="1.8" fill="#ffd88a" opacity="0.9" />
                <circle cx="280" cy="35" r="1.5" fill="#ffffff" opacity="0.7" />
                <circle cx="360" cy="80" r="2" fill="#ffd88a" opacity="0.85" />
                <circle cx="200" cy="30" r="1.2" fill="#ffffff" opacity="0.75" />

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

            {/* Realm 2: Lavender Cloud Garden */}
            {selectedWorld === 'garden' && (
              <svg
                viewBox="0 0 500 300"
                preserveAspectRatio="none"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.88 }}
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
                <circle cx="80" cy="90" r="4.5" fill="#fbcfe8" opacity="0.8" />
                <circle cx="160" cy="140" r="5.5" fill="#c4b5fd" opacity="0.85" />
                <circle cx="340" cy="80" r="5" fill="#fbcfe8" opacity="0.8" />
                <circle cx="420" cy="130" r="4.5" fill="#c4b5fd" opacity="0.85" />
                <circle cx="250" cy="60" r="3.5" fill="#ffffff" opacity="0.75" />
              </svg>
            )}

            {/* Realm 3: Starlight Ocean */}
            {selectedWorld === 'ocean' && (
              <svg
                viewBox="0 0 500 300"
                preserveAspectRatio="none"
                style={{ position: 'absolute', bottom: 0, width: '100%', height: '160px', opacity: 0.92 }}
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
                <circle cx="280" cy="210" r="2.5" fill="#38bdf8" opacity="0.9" />
                <circle cx="410" cy="170" r="2.5" fill="#7dd3fc" opacity="0.8" />
                <circle cx="190" cy="150" r="2" fill="#bae6fd" opacity="0.8" />
              </svg>
            )}

            {/* Realm 4: Sleepy Woodland */}
            {selectedWorld === 'woodland' && (
              <svg
                viewBox="0 0 500 300"
                preserveAspectRatio="none"
                style={{ position: 'absolute', bottom: 0, width: '100%', height: '180px', opacity: 0.95 }}
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
                <circle cx="110" cy="110" r="3" fill="#fef08a" opacity="0.95" filter="drop-shadow(0 0 8px #fef08a)" />
                <circle cx="220" cy="80" r="2.5" fill="#86efac" opacity="0.95" filter="drop-shadow(0 0 8px #86efac)" />
                <circle cx="360" cy="100" r="3" fill="#fef08a" opacity="0.9" filter="drop-shadow(0 0 8px #fef08a)" />
                <circle cx="440" cy="60" r="2" fill="#86efac" opacity="0.85" filter="drop-shadow(0 0 6px #86efac)" />
              </svg>
            )}

            {/* 2. Feeling Atmosphere & Glowing Aura Ring */}
            <div
              style={{
                position: 'absolute',
                width: '260px',
                height: '260px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${currentFeelingObj.glowRgba} 0%, transparent 70%)`,
                filter: 'blur(35px)',
                pointerEvents: 'none',
                transition: 'all 0.6s ease'
              }}
            />

            {/* 3. Center Animated Companion Graphic */}
            <div
              style={{
                position: 'relative',
                zIndex: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                filter: `drop-shadow(0 10px 25px ${currentFeelingObj.auraColor}80)`,
                transition: 'transform 0.4s ease'
              }}
            >
              {/* COMPANION GRAPHICS */}
              {selectedCompanion === 'kitten' && (
                <div style={{ textAlign: 'center' }}>
                  <svg width="130" height="110" viewBox="0 0 120 100" style={{ overflow: 'visible' }}>
                    {/* Fluffy Cloud Bed */}
                    <path
                      d="M 20 70 Q 10 50 30 45 Q 45 25 70 35 Q 90 20 100 45 Q 115 55 105 75 Q 95 90 60 85 Q 30 90 20 70 Z"
                      fill="#ffffff"
                      opacity="0.95"
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
                  <svg width="130" height="110" viewBox="0 0 120 100" style={{ overflow: 'visible' }}>
                    {/* Moth Left Wing */}
                    <ellipse cx="44" cy="46" rx="28" ry="19" fill="#e0e7ff" opacity="0.9" transform="rotate(-25 44 46)" />
                    <circle cx="44" cy="46" r="6" fill="#ffd88a" opacity="0.8" />
                    {/* Moth Right Wing */}
                    <ellipse cx="76" cy="46" rx="28" ry="19" fill="#e0e7ff" opacity="0.9" transform="rotate(25 76 46)" />
                    <circle cx="76" cy="46" r="6" fill="#ffd88a" opacity="0.8" />
                    {/* Lower Wings */}
                    <ellipse cx="48" cy="62" rx="16" ry="12" fill="#c7d2fe" opacity="0.85" transform="rotate(-15 48 62)" />
                    <ellipse cx="72" cy="62" rx="16" ry="12" fill="#c7d2fe" opacity="0.85" transform="rotate(15 72 62)" />
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
                  <svg width="140" height="110" viewBox="0 0 130 100" style={{ overflow: 'visible' }}>
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
                  <svg width="120" height="110" viewBox="0 0 110 100" style={{ overflow: 'visible' }}>
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
                    <circle cx="28" cy="46" r="3" fill="#ffd88a" opacity="0.85" />
                    <circle cx="82" cy="65" r="3.5" fill="#ffb3ba" opacity="0.9" />
                    <circle cx="65" cy="80" r="2.5" fill="#c4b5fd" opacity="0.85" />
                  </svg>
                </div>
              )}

              {/* Companion & Tone Badge */}
              <div
                className="font-mono"
                style={{
                  marginTop: '0.85rem',
                  padding: '0.25rem 0.95rem',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(5, 7, 24, 0.8)',
                  backdropFilter: 'blur(8px)',
                  border: `1.5px solid ${currentFeelingObj.auraColor}`,
                  color: currentFeelingObj.auraColor,
                  fontSize: '0.76rem',
                  letterSpacing: '0.04em',
                  boxShadow: `0 0 15px ${currentFeelingObj.glowRgba}`
                }}
              >
                {currentCompanionObj.name} • {currentFeelingObj.name}
              </div>
            </div>

            {/* Bottom Status Ticker inside Diorama */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '14px',
                right: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 6
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: '0.7rem',
                  color: 'rgba(255,255,255,0.8)',
                  backgroundColor: 'rgba(0,0,0,0.55)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px'
                }}
              >
                {currentWorldObj.name}
              </span>
              <span
                className="font-mono"
                style={{
                  fontSize: '0.7rem',
                  color: '#ffd88a',
                  backgroundColor: 'rgba(0,0,0,0.55)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Volume2 size={12} />
                {currentWorldObj.resonanceFreq.toFixed(1)} Hz RESONANCE
              </span>
            </div>
          </div>

          {/* Quick-Action Bar Beneath Viewport */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.35rem 0.5rem',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}
          >
            {savedTicket ? (
              <button
                onClick={handleLoadSavedDream}
                className="retro-btn"
                style={{
                  fontSize: '0.76rem',
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
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                No dream saved yet tonight.
              </span>
            )}

            <button
              onClick={() => handleForgeDream(false)}
              className="retro-btn"
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--accent-color)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Sparkles size={14} />
              Instant Forge Preview →
            </button>
          </div>
        </div>
      </div>

      {/* Bedtime Postcard Preview Modal */}
      {isPostcardModalOpen && postcardPreviewUrl && (
        <div
          className="dream-modal-backdrop"
          onClick={() => setIsPostcardModalOpen(false)}
          role="presentation"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(26, 17, 39, 0.82)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem'
          }}
        >
          <div
            className="retro-panel postcard-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="postcard-modal-title"
            style={{
              width: '100%',
              maxWidth: '860px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255, 216, 138, 0.3)',
              border: '2px solid var(--color-gold)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '0.85rem',
                marginBottom: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={18} color="var(--color-gold)" />
                <h3
                  id="postcard-modal-title"
                  className="font-serif"
                  style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}
                >
                  Bedtime Postcard Preview
                </h3>
              </div>
              <button
                onClick={() => setIsPostcardModalOpen(false)}
                className="retro-btn"
                style={{ padding: '0.45rem' }}
                aria-label="Close postcard preview"
              >
                <X size={16} />
              </button>
            </div>

            {/* Postcard Image Preview */}
            <div
              style={{
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
                border: '1px solid var(--border-color)',
                marginBottom: '1.25rem'
              }}
            >
              <img
                src={postcardPreviewUrl}
                alt={`Bedtime dream postcard for ${dreamTitle}`}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <span className="font-mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                HIGH-RESOLUTION 1200×750 PNG // CALIBRATED 432 Hz
              </span>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  onClick={() => setIsPostcardModalOpen(false)}
                  className="retro-btn"
                  style={{ padding: '0.55rem 1.1rem' }}
                >
                  Close
                </button>
                <button
                  onClick={handleDownloadPostcard}
                  className="retro-btn"
                  style={{
                    backgroundColor: 'var(--color-gold)',
                    color: '#3b2512',
                    padding: '0.55rem 1.35rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}
                >
                  <Download size={15} />
                  <span>Download Postcard (.PNG)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DreamForge;
