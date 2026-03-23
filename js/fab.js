/* ============================================================
   fab.js
   Radial FAB navigation + floating refresh button.

   showRefresh() / hideRefresh() — called by demo.js and
   query.js when demos start and reset. The refresh button
   tracks which section is active and resets it.
   ============================================================ */

const fabContainer = document.getElementById('fabContainer');
const fabTrigger   = document.getElementById('fabTrigger');
const fabBackdrop  = document.getElementById('fabBackdrop');
const fabRefresh   = document.getElementById('fabRefresh');

/* Active section for reset routing */
let activeDemoSection = null;
let resetCallbacks = {};

/* ------ Open / Close ------ */

function openFab() {
  fabContainer.classList.add('fab-container--open');
  fabBackdrop.classList.add('fab-backdrop--visible');
  fabTrigger.setAttribute('aria-expanded', 'true');
}

function closeFab() {
  fabContainer.classList.remove('fab-container--open');
  fabBackdrop.classList.remove('fab-backdrop--visible');
  fabTrigger.setAttribute('aria-expanded', 'false');
}

fabTrigger.addEventListener('click', () =>
  fabContainer.classList.contains('fab-container--open') ? closeFab() : openFab()
);
fabBackdrop.addEventListener('click', closeFab);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeFab(); });

/* ------ Scroll to section ------ */

document.querySelectorAll('.fab-item').forEach(item => {
  item.addEventListener('click', () => {
    const target = document.getElementById(item.getAttribute('data-target'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    closeFab();
  });
});

/* ------ Active section highlight ------ */

const sections = document.querySelectorAll('.section[id]');
const fabItems  = document.querySelectorAll('.fab-item');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      fabItems.forEach(i => i.classList.remove('fab-item--active'));
      const active = document.querySelector(
        `.fab-item[data-target="${entry.target.id}"]`
      );
      if (active) active.classList.add('fab-item--active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ------ Floating refresh button ------ */

fabRefresh.addEventListener('click', () => {
  /* Spin animation */
  fabRefresh.classList.add('fab-refresh--spinning');
  fabRefresh.addEventListener('animationend', () => {
    fabRefresh.classList.remove('fab-refresh--spinning');
  }, { once: true });

  /* Call the active section's reset */
  if (activeDemoSection && resetCallbacks[activeDemoSection]) {
    resetCallbacks[activeDemoSection]();
  }
});

/* ------ Public API ------ */

export function showRefresh(sectionId, resetFn) {
  activeDemoSection = sectionId;
  resetCallbacks[sectionId] = resetFn;
  fabRefresh.classList.add('fab-refresh--visible');
}

export function hideRefresh(sectionId) {
  if (activeDemoSection === sectionId) {
    fabRefresh.classList.remove('fab-refresh--visible');
    activeDemoSection = null;
  }
}
