/**
 * Is the landing site actually crawlable and indexable?
 *
 * Google renders JavaScript before it indexes, so the client-rendered DOM is
 * the thing to audit, not the source files. Everything here is measured against
 * a real browser on the production build.
 *
 *   node check-seo.mjs [baseUrl]
 */
import puppeteer from 'puppeteer-core'
import { readFileSync } from 'node:fs'

// vite preview binds the IPv6 loopback only, and Node's fetch and Chrome both
// disagree about which of localhost's two addresses to use — so a check pointed
// at "localhost" reports four missing files while the page plainly loaded. Ask
// for the address the server is actually on.
const BASE = (process.argv[2] || 'http://localhost:4174').replace('//localhost', '//[::1]')
const ROUTES = ['/', '/features', '/pricing', '/privacy', '/terms']

// Google's own guidance: title ~50-60 chars, description ~150-160.
const TITLE_MIN = 30
const TITLE_MAX = 60
const DESC_MIN = 70
const DESC_MAX = 160

let problems = 0
// Kept so the share-image check below can read what the pages actually declared.
let pageState = null
const note = (m) => {
  console.log(`  ! ${m}`)
  problems++
}

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
})
const page = await browser.newPage()

for (const route of ROUTES) {
  console.log(`\n${route}`)
  const res = await page.goto(BASE + route + (route === '/' ? '?v=seo' : ''), {
    waitUntil: 'networkidle2',
    timeout: 30000,
  })
  await new Promise((r) => setTimeout(r, 400))

  const s = await page.evaluate(() => {
    const meta = (n, attr = 'name') => document.head.querySelector(`meta[${attr}="${n}"]`)?.content || null
    const text = (sel) => document.querySelector(sel)?.textContent.replace(/\s+/g, ' ').trim() || null
    const heads = [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => ({
      tag: h.tagName,
      text: h.textContent.replace(/\s+/g, ' ').trim(),
    }))
    return {
      status: document.title ? null : 'no title',
      title: document.title,
      desc: meta('description'),
      canonical: document.querySelector('link[rel=canonical]')?.href || null,
      robots: meta('robots'),
      viewport: meta('viewport'),
      ogTitle: meta('og:title', 'property'),
      ogDesc: meta('og:description', 'property'),
      ogUrl: meta('og:url', 'property'),
      ogImage: meta('og:image', 'property'),
      ogImageW: meta('og:image:width', 'property'),
      ogImageH: meta('og:image:height', 'property'),
      ogType: meta('og:type', 'property'),
      twitter: meta('twitter:card'),
      twTitle: meta('twitter:title'),
      twDesc: meta('twitter:description'),
      twImage: meta('twitter:image'),
      locale: meta('og:locale'),
      jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent.length),
      h1: heads.filter((h) => h.tag === 'H1'),
      h2: heads.filter((h) => h.tag === 'H2'),
      all: heads,
      lang: document.documentElement.lang,
      // Text a crawler actually reads.
      words: document.body.innerText.replace(/\s+/g, ' ').trim().split(' ').length,
      imagesNoAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length,
      emptyLinks: [...document.querySelectorAll('a')].filter((a) => !a.textContent.trim() && !a.getAttribute('aria-label')).length,
      // A link with href="#" is a dead end for a crawler.
      hashLinks: [...document.querySelectorAll('a[href="#"]')].length,
      skipLink: !!document.querySelector('a.skip'),
      main: !!document.querySelector('main'),
      video: document.querySelectorAll('video').length,
    }
  })

  console.log(`  title       ${s.title.length}ch  "${s.title}"`)
  if (s.title.length < TITLE_MIN || s.title.length > TITLE_MAX) note(`title is ${s.title.length}ch, want ${TITLE_MIN}-${TITLE_MAX}`)
  console.log(`  description ${s.desc ? s.desc.length : 0}ch`)
  if (!s.desc) note('no meta description')
  else if (s.desc.length < DESC_MIN || s.desc.length > DESC_MAX) note(`description is ${s.desc.length}ch, want ${DESC_MIN}-${DESC_MAX}`)

  if (!s.canonical) note('no canonical link')
  if (!s.ogUrl) note('no og:url')
  if (!s.ogImage) note('no og:image')
  if (!s.twitter) note('no twitter:card')
  if (!s.twTitle) note('no twitter:title')
  if (s.h1.length !== 1) note(`${s.h1.length} h1 elements, want exactly 1`)
  if (!s.h2.length) note('no h2 at all')
  if (!s.jsonLd.length) note('no JSON-LD structured data')
  if (s.hashLinks) note(`${s.hashLinks} links point at "#" — dead ends for a crawler`)
  if (s.imagesNoAlt) note(`${s.imagesNoAlt} images without an alt attribute`)
  if (s.emptyLinks) note(`${s.emptyLinks} links with no accessible name`)
  if (!s.lang) note('no lang on <html>')
  if (s.words < 300) note(`only ${s.words} words of body text`)

  console.log(`  h1          ${s.h1.map((h) => `"${h.text}"`).join(' | ')}`)
  console.log(`  h2 (${s.h2.length})    ${s.h2.map((h) => h.text.slice(0, 44)).join(' · ')}`)
  console.log(`  words ${s.words} · jsonld ${s.jsonLd.length} · imgs-no-alt ${s.imagesNoAlt} · hash-links ${s.hashLinks}`)
  pageState = s
}

