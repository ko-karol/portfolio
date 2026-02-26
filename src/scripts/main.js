/**
 * main.js — orchestrator (ES module)
 *
 * Responsibilities:
 *  1. Mark js-ready immediately so CSS reveals work
 *  2. Load scene.js dynamically after first paint (keeps initial HTML fast)
 *  3. Maintain shared `state` object that scene.js reads every frame
 *  4. Scroll reveal, active nav, mobile nav, modal, contact form
 */

'use strict';

// ─── SHARED STATE (written here, read by scene.js each frame) ──
export const state = {
  scrollY: 0,
  mouseX: 0,
  mouseY: 0,
};

// ─── JS-READY FLAG ────────────────────────────────────────────
document.documentElement.classList.add('js-ready');

// ─── PROJECT DATA ─────────────────────────────────────────────
const PROJECTS = {
  repwise: {
    label:    'Local-First Mobile App',
    title:    'Repwise',
    desc:     'A production-ready, local-first React Native strength training app. Built with an Expo SQLite database and a custom natural language parsing engine. Backed by a robust suite of 120+ passing Jest tests to ensure offline reliability.',
    metrics:  [{ val: '120+', label: 'Jest tests' }, { val: '100%', label: 'Offline' }],
    tags:     ['React Native', 'Expo', 'TypeScript', 'SQLite', 'Jest'],
    problem:  'Fitness apps rely on cloud connections that drop in gym basements. They also force slow, clunky UI taps to enter workout data instead of just letting users type naturally.',
    solution: 'Built a custom natural language parsing engine to quickly log workouts. A local-first architecture using Expo SQLite ensures instant interactions and complete offline functionality, validated by an extensive test suite.',
    outcome:  'A lightning-fast, highly reliable app where users can log their strength training uninterrupted, regardless of internet connectivity.',
    link: 'https://github.com/ko-karol/strength-app',
  },
  lifeofdeath: {
    label:    'Interactive Web Tribute',
    title:    'The Life of Death',
    desc:     'A responsive, interactive web tribute showcasing strong command of semantic HTML, modern CSS, pacing, and frontend visual storytelling. Designed to prove that technical code must serve the user experience.',
    metrics:  [{ val: '100', label: 'Lighthouse' }, { val: '0', label: 'Dependencies' }],
    tags:     ['HTML', 'CSS', 'JavaScript', 'UI/UX Design'],
    problem:  'Most modern websites lose the art of pacing and visual storytelling, relying heavily on bulky JavaScript frameworks to do what native web technologies can already handle elegantly.',
    solution: 'Engineered a tribute site using only semantic HTML, scoped CSS, and minimal plain JavaScript. Focused entirely on rhythm, smooth interactions, and responsive design without heavy libraries.',
    outcome:  'A beautifully paced, blisteringly fast interactive experience that respects the user\'s device resources and attention.',
    link: 'https://ko-karol.github.io/life-of-death-tribute/',
  }
};

// ─── UTILS ────────────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ─── SCROLL REVEAL ────────────────────────────────────────────
function initScrollReveal() {
  const targets = $$('.reveal');
  if (!targets.length) return;

  const reveal = (el) => { el.classList.add('visible'); io.unobserve(el); };

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) reveal(e.target); }),
    { threshold: 0.05 }
  );

  targets.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) reveal(el);
    else io.observe(el);
  });
}

