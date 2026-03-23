/* ============================================================
   utils.js
   Generic utility functions. These know nothing about Manatee
   or the demo — they are pure tools that could be used in any
   project. Keeping them separate means demo.js stays focused
   on demo logic, not low-level mechanics.

   All functions are exported so demo.js can import them.
   ============================================================ */


/* ------------------------------------------------------------
   sleep(ms)
   Returns a Promise that resolves after `ms` milliseconds.
   Used with async/await to pause between animation steps
   without blocking the browser's UI thread.

   Usage:
     await sleep(500); // pause for half a second
   ------------------------------------------------------------ */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


/* ------------------------------------------------------------
   timestamp()
   Returns a human-readable elapsed time string like "1.34s".
   Uses performance.now() which counts milliseconds from when
   the page loaded — more precise than Date.now().

   Usage:
     document.getElementById('t1').textContent = timestamp();
   ------------------------------------------------------------ */
export function timestamp() {
  return (performance.now() / 1000).toFixed(2) + 's';
}


/* ------------------------------------------------------------
   animateValue(options)
   Smoothly animates a numeric value from `from` to `to`
   over `duration` milliseconds using requestAnimationFrame.

   requestAnimationFrame is the correct way to animate in
   browsers — it syncs with the display refresh rate (usually
   60fps) and automatically pauses when the tab is hidden.

   The easing function used is "ease-out cubic" — starts fast,
   decelerates at the end. Feels natural for score changes.

   Options:
     from     {number}   Starting value
     to       {number}   Ending value
     duration {number}   Duration in ms
     decimals {number}   Decimal places to display (default: 3)
     onUpdate {function} Called each frame with the current value
     onDone   {function} Called once when animation completes

   Usage:
     animateValue({
       from: 0.333,
       to: 0.621,
       duration: 1200,
       decimals: 3,
       onUpdate: (v) => el.textContent = 'E[trust] = ' + v,
       onDone:   ()  => el.classList.add('lit')
     });
   ------------------------------------------------------------ */
export function animateValue({ from, to, duration, decimals = 3, onUpdate, onDone }) {
  const startTime = performance.now();

  function easeOutCubic(t) {
    // t is a value 0..1 representing progress through the animation.
    // This formula makes it start fast and slow down at the end.
    return 1 - Math.pow(1 - t, 3);
  }

  function frame(currentTime) {
    // How far through the animation are we? (0 = just started, 1 = done)
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = easeOutCubic(progress);

    // Interpolate between from and to
    const currentValue = from + (to - from) * eased;

    // Call the update handler with the formatted value
    if (onUpdate) {
      onUpdate(currentValue.toFixed(decimals));
    }

    if (progress < 1) {
      // Not done yet — schedule the next frame
      requestAnimationFrame(frame);
    } else {
      // Animation complete
      if (onDone) onDone();
    }
  }

  requestAnimationFrame(frame);
}


/* ------------------------------------------------------------
   flash(element, duration)
   Briefly makes an element visible then fades it out.
   Used for the green flash on the phone screens at tap moment.

   The element should have opacity: 0 by default in CSS.
   This function snaps it to 1 then lets CSS transition handle
   the fade back down.

   Usage:
     flash(document.getElementById('flashA'));
   ------------------------------------------------------------ */
export function flash(element, duration = 180) {
  element.style.opacity = '1';
  setTimeout(() => {
    element.style.opacity = '0';
  }, duration);
}


/* ------------------------------------------------------------
   setStatusRow(element, state)
   Updates a status row's CSS modifier class and SVG icon
   to reflect one of three states: pending, active, done.

   The SVG paths are hardcoded here — they're pure presentational
   data that belongs with the UI logic, not in the HTML.

   States:
     'pending' — gray clock icon, faint text
     'active'  — amber spinner icon, dark text
     'done'    — teal checkmark icon, teal text

   Usage:
     setStatusRow(document.getElementById('s1'), 'active');
   ------------------------------------------------------------ */
export function setStatusRow(element, state) {
  // Remove all state modifier classes, then add the new one.
  // This is safer than toggling — no stale classes left behind.
  element.classList.remove(
    'status-row--pending',
    'status-row--active',
    'status-row--done'
  );
  element.classList.add(`status-row--${state}`);

  // Update the SVG icon to match the state
  const svg = element.querySelector('svg');

  const icons = {
    pending: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/>',
    active:  '<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>',
    done:    '<path d="M20 6L9 17l-5-5"/>'
  };

  svg.innerHTML = icons[state] || icons.pending;
}
