/* ═══════════════════════════════════════════════════════════
   PAPER PORTFOLIO — main.js v0.2
   Zero dependencies. Vanilla JS. View Transitions API.
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── UTILS ──────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─── PROJECT DATA ───────────────────────────────────────── */
const PROJECTS = {
  alpha: {
    label:    'Web App',
    title:    'Task Flow',
    desc:     'A keyboard-first task manager with real-time sync, offline mode, and a radically minimal UI. Built without a framework — 14 KB gzipped.',
    metrics:  [{ val: '14 KB', label: 'bundle' }, { val: '100', label: 'Lighthouse' }, { val: '8 k', label: 'users' }],
    tags:     ['JavaScript', 'Service Worker', 'IndexedDB'],
    problem:  'Most task apps are overengineered — they load megabytes of JS just to show you a to-do list. Users complained that competitors felt sluggish on slower devices and used too much battery.',
    solution: 'I built from scratch in vanilla JS with zero runtime dependencies. A Service Worker handles offline sync; IndexedDB stores the data locally. The entire app ships in 14 KB gzipped — faster than most framework boot sequences.',
    outcome:  '8,000 active users, a 100/100 Lighthouse score, and a sub-1s time-to-interactive on 3G. Featured in the Chrome Developers blog.',
    link:     '#',
  },
  papercli: {
    label:    'CLI / npm',
    title:    'PaperCLI',
    desc:     'Zero-dependency project scaffolding tool with opinionated defaults. Ships your first commit in seconds, not minutes.',
    metrics:  [{ val: '12 k', label: 'weekly installs' }, { val: '0', label: 'deps' }, { val: '98%', label: 'satisfaction' }],
    tags:     ['Node.js', 'Open Source'],
    problem:  'Every team I worked with wasted the first hour of a new project on the same yak-shaving: ESLint config, Prettier, TypeScript setup, CI boilerplate. That time adds up.',
    solution: 'A single CLI command that asks three questions and generates a production-ready project with sane defaults. No dependencies — just Node.js. The entire source fits in one file.',
    outcome:  '12,000 weekly npm installs, a 98% satisfaction rating from a survey of 400+ users, and contributions from 23 developers around the world.',
    link:     '#',
  },
  foldline: {
    label:    'Backend / API',
    title:    'Foldline API',
    desc:     'High-throughput REST + GraphQL API serving a document-heavy SaaS. Built for sub-20 ms p99 with zero cold starts.',
    metrics:  [{ val: '1 M+', label: 'req / day' }, { val: '18 ms', label: 'p99' }, { val: '99.98%', label: 'uptime' }],
    tags:     ['Go', 'GraphQL', 'Postgres', 'Redis'],
    problem:  'The client had an existing Node.js API that was hitting ~300 ms p99 under load, causing user-visible slowdowns during document exports. They needed a replacement with room to grow.',
    solution: 'Rewrote the critical paths in Go, behind the same GraphQL interface so the frontend needed zero changes. Introduced connection pooling with pgxpool, query result caching with Redis, and distributed tracing from day one.',
    outcome:  'p99 latency dropped from 300 ms to 18 ms. The service has maintained 99.98% uptime over 14 months and handles 1M+ requests per day without autoscaling.',
    link:     '#',
  },
  craftui: {
    label:    'Design System',
    title:    'CraftUI',
    desc:     'Accessible, headless component library. Every component ships with full ARIA support, keyboard navigation, and TypeScript types.',
    metrics:  [{ val: '60+', label: 'components' }, { val: 'AA', label: 'WCAG 2.1' }, { val: '2.1 k', label: 'GitHub stars' }],
    tags:     ['TypeScript', 'React', 'Radix', 'Storybook'],
    problem:  'The team was rebuilding the same Modal, Dropdown, and DatePicker in every project. Each implementation had subtly different accessibility bugs. There was no shared source of truth.',
    solution: 'Built a headless library on top of Radix primitives, styled with CSS variables so teams can theme it without fighting specificity. Every component is tested with axe-core and a real screen reader.',
    outcome:  'Adopted by 5 internal teams, open-sourced, and reached 2,100 GitHub stars within the first year. Reduced per-project component work from ~3 weeks to ~1 day.',
    link:     '#',
  },
};

