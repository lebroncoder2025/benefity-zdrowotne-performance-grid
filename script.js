/* Performance Grid — Interactions */
(function () {
  'use strict';

  /* ── Nav toggle ─────────────────────────── */
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
    });
  }

  /* ── Scroll reveal ──────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  /* ── Counter animation (trust row) ─────── */
  const trustItems = document.querySelectorAll('.trust-item strong');
  if (trustItems.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const text = el.textContent.trim();
        const num = parseInt(text, 10);
        if (isNaN(num)) { cio.unobserve(el); return; }
        const suffix = text.replace(/[\d]/g, '');
        const dur = 1000;
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(ease * num) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    trustItems.forEach(el => cio.observe(el));
  }

  /* ── Header hide/show ───────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    let last = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > last && y > 300) header.style.transform = 'translateY(-100%)';
      else header.style.transform = 'translateY(0)';
      header.style.transition = 'transform .3s ease';
      last = y;
    }, { passive: true });
  }

  /* ── Staggered card reveals ─────────────── */
  const panels = document.querySelectorAll('.panel, .benefit-card, .c-card');
  if (panels.length && 'IntersectionObserver' in window) {
    const pio = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          e.target.style.transitionDelay = (i * 0.08) + 's';
          e.target.classList.add('is-visible');
          pio.unobserve(e.target);
        }
      });
    }, { threshold: 0.05 });
    panels.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity .5s ease, transform .5s ease';
      pio.observe(el);
    });
  }

  /* ── Smooth anchor scroll ───────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (nav && nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
        }
      }
    });
  });
})();
