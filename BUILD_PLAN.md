# BUILD PLAN: PIP://MIDNIGHT NURSERY — DREAMOS '99

## 1. Project Vision & Architecture
A strange, warm, editorial, interactive 1999 dream operating system hidden inside a cozy nursery.
Starring **Pip**, the Skull Baby, Junior Dream Engineer at Midnight Nursery.
Preserving canon: Smooth round skull face, soft glowing eye sockets, tiny crooked smile, starry bedtime nightcap with pink bow, gentle and sleepy personality. Never scary or gory.

### Color System & Design Tokens
- **Nursery Cream Canvas**: `#fff8f1` (warm, paper-like nostalgia)
- **Berry Accents**: `#a34063` (buttons, badges, active states)
- **Cocoa Deep**: `#5c4033` (shadows, retro borders, outlines)
- **Midnight Deep**: `#090b20` (dream sequences, taskbar, night mode background)
- **Dream Violet**: `#777dff` (ethereal wires, flight paths, glows)
- **Lantern Gold**: `#ffd88a` (constellations, soft socket glows, warm lamps)

### Typography Stack
- **Editorial Headlines**: `Playfair Display` (serif, expressive, literary)
- **Playful UI & Controls**: `Fredoka` (rounded, gentle, approachable)
- **Terminal & Telemetry**: `Space Mono` (monospace, retro 1999 OS diagnostics)

---

## 2. Component Hierarchy
```
pip-dream-os/
├── public/
│   └── assets/
│       ├── pip_portrait.png        (Centerpiece Hero)
│       ├── pip_lullaby_box.png     (Exhibit 1: Lullaby Lab)
│       ├── pip_dream_lantern.png   (Exhibit 2: Nightlight Collection)
│       └── pip_avatar_cloud.png    (Exhibit 3: Dream Delivery & Act III)
├── src/
│   ├── audio/
│   │   └── soundEngine.ts          (Web Audio API synthesizer, chime generator, safe mute)
│   ├── types/
│   │   └── index.ts                (Theme, Lantern, DeliveryStop interfaces)
│   ├── components/
│   │   ├── BootScreen.tsx          (Skippable 1999 BIOS terminal boot sequence)
│   │   ├── OSNavbar.tsx            (Title bar, navigation anchors, theme toggle, mute switch, chaos toggle)
│   │   ├── HeroSection.tsx         (Pip centerpiece, cursor perspective tilt, headline, primary CTAs)
│   │   ├── StatusWidget.tsx        (Odometer-style dreams delivered counter, nursery harmonics)
│   │   ├── exhibits/
│   │   │   ├── LullabyLab.tsx      (Exhibit A: Interactive music box chime synthesizers)
│   │   │   ├── NightlightCollection.tsx (Exhibit B: Tunable spectrum lanterns & lumen dimmer)
│   │   │   └── DreamDelivery.tsx   (Exhibit C: Illustrated SVG rooftop route with live dispatch)
│   │   ├── story/
│   │   │   └── OriginStory.tsx     (3 acts under 150 words with reversible stepping)
│   │   ├── EasterEggModal.tsx      (Hidden star in taskbar, secret 1999 diskette + confetti)
│   │   ├── SparkleTrail.tsx        (Non-intrusive cursor particle trail for mouse devices)
│   │   └── Footer.tsx              (Attribution for all 4 official assets, tech stack, back to top)
│   ├── App.tsx                     (Layout coordination, GSAP ScrollTrigger transitions)
│   ├── index.css                   (Tokens, custom scrollbars, scanlines, responsive styles)
│   └── main.tsx                    (React 19 root bootstrap)
```

---

## 3. Implementation Phases

