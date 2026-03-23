/* ============================================================
   fab.js — radial FAB nav + floating refresh button
   DOM lookups deferred to function calls so this module
   can be imported before the DOM is fully ready.
   ============================================================ */

let _fabContainer, _fabTrigger, _fabBackdrop, _fabRefresh;

function dom() {
  if (!_fabContainer) {
    _fabContainer = document.getElementById('fabContainer');
    _fabTrigger   = document.getElementById('fabTrigger');
    _fabBackdrop  = document.getElementById('fabBackdrop');
    _fabRefresh   = document.getElementById('fabRefresh');
  }
  return { fabContainer: _fabContainer, fabTrigger: _fabTrigger,
           fabBackdrop: _fabBackdrop, fabRefresh: _fabRefresh };
}

let activeDemoSection = null;
let resetCallbacks = {};

function openFab() {
  const d = dom();
  d.fabContainer.classList.add('fab-container--open');
  d.fabBackdrop.classList.add('fab-backdrop--visible');
  d.fabTrigger.setAttribute('aria-expanded', 'true');
}

function closeFab() {
  const d = dom();
  d.fabContainer.classList.remove('fab-container--open');
  d.fabBackdrop.classList.remove('fab-backdrop--visible');
  d.fabTrigger.setAttribute('aria-expanded', 'false');
}

document.addEventListener('DOMContentLoaded', () => {
  const d = dom();

  d.fabTrigger.addEventListener('click', () =>
    d.fabContainer.classList.contains('fab-container--open') ? closeFab() : openFab()
  );

  d.fabBackdrop.addEventListener('click', closeFab);

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeFab(); });

  document.querySelectorAll('.fab-item').forEach(item => {
    item.addEventListener('click', () => {
      const target = document.getElementById(item.getAttribute('data-target'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeFab();
    });
  });

  const sections = document.querySelectorAll('.section[id]');
  const fabItems = document.querySelectorAll('.fab-item');

  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fabItems.forEach(i => i.classList.remove('fab-item--active'));
        const active = document.querySelector(
          `.fab-item[data-target="${entry.target.id}"]`
        );
        if (active) active.classList.add('fab-item--active');
      }
    });
  }, { threshold: 0.4 }).observe(sections[0]);

  sections.forEach(s => new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fabItems.forEach(i => i.classList.remove('fab-item--active'));
        const active = document.querySelector(
          `.fab-item[data-target="${entry.target.id}"]`
        );
        if (active) active.classList.add('fab-item--active');
      }
    });
  }, { threshold: 0.4 }).observe(s));

  d.fabRefresh.addEventListener('click', () => {
    d.fabRefresh.classList.add('fab-refresh--spinning');
    d.fabRefresh.addEventListener('animationend', () => {
      d.fabRefresh.classList.remove('fab-refresh--spinning');
    }, { once: true });
    if (activeDemoSection && resetCallbacks[activeDemoSection]) {
      resetCallbacks[activeDemoSection]();
    }
  });
});

export function showRefresh(sectionId, resetFn) {
  activeDemoSection = sectionId;
  resetCallbacks[sectionId] = resetFn;
  const d = dom();
  if (d.fabRefresh) d.fabRefresh.classList.add('fab-refresh--visible');
}

export function hideRefresh(sectionId) {
  if (activeDemoSection === sectionId) {
    const d = dom();
    if (d.fabRefresh) d.fabRefresh.classList.remove('fab-refresh--visible');
    activeDemoSection = null;
  }
}
