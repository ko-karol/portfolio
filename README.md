# Portfolio

Personal portfolio for Karol, a full-stack developer. Single-page site built with Astro 7, Tailwind CSS 4, vanilla JS and GSAP.

## Commands

Requires Node 22.12 or newer. Run from the project root.

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Start dev server at `localhost:4321`        |
| `npm run build`   | Build the production site to `./dist/`      |
| `npm run preview` | Preview the production build locally        |

## Structure

```text
public/            static assets (favicons)
src/
├── components/    shared Astro components (e.g. Footer)
├── layouts/       base HTML layout
├── pages/         routes (index.astro composes the sections)
├── scripts/       client-side behaviour and GSAP animation
├── sections/      page sections (Hero, Work, About, Contact, ...)
└── styles/        global CSS and design tokens
docs/archive.md    archived notes and data from earlier iterations
AGENTS.md          design and content rules for contributors
```

See `AGENTS.md` before changing design or copy, and `docs/archive.md` for preserved project data.