### Phase 1: Complete Responsive Structure & Core Exhibits (CURRENT)
- [x] Design token definition and typography loading (@fontsource).
- [x] Responsive taskbar navigation with status pills, theme toggle, mute switch, and secret star.
- [x] Hero section featuring Pip's canon portrait, cursor perspective tilt, and headline.
- [x] Diagnostic bar featuring live ticking odometer ("Dreams Delivered").
- [x] Exhibit A: Lullaby Lab with real-time Web Audio API sine synthesis (6 chime notes, melody recorder, Pip's Lullaby player).
- [x] Exhibit B: Nightlight Collection with 4 lantern spectra and dimmer slider modifying the nursery glow live.
- [x] Exhibit C: Rooftop Dream Delivery with SVG chimney map, animated path, and dispatch mechanism.
- [x] Origin Story with 3 concise acts (each verified under 150 words: 69, 67, 68 words).
- [x] Full footer crediting official assets, third-party libraries, and smooth scroll to top.
- [x] Verified zero errors with `oxlint` and `npm run build`.

### Phase 2: Cinematic Scroll Choreography & Atmosphere (COMPLETED)
- [x] Official GSAP `matchMedia()` scroll choreography with `(prefers-reduced-motion: reduce)` fallback.
- [x] Natural entrance reveals with reversible `toggleActions: "play none none reverse"` without viewport locking.
- [x] Ambient radial lantern radiance synchronized with live lantern color and brightness adjustments.
- [x] High-contrast accessibility and visible focus indicators.

### Phase 3: Audio Micro-Interactions, Sparkle Trail & Easter Egg (COMPLETED)
- [x] Web Audio API music-box synthesizer with crystalline (432Hz) vs. deep REM octave switcher.
- [x] Sparkle cursor trail active exclusively on pointer/mouse devices (disabled on touch).
- [x] Secret star in DreamOS taskbar and Pip window triggering celebratory chime and `canvas-confetti`.
- [x] Interactive live-ticking odometer dreams counter and harmonic frequency monitor.

### Phase 4: Responsive Chaos Mode, Mobile Optimizations & Final Polish (COMPLETED)
- [x] Retro 1999 CRT Chaos Mode with scanlines and monospace typography.
- [x] Mobile (390x844) viewport optimization: zero horizontal overflow (`scrollWidth === clientWidth`).
- [x] Unified single-tier desktop navigation bar (no two-tiered awkward stacking).
- [x] Clean circular dream badge for Pip's cloud avatar on the SVG night sky.
- [x] Desktop 1440x900 above-the-fold CTA visibility verified via Playwright.

---

## 4. Responsive Behavior & Accessibility
- **Breakpoints**: Mobile (<640px), Tablet (640px–1024px), Desktop (>1024px).
- **Mobile handling**:
  - Sparkle trail disabled automatically on touch-only devices to save battery and GPU.
  - Perspective tilts fall back to subtle static CSS transforms.
  - Multi-column grids collapse into fluid single-column cards with touch targets >= 44px.
- **Accessibility**:
  - High-contrast text against backgrounds (`#34221a` on `#fff8f1`, `#eaeaff` on `#090b20`).
  - Clear `:focus-visible` outlines on all interactive buttons and keys.
  - Meaningful `aria-label` attributes on audio triggers, lantern switches, and navigation links.
  - Full `prefers-reduced-motion` CSS override preventing vestibular discomfort.
  - Visible, reliable audio mute button with keyboard shortcut (`m`).

---

## 5. Animation Strategy
- **GSAP + ScrollTrigger**: Applied for natural entrance transitions (`.gsap-fade-in`) without locking the viewport or trapping scroll wheels.
- **CSS Transitions**: Used for tactile micro-interactions (button presses, active chime bounce, lantern glow fade).
- **Canvas-Confetti**: Triggered purely on demand when the Easter egg secret star is unlocked.

---

## 6. QA Checklist
- [x] Pip's canon preserved: round skull, soft eye sockets, nightcap with bow, gentle smile, strictly non-gory.
- [x] All 4 official assets in `public/assets` loaded and credited in the footer.
- [x] All 3 story scenes verified under 150 words.
- [x] Working Web Audio API sound box with reliable mute button.
- [x] Clickable lanterns causing visible live change to scene aura.
- [x] Rooftop route with visible stops and dispatch progress.
- [x] Keyboard navigation and visible focus rings active.
- [x] `npm run build` passes with zero errors.
- [x] `oxlint` passes with zero errors and zero warnings.
