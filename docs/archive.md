# Portfolio Archive

Reusable data extracted from the pre-modernisation repo (sources: `src/`, `.pi/`, `LAYOUT.md`, `.hallmark/`, `.serena/`) before those were removed. `AGENTS.md` is the authority for current design rules; where an archived idea conflicts with it, it is marked **superseded**.

## Identity & contact

- Name: Karol. Handle/brand: `ko-karol` (footer stamp "KO-KAROL" + current year).
- Role: Full-Stack Developer (JavaScript, TypeScript, React, AI-assisted workflows).
- Email: karol@ko-karol.com
- GitHub: https://github.com/ko-karol
- LinkedIn: https://www.linkedin.com/in/ko-karol/
- Contact form endpoint (Formspree): `https://formspree.io/f/mbdawelb` (POST FormData, `Accept: application/json`; fields `name`, `email`, `message`).
- Page `<title>`: "Karol | Full-Stack Developer"; signal page: "Signal | Karol".
- Meta description (Layout.astro): "Software developer specialising in fast, thoughtful products. Available for freelance and full-time opportunities."
- Navigation links: Work, Process (anchor `#process`, no such section on the page), About, Signal (`/signal`), "Let's talk" (`#contact`).

## Copy

### Hero
- H1 lines: "Hey, I'm" / "Karol." / "Full‑Stack" / "Developer." (non-breaking hyphen in Full‑Stack)
- Status: "Available for work"
- Stack line: "TypeScript · React · Node.js · AI-Augmented"
- Facts (value / label): `3yr` Freelance · `F&C` Graduate · `UK` Remote
- Links: GitHub ↗, LinkedIn ↗, "See work ↓" (→ `#work`)

### Currently strip ("Now")
- Reading *SICP*
- Building a NixOS home server
- Learning systems design patterns

### About
- Heading: "Full-stack developer."
- Bio: "I build clean, resilient web applications. Founders & Coders graduate, formerly freelance for charitable organizations."
- Pi note: "I work with AI coding agents (Pi) for rapid prototyping and boilerplate generation—always with human oversight for architecture decisions, code review, and quality assurance."
- Skills: JavaScript, TypeScript, React, Astro, SQLite, NixOS, Docker
- Photo card: placeholder "K" tile, caption "Karol" / "Available for work" (no real photo exists).

### Work
- Heading: "Things I've built."
- Groups: "Client Work", "Personal Projects"
- Detail panel structure per project: description, tags, Context / What I did / Result, "View project ↗" link.

### Contact
- Heading: "Let's build something great."
- Sub: "Whether you have a project in mind, want to chat about an opportunity, or just want to say hi — my inbox is open."
- Email CTA button with karol@ko-karol.com; GitHub · LinkedIn links.
- Form: Name ("Your name"), Email ("you@example.com"), Message ("Tell me about your project…"); button "Send message".
- Form states: success "Message sent — I'll get back to you soon."; error "Oops! There was a problem submitting your form."

## Projects

### Client work (all "Client Site")

| Title | Description | Tags | Link |
|---|---|---|---|
| Toast Collective | Film production website for nonprofits. Custom WordPress theme with portfolio gallery and testimonial carousel. | WordPress, PHP, CSS | https://toastcollective.co.uk |
| Guild of Psychotherapists | Membership site with therapist search, member portal, and training course management. Migrated from SilverStripe to WordPress. | WordPress, Migration, Custom Search | https://guildofpsychotherapists.org.uk |
| Claire Lynch Consulting | Business and human rights advisory site. Responsive landing pages with service breakdowns and contact flows. | WordPress, Responsive | https://clairelynchconsulting.com |
| Rehabit UK | Addiction counseling charity site. Streamlined referral form UX and volunteer application system. | WordPress, Forms, UX | https://rehabit.uk |

(The `.hallmark` crawl also recorded these under client-work headings; no per-project Context/Result copy existed for client sites.)

