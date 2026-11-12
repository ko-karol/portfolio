# Portfolio

Personal portfolio for Karol, a full-stack developer. Plain multi-page Astro 7 site (Home, Projects, Signal) with view transitions, GSAP scroll reveals and a Formspree contact form. Works without JavaScript.

## Commands

Requires Node 22.12 or newer. Run from the project root.

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Start dev server at `localhost:4321`        |
| `npm run build`   | Build the production site to `./dist/`      |
| `npm run check`   | Type-check Astro and TypeScript files       |
| `npm run preview` | Preview the production build locally        |

## Structure

```text
public/            static assets (favicons, robots.txt)
src/
├── assets/projects/  project screenshots, named <project id>.jpg
├── components/       ProjectList (large preview + title list/filmstrip)
├── data/             projects.json, reads.json (content collection sources)
├── layouts/          base HTML layout, nav, footer
├── pages/            index, projects, signal, 404
├── scripts/          contact form submit, GSAP reveals
├── styles/           global.css
└── content.config.ts collection schemas
docs/archive.md       archived notes and data from earlier iterations
AGENTS.md             design and content rules for contributors
```

## Content

- Add a project: append an entry to `src/data/projects.json` and, optionally, drop a 16:9 screenshot at `src/assets/projects/<id>.jpg`. Without one the project renders a text tile instead of a preview image.
- Add a read: append an entry to `src/data/reads.json`.

