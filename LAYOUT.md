# Layout Intent

**Product:** Personal developer portfolio — a showroom, not a résumé
**Core task:** Visitors decide within 10 seconds if Karol is worth hiring; projects are the argument
**Density:** Moderate (Behance-like) — visual-first project cards with expandable detail
**Primary action:** Engage with a project (slide-up on mobile, side-cutting panel on desktop)
**Viewport:** Mobile-first (LinkedIn is the real traffic driver); desktop is the enhanced view
**Tempo:** Dual-speed — 10-second recruiter scan + 5-minute developer deep-dive
**Structural precedent:** Behance project cards (moderate density, visual-first) crossed with Linear-style slide-out detail panels (spatial, no navigation away). Hero is a masthead, not a statement.
**Pattern:** Stacked Full-Bleed (mobile primary) + Asymmetric Split detail panel (desktop enhancement). Compact hero (~40vh) gets out of the way fast so projects appear above or near the fold.

## Structure

```
MOBILE (primary):                    DESKTOP (enhanced):
┌─────────────────┐                  ┌─────────────────────────────────┐
│  HERO (~40vh)   │                  │  HERO (~40vh)                   │
│  name · role    │                  │  name · role · 2 hard facts     │
│  2 hard facts   │                  │  GitHub ↗  LinkedIn ↗           │
│  GitHub/LinkedIn╲                  ╲─────────────────────────────────╱
╲─────────────────╱                  ╱─────────────────────────────────╲
│  PROJECTS       │                  │  PROJECTS                       │
│  (immediate,    │                  │  PROJECT 1      PROJECT 2       │
│  first scroll)  │                  │  visual+hook    visual+hook     │
│  PROJECT 1      │                  │  [click → detail cuts in →]    │
│  PROJECT 2      ╲                  ╲─────────────────────────────────╱
╲─────────────────╱                  ╱─────────────────────────────────╲
│  ABOUT (sparse) │                  │  ABOUT (sparse, secondary)      │
╲─────────────────╱                  ╲─────────────────────────────────╱
╱─────────────────╲                  ╱─────────────────────────────────╲
│  CONTACT/FOOTER │                  │  CONTACT / FOOTER               │
└─────────────────┘                  └─────────────────────────────────┘

DETAIL ENGAGED (mobile):             DETAIL ENGAGED (desktop):
┌─────────────────┐                  ┌──────────────┬──────────────────┐
│  PROJECT BG     │                  │  projects    │  DETAIL PANEL    │
│  (dimmed)       │                  │  (compressed)│  cuts in from    │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤                  │              │  right           │
│  DETAIL PANEL   │                  │              │  tech · desc ·   │
│  slides up      │                  │              │  links · images  │
│  tech · links   │                  └──────────────┴──────────────────┘
└─────────────────┘
```

## Section dividers

Sections are NOT straight-cut. Use diagonal clips (CSS `clip-path: polygon`) or gentle
SVG curves between sections. Each section transition should feel like a physical overlap or
tilt — not a flat horizontal line. Vary the angle/direction per transition to avoid monotony.

## Banned pattern overrides

- **Full-bleed 100vh hero:** Replaced with compact ~40vh masthead. Hero's job is identity
  establishment only — projects must be visible or near-visible on first scroll.
- **Sidebar navigation:** Rejected. With 2 projects and a bio, a persistent sidebar is
  over-engineered. Navigation depth doesn't warrant it.
- **Modal for project detail:** Replaced with slide-up panel (mobile) and side-cutting
  push panel (desktop). Modals break spatial context; panels preserve it.