### Personal projects

**Repwise** (label "Personal Project")
- Card: React Native app for tracking strength training. Natural language input for quick workout logging. Works offline.
- Detail short desc: React Native app for tracking strength training with natural language input.
- Tags: React Native, TypeScript, SQLite
- Link: https://github.com/ko-karol/strength-app
- Context: Logging workouts on phones is tedious — too many taps, too much waiting.
- What I did: Built a simple parser that understands plain text like "bench 3x5 80kg" and converts it to structured data. SQLite keeps everything local and fast.
- Result: Quick workout logging that works offline. Still in development.

**Life of Death** (label "Experiment"; detail title "The Life of Death")
- Card: Interactive web tribute for an animated short. No frameworks — just semantic HTML, CSS animations, and careful pacing.
- Detail short desc: Interactive web tribute for an animated short film. No frameworks.
- Tags: HTML, CSS, JavaScript
- Link: https://ko-karol.github.io/life-of-death-tribute/
- Context: Wanted to see how far I could push storytelling with just the basics.
- What I did: Used semantic HTML for structure, CSS for rhythm and animations, and minimal JS for interactions. No build step, no dependencies.
- Result: A lightweight, fast-loading tribute that respects the source material.

## Signal page (`/signal`, curated reads)

- Heading: "Valuable Reads"; sub: "A curated collection of articles, essays, and resources I've found insightful. New additions will appear here."
- Post entry shape: `{ title, url, author, date, commentary, tags }`; card shows author label, title, commentary blockquote, published date, tags, "Read Article →".
- Entry:
  - Title: "Yes, and..." — Carson Gross — https://htmx.org/essays/yes-and/ — 2026-02-27
  - Tags: AI, Software Development, Career
  - Commentary: "A thoughtful piece on the future of programming in the age of AI. Gross argues that while AI can generate code, the core skills of problem-solving, complexity management, and understanding the code you ship will become even more valuable. His take: "You have to write the code.""

## Design tokens (`src/styles/tokens.css`)

- Palette "Pastel Paper", all OKLCH:
  - Paper: white `0.98 0.01 90`, cream `0.95 0.02 90`, tan `0.92 0.03 90`, warm `0.88 0.04 90`, dark `0.80 0.03 90`
  - Ink (hue 250): 900 `0.25`, 700 `0.35`, 500 `0.50`, 400 `0.60`, 300 `0.70`, 100 `0.85` (chroma 0.02)
  - Accents: red `0.65 0.15 25`, orange `0.75 0.12 45`, yellow `0.88 0.15 90`, green `0.70 0.12 150`, teal `0.70 0.10 180`, blue `0.65 0.10 250`, purple `0.70 0.10 300`
  - Landscape (defined but unused in CSS; `scene.js` has its own hex palette for a Three.js papercraft hills scene): sky `0.92 0.02 250`, sky-light `0.96 0.02 250`, mountain `0.85 0.05 250`, hills `0.80/0.75/0.70 · 0.08/0.10/0.12 · 150`, ground `0.65 0.10 150`
- Shadows: hard offset, ink at 15% alpha (`xs` 2px 2px; `sm` 3px 4px + 6px 8px at 5%; `md` 4px 6px + 10px 16px at 5%)
- Fonts: Space Grotesk 400/500/600/700 (sans), Lora regular + italic (serif; used for italic accent words and quote text); loaded from Google Fonts
- Motion: `--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.2)`, `--ease-out: cubic-bezier(0.2, 0.8, 0.2, 1)`, `--dur: 0.3s`, `--dur-fast: 0.15s`
- Spacing: xs 0.5rem, sm 1rem, md 2rem, lg 3rem, xl 6rem, 2xl 8rem
- Radii: 4px, sm 2px, lg 8px
- Visual language: paper cards with 2.5px ink borders, hard offset shadows, folded corner (`CardFold`), washi-tape strips (`CardTape`, colours red/yellow/green/blue/purple), dashed rules, 3-dot window chrome on project cards, hand-highlight (yellow marker under a heading word), dotted hero background, slight card rotation (~-0.5deg), blueprint-grid navy footer (`#1a3a5c`, text `#a8c5e2`, stamp `#f5f0e0`, hover underline `#c41e3a`), dark contact section (`rgba(22,18,14,0.92)`).

