/**
 * The price schedule on /pricing is a copy, so pin it.
 *
 * The schedule printed on the pricing page is written out twice — once as the
 * table and once in `sitePrice` below — and both must agree with the product's
 * own formula. That formula lives in the app repository at
 * `supabase/functions/_shared/engine.js`, mirrored here as `vendor/engine.js`
 * so this check can run on its own. Refresh the mirror when the product's price
 * changes:
 *
 *   cp ../coffin-mail/supabase/functions/_shared/engine.js vendor/engine.js
 *
 * A marketing site quoting a stale price is worse than one with no price on it.
 *
 *   node check-price.mjs
 */
import {
  BASE_CENTS,
  SLOT_STEP_CENTS,
  YEAR_STEP_CENTS,
  BLOCK_YEARS,
  MAX_YEARS,
  CAP_CENTS,
  TRIAL_DAYS,
  priceCents,
  isTrial,
  isCapped,
  termLabel,
} from './vendor/engine.js'

// As written in src/pages/Pricing.jsx
const sitePrice = (messages, years) =>
  Math.min(2000 + 500 * (messages - 1) + 500 * (years - 1) * messages, 50000)

let bad = 0
const fail = (m) => {
  console.error(m)
  bad++
}

for (const [label, engine, site] of [
  ['BASE_CENTS', BASE_CENTS, 2000],
  ['SLOT_STEP_CENTS', SLOT_STEP_CENTS, 500],
  ['YEAR_STEP_CENTS', YEAR_STEP_CENTS, 500],
  ['BLOCK_YEARS', BLOCK_YEARS, 1],
  ['MAX_YEARS', MAX_YEARS, 50],
  ['CAP_CENTS', CAP_CENTS, 50000],
  ['TRIAL_DAYS', TRIAL_DAYS, 92],
]) {
  if (engine !== site) fail(`mismatch ${label}: engine ${engine} vs pricing page ${site}`)
}

if (!isTrial(0)) fail('the trial (0 years) must price as free')
if (termLabel(50) !== 'Forever') fail('the longest term must read as Forever, not as fifty years')

for (let messages = 1; messages <= 8; messages++) {
  for (let years = 1; years <= MAX_YEARS; years++) {
    const engine = priceCents(messages, years)
    const site = sitePrice(messages, years)
    if (engine !== site) fail(`mismatch ${messages} message(s) x ${years}y: engine ${engine} vs page ${site}`)
    if (years > 1 && site < sitePrice(messages, years - 1)) {
      fail(`the page's schedule drops at ${messages} message(s), ${years}y — a longer promise must never cost less`)
    }
    if (site > CAP_CENTS) fail(`the page quotes ${site} at ${messages} messages, ${years}y — over the ceiling`)
  }
}

// The ceiling has to actually bind, or it is decoration.
if (sitePrice(2, MAX_YEARS) !== CAP_CENTS) fail('the longest term must cost exactly the ceiling for two messages')
if (sitePrice(5, MAX_YEARS) !== CAP_CENTS) fail('the longest term must cost exactly the ceiling for five messages')
if (sitePrice(1, MAX_YEARS) >= CAP_CENTS) fail('one message for fifty years should still be under the ceiling')
if (!isCapped(MAX_YEARS)) fail('the longest term must report as capped')

console.log(bad ? `${bad} mismatches` : 'the printed schedule matches the product')
process.exit(bad ? 1 : 0)