/**
 * Make the link-preview image.
 *
 * og:image was pointing at logo-wide.png, which is the logo mark cropped to its
 * ink: 266x256 of transparent PNG. Every social platform asks for at least
 * 1200x300, and a bare mark on transparency renders as a small unidentifiable
 * blob. The declared width and height in the schema were also fiction - 1024x487
 * for a 266x256 file - which is the kind of thing that makes a rich result fail
 * validation.
 *
 * So: render a real card at the size platforms want, out of the same tokens the
 * site uses, and read its dimensions back off the PNG header rather than typing
 * them a second time somewhere else.
 *
 *   node make-og.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const OUT = 'public/og.png'
const W = 1200
const H = 630

const logo = readFileSync('public/logo.png').toString('base64')

const CARD = `<!doctype html><html><head><meta charset="utf-8"><style>
  /* The site's own tokens, so the card cannot drift from the page it links to. */
  :root { --paper:#ebeee7; --ink:#2b3a30; --muted:#6b746c; --rule:#d3d9cf;
          --serif:"Fraunces",Georgia,serif; --sans:"Inter",system-ui,sans-serif; }
  * { margin:0; box-sizing:border-box }
  body { width:${W}px; height:${H}px; background:var(--paper); color:var(--ink);
         font-family:var(--sans); padding:76px 92px; display:flex; flex-direction:column }
  /* logo.png is square with padding baked in, so it is drawn oversized on purpose:
     cropping to its ink again here would mean keeping a second copy of the source. */
  .mark { width:206px; height:206px; object-fit:contain; margin:-34px 0 24px -30px }
  .tag { font-family:var(--sans); font-size:23px; letter-spacing:.22em;
         text-transform:uppercase; color:var(--muted); margin-bottom:auto }
  h1 { font-family:var(--serif); font-weight:600; font-size:98px; line-height:1.02;
       letter-spacing:-.02em; max-width:14ch }
  .rule { height:2px; background:var(--rule); margin:46px 0 26px }
  .foot { font-family:var(--sans); font-size:27px; color:var(--muted) }
</style></head><body>
  <img class="mark" src="data:image/png;base64,${logo}" alt="">
  <p class="tag">Mails After Death</p>
  <h1>Write your Death Mail.</h1>
  <div class="rule"></div>
  <p class="foot">coffinmail.com</p>
</body></html>`

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
})
const page = await browser.newPage()
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 })
await page.setContent(CARD, { waitUntil: 'load' })
await page.evaluateHandle('document.fonts.ready')
const buf = await page.screenshot({ type: 'png' })
await browser.close()

writeFileSync(OUT, buf)

// Read the size back rather than trusting the two above to be what we asked for.
const w = buf.readUInt32BE(16)
const h = buf.readUInt32BE(20)

console.log(`og.png ${w}x${h}, ${Math.round(buf.length / 1024)}KB — copy these into Seo.jsx and index.html`)