# Build rules for every toy

PAGE CONTRACT (the file is served as-is from GitHub Pages):
- Write exactly ONE self-contained file: C:\Users\Himu\src\web-toys\<slug>\index.html. Scratch/test files only in C:\Users\Himu\src\web-toys\tools\_out. Never touch other folders. Never run git.
- A full standalone document: <!doctype html>, <html lang="en">, <head> with <meta charset="utf-8">, <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">, <title>, Google Fonts <link>s and <style>; then <body>. body has margin 0 and pads top/bottom with env(safe-area-inset-*).
- Add <meta name="description" content="..."> with one plain sentence saying what the toy is (it feeds the gallery).
- <title> is a 2-4 word product-like name, specific to the piece; no explainer after a dash or colon.
- External scripts ONLY from https://cdnjs.cloudflare.com with exact pinned versions; strongly prefer none (raw WebGL / Canvas 2D / Web Audio). Stylesheets ONLY from fonts.googleapis.com, always with real fallback stacks. No fetch/XHR, no remote images, media or iframes; generate assets procedurally or as data: URIs.
- Never use alert()/confirm()/prompt(), window.print(), window.open or <a download>. Audio starts only from a user click (a clear Sound on button). Fullscreen / pointer lock optional and wrapped in try/catch.
- localStorage only for per-viewer conveniences, every access in try/catch; the page must work with it throwing.
- Theme: define every colour as a CSS custom property on bare :root (light values), redefine under @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ...; color-scheme: dark } } and again under :root[data-theme="dark"] { ... }; body sets an explicit background and colour from tokens. Allowed exception: a deliberate single visual world (an observatory, a lab instrument, a night sky) may define all colours on :root with color-scheme: dark and skip the dark blocks, but body must still set an explicit background. Canvas drawing colours may be fixed when the canvas is its own physical object.
- Responsive: must work at 390px wide with NO horizontal page scroll. Side gutter on body or one outer wrapper: padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); vertical padding only via padding-block. Flex/grid children that hold text get min-width: 0. Canvases sized by CSS with a devicePixelRatio-aware backing store, capped for performance; handle resize.
- Complete at rest: the first painted frame must already show something compelling (pre-simulate / pre-render before first paint). Headless screenshots check this.
- Polish and access: visible :focus-visible styles, real <button>/<input>/<select> with stable ids and labels, natural keyboard shortcuts, prefers-reduced-motion respected (start paused or calmer, but still render a full first frame), pointer events with touch-action: none on drawing surfaces.
- Performance: aim for 60fps on a laptop; degrade gracefully on phones (fewer particles / lower resolution under matchMedia("(max-width: 600px)")). No per-frame allocations in hot loops.
- Originality: an original creation in its genre. Do not recreate or name any specific existing game or app.
- Keep the file complete: no TODOs, no placeholder text, under about 150 KB.

DESIGN BAR (editorial treatment: a toy people keep and share; the client rejects anything that looks templated):
- Ground every choice in the subject's own world: its materials, instruments, units and terms of art. Include at least one real, subject-specific detail as content (true units, scales, names, a short accurate scientific or historical note). Never invent facts.
- Typography: two typefaces at most: one characterful Google Fonts display face for the title only, one UI/body face for everything else. No monospace; readouts use the UI face with font-variant-numeric: tabular-nums. Avoid Inter, Space Grotesk, Roboto, Arial, Poppins, Montserrat, Figtree, Instrument Serif, Geist and Literata. The h1 is 24-32px, one face and one colour (no italic or coloured accent word). Labels are sentence case, 12-14px, never uppercase with letter-spacing. Nothing under 11px. text-wrap: balance on headings.
- Palette: 4-6 named colour tokens with deliberately hue-biased neutrals. Avoid the AI-default looks: warm cream with serif and terracotta; near-black with one acid-green or vermilion pop; purple-to-blue gradients; emoji as icons; everything centred; the same big radius and shadow on every block; accent rails on cards.
- Layout: the live canvas / instrument is the hero; controls are compact, grouped by role, obviously interactive; gap-based spacing; consistent edges and baselines. Card styling only where it marks a distinct object.
- Banned outright (the inspector fails them): gradients on any surface or text, text-shadow, glows, backdrop blur, shadows on resting panels, emoji, terracotta/rust, violet/indigo, pill badges above headings, 01/02/03 index numbering, icon-topped cards. Separate surfaces with one tone step or a 1px low-contrast border, never both a border and a shadow. Accent colour goes on the data and at most one control.
- Check: node "%USERPROFILE%/.claude/skills/design-taste-frontend/scripts/inspect.mjs" --app http://127.0.0.1:8765/<slug>/ --out .taste-skill/<slug> (needs python -m http.server 8765 --bind 127.0.0.1 running from the repo root). Required: 0 FAIL. A colour-sprawl WARN caused by the canvas itself is acceptable.
- Copy: plain, specific, active voice; controls say exactly what they do. No lorem ipsum, no em-dash asides, no "not X but Y" framing, no stock phrases.
- Motion: one orchestrated, purposeful effect beats many scattered ones.
- Put the design plan in the file as the :root token block at the top of <style>, with a one-line layout comment above it.

TESTING (mandatory; use headless Edge through the provided PowerShell script):
  powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Users\Himu\src\web-toys\tools\shot.ps1" -Slug <slug> -Width 1280 -Height 900 -Tag desk
  powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Users\Himu\src\web-toys\tools\shot.ps1" -Slug <slug> -Width 390 -Height 844 -Tag phone
Optional: -Budget <ms of virtual time, default 4000>, -InjectFile "C:\Users\Himu\src\web-toys\tools\_out\<slug>-probe.js" (JS appended at the end of the page: dispatch pointer/keyboard/click events after setTimeout, then console.log the resulting state), -NoRafShim.
The script shims requestAnimationFrame onto timers so animation really runs for the budget, writes C:\Users\Himu\src\web-toys\tools\_out\<slug>-<Tag>.png and prints every console message (uncaught errors included). LOOK at the PNG with the Read tool every time.
WebGL runs on SwiftShader (software) in this harness: slow but functional. If WebGL fails there, it will fail for some real users too, so handle it.
Required before you finish: desktop and phone screenshots both look right, zero console errors, and a probe confirming no horizontal overflow at 390px: console.log("overflow", document.documentElement.scrollWidth > innerWidth) must print false. Also probe your main interactions.
Use the PowerShell tool for commands. Iterate (write, test, look, fix) until it is genuinely excellent.

Quality bar: this should feel like a small studio shipped it. Physics and maths must be correct; every control must work on mouse, touch and keyboard; performance must hold up. Prefer a focused, flawless set of features over a long buggy list, but deliver everything the brief marks as must-have.

Harness notes (learned from earlier builds, saves you turns):
- Headless Edge will not make a window narrower than about 496px, so `-Width 390` crops a 496px layout. For a true 390px check, use an -InjectFile probe that re-renders the page inside a 390x844 iframe (srcdoc of document.documentElement.outerHTML) and logs the overflow result from inside it.
- With the default requestAnimationFrame shim, WebGL or heavy canvas frames sometimes capture blank even though the page is fine. If a shot is blank, re-run with -NoRafShim before debugging; if that renders, move on and mention it in your report. Do not spend more than a few turns on harness quirks.
