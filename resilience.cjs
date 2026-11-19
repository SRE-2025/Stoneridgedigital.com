/* Refresh inline styles without regenerating or rewriting page content. */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const root = __dirname;
const css = fs.readFileSync(path.join(root, 'assets/styles.min.css'), 'utf8') + '\n' +
  fs.readFileSync(path.join(root, 'assets/reliability.css'), 'utf8');
const version = crypto.createHash('sha256').update(css + fs.readFileSync(path.join(root, 'assets/app.min.js'))).digest('hex').slice(0,12);
const style = `<style id="stoneridge-styles" data-release="${version}">${css}</style>`;
let count = 0;
for (const name of fs.readdirSync(root).filter(x => x.endsWith('.html'))) {
  const file = path.join(root, name);
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('assets/styles.min.css') && !html.includes('id="stoneridge-styles"')) continue;
  html = html.replace(/<style id="stoneridge-styles"[^>]*>[\s\S]*?<\/style>/, () => style)
    .replace(/<link rel="stylesheet" href="assets\/styles\.min\.css[^\"]*">/, () => style)
    .replace(/<script>document\.documentElement\.classList\.add\('js'\);<\/script>\s*/, '')
    .replace(/<div class="intro" id="intro">/, '<div class="intro" id="intro" hidden aria-hidden="true">')
    .replace(/<script(?: defer)? src="assets\/app\.min\.js[^\"]*"><\/script>/,
      `<script defer src="assets/app.min.js?v=${version}"></script>`);
  fs.writeFileSync(file, html);
  count++;
}
console.log(JSON.stringify({pages: count, release: version, inlineCssBytes: Buffer.byteLength(css)}));
