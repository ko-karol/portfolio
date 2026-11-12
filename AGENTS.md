# Project Context

Personal portfolio website for Karol — Full-Stack Developer specializing in JavaScript, TypeScript, React, and AI-assisted workflows.

## Site Structure

Multi-page, plain HTML in Astro:

```
/          Home: bento grid of intro tile, About tile, six project tiles and the Contact tile
/projects  Title band + six project tiles (kind chip: client work / personal project)
/signal    "Valuable Reads": curated articles with commentary
/404       Not found
```

- Nav: Home, Projects, Signal only. External links (GitHub, LinkedIn) live in the footer, never the nav.
- Content comes from `src/data/projects.json` and `src/data/reads.json` (content collections, schemas in `src/content.config.ts`).
- Project screenshots: `src/assets/projects/<project id>.jpg`, 16:9. A project without one renders without an image (its tile shows the title in large type on a lime fill).
- Share image for Open Graph is the Toast screenshot; site URL is `https://ko-karol.com` (set in `astro.config.mjs`). No personal photo on the site.

## Design Principles

- **Bento tiles**: system sans, tight tracking, heavy weights. One dark neutral (light variant: warm off-white) page and tile fill plus two solid accents: orange (intro tile, active nav, Projects/Signal title band) and lime (Contact tile, no-screenshot project tile), both with dark text in both themes. 10-12px gaps, 12px radius, body >= 16px. No gradients, shadows or glass. Project tiles: screenshot fills the tile, caption on a solid near-black strip (title, tags), kind chip top-left, description revealed over the tile on hover/focus and always in the DOM (stacked under the title on tablet/phone).
- **No eyebrow headings** ("About me", "Selected work", etc.)
- **No diagonal clip-paths** or overlapping sections
- **Fit to screen**: on desktop-sized viewports (>= 64rem wide, >= 34rem tall) Home and Projects fill the viewport with no page scroll (CSS grid, no JS). Home: left column intro + About, right column a 10-column 3x2 staggered grid of project tiles, Contact tile (one-row form) under it. Projects: orange title band over the same tile grid. Smaller screens and no-JS use the stacked layout, projects before About/Contact.
- **Contact form stays visible** inline on the home page. Never hide it behind a modal, popover or toggle.
- **Progressive enhancement**: everything works without JS. JS only adds the fetch-based contact form submit and GSAP scroll reveals.
- **Reduced motion / no JS**: an inline script adds `.reveal` to `<html>` only when JS runs and motion is allowed; CSS hides reveal targets only under that class. GSAP is loaded on demand and never downloaded under `prefers-reduced-motion: reduce`. If GSAP fails to load, `.reveal` is removed.
- **Light and dark** via `prefers-color-scheme`, using the CSS variables in `src/styles/global.css`.
- Client vs personal projects are separate groups on /projects.

## Tech Stack

- Astro 7 with @astrojs/sitemap (content collections, `astro:assets`, `<ClientRouter />` view transitions, hover prefetch)
- Single global stylesheet (`src/styles/global.css`) plus scoped styles in `ProjectList.astro` (tile layout: desktop grid placement, caption strip, hover/focus description overlay)
- GSAP + ScrollTrigger, dynamically imported (`src/scripts/animations.ts`)
- Formspree for the contact form (progressive: plain POST without JS)

## Content Guidelines

- Keep About section tight: 1-2 paragraphs max, no stat grids
- Mention Pi/AI workflows as a note, not a manifesto
- No unverified metrics (don't claim test counts, lead numbers, etc.)
- No marketing copy; descriptions state facts from `docs/archive.md`
