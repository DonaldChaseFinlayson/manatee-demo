/* ============================================================
   feed.js
   Handles interactivity for the three-state badge section.

   Currently this is lightweight — tooltips are handled purely
   in CSS via :hover. This file populates the tooltip text
   from data-tooltip attributes so the strings live in HTML,
   not scattered across CSS content: '' values or JS strings.

   As the feed section grows (e.g. clickable badge states,
   animated transitions between states) this file expands
   while feed.css and index.html stay stable.
   ============================================================ */


/* ------------------------------------------------------------
   populateTooltips()
   Reads the data-tooltip attribute from each badge and writes
   it into the badge's .manatee-badge__tooltip child element.

   Why do it this way instead of CSS content: attr(data-tooltip)?
   Browser support for attr() in content is limited. This JS
   approach works everywhere and keeps the text in the HTML
   where it's easy to find and edit.
   ------------------------------------------------------------ */

function populateTooltips() {
  // Select every badge that has a data-tooltip attribute
  const badges = document.querySelectorAll('.manatee-badge[data-tooltip]');

  badges.forEach(badge => {
    const tooltipText = badge.getAttribute('data-tooltip');
    const tooltipEl   = badge.querySelector('.manatee-badge__tooltip');

    if (tooltipEl && tooltipText) {
      tooltipEl.textContent = tooltipText;
    }
  });
}


/* ------------------------------------------------------------
   highlightActiveNavLink()
   Updates the nav tab appearance as the user scrolls between
   the two demo sections, so the active section is always
   reflected in the nav.

   Uses IntersectionObserver — a browser API that fires a
   callback when an element enters or leaves the viewport.
   More efficient than listening to scroll events.
   ------------------------------------------------------------ */

function highlightActiveNavLink() {
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.demo-nav__link');

  // No sections or nav links — nothing to do
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Remove active class from all links
          navLinks.forEach(link => {
            link.classList.remove('demo-nav__link--active');
          });

          // Add active class to the link pointing at this section
          const activeLink = document.querySelector(
            `.demo-nav__link[href="#${entry.target.id}"]`
          );
          if (activeLink) {
            activeLink.classList.add('demo-nav__link--active');
          }
        }
      });
    },
    {
      // Fire when the section is at least 40% visible
      threshold: 0.4
    }
  );

  sections.forEach(section => observer.observe(section));
}


/* ------------------------------------------------------------
   Init — run both functions when the DOM is ready.
   Because this script is loaded as type="module" at the bottom
   of <body>, the DOM is already parsed when this runs —
   no need for a DOMContentLoaded wrapper.
   ------------------------------------------------------------ */

populateTooltips();
highlightActiveNavLink();
