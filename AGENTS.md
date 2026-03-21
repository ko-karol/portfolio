# Project Context

Personal portfolio website for Karol — Full-Stack Developer specializing in JavaScript, TypeScript, React, and AI-assisted workflows.

## Site Structure

```
Hero → Currently → About → Work → Contact
```

- **Hero**: Name, headline, CTA
- **Currently**: Availability/marquee strip
- **About**: Short bio + Pi workflow note + skills, photo card
- **Work**: Client projects + Personal projects (no eyebrow labels on headings)
- **Contact**: Email CTA + form

## Design Principles

- **No eyebrow headings** ("About me", "Selected work", etc.)
- **No diagonal clip-paths** or overlapping sections
- **Clean spacing** using design tokens (`var(--space-2xl)`) not calc()
- **Minimal sections**: 5 total, no timeline/journey block
- **Mobile bottom sheet** for project details (desktop uses inline panel)

## Tech Stack

- Astro + vanilla JS
- Scoped CSS in components
- GSAP for scroll animations
- SVG icons

## Content Guidelines

- Keep About section tight: 1-2 paragraphs max, no stat grids
- Mention Pi/AI workflows as a note, not a manifesto
- Separate client vs personal projects visually but without uppercase labels
- No unverified metrics (don't claim test counts, lead numbers, etc.)
