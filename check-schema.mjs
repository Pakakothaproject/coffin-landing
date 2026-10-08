/**
 * Is the JSON-LD valid, and does the graph contain what a rich result needs?
 *
 * Parsed and checked here rather than shipped on trust: a malformed graph is
 * silently ignored by every consumer, so a syntax error looks exactly like a
 * page with no structured data.
 *
 *   node check-schema.mjs [baseUrl]
 */
import puppeteer from 'puppeteer-core'

// vite preview binds the IPv6 loopback only — see check-seo.mjs.
const BASE = (process.argv[2] || 'http://localhost:4174').replace('//localhost', '//[::1]')
const ROUTES = ['/', '/features', '/pricing', '/privacy', '/terms']

let problems = 0
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
  await page.goto(BASE + route + (route === '/' ? '?v=ld' : ''), { waitUntil: 'networkidle2', timeout: 30000 })
  await new Promise((r) => setTimeout(r, 300))

  const raw = await page.evaluate(() => document.getElementById('ld-json')?.textContent || null)

  if (!raw) {
    note('no JSON-LD on this route')
    continue
  }

  let graph
  try {
    graph = JSON.parse(raw)
  } catch (e) {
    note(`JSON-LD does not parse: ${e.message}`)
    continue
  }

  const types = (graph['@graph'] || []).map((n) => n['@type'])
  console.log(`  types: ${types.join(', ')}`)

  for (const required of ['Organization', 'WebSite', 'WebPage']) {
    if (!types.includes(required)) note(`missing ${required}`)
  }

  // Every node must be resolvable: a dangling @id reference is a silent failure.
  const ids = new Set((graph['@graph'] || []).map((n) => n['@id']).filter(Boolean))
  const dangling = []
  const walk = (node, path) => {
    for (const [k, v] of Object.entries(node || {})) {
      if (k === '@id') continue
      if (v && typeof v === 'object') {
        if (typeof v['@id'] === 'string' && !ids.has(v['@id'])) dangling.push(`${path}.${k} -> ${v['@id']}`)
        else walk(v, `${path}.${k}`)
      }
    }
  }
  walk(graph['@graph'], 'graph')
  for (const d of dangling) note(`dangling reference ${d}`)

  const faq = (graph['@graph'] || []).find((n) => n['@type'] === 'FAQPage')
  if (route === '/' && !faq) note('the homepage has FAQ copy on it but no FAQPage schema')
  if (faq) {
    const q = faq.mainEntity || []
    console.log(`  FAQPage: ${q.length} question(s)`)
    if (q.length < 3) note('FAQPage with fewer than 3 questions is not eligible for a rich result')
    // Google requires the answer to be visible on the page too.
    for (const item of q) {
      const onPage = await page.evaluate(
        (t) => document.body.innerText.includes(t),
        item.name.slice(0, 40),
      )
      if (!onPage) note(`FAQ question is in the schema but not on the page: "${item.name.slice(0, 50)}"`)
    }
  }

  const howTo = (graph['@graph'] || []).find((n) => n['@type'] === 'HowTo')
  if (route === '/' && !howTo) note('the homepage describes a sequence but has no HowTo schema')
  if (howTo) console.log(`  HowTo: ${howTo.step?.length || 0} step(s)`)
}

await browser.close()

console.log(problems ? `\n${problems} problem(s)` : '\nthe structured data is valid and complete')