## Design decisions & audience insights (from `.pi/decisions.md`, March 2026)

- Product is a showroom, not a résumé: work is the argument; bio/contact are supporting. Closest analogue: a case-study deck (Dribbble/Behance).
- Primary action: a visitor decides within ~10 seconds whether Karol is worth hiring. Lead with the strongest signal, not the most clickable thing.
- Audience: dual persona — the 10-second recruiter scan (visual hierarchy, one-click project links) and the 3–5 minute developer deep-dive (detail on click / scroll-into-view).
- Information density: Behance-like, moderate; card = visual + title + one-liner, detail behind a click.
- Navigation: flat single-page vertical flow; no nested hierarchy; no persistent sidebar (rejected as over-engineered for a few projects and a short bio).
- Viewport: mobile-first (LinkedIn clicks drive traffic); desktop is the enhanced view.
- Hero: compact, not full-bleed — the real conversion is "click into work".
- Project detail: not a modal on desktop; a panel that cuts in from the side and displaces the list (inline split). Mobile: slide-up bottom sheet per `AGENTS.md` (current code still uses a centred modal on ≤768px).

## Layout intent (from `LAYOUT.md`)

Still relevant:
- Compact masthead hero (~40vh original target; code used `min-height: 80vh`) so projects are visible or near-visible on first scroll.
- Hero shows name, role, hard facts, GitHub/LinkedIn.
- Detail on desktop: list compresses, detail panel cuts in from the right (tech, description, links). Mobile: stacked cards, detail slides up.
- Order of sections evolved: Hero → Currently → About → Work → Contact (see `AGENTS.md`).

Superseded by `AGENTS.md`:
- Diagonal `clip-path: polygon` / SVG-curve section dividers and overlapping sections — **rejected**; no diagonal clip-paths or overlaps.
- "Process" nav item / section — no such section in the 5-section structure.
- Eyebrow labels (e.g. "Get in touch", "Signal", `.detail-eyebrow`, `.section-eyebrow`, hero status caps) — **rejected** by the no-eyebrow rule.

## Audit findings worth remembering (`.hallmark`, Oct–Nov 2026, against the old design)

- Contrast failures (<4.5:1): `--ink-300` small labels on paper (Now, Available for work, Client Site, Context, fact labels), red/accent-filled buttons with white text (3.46:1), contact email button.
- Focus rings only 1.63:1 on the blue footer links and 2.67:1 on project cards; need ≥3:1 (a `--color-focus` token).
- Horizontal scroll at 320px (scrollWidth 349).
- Text smaller than 12px (fact labels ~9.9px); 4 font weights in use (target ≤3).
- Control heights outside 44–52px (project cards' CTA 24px).
- Accent-coloured word inside a heading (`.hero-name`/`.hero-display .accent`) flagged; use a whole-head treatment.
- Heading spacing: group headings sat closer to preceding content than to what they head (want ≥2× space above vs below).
- Currently strip and About were "thin sections" with no mass; one screen carried ~151 words (target ≈80).
- A dynamically imported module (`.vite/deps`) failed on load in dev.

## Tooling notes

- `.serena/project.yml`: Serena project "paper-portfolio", language `typescript`, UTF-8, all defaults — no custom config worth keeping.
- `.pi/todos.json`: all 9 listed tasks (CSS tokens/reset/utilities/scoped files, Layout imports, extracting Hero/Work/About/Contact sections, shared UI components) were completed on 2026-03-21; nothing outstanding.
