// Strips the common generated-page tells from a toy: tracked uppercase micro-labels, a third (mono)
// typeface, an accent-styled word in the h1, text-shadows, and titles over 32px.
// Run: node tools/detell.js <slug>...   then check with the design inspector and look at the page.
const fs = require('fs')
const path = require('path')
for (const slug of process.argv.slice(2)) {
  const file = path.join(__dirname, '..', slug, 'index.html')
  let s = fs.readFileSync(file, 'utf8')
  const ui = (s.match(/--(font-ui|ui|body|font-body)\s*:/) || [])[1]
  if (ui) s = s.replace(/(--(?:font-)?mono\s*:)[^;]*;/, `$1 var(--${ui});`)
  s = s.replace(/&family=JetBrains\+Mono[^&"]*/, '')
  s = s.split('\n').map(l => {
    if (/^\s*h1\s+(span|em)\s*\{[^}]*\}\s*$/.test(l)) return null
    l = l.replace(/\s*text-shadow:[^;}]*;?/g, '')
    if (/^\s*h1\b/.test(l)) return l
    if (/text-transform:\s*uppercase/.test(l)) {
      l = l.replace(/\s*text-transform:\s*uppercase;?/g, '').replace(/\s*letter-spacing:[^;}]*;?/g, '')
        .replace(/(font(?:-size)?:[^;}]*?)\b(?:9|10|11)(?:\.\d+)?px/g, '$112px')
    }
    return l.replace(/(font(?:-size)?:[^;}]*?)\b(?:8|9|10)(?:\.\d+)?px/g, '$111px')
  }).filter(l => l !== null).join('\n')
  s = s.replace(/(<h1[^>]*>)([\s\S]*?)(<\/h1>)/, (m, a, b, c) => a + b.replace(/<\/?(span|em|i|b)[^>]*>/g, '') + c)
  s = s.replace(/(h1\s*\{[^}]*?)clamp\([^)]*\)/, '$1clamp(24px, 4vw, 32px)')
  s = s.replace('</style>', 'body { font-variant-numeric: tabular-nums; }\n</style>')
  fs.writeFileSync(file, s)
  console.log(slug, 'ok')
}
