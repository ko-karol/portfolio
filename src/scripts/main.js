/**
 * main.js — orchestrator (ES module)
 *
 * Responsibilities:
 *  1. Mark js-ready immediately so CSS reveals work
 *  2. Load scene.js dynamically after first paint
 *  3. Scroll reveal, active nav, mobile nav
 *  4. Project detail — GSAP-powered inline split (no overlay, no fixed panel)
 *  5. Contact form
 */

import { gsap } from 'gsap';

'use strict';

// ─── SHARED STATE ─────────────────────────────────────────────
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
    label:    'Personal Project',
    title:    'Repwise',
    desc:     'React Native app for tracking strength training with natural language input.',
    metrics:  [],
    tags:     ['React Native', 'TypeScript', 'SQLite'],
    problem:  'Logging workouts on phones is tedious — too many taps, too much waiting.',
    solution: 'Built a simple parser that understands plain text like "bench 3x5 80kg" and converts it to structured data. SQLite keeps everything local and fast.',
    outcome:  'Quick workout logging that works offline. Still in development.',
    link:     'https://github.com/ko-karol/strength-app',
  },
  lifeofdeath: {
    label:    'Experiment',
    title:    'The Life of Death',
    desc:     'Interactive web tribute for an animated short film. No frameworks.',
    metrics:  [],
    tags:     ['HTML', 'CSS', 'JavaScript'],
    problem:  'Wanted to see how far I could push storytelling with just the basics.',
    solution: 'Used semantic HTML for structure, CSS for rhythm and animations, and minimal JS for interactions. No build step, no dependencies.',
    outcome:  'A lightweight, fast-loading tribute that respects the source material.',
    link:     'https://ko-karol.github.io/life-of-death-tribute/',
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

// ─── PROJECT DETAIL — desktop inline / mobile modal ──────────
/*
 * Desktop: inline split panel (GSAP width animation)
 * Mobile: centered modal overlay
 */
function initProjectDetail() {
  const layout    = $('#project-layout');
  const listEl    = $('#project-list');
  const detailEl  = $('#project-detail');
  const backBtn   = $('#project-detail-back');
  const modalEl   = $('#modal');
  const backdropEl = $('#modal-backdrop');
  const modalCloseBtn = $('#modal-close');

  if (!layout || !listEl || !detailEl) return;

  let openProjectId = null;
  let lastFocused   = null;
  const isMobile    = () => window.innerWidth <= 768;

  // ── Populate detail content ──────────────────────────────────
  function populate(projectId, useModal = false) {
    const data = PROJECTS[projectId];
    if (!data) return;

    const prefix = useModal ? '#sheet-' : '#detail-';
    $(prefix + 'eyebrow').textContent  = data.label;
    $(prefix + 'title').textContent    = data.title;
    $(prefix + 'desc').textContent     = data.desc;
    $(prefix + 'problem').textContent  = data.problem;
    $(prefix + 'solution').textContent = data.solution;
    $(prefix + 'outcome').textContent  = data.outcome;
    $(prefix + 'link').href            = data.link;

    $(prefix + 'metrics').innerHTML = data.metrics
      .map(m => `<div class="metric">
        <span class="metric-val">${m.val}</span>
        <span class="metric-label">${m.label}</span>
      </div>`).join('');

    $(prefix + 'tags').innerHTML = data.tags
      .map(t => `<span class="tag">${t}</span>`).join('');
  }

  // ── Open ─────────────────────────────────────────────────────
  function openDetail(projectId) {
    if (!PROJECTS[projectId]) return;

    lastFocused = document.activeElement;

    $$('.project-card', layout).forEach(c =>
      c.classList.toggle('is-active', c.dataset.project === projectId)
    );

    populate(projectId, isMobile());
    openProjectId = projectId;

    if (isMobile()) {
      openModal();
    } else {
      openInlinePanel();
    }
  }

  function openModal() {
    if (!modalEl || !backdropEl) return;

    modalEl.setAttribute('aria-hidden', 'false');
    backdropEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Force reflow
    void modalEl.offsetHeight;

    modalEl.classList.add('is-open');
    backdropEl.classList.add('is-open');
  }

  function openInlinePanel() {
    layout.classList.add('detail-open');
    detailEl.setAttribute('aria-hidden', 'false');

    const inner = $('.project-detail-inner', detailEl);
    const totalWidth  = layout.offsetWidth;
    const listTarget  = Math.min(320, totalWidth * 0.35);
    const detailTarget = totalWidth - listTarget;

    gsap.set(listEl, { width: listEl.offsetWidth });
    gsap.set(detailEl, { width: 0, opacity: 0 });
    gsap.set(inner, { x: 40, opacity: 0 });

    const tl = gsap.timeline({ onComplete: () => backBtn && backBtn.focus() });

    tl.to(listEl, { width: listTarget, duration: 0.5, ease: 'power3.inOut' })
      .to(detailEl, { width: detailTarget, opacity: 1, duration: 0.5, ease: 'power3.inOut' }, '<')
      .to(inner, { x: 0, opacity: 1, duration: 0.38, ease: 'power2.out' }, '-=0.18');
  }

  // ── Close ────────────────────────────────────────────────────
  function closeDetail() {
    if (!openProjectId) return;

    $$('.project-card', layout).forEach(c => c.classList.remove('is-active'));

    if (isMobile()) {
      closeModal();
    } else {
      closeInlinePanel();
    }
  }

  function closeModal() {
    if (!modalEl || !backdropEl) return;

    modalEl.classList.remove('is-open');
    backdropEl.classList.remove('is-open');

    setTimeout(() => {
      modalEl.setAttribute('aria-hidden', 'true');
      backdropEl.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      openProjectId = null;
      if (lastFocused) lastFocused.focus();
    }, 250);
  }

  function closeInlinePanel() {
    const inner = $('.project-detail-inner', detailEl);

    const tl = gsap.timeline({
      onComplete: () => {
        layout.classList.remove('detail-open');
        gsap.set([listEl, detailEl, inner], { clearProps: 'all' });
        openProjectId = null;
        if (lastFocused) lastFocused.focus();
      }
    });

    tl.to(inner, { x: 30, opacity: 0, duration: 0.22, ease: 'power2.in' })
      .to(detailEl, { width: 0, opacity: 0, duration: 0.42, ease: 'power3.inOut' }, '-=0.05')
      .to(listEl, { width: layout.offsetWidth, duration: 0.42, ease: 'power3.inOut' }, '<');
  }

  // ── Event listeners ───────────────────────────────────────────
  $$('.project-card', layout).forEach(card => {
    if (card.classList.contains('client-project')) return;
    card.addEventListener('click', () => openDetail(card.dataset.project));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDetail(card.dataset.project);
      }
    });
  });

  backBtn && backBtn.addEventListener('click', closeDetail);
  modalCloseBtn && modalCloseBtn.addEventListener('click', closeDetail);
  backdropEl && backdropEl.addEventListener('click', e => {
    // Only close if clicking the backdrop itself, not the modal
    if (e.target === backdropEl) closeDetail();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && openProjectId) closeDetail();
  });

  // Recalculate widths on resize (desktop only)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!openProjectId || isMobile()) return;
      const totalWidth = layout.offsetWidth;
      const listTarget = Math.min(320, totalWidth * 0.35);
      const detailTarget = totalWidth - listTarget;
      gsap.set(listEl, { width: listTarget });
      gsap.set(detailEl, { width: detailTarget });
    }, 150);
  }, { passive: true });
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

    try {
      const res = await fetch('https://formspree.io/f/mbdawelb', {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (res.ok) {
        form.reset();
        status.textContent = "Message sent — I'll get back to you soon.";
        status.style.color = 'var(--green)';
      } else {
        const data = await res.json();
        status.textContent = Object.hasOwn(data, 'errors')
          ? data.errors.map(err => err.message).join(', ')
          : 'Oops! There was a problem submitting your form.';
        status.style.color = 'var(--red)';
      }
    } catch {
      status.textContent = 'Oops! There was a problem submitting your form.';
      status.style.color = 'var(--red)';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send message';
      setTimeout(() => { status.textContent = ''; }, 6000);
    }
  });
}

// ─── THREE.JS DYNAMIC LOAD ────────────────────────────────────
function initThree() {
  const canvas = $('#bg-canvas');
  if (!canvas) return;

  const probe = document.createElement('canvas');
  const hasWebGL = !!(probe.getContext('webgl2') || probe.getContext('webgl'));
  if (!hasWebGL) { document.body.classList.add('no-webgl'); return; }

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
  initProjectDetail();
  initContactForm();
  initThree();
});
