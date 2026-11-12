// Content is visible by default; animation only runs when JS is available
// and the user has not asked for reduced motion. GSAP is loaded on demand,
// so reduced-motion visitors never download it.
let cleanup: (() => void) | undefined;
let run = 0;

async function init() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const current = ++run;

  const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ]);
  // A newer navigation started while GSAP was loading.
  if (current !== run) return;
  gsap.registerPlugin(ScrollTrigger);

  const ctx = gsap.context(() => {
    gsap.from('main > h1', { opacity: 0, y: 12, duration: 0.5, ease: 'power2.out' });

    gsap.utils.toArray<HTMLElement>('main section, main article, main > ul > li').forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });
    });
  });
  cleanup = () => ctx.revert();
}

document.addEventListener('astro:page-load', init);
// Revert animations (and inline styles) before the old page is swapped out.
document.addEventListener('astro:before-swap', () => {
  run++;
  cleanup?.();
  cleanup = undefined;
});
