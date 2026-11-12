# Project Context

Personal portfolio website for Karol — Full-Stack Developer specializing in JavaScript, TypeScript, React, and AI-assisted workflows.

## Site Structure

Multi-page, plain HTML in Astro:

```
/          Home: intro + CTA, About, project index with preview, Contact form
/projects  Client work + Personal projects (index list with preview)
/signal    "Valuable Reads": curated articles with commentary
/404       Not found
```

- Nav: Home, Projects, Signal only. External links (GitHub, LinkedIn) live in the footer, never the nav.
- Content comes from `src/data/projects.json` and `src/data/reads.json` (content collections, schemas in `src/content.config.ts`).
- Project screenshots: `src/assets/projects/<project id>.jpg`, 16:9. A project without one renders without an image.
- Share image for Open Graph is the Toast screenshot; site URL is `https://ko-karol.com` (set in `astro.config.mjs`). No personal photo on the site.

## Design Principles

- **Terminal / spec-sheet look, still plain**: monospace headings and nav, square corners, 1px ruled grid, one green accent, high contrast. No gradients, shadows, fake terminal windows or typing animations.
- **No eyebrow headings** ("About me", "Selected work", etc.)
- **No diagonal clip-paths** or overlapping sections
- **Fit to screen**: on desktop-sized viewports (>= 64rem wide, >= 34rem tall) Home and Projects fill the viewport with no page scroll (CSS grid, no JS). The project index lists rows with a large preview panel; the preview is chosen by CSS alone (`:has(:hover, :focus-within)`, first project by default). Smaller screens and no-JS use the scrolling layout, projects first on phones.
- **Contact form stays visible** inline on the home page. Never hide it behind a modal, popover or toggle.
- **Progressive enhancement**: everything works without JS. JS only adds the fetch-based contact form submit and GSAP scroll reveals.
- **Reduced motion / no JS**: an inline script adds `.reveal` to `<html>` only when JS runs and motion is allowed; CSS hides reveal targets only under that class. GSAP is loaded on demand and never downloaded under `prefers-reduced-motion: reduce`. If GSAP fails to load, `.reveal` is removed.
- **Light and dark** via `prefers-color-scheme`, using the CSS variables in `src/styles/global.css`.
- Client vs personal projects are separate groups on /projects.

## Tech Stack

- Astro 7 with @astrojs/sitemap (content collections, `astro:assets`, `<ClientRouter />` view transitions, hover prefetch)
- Single global stylesheet (`src/styles/global.css`) plus scoped styles in `ProjectList.astro` (index rows and preview panels)
- GSAP + ScrollTrigger, dynamically imported (`src/scripts/animations.ts`)
- Formspree for the contact form (progressive: plain POST without JS)

## Content Guidelines

- Keep About section tight: 1-2 paragraphs max, no stat grids
- Mention Pi/AI workflows as a note, not a manifesto
- No unverified metrics (don't claim test counts, lead numbers, etc.)
- No marketing copy; descriptions state facts from `docs/archive.md`
