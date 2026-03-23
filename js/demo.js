/* ============================================================
   demo.js
   Orchestrates the NFC handshake demo animation.

   This file imports generic tools from utils.js and uses them
   to control the specific elements in index.html. It knows
   about Manatee's UI; utils.js does not.

   Pattern used: async/await with a running flag to prevent
   double-triggering if the user clicks the button twice.
   ============================================================ */

import { sleep, timestamp, animateValue, flash, setStatusRow } from './utils.js';


/* ------------------------------------------------------------
   DOM REFERENCES
   Grab all the elements we need once at module load time.
   Storing references avoids calling getElementById repeatedly
   inside animation loops — a small but good habit.
   ------------------------------------------------------------ */

const dom = {
  // Buttons
  tapBtn:   document.getElementById('tapBtn'),
  resetBtn: document.getElementById('resetBtn'),

  // Phone wrappers (animated on approach/retreat)
  phoneWrapA: document.getElementById('phoneWrapA'),
  phoneWrapB: document.getElementById('phoneWrapB'),

  // Flash overlays
  flashA: document.getElementById('flashA'),
  flashB: document.getElementById('flashB'),

  // NFC animation zones
  nfcA: document.getElementById('nfcA'),
  nfcB: document.getElementById('nfcB'),

  // Avatars and verification rings
  ringA: document.getElementById('ringA'),
  ringB: document.getElementById('ringB'),

  // Badges
  badgeA: document.getElementById('badgeA'),

  // ZK proof pills
  proofA: document.getElementById('proofA'),
  proofB: document.getElementById('proofB'),

  // Score bars and readouts
  scoreFillA:   document.getElementById('scoreFillA'),
  scoreNumberA: document.getElementById('scoreNumberA'),
  scoreFillB:   document.getElementById('scoreFillB'),
  scoreNumberB: document.getElementById('scoreNumberB'),

  // Status rows
  step1: document.getElementById('step1'),
  step2: document.getElementById('step2'),
  step3: document.getElementById('step3'),
  step4: document.getElementById('step4'),

  // Timestamp readouts
  time1: document.getElementById('time1'),
  time2: document.getElementById('time2'),
  time3: document.getElementById('time3'),
  time4: document.getElementById('time4'),

  // Center connector
  connectorIcon:  document.getElementById('connectorIcon'),
  connectorLabel: document.getElementById('connectorLabel'),
};


/* ------------------------------------------------------------
   STATE
   A single flag to prevent the animation running twice if
   the user clicks the button before the reset completes.
   ------------------------------------------------------------ */

let isRunning = false;


/* ------------------------------------------------------------
   startDemo()
   The main animation sequence. Each await pause gives the
   browser time to render the previous change before the next
   one happens. The sequence maps to real NFC verification:

   1. Phones approach each other (physical proximity required)
   2. NFC rings pulse (radio signal exchanged)
   3. Flash on contact (handshake registered)
   4. Phones separate (physical contact no longer needed)
   5. Verification steps complete (server-side work)
   6. Trust scores update (graph updated)
   7. Badge and proof appear (verification confirmed)
   ------------------------------------------------------------ */

