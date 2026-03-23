/* ============================================================
   query.js
   Orchestrates the platform verification query demo.
   Imports generic tools from utils.js.
   ============================================================ */

import { sleep, timestamp } from './utils.js';


/* ------------------------------------------------------------
   QUERY DEFINITIONS
   Each query type has a label used in the terminal and result,
   and a description shown in the preview.
   ------------------------------------------------------------ */

const QUERIES = {
  tier:  { label: 'tier_gte_3',    desc: 'Is user Tier 3 or above?' },
  score: { label: 'score_gte_0.7', desc: 'Is E[trust] above 0.70?'  },
  nfc:   { label: 'nfc_gte_5',     desc: 'Has 5+ NFC handshakes?'   },
};


/* ------------------------------------------------------------
   DOM REFERENCES
   ------------------------------------------------------------ */

const dom = {
  queryType:    document.getElementById('queryType'),
  queryPreview: document.getElementById('queryPreview'),
  runBtn:       document.getElementById('runBtn'),
  resetBtn:     document.getElementById('resetBtn'),
  terminal:     document.getElementById('terminal'),
  resultPanel:  document.getElementById('resultPanel'),
  privacyNote:  document.getElementById('privacyNote'),
  resultTime:   document.getElementById('resultTime'),
  rVerified:    document.getElementById('rVerified'),
  rQuery:       document.getElementById('rQuery'),
  rProof:       document.getElementById('rProof'),
  rExpires:     document.getElementById('rExpires'),
  rSigVerified: document.getElementById('rSigVerified'),
};


/* ------------------------------------------------------------
   updatePreview()
   Rebuilds the query JSON preview and terminal command
   whenever the select changes.
   ------------------------------------------------------------ */

function updatePreview() {
  const q = QUERIES[dom.queryType.value];

  dom.queryPreview.innerHTML =
    `POST /v1/verify<br>` +
    `{<br>` +
    `&nbsp;&nbsp;<span class="qs">"query"</span>: <span class="qs">"${q.label}"</span>,<br>` +
    `&nbsp;&nbsp;<span class="qs">"session"</span>: <span class="qs">"sess_7f3..."</span><br>` +
    `}`;
}


/* ------------------------------------------------------------
   appendTermLine(html)
   Adds a new line to the terminal and fades it in.
   Returns the element so callers can reference it later if needed.
   ------------------------------------------------------------ */

function appendTermLine(html) {
  const div = document.createElement('div');
  div.className = 'term-line';
  div.innerHTML = html;
  dom.terminal.appendChild(div);

  // requestAnimationFrame ensures the browser renders the element
  // in its initial (invisible) state before we add the visible class,
  // triggering the CSS transition.
  requestAnimationFrame(() => div.classList.add('term-line--visible'));
  return div;
}


/* ------------------------------------------------------------
   runQuery()
   Main animation sequence for the verification query.
   ------------------------------------------------------------ */

let isRunning = false;

async function runQuery() {
  if (isRunning) return;
  isRunning = true;
  dom.runBtn.disabled = true;

  const qKey   = dom.queryType.value;
  const q      = QUERIES[qKey];
  const proofId = 'zkp_' + Math.random().toString(36).slice(2, 10);
  const t0     = performance.now();

  // Clear terminal from any previous run
  dom.terminal.innerHTML = '';

  // --- Animation sequence ---
  // Each appendTermLine + sleep pair represents one step in the
  // verification flow. The delays are tuned to feel responsive
  // without rushing the user through the key moments.

  appendTermLine(
    `<span class="term-prompt">$</span> ` +
    `<span class="term-cmd">manatee</span> verify ` +
    `--query ${q.label} --session sess_7f3...`
  );

  await sleep(300);
  appendTermLine(`<span class="term-dim">→ Connecting to Manatee gateway...</span>`);

  await sleep(400);
  appendTermLine(`<span class="term-dim">→ Session validated</span>`);

  await sleep(400);
  appendTermLine(`<span class="term-dim">→ Forwarding query to user device...</span>`);

  await sleep(500);
  appendTermLine(`<span class="term-dim">→ ZK proof computing on-device...</span>`);

  await sleep(500);
  appendTermLine(
    `<span class="term-key">"query"</span>` +
    `<span class="term-dim">:     </span>` +
    `<span class="term-str">"${q.label}"</span>`
  );

  await sleep(250);
  appendTermLine(
    `<span class="term-key">"verified"</span>` +
    `<span class="term-dim">:  </span>` +
    `<span class="term-true">true</span>`
  );

  await sleep(250);
  appendTermLine(
    `<span class="term-key">"proof_id"</span>` +
    `<span class="term-dim">:  </span>` +
    `<span class="term-str">"${proofId}"</span>`
  );

  await sleep(300);
  appendTermLine(
    `<span class="term-dim">→ Platform verifying signature against Manatee public key...</span>`
  );

  await sleep(400);
  appendTermLine(
    `<span class="term-key">"signature_verified"</span>` +
    `<span class="term-dim">: </span>` +
    `<span class="term-true">true</span>`
  );

  await sleep(200);
  appendTermLine(
    `<span class="term-key">"score_disclosed"</span>` +
    `<span class="term-dim">:    </span>` +
    `<span class="term-false">false</span>`
  );

  await sleep(200);
  appendTermLine(
    `<span class="term-key">"data_retained"</span>` +
    `<span class="term-dim">:     </span>` +
    `<span class="term-false">false</span>`
  );

  await sleep(200);
  appendTermLine(
    `<span class="term-comment">// proof valid for this session only · cannot be replayed</span>`
  );

  // --- Populate and reveal result panel ---
  await sleep(400);

  const elapsed = ((performance.now() - t0) / 1000).toFixed(2) + 's';
  const expiry  = new Date(Date.now() + 300000)
    .toISOString()
    .replace('T', ' ')
    .slice(0, 19) + ' UTC';

  dom.resultTime.textContent   = elapsed;
  dom.rVerified.textContent    = 'true';
  dom.rQuery.textContent       = q.label;
  dom.rProof.textContent       = proofId;
  dom.rExpires.textContent     = expiry;
  dom.rSigVerified.textContent = 'true';

  dom.resultPanel.classList.add('query-result--visible');
  dom.privacyNote.style.display = 'block';
  dom.resetBtn.style.display    = 'block';
}


/* ------------------------------------------------------------
   resetDemo()
   Restores all elements to initial state.
   ------------------------------------------------------------ */

function resetDemo() {
  isRunning = false;

  dom.terminal.innerHTML = '';
  dom.resultPanel.classList.remove('query-result--visible');
  dom.privacyNote.style.display = 'none';
  dom.resetBtn.style.display    = 'none';
  dom.runBtn.disabled           = false;

  // Clear result fields
  [dom.rVerified, dom.rQuery, dom.rProof, dom.rExpires, dom.rSigVerified, dom.resultTime]
    .forEach(el => el.textContent = '—');

  dom.queryType.value = 'tier';
  updatePreview();
}


/* ------------------------------------------------------------
   EVENT LISTENERS
   ------------------------------------------------------------ */

dom.queryType.addEventListener('change', updatePreview);
dom.runBtn.addEventListener('click', runQuery);
dom.resetBtn.addEventListener('click', resetDemo);

// Initialize preview on load
updatePreview();
