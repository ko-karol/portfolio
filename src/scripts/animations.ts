// Content is visible by default. An inline script in Layout.astro adds `.reveal`
// to <html> (JS on, motion allowed), which hides the targets before first paint;
// this module fades them in. GSAP is loaded on demand, so reduced-motion visitors
// never download it.
const root = document.documentElement;
let cleanup: (() => void) | undefined;
let run = 0;

async function init() {
  if (!root.classList.contains('reveal')) return;
  const current = ++run;

  try {
    const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);
    // A newer navigation started while GSAP was loading.
    if (current !== run) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        'main h1',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'transform' },
      );

      gsap.utils.toArray<HTMLElement>('main section, main article, main > ul > li').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            clearProps: 'transform',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          },
        );
      });
    });
    cleanup = () => ctx.revert();
  } catch {
    // GSAP failed to load: show everything.
    root.classList.remove('reveal');
  }
}

document.addEventListener('astro:page-load', init);
// Revert animations (and inline styles) before the old page is swapped out.
document.addEventListener('astro:before-swap', () => {
  run++;
  cleanup?.();
  cleanup = undefined;
});

export {};