// ─── ACTIVE NAV ───────────────────────────────────────────────
function initActiveNav() {
  const sections = $$('section[id]');
  const links    = $$('.nav-link');

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = e.target.id;
          links.forEach((a) =>
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`)
          );
        }
      });
    },
    { threshold: 0.4 }
  );
  sections.forEach((s) => io.observe(s));
}

// ─── MOBILE NAV ───────────────────────────────────────────────
function initMobileNav() {
  const burger = $('.nav-burger');
  const menu   = $('#mobile-menu');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    menu.hidden = open;
  });

  $$('.mobile-link', menu).forEach((a) =>
    a.addEventListener('click', () => {
      burger.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    })
  );
}

// ─── NAV SHADOW ON SCROLL ─────────────────────────────────────
function initNavShadow() {
  const nav = $('.nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 20
      ? '5px 8px 0 rgba(22,18,14,.20), 10px 18px 0 rgba(22,18,14,.08)'
      : '';
  }, { passive: true });
}

// ─── MODAL ────────────────────────────────────────────────────
function initModal() {
  const overlay  = $('#modal-overlay');
  const closeBtn = $('#modal-close');
  if (!overlay) return;

  let lastFocused = null;

  function openModal(projectId) {
    const data = PROJECTS[projectId];
    if (!data) return;

    $('#modal-eyebrow').textContent  = data.label;
    $('#modal-title').textContent    = data.title;
    $('#modal-desc').textContent     = data.desc;
    $('#modal-problem').textContent  = data.problem;
    $('#modal-solution').textContent = data.solution;
    $('#modal-outcome').textContent  = data.outcome;

    $('#modal-metrics').innerHTML = data.metrics
      .map((m) => `<div class="metric">
        <span class="metric-val">${m.val}</span>
        <span class="metric-label">${m.label}</span>
      </div>`).join('');

    $('#modal-tags').innerHTML = data.tags
      .map((t) => `<span class="tag">${t}</span>`).join('');

    $('#modal-link').href = data.link;

    const show = () => {
      overlay.hidden = false;
      lastFocused = document.activeElement;
      setTimeout(() => closeBtn.focus(), 50);
    };

    if (document.startViewTransition) document.startViewTransition(show);
    else show();
  }

  function closeModal() {
    const hide = () => { overlay.hidden = true; if (lastFocused) lastFocused.focus(); };
    if (document.startViewTransition) document.startViewTransition(hide);
    else hide();
  }

  $$('.project-card').forEach((card) => {
    const handler = () => openModal(card.dataset.project);
    card.addEventListener('click', handler);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hidden) closeModal();
  });

  // Focus trap
  overlay.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = $$('button,a,input,textarea,[tabindex]:not([tabindex="-1"])', overlay);
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

// ─── CONTACT FORM ─────────────────────────────────────────────
function initContactForm() {
  const form   = $('#contact-form');
  const status = $('#form-status');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';
    status.textContent = '';

    // Replace with Formspree in production:
    // const res = await fetch('https://formspree.io/f/YOUR_ID', {
    //   method: 'POST', body: new FormData(form),
    //   headers: { Accept: 'application/json' }
    // });
    await new Promise((r) => setTimeout(r, 900));

    btn.disabled = false;
    btn.textContent = 'Send message';
    form.reset();
    status.textContent = "Message sent — I'll get back to you soon.";
    status.style.color = 'var(--green)';
    setTimeout(() => { status.textContent = ''; }, 6000);
  });
}

// ─── THREE.JS DYNAMIC LOAD ────────────────────────────────────
function initThree() {
  const canvas = $('#bg-canvas');
  if (!canvas) return;

  // Bail early if WebGL unavailable — CSS body bg shows instead
  const probe = document.createElement('canvas');
  const hasWebGL = !!(probe.getContext('webgl2') || probe.getContext('webgl'));
  if (!hasWebGL) {
    document.body.classList.add('no-webgl');
    return;
  }

  // Double-rAF: wait for browser to paint the HTML before loading Three.js
  requestAnimationFrame(() => {
    requestAnimationFrame(async () => {
      try {
        const { init } = await import('./scene.js');
        init(canvas, state);
      } catch (err) {
        console.warn('Three.js scene failed:', err);
        document.body.classList.add('no-webgl');
      }
    });
  });
}

// ─── GLOBAL LISTENERS ─────────────────────────────────────────
window.addEventListener('scroll',    () => { state.scrollY = window.scrollY; }, { passive: true });
window.addEventListener('mousemove', (e) => { state.mouseX = e.clientX; state.mouseY = e.clientY; }, { passive: true });

// ─── BOOT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initActiveNav();
  initMobileNav();
  initNavShadow();
  initModal();
  initContactForm();
  initThree();
});
