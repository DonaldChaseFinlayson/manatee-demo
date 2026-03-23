/* ============================================================
   theme.js
   Manages the light/dark mode toggle.

   Strategy:
   - On load, check localStorage for a saved preference.
     If none, default to light mode.
   - Toggling sets data-theme="dark" or data-theme="light"
     on the <html> element. CSS variables in main.css respond
     to this attribute to swap color tokens across the whole page.
   - The chosen theme is saved to localStorage so it persists
     across page loads and navigation between demos.
   - The toggle button icon swaps between sun (light) and
     moon (dark) to reflect the current state.
   ============================================================ */


/* ------------------------------------------------------------
   SVG ICONS
   Inline SVG paths for sun and moon.
   Defined as strings so we can swap them in JS without a
   separate icon file or font dependency.
   ------------------------------------------------------------ */

const ICON_SUN = `
  <circle cx="12" cy="12" r="5"/>
  <line x1="12" y1="1" x2="12" y2="3"/>
  <line x1="12" y1="21" x2="12" y2="23"/>
  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
  <line x1="1" y1="12" x2="3" y2="12"/>
  <line x1="21" y1="12" x2="23" y2="12"/>
  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
`;

const ICON_MOON = `
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
`;


/* ------------------------------------------------------------
   applyTheme(theme)
   Sets the data-theme attribute on <html> and updates the
   toggle button icon to reflect the current state.

   theme: 'light' | 'dark'
   ------------------------------------------------------------ */

function applyTheme(theme) {
  // Set the attribute that CSS variables respond to
  document.documentElement.setAttribute('data-theme', theme);

  // Update the button icon — sun means "switch to light",
  // moon means "switch to dark". We show the opposite of
  // the current theme so the icon describes the action.
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const svg = btn.querySelector('svg');
  if (theme === 'dark') {
    // Currently dark — show sun icon (click to go light)
    svg.innerHTML = ICON_SUN;
    btn.setAttribute('aria-label', 'Switch to light mode');
    btn.setAttribute('title', 'Switch to light mode');
  } else {
    // Currently light — show moon icon (click to go dark)
    svg.innerHTML = ICON_MOON;
    btn.setAttribute('aria-label', 'Switch to dark mode');
    btn.setAttribute('title', 'Switch to dark mode');
  }
}


/* ------------------------------------------------------------
   toggleTheme()
   Called when the button is clicked. Reads the current theme,
   flips it, saves to localStorage, and applies.
   ------------------------------------------------------------ */

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem('manatee-theme', next);
  applyTheme(next);
}


/* ------------------------------------------------------------
   INIT
   Run immediately when the script loads (deferred via
   type="module" in the HTML, so DOM is ready).
   Read saved preference and apply it before the page paints
   to avoid a flash of the wrong theme.
   ------------------------------------------------------------ */

const saved = localStorage.getItem('manatee-theme') || 'light';
applyTheme(saved);

// Wire the button
const toggleBtn = document.getElementById('themeToggle');
if (toggleBtn) {
  toggleBtn.addEventListener('click', toggleTheme);
}

// Export so other modules can read the current theme if needed
export { applyTheme, toggleTheme };
