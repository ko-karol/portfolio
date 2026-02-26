/* ═══════════════════════════════════════════════════════════
   PAPER PORTFOLIO — main.js v0.1
   Zero dependencies. Vanilla JS.
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── SCROLL REVEAL ──────────────────────────────────────── */
// Targets: .project-card, .about-card, .contact-paper, .stat-item
function initScrollReveal() {
  const revealTargets = document.querySelectorAll(
    '.project-card, .about-card, .contact-paper, .stat-item'
  );

  if (!revealTargets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealTargets.forEach((el) => observer.observe(el));
}

/* ─── CSS 3D TILT ────────────────────────────────────────── */
// Pure CSS perspective tilt on mouse move — no lib needed.
function initTilt() {
  const TILT_ELEMENTS = document.querySelectorAll('.js-tilt');
  if (!TILT_ELEMENTS.length) return;

  TILT_ELEMENTS.forEach((el) => {
    const maxTilt = parseFloat(el.dataset.tiltMax ?? '10');

    el.addEventListener('mousemove', (e) => {
      const rect   = el.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotX   = -(dy * maxTilt).toFixed(2);
      const rotY   =  (dx * maxTilt).toFixed(2);

      el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });

    // Keyboard / pointer-none contexts: reset on blur
    el.addEventListener('blur', () => { el.style.transform = ''; });
  });
}

/* ─── HERO PARALLAX (landscape layers) ─────────────────────── */
// Subtle depth scroll effect on the paper-world layers.
function initHeroParallax() {
  const layers = [
    { el: document.querySelector('.layer-mountains'),  speed: 0.04 },
    { el: document.querySelector('.layer-hills-back'), speed: 0.07 },
    { el: document.querySelector('.layer-hills-mid'),  speed: 0.10 },
    { el: document.querySelector('.layer-hills-front'),speed: 0.14 },
    { el: document.querySelector('.layer-ground'),     speed: 0.18 },
  ].filter((l) => l.el !== null);

  if (!layers.length) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        layers.forEach(({ el, speed }) => {
          el.style.transform = `translateY(${(scrollY * speed).toFixed(2)}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ─── FLOATING WIDGETS MOUSE PARALLAX ──────────────────────── */
// Widgets slightly follow the cursor for depth.
function initWidgetParallax() {
  const widgets = document.querySelectorAll('.paper-widget');
  if (!widgets.length) return;

  document.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth  - 0.5) * 2; // -1 to 1
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;

    widgets.forEach((w, i) => {
      const factor = (i + 1) * 6;
      w.style.translate = `${(nx * factor).toFixed(2)}px ${(ny * factor).toFixed(2)}px`;
    });
  }, { passive: true });
}

/* ─── ACTIVE NAV LINK ────────────────────────────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((a) => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ─── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initTilt();
  initHeroParallax();
  initWidgetParallax();
  initActiveNav();
});
