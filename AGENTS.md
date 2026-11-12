# Project Context

Personal portfolio website for Karol — Full-Stack Developer specializing in JavaScript, TypeScript, React, and AI-assisted workflows.

## Site Structure

Multi-page, plain HTML in Astro:

```
/          Home: intro + CTA, featured work (2 cards), About, Contact form
/projects  Client work + Personal projects (cards)
/signal    "Valuable Reads": curated articles with commentary
/404       Not found
```

- Nav: Home, Projects, Signal only. External links (GitHub, LinkedIn) live in the footer, never the nav.
- Content comes from `src/data/projects.json` and `src/data/reads.json` (content collections, schemas in `src/content.config.ts`).
- Project screenshots: `src/assets/projects/<project id>.jpg`, 16:9. A project without one renders without an image.
- Share image for Open Graph is the Toast screenshot; site URL is `https://ko-karol.com` (set in `astro.config.mjs`). No personal photo on the site.

## Design Principles

- **Plain and basic**: semantic HTML first, minimal styling, no decorative frills.
- **No eyebrow headings** ("About me", "Selected work", etc.)
- **No diagonal clip-paths** or overlapping sections
- **Progressive enhancement**: everything works without JS. JS only adds the fetch-based contact form submit and GSAP scroll reveals.
- **Reduced motion / no JS**: an inline script adds `.reveal` to `<html>` only when JS runs and motion is allowed; CSS hides reveal targets only under that class. GSAP is loaded on demand and never downloaded under `prefers-reduced-motion: reduce`. If GSAP fails to load, `.reveal` is removed.
- **Light and dark** via `prefers-color-scheme`, using the CSS variables in `src/styles/global.css`.
- Separate client vs personal projects visually but without uppercase labels.

## Tech Stack

- Astro 7 with @astrojs/sitemap (content collections, `astro:assets`, `<ClientRouter />` view transitions, hover prefetch)
- Single global stylesheet (`src/styles/global.css`) plus scoped styles in `ProjectList.astro`
- GSAP + ScrollTrigger, dynamically imported (`src/scripts/animations.ts`)
- Formspree for the contact form (progressive: plain POST without JS)

## Content Guidelines

- Keep About section tight: 1-2 paragraphs max, no stat grids
- Mention Pi/AI workflows as a note, not a manifesto
- No unverified metrics (don't claim test counts, lead numbers, etc.)
- No marketing copy; descriptions state facts from `docs/archive.md`
