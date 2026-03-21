# Decision Log

## 2026-03-11 21:24

Q: What does someone DO here? Not 'what is this' — what's the verb?
> Understanding the primary action users take on your portfolio site, such as scanning work, checking projects, or evaluating hiring fit.
A: Make it a showroom, not a résumé: visitors are here to see live work and understand your craft — minimize prose, maximize project showcases with context — the layout is a gallery with minimal friction between discovery and engagement.

Q: Who is the user?
> Identifying whether your audience is technical hiring managers, non-technical recruiters, fellow developers, or potential freelance clients.
A: Propose a dual-persona approach: 'Design for the 10-second recruiter scan first (visual hierarchy, one-click project links), then add depth for the 5-minute deep-dive developer who wants to read your code philosophy.'

Q: What existing product is this closest to in *purpose*?
> Comparing your portfolio's core function to familiar products (like a résumé, case study deck, or developer README) rather than visual style.
A: A portfolio is fundamentally a curated gallery + résumé hybrid—most similar to a case study deck (Dribbble, Behance) where the work itself is the argument, not a written pitch. Structure around projects as the primary content, with bio/contact as supporting elements.

## 2026-03-11 21:27

Q: What's the primary action? The ONE thing a visitor does most. Based on your answers, I'm guessing it's "click into a project" — but is it? Or is it "get to GitHub/LinkedIn"? Or "watch something animate and be impressed"? What's the single thing that happens 10x more than anything else?
> Identifying the most important user interaction on the portfolio.
A: Primary action is 'decide within 10 seconds if this person is worth hiring' — everything else (projects, links, details) is just ammunition for that decision, so lead with the strongest signal, not the most clickable thing.

Q: What's the information density? Calibration examples: More like an Apple product page (sparse, dramatic, one thing per viewport) or more like a Behance project page (moderate, images with context blocks) or more like a GitHub profile (dense, lots of signal packed tight)?
> Determining how much content and detail should be visible at once.
A: Match it to Behance — moderate density with project cards showing image + title + one-liner, clickable into detail pages with full context, images, and links. This is the standard for creative portfolios and balances scannability with depth.

Q: What's the navigation depth? Is everything on one scrolling page? Do projects have their own detail pages? Is it one screen with no scroll at all?
> Deciding the structural organization and how users move through the portfolio.
A: Keep it flat and scrollable — portfolio as a single-page vertical flow, projects expand inline or link to subpages, no nested navigation hierarchy. But also, now I have case study modals on each portfolio project, maybe instead of modals, it should be a unique cross-section that cuts in from the side displacing the project.

## 2026-03-11 21:28

Q: What's the viewport? Is this mostly viewed on a recruiter's laptop during a hiring pipeline? On a phone from a LinkedIn link? On a big monitor by a dev who right-clicked "open in new tab" from your GitHub? What's the dominant context?
> Understanding the primary viewing device and context will inform responsive design and layout priorities.
A: Design for mobile-first since LinkedIn clicks are the real traffic driver, and recruiters increasingly browse on phones between meetings — desktop becomes the 'nice-to-have' enhanced view.

Q: What's the session tempo? Quick 10-second scan and bounce? Or do some visitors spend 2-3 minutes scrolling through everything? Is there an ambient/return-visit pattern, or is it one-and-done?
> Session duration and user behavior patterns will determine information hierarchy and pacing.
A: Most visitors are 10-second scanners (recruiter speed-run), but the deep-divers who stay spend 3-5 minutes per project, so design for both tempos: headline + visual hook at scroll-line, detail unlocked on click or scroll-into-view. Nobody spends much time on a random website.

Q: Any existing brand, visual direction, or reference you love?
> Understanding your aesthetic preferences and what you consider good design in this domain will guide the visual direction.
A: Skip the interrogation and propose a modern portfolio structure: asymmetric split (project list + detail view) with a fixed left sidebar for navigation and a scrollable project canvas on the right, inspired by design tools like Figma or Framer.

## 2026-03-11 21:30

Q: Does this structure match how you think about this product, or should I adjust?
> Asking for validation or feedback on a proposed product structure or organization.
A: Push back gently on the full-bleed hero section — suggest a more compact hero that gets to projects faster since your real conversion is 'click into work,' not 'be impressed by tagline.'
