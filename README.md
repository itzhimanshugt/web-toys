# Web Toys

Single-file interactive simulations, instruments and puzzles. Each toy lives in `<slug>/index.html` and runs in any modern browser with no build step.

Live gallery: https://itzhimanshugt.github.io/web-toys/

## Layout

- `<slug>/index.html`: one toy, fully self-contained
- `briefs/<slug>.json`: the design brief each toy is built from
- `tools/BUILD.md`: rules every toy must meet (standalone page, theming, 390px phone width, accessibility, performance)
- `tools/shot.ps1`: headless Edge check that saves desktop and phone screenshots and prints console errors
- `tools/gallery.js`: regenerates the root `index.html` gallery

## Check a toy

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools\shot.ps1 -Slug physarum -Width 390 -Height 844 -Tag phone
```

Screenshots land in `tools/_out/` (not committed).

## Update the gallery

```bash
node tools/gallery.js
```
