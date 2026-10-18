---
name: dreamos-frontend-design
description: Improves DreamOS 99 frontend art direction, distinctive layouts, typography, responsive behavior, cinematic animation, accessibility and polished early-web interactions. Use when designing, implementing, reviewing or refining the DreamOS hackathon website.
---

# DreamOS Frontend Design Skill

Act as a meticulous creative director and senior frontend engineer.

## Art direction

- Preserve Pip's official character identity and supplied artwork.
- Use nursery cream #fff8f1, berry #a34063, cocoa #5c4033, midnight #090b20, violet #777dff and lantern gold #ffd88a.
- Use Playfair Display for editorial headlines, Fredoka for friendly controls, and Space Mono for terminal details.
- Combine handmade 1990s web nostalgia with cinematic storytelling.
- Avoid generic SaaS layouts, repetitive cards, excessive gradients and indiscriminate glow effects.
- Use intentional composition, varied section rhythm, meaningful negative space and strong visual hierarchy.

## Animation principles

- Prefer one outstanding signature transition over many unrelated animations.
- Use GSAP and ScrollTrigger for complex scroll-linked sequences.
- Keep scroll behavior reversible and avoid unnecessary pinning.
- Respect prefers-reduced-motion and disable expensive pointer effects on touch devices.
- Clean up event listeners, animation contexts and observers.

## Engineering and QA

- Inspect existing code before editing.
- Preserve working interactions and existing architecture.
- Keep Oxlint and the existing Vite scripts.
- Make every visible control functional.
- Maintain keyboard access, visible focus, readable contrast and accessible sound controls.
- Test desktop and narrow mobile layouts.
- Run the existing lint command and npm run build after meaningful changes.
- Fix regressions instead of rewriting working features.
- Never claim a test passed unless it was actually run.
