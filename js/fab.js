/* ============================================================
   fab.js
   Radial FAB navigation + contextual reset buttons.

   Two responsibilities:
   1. FAB radial menu — open/close, scroll to section, highlight
      active section based on scroll position.
   2. Reset coordination — showReset/hideReset called by
      demo.js and query.js when demos start/finish.
   ============================================================ */


/* ------------------------------------------------------------
   DOM
   ------------------------------------------------------------ */

const fabContainer = document.getElementById('fabContainer');
const fabTrigger   = document.getElementById('fabTrigger');
const fabBackdrop  = document.getElementById('fabBackdrop');


/* ------------------------------------------------------------
   OPEN / CLOSE
   ------------------------------------------------------------ */

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

fabTrigger.addEventListener('click', () => {
  fabContainer.classList.contains('fab-container--open') ? closeFab() : openFab();
});

fabBackdrop.addEventListener('click', closeFab);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeFab();
});


/* ------------------------------------------------------------
   SCROLL TO SECTION
   Each FAB item scrolls to its section and closes the menu.
   ------------------------------------------------------------ */

document.querySelectorAll('.fab-item').forEach(item => {
  item.addEventListener('click', () => {
    const targetId = item.getAttribute('data-target');
    const target   = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    closeFab();
  });
});


/* ------------------------------------------------------------
   ACTIVE SECTION HIGHLIGHT
   IntersectionObserver watches the three sections and updates
   which FAB item appears active as the user scrolls.
   ------------------------------------------------------------ */

const sections = document.querySelectorAll('.section[id]');
const fabItems = document.querySelectorAll('.fab-item');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      fabItems.forEach(item => item.classList.remove('fab-item--active'));
      const active = document.querySelector(
        `.fab-item[data-target="${entry.target.id}"]`
      );
      if (active) active.classList.add('fab-item--active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));


/* ------------------------------------------------------------
   CONTEXTUAL RESET BUTTONS
   Each section has a .section-reset button.
   showReset(id) makes it visible; hideReset(id) hides it.
   Called by demo.js and query.js at the right moments.
   ------------------------------------------------------------ */

export function showReset(sectionId) {
  const btn = document.querySelector(`#${sectionId} .section-reset`);
  if (btn) btn.classList.add('section-reset--visible');
}

export function hideReset(sectionId) {
  const btn = document.querySelector(`#${sectionId} .section-reset`);
  if (btn) btn.classList.remove('section-reset--visible');
}
