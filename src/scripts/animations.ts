import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let mm: gsap.MatchMedia | undefined;

// Content is visible by default; animation only runs when JS is available
// and the user has not asked for reduced motion.
function init() {
  mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from('main > h1', { opacity: 0, y: 12, duration: 0.5, ease: 'power2.out' });

    gsap.utils.toArray<HTMLElement>('main section, main li').forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });
    });
  });
}

document.addEventListener('astro:page-load', init);
// Revert animations (and inline styles) before the old page is swapped out.
document.addEventListener('astro:before-swap', () => {
  mm?.revert();
  mm = undefined;
});
