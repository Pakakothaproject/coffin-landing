/**
 * Make the logo usable as a web icon.
 *
 * The source is a 2048x2048 PNG with transparency and about 3.8MB of it, which is
 * not something to put in a <nav>. This crops it to the ink, squares it, and
 * writes the sizes a page actually asks for.
 *
 * It runs in Chrome rather than ffmpeg because ffmpeg decodes this file's alpha
 * as near-empty noise while every browser draws it perfectly, and a logo that
 * comes out inverted is worse than no logo.
 *
 *   node make-logo.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

// The 2048px original lives outside public/ on purpose: it is 3.8MB and nothing
// on the site ever loads it, so shipping it would just make the deploy bigger.
const SRC = 'assets-src/logo-source.png'
const OUT_SQUARE = 'public/logo.png'

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
})
const page = await browser.newPage()
await page.goto('about:blank')

const dataUrl = 'data:image/png;base64,' + readFileSync(SRC).toString('base64')

const result = await page.evaluate(async (src) => {
  const img = new Image()
  img.src = src
  await img.decode()

  const full = document.createElement('canvas')
  full.width = img.naturalWidth
  full.height = img.naturalHeight
  const fctx = full.getContext('2d', { willReadFrequently: true })
  fctx.drawImage(img, 0, 0)

  const { data, width, height } = fctx.getImageData(0, 0, full.width, full.height)

  // Where the ink actually is. A low threshold keeps the faint engraved shading
  // instead of cropping it off and leaving a hole in the lid.
  const THRESHOLD = 18
  let minX = width
  let minY = height
  let maxX = -1
  let maxY = -1
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > THRESHOLD) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (maxX < 0) throw new Error('nothing opaque in the source image')

  const pad = Math.round(Math.max(maxX - minX, maxY - minY) * 0.02)
  minX = Math.max(0, minX - pad)
  minY = Math.max(0, minY - pad)
  maxX = Math.min(width - 1, maxX + pad)
  maxY = Math.min(height - 1, maxY + pad)
  const cw = maxX - minX + 1
  const ch = maxY - minY + 1

  const draw = (size, fit, padding) => {
    const c = document.createElement('canvas')
    c.width = size
    c.height = size
    const ctx = c.getContext('2d')
    const box = fit === 'cover' ? size : size - padding * 2
    const scale = Math.min(fit === 'cover' ? box / cw : box / cw, fit === 'cover' ? box / ch : box / ch)
    const w = cw * scale
    const h = ch * scale
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(full, minX, minY, cw, ch, (size - w) / 2, (size - h) / 2, w, h)
    return c
  }

  return {
    box: { minX, minY, cw, ch },
    source: { width, height },
    square512: draw(512, 'contain', 24).toDataURL('image/png'),
    square256: draw(256, 'contain', 12).toDataURL('image/png'),
    icon64: draw(64, 'contain', 3).toDataURL('image/png'),
    icon180: draw(180, 'contain', 9).toDataURL('image/png'),
    wide: (() => {
      const c = document.createElement('canvas')
      const h = 256
      const w = Math.round((cw / ch) * h)
      c.width = w
      c.height = h
      const ctx = c.getContext('2d')
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(full, minX, minY, cw, ch, 0, 0, w, h)
      return c.toDataURL('image/png')
    })(),
  }
}, dataUrl)

await browser.close()

const write = (path, dataUrl) => writeFileSync(path, Buffer.from(dataUrl.split(',')[1], 'base64'))

write(OUT_SQUARE, result.square512)
write('public/icon-256.png', result.square256)
write('public/icon-64.png', result.icon64)
write('public/apple-touch-icon.png', result.icon180)

const kb = (p) => Math.round(readFileSync(p).length / 1024)
console.log(`source ${result.source.width}x${result.source.height}, ink box ${result.box.cw}x${result.box.ch} at ${result.box.minX},${result.box.minY}`)
console.log(`logo.png ${kb(OUT_SQUARE)}KB · icon-256 ${kb('public/icon-256.png')}KB · icon-64 ${kb('public/icon-64.png')}KB · apple-touch-icon ${kb('public/apple-touch-icon.png')}KB`)