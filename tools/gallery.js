// Regenerates the root index.html gallery from each <slug>/index.html <title> and meta description.
// Run: node tools/gallery.js
const fs = require('fs')
const path = require('path')
const root = path.join(__dirname, '..')
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
const toys = fs.readdirSync(root)
  .filter(d => fs.existsSync(path.join(root, d, 'index.html')))
  .map(slug => {
    const html = fs.readFileSync(path.join(root, slug, 'index.html'), 'utf8')
    const title = (html.match(/<title>([^<]*)<\/title>/) || [, slug])[1].trim()
    const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [, ''])[1]
    return { slug, title, desc }
  })
  .sort((a, b) => a.title.localeCompare(b.title))

const cards = toys.map(t =>
  `  <li><a href="${t.slug}/"><strong>${esc(t.title)}</strong><span>${esc(t.desc)}</span></a></li>`).join('\n')

fs.writeFileSync(path.join(root, 'index.html'), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Web Toys</title>
<meta name="description" content="Single-file interactive simulations, instruments and puzzles.">
<style>
:root{--bg:#f6f5f1;--ink:#1b1c1f;--muted:#5d5f66;--card:#fff;--line:#dcdad3;--accent:#2a5bd7}
@media (prefers-color-scheme:dark){:root{--bg:#121316;--ink:#ecebe6;--muted:#a3a5ab;--card:#1b1d21;--line:#2c2f35;--accent:#8fb0ff;color-scheme:dark}}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;padding:48px max(16px,env(safe-area-inset-left)) 64px}
main{max-width:1040px;margin:0 auto}
h1{margin:0 0 4px;font-size:2rem}
p{margin:0 0 32px;color:var(--muted)}
ul{list-style:none;margin:0;padding:0;display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}
a{display:flex;flex-direction:column;gap:4px;height:100%;box-sizing:border-box;padding:16px;background:var(--card);border:1px solid var(--line);border-radius:10px;color:inherit;text-decoration:none}
a:hover,a:focus-visible{border-color:var(--accent);outline:none}
span{color:var(--muted);font-size:.9rem}
</style>
</head>
<body>
<main>
<h1>Web Toys</h1>
<p>${toys.length} single-file interactive pieces. No build step, no dependencies.</p>
<ul>
${cards}
</ul>
</main>
</body>
</html>
`)
console.log(toys.length + ' toys')