export async function startDemo() {
  if (isRunning) return;
  isRunning = true;

  // Disable the tap button to prevent double-clicks
  dom.tapBtn.disabled = true;

  // --- Step 1: Waiting for NFC handshake ---
  setStatusRow(dom.step1, 'active');

  // Phones move toward each other
  dom.phoneWrapA.classList.add('phone-wrap--left');
  dom.phoneWrapB.classList.add('phone-wrap--right');

  // Connector reacts
  dom.connectorIcon.classList.add('connector__icon--active');
  dom.connectorLabel.classList.add('connector__label--hidden');

  await sleep(500);

  // NFC rings start pulsing
  dom.nfcA.classList.add('nfc-zone--active');
  dom.nfcB.classList.add('nfc-zone--active');

  await sleep(900);

  // Contact moment — flash both screens
  flash(dom.flashA);
  flash(dom.flashB);

  // Step 1 complete
  dom.time1.textContent = timestamp();
  setStatusRow(dom.step1, 'done');

  await sleep(300);

  // --- Step 2: Verifying co-presence proof ---
  setStatusRow(dom.step2, 'active');

  // Phones retreat — physical proximity no longer needed
  dom.nfcA.classList.remove('nfc-zone--active');
  dom.nfcB.classList.remove('nfc-zone--active');
  dom.phoneWrapA.classList.remove('phone-wrap--left');
  dom.phoneWrapB.classList.remove('phone-wrap--right');

  await sleep(700);

  dom.time2.textContent = timestamp();
  setStatusRow(dom.step2, 'done');

  await sleep(200);

  // --- Step 3: Updating trust graph ---
  setStatusRow(dom.step3, 'active');

  await sleep(650);

  dom.time3.textContent = timestamp();
  setStatusRow(dom.step3, 'done');

  await sleep(200);

  // --- Step 4: Issuing ZK proof ---
  setStatusRow(dom.step4, 'active');

  // Animate Jordan's score from new entrant to verified range
  animateValue({
    from:     0.333,
    to:       0.621,
    duration: 1200,
    decimals: 3,
    onUpdate: (v) => {
      dom.scoreNumberA.textContent = 'E[trust] = ' + v;
      dom.scoreFillA.style.width   = (parseFloat(v) * 100) + '%';
    },
    onDone: () => dom.scoreNumberA.classList.add('phone__score-number--lit')
  });

  // Sam's score nudges up slightly from the mutual handshake
  animateValue({
    from:     0.742,
    to:       0.798,
    duration: 800,
    decimals: 3,
    onUpdate: (v) => {
      dom.scoreNumberB.textContent = 'E[trust] = ' + v;
      dom.scoreFillB.style.width   = (parseFloat(v) * 100) + '%';
    }
  });

  await sleep(500);

  // Verification rings appear on both avatars
  dom.ringA.classList.add('avatar__ring--verified');
  dom.ringB.classList.add('avatar__ring--verified');

  // Jordan's badge flips from unverified to verified
  dom.badgeA.classList.remove('badge--unverified');
  dom.badgeA.classList.add('badge--verified');
  dom.badgeA.textContent = 'Verified';

  await sleep(350);

  // ZK proof pills slide in — confirming score stayed on device
  dom.proofA.classList.add('proof-pill--visible');
  dom.proofB.classList.add('proof-pill--visible');

  await sleep(300);

  dom.time4.textContent = timestamp();
  setStatusRow(dom.step4, 'done');

  // Swap buttons
  dom.tapBtn.classList.add('btn--hidden');
  dom.resetBtn.classList.remove('btn--hidden');
}


/* ------------------------------------------------------------
   resetDemo()
   Restores every element to its initial state so the demo
   can be run again. The score bar transitions are temporarily
   disabled during reset to avoid an animated rewind.
   ------------------------------------------------------------ */

export function resetDemo() {
  isRunning = false;

  // Reset status rows
  [dom.step1, dom.step2, dom.step3, dom.step4].forEach(el => {
    setStatusRow(el, 'pending');
  });

  // Clear timestamps
  [dom.time1, dom.time2, dom.time3, dom.time4].forEach(el => {
    el.textContent = '—';
  });

  // Reset phone positions
  dom.phoneWrapA.classList.remove('phone-wrap--left');
  dom.phoneWrapB.classList.remove('phone-wrap--right');

  // Stop NFC rings
  dom.nfcA.classList.remove('nfc-zone--active');
  dom.nfcB.classList.remove('nfc-zone--active');

  // Reset connector
  dom.connectorIcon.classList.remove('connector__icon--active');
  dom.connectorLabel.classList.remove('connector__label--hidden');

  // Remove verification rings
  dom.ringA.classList.remove('avatar__ring--verified');
  dom.ringB.classList.remove('avatar__ring--verified');

  // Reset Jordan's badge
  dom.badgeA.classList.remove('badge--verified');
  dom.badgeA.classList.add('badge--unverified');
  dom.badgeA.textContent = 'Unverified';

  // Hide proof pills
  dom.proofA.classList.remove('proof-pill--visible');
  dom.proofB.classList.remove('proof-pill--visible');

  // Reset scores — disable transition first to avoid animated rewind
  dom.scoreFillA.style.transition = 'none';
  dom.scoreFillA.style.width = '0%';
  dom.scoreNumberA.textContent = 'E[trust] = 0.333';
  dom.scoreNumberA.classList.remove('phone__score-number--lit');

  dom.scoreFillB.style.transition = 'none';
  dom.scoreFillB.style.width = '68%';
  dom.scoreNumberB.textContent = 'E[trust] = 0.742';

  // Re-enable score transitions after a frame so the DOM can settle
  requestAnimationFrame(() => {
    const scoreTransition = 'width var(--transition-score)';
    dom.scoreFillA.style.transition = scoreTransition;
    dom.scoreFillB.style.transition = scoreTransition;
  });

  // Swap buttons back
  dom.tapBtn.disabled = false;
  dom.tapBtn.classList.remove('btn--hidden');
  dom.resetBtn.classList.add('btn--hidden');
}


/* ------------------------------------------------------------
   EVENT LISTENERS
   Wire the buttons to their functions.
   We do this here rather than in the HTML (onclick="...") to
   keep behavior in JS files, not scattered across the markup.
   ------------------------------------------------------------ */

dom.tapBtn.addEventListener('click', startDemo);
dom.resetBtn.addEventListener('click', resetDemo);