/* ─── SCROLL REVEAL ──────────────────────────────────────── */
function initScrollReveal() {
  const targets = $$('.reveal');
  if (!targets.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  targets.forEach((el) => io.observe(el));
}

/* ─── CSS 3D TILT ────────────────────────────────────────── */
function initTilt() {
  $$('.js-tilt').forEach((el) => {
    const max = parseFloat(el.dataset.tiltMax ?? '10');

    el.addEventListener('mousemove', (e) => {
      const r  = el.getBoundingClientRect();
      const dx = ((e.clientX - r.left) / r.width  - .5) * 2;
      const dy = ((e.clientY - r.top)  / r.height - .5) * 2;
      el.style.transform = `perspective(800px) rotateX(${(-dy * max).toFixed(2)}deg) rotateY(${(dx * max).toFixed(2)}deg)`;
    }, { passive: true });

    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* ─── HERO PARALLAX ──────────────────────────────────────── */
function initHeroParallax() {
  const layers = [
    { el: $('.layer-mountains'),   speed: .04 },
    { el: $('.layer-hills-back'),  speed: .07 },
    { el: $('.layer-hills-mid'),   speed: .10 },
    { el: $('.layer-hills-front'), speed: .14 },
    { el: $('.layer-ground'),      speed: .18 },
  ].filter((l) => l.el);

  if (!layers.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      layers.forEach(({ el, speed }) => {
        el.style.transform = `translateY(${(y * speed).toFixed(2)}px)`;
      });
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
}

/* ─── WIDGET / CRANE MOUSE PARALLAX ─────────────────────── */
function initMouseParallax() {
  const items = $$('.crane-wrap');
  if (!items.length) return;

  document.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth  - .5) * 2;
    const ny = (e.clientY / window.innerHeight - .5) * 2;

    items.forEach((el, i) => {
      const f = (i + 1) * 8;
      el.style.translate = `${(nx * f).toFixed(2)}px ${(ny * f * .6).toFixed(2)}px`;
    });
  }, { passive: true });
}

/* ─── ACTIVE NAV HIGHLIGHT ───────────────────────────────── */
function initActiveNav() {
  const sections = $$('section[id]');
  const links    = $$('.nav-link');

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((a) => {
            a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`);
          });
        }
      });
    },
    { threshold: .45 }
  );

  sections.forEach((s) => io.observe(s));
}

/* ─── MOBILE NAV ─────────────────────────────────────────── */
function initMobileNav() {
  const burger = $('.nav-burger');
  const menu   = $('#mobile-menu');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    menu.hidden = open;
  });

  // Close on link click
  $$('.mobile-link', menu).forEach((a) => {
    a.addEventListener('click', () => {
      burger.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    });
  });
}

/* ─── MODAL (case study) ─────────────────────────────────── */
function initModal() {
  const overlay = $('#modal-overlay');
  const closeBtn = $('#modal-close');
  if (!overlay) return;

  let lastFocused = null;

  function openModal(projectId) {
    const data = PROJECTS[projectId];
    if (!data) return;

    // Populate
    $('#modal-eyebrow').textContent  = data.label;
    $('#modal-title').textContent    = data.title;
    $('#modal-desc').textContent     = data.desc;
    $('#modal-problem').textContent  = data.problem;
    $('#modal-solution').textContent = data.solution;
    $('#modal-outcome').textContent  = data.outcome;

    // Metrics
    const metricsEl = $('#modal-metrics');
    metricsEl.innerHTML = data.metrics
      .map((m) => `
        <div class="metric">
          <span class="metric-val">${m.val}</span>
          <span class="metric-label">${m.label}</span>
        </div>`)
      .join('');

    // Tags
    const tagsEl = $('#modal-tags');
    tagsEl.innerHTML = data.tags
      .map((t) => `<span class="tag">${t}</span>`)
      .join('');

    // Link
    const linkEl = $('#modal-link');
    linkEl.href = data.link;

    // Open with View Transitions if available
    const show = () => {
      overlay.hidden = false;
      overlay.removeAttribute('hidden');
      lastFocused = document.activeElement;
      // Move focus to close button
      setTimeout(() => closeBtn.focus(), 50);
    };

    if (document.startViewTransition) {
      document.startViewTransition(show);
    } else {
      show();
    }
  }

  function closeModal() {
    const hide = () => {
      overlay.hidden = true;
      if (lastFocused) lastFocused.focus();
    };

    if (document.startViewTransition) {
      document.startViewTransition(hide);
    } else {
      hide();
    }
  }

  // Open on card click / Enter / Space
  $$('.project-card').forEach((card) => {
    const handler = () => openModal(card.dataset.project);
    card.addEventListener('click', handler);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
  });

  // Close
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hidden) closeModal();
  });

  // Trap focus inside modal
  overlay.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = $$('button, a, input, textarea, [tabindex]:not([tabindex="-1"])', overlay);
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });
}

/* ─── CONTACT FORM ────────────────────────────────────────── */
function initContactForm() {
  const form   = $('#contact-form');
  const status = $('#form-status');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';
    status.textContent = '';

    // Simulate send (replace with Formspree endpoint in production)
    await new Promise((r) => setTimeout(r, 900));

    btn.disabled = false;
    btn.textContent = 'Send message';
    form.reset();
    status.textContent = 'Message sent — I'll get back to you soon.';
    status.style.color = 'var(--green)';
    setTimeout(() => { status.textContent = ''; }, 6000);
  });
}

/* ─── NAV SHADOW ON SCROLL ───────────────────────────────── */
function initNavShadow() {
  const nav = $('.nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 20
      ? '5px 8px 0 rgba(22,18,14,.20), 10px 18px 0 rgba(22,18,14,.08)'
      : '';
  }, { passive: true });
}

/* ─── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initTilt();
  initHeroParallax();
  initMouseParallax();
  initActiveNav();
  initMobileNav();
  initModal();
  initContactForm();
  initNavShadow();
});
