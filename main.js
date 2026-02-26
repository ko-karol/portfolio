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
  alpha: {
    label:    'Web App',
    title:    'Task Flow',
    desc:     'A keyboard-first task manager with real-time sync, offline mode, and a radically minimal UI. Built without a framework — 14 KB gzipped.',
    metrics:  [{ val: '14 KB', label: 'bundle' }, { val: '100', label: 'Lighthouse' }, { val: '8 k', label: 'users' }],
    tags:     ['JavaScript', 'Service Worker', 'IndexedDB'],
    problem:  'Most task apps are overengineered — they load megabytes of JS just to show you a to-do list. Users complained that competitors felt sluggish on slower devices and used too much battery.',
    solution: 'Built from scratch in vanilla JS with zero runtime dependencies. A Service Worker handles offline sync; IndexedDB stores data locally. The entire app ships in 14 KB gzipped.',
    outcome:  '8,000 active users, a 100/100 Lighthouse score, and a sub-1s TTI on 3G. Featured in the Chrome Developers blog.',
    link: '#',
  },
  papercli: {
    label:    'CLI / npm',
    title:    'PaperCLI',
    desc:     'Zero-dependency project scaffolding tool with opinionated defaults. Ships your first commit in seconds, not minutes.',
    metrics:  [{ val: '12 k', label: 'weekly installs' }, { val: '0', label: 'deps' }, { val: '98%', label: 'satisfaction' }],
    tags:     ['Node.js', 'Open Source'],
    problem:  'Every team I worked with wasted the first hour of a new project on the same yak-shaving: ESLint config, Prettier, TypeScript setup, CI boilerplate.',
    solution: 'A single CLI command that asks three questions and generates a production-ready project. No dependencies — just Node.js. The entire source fits in one file.',
    outcome:  '12,000 weekly npm installs, 98% satisfaction from a survey of 400+ users, contributions from 23 developers worldwide.',
    link: '#',
  },
  foldline: {
    label:    'Backend / API',
    title:    'Foldline API',
    desc:     'High-throughput REST + GraphQL API serving a document-heavy SaaS. Built for sub-20 ms p99 with zero cold starts.',
    metrics:  [{ val: '1 M+', label: 'req / day' }, { val: '18 ms', label: 'p99' }, { val: '99.98%', label: 'uptime' }],
    tags:     ['Go', 'GraphQL', 'Postgres', 'Redis'],
    problem:  'The client had a Node.js API hitting ~300 ms p99 under load. Users noticed slowdowns during document exports. They needed a replacement with room to grow.',
    solution: 'Rewrote critical paths in Go behind the same GraphQL interface — zero frontend changes. Added pgxpool connection pooling, Redis result caching, and distributed tracing from day one.',
    outcome:  'p99 dropped from 300 ms to 18 ms. 99.98% uptime over 14 months, handling 1M+ requests/day without autoscaling.',
    link: '#',
  },
  craftui: {
    label:    'Design System',
    title:    'CraftUI',
    desc:     'Accessible, headless component library. Every component ships with full ARIA support, keyboard navigation, and TypeScript types.',
    metrics:  [{ val: '60+', label: 'components' }, { val: 'AA', label: 'WCAG 2.1' }, { val: '2.1 k', label: 'GitHub stars' }],
    tags:     ['TypeScript', 'React', 'Radix', 'Storybook'],
    problem:  'The team was rebuilding the same Modal, Dropdown, and DatePicker in every project. Each had subtly different accessibility bugs. No shared source of truth.',
    solution: 'Headless library on Radix primitives, styled with CSS variables for easy theming. Every component tested with axe-core and a real screen reader.',
    outcome:  'Adopted by 5 internal teams, open-sourced, 2,100 GitHub stars in the first year. Per-project component work reduced from ~3 weeks to ~1 day.',
    link: '#',
  },
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