// The things that are files rather than pages.
console.log('\nstatic files')
// The static files. The check that matters most is the content type: the SPA
// fallback answers *any* path with index.html and HTTP 200, so a "sitemap" that
// returns text/html is not a sitemap at all, and it is the failure that is
// invisible until you look.
const STATIC = [
  ['/robots.txt', 'text/plain'],
  ['/sitemap.xml', 'xml'],
  ['/llms.txt', 'text/plain'],
  ['/.well-known/ai.txt', 'text/plain'],
]

for (const [f, want] of STATIC) {
  try {
    const r = await fetch(BASE + f)
    const body = await r.text()
    const type = r.headers.get('content-type') || ''
    const right = type.includes(want) || (want === 'xml' && type.includes('xml'))
    console.log(`  ${r.status} ${f.padEnd(22)} ${String(body.length).padStart(6)}b  ${type}`)
    if (!r.ok) note(`${f} returned ${r.status}`)
    if (!right) note(`${f} served as "${type}" — expected something containing "${want}"`)
    if (/^\s*<!doctype html/i.test(body)) note(`${f} is the SPA fallback serving index.html, not a real file`)
  } catch (e) {
    console.log(`  ERR ${f}  ${e.message}`)
    note(`${f} is missing`)
  }
}

// The declared size of the share image must be the size it actually is. These
// numbers get typed into Seo.jsx *and* index.html, and they were wrong once
// already — a 1024x487 card declared for a 266x256 file, which fails rich-result
// validation. A check that reads the PNG header is the only thing that stops
// the same numbers drifting apart a second time.
{
  console.log('\nshare image')
  const url = pageState?.ogImage || ''
  const path = url.replace(/^https?:\/\/[^/]+/, '')
  const file = 'public' + path
  let buf = null
  try {
    buf = readFileSync(file)
  } catch {
    note(`${url} points at ${file}, which does not exist`)
  }
  if (buf) {
    // PNG: the width and height are big-endian uint32s at offset 16.
    const w = buf.readUInt32BE(16)
    const h = buf.readUInt32BE(20)
    console.log(`  ${path}  ${w}x${h}  ${Math.round(buf.length / 1024)}KB  (declared ${pageState.ogImageW}x${pageState.ogImageH})`)
    if (pageState.ogImageW !== String(w) || pageState.ogImageH !== String(h))
      note(`og:image declares ${pageState.ogImageW}x${pageState.ogImageH} but ${file} is ${w}x${h}`)
    // Below this and platforms letterbox it or drop it.
    if (w < 1200 || h < 630) note(`${path} is ${w}x${h}; a share card wants at least 1200x630`)
  }
}

// An unknown URL must not be indexable. The SPA fallback gives it a 200, so the
// only defence is the noindex meta on the 404 route.
{
  await page.goto(BASE + '/this-page-does-not-exist', { waitUntil: 'networkidle2', timeout: 30000 })
  await new Promise((r) => setTimeout(r, 300))
  const robots = await page.evaluate(() => document.querySelector('meta[name=robots]')?.content || '')
  console.log(`\n  404 route robots meta: ${robots || '(none)'}`)
  if (!/noindex/.test(robots)) note('the 404 route is not noindex, so every unknown URL is a soft 404')
}

await browser.close()

console.log(problems ? `\n${problems} problem(s)` : '\nnothing blocking')