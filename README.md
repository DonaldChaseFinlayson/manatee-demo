# manatee-demo

Interactive demo for the [Manatee Protocol](https://github.com/donaldchasefinlayson/manatee).

Currently shows: NFC handshake verification flow between two users.

---

## Running locally

No build step required. Because we use ES modules (`type="module"` in the script tag), the files must be served over HTTP rather than opened directly as `file://` URLs. Browsers block module imports from the filesystem for security reasons.

The simplest way:

```bash
# Python 3 (built into macOS and most Linux)
cd manatee-demo
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

Alternatively, install the VS Code [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension and click "Go Live" — it handles this automatically and reloads the page on every file save.

---

## Structure

```
manatee-demo/
├── index.html          Structure only — no inline styles or JS
│
├── css/
│   ├── main.css        Design tokens (CSS variables), reset, base layout
│   └── components.css  Visual components: phone, badge, button, status panel
│
├── js/
│   ├── utils.js        Generic tools: sleep, animateValue, flash, setStatusRow
│   └── demo.js         Demo-specific logic: animation sequence, DOM references
│
└── assets/             Fonts, icons, images (empty for now)
```

### The separation of concerns

**index.html** is markup only. It describes structure — what elements exist and what they contain. It does not describe appearance (no `style=""` attributes beyond unavoidable one-off values) and does not describe behavior (no `onclick=""` handlers).

**css/main.css** is the design token layer. All colors, fonts, spacing, and transition values live here as CSS custom properties. Change `--color-teal` once and it updates everywhere.

**css/components.css** is the visual layer. It uses the tokens from main.css to style each reusable component. A component knows what it looks like; it does not know where it lives on the page.

**js/utils.js** is generic tooling with no knowledge of Manatee or this demo. `sleep()`, `animateValue()`, `flash()`, and `setStatusRow()` could be dropped into any project unchanged.

**js/demo.js** is the orchestrator. It imports from utils.js and uses those tools to control the specific elements in index.html. It knows about this demo; utils.js does not.

---

## Adding a new demo

1. Add a new HTML file (e.g. `badge-demo.html`) in the root
2. Add component styles to `css/components.css` or a new file
3. Add a new JS file in `js/` for the demo logic
4. Import utils.js functions you need

---

## Tech stack

- Vanilla HTML, CSS, JS — no framework, no build step
- ES Modules for clean import/export between JS files
- CSS Custom Properties for the design token system
- `requestAnimationFrame` for smooth score animations
- Google Fonts: DM Sans + DM Mono
