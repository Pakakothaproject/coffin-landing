/**
 * The ladder. One implementation, imported by the app (to render the clock)
 * and by the tick Edge Function (to decide what happens). If these ever
 * disagree, the app lies to people about their own letters.
 *
 * Pure: takes a plain snapshot and a timestamp, returns the derived state.
 * No database, no Supabase, no React. `npm test` covers it.
 */

export const DAY = 86400000

/* =============================================================================
   THE LADDER
   =============================================================================

   Two stages, and the first one is almost entirely about the author.

   STAGE ONE — eighty days of writing to them. Every address on file, every
   time, all the way through. Not a couple of nudges and then a shrug: eighty
   days of being asked, at every mailbox, because the single most likely reason
   nothing came back is that one inbox is dead and the other one works.

   STAGE TWO — twelve days of asking somebody who knows them (thirty, from the
   next silence on, once they have spent their one 'alive'). One person, not a
   list. Two buttons: *dead* or *alive*. No question to answer, no documents, no
   proof. A person who loves you cannot in general tell you whether you are dead,
   and we are not asking them to.

     alive   they nudge you, the clock restarts — once per silence period, and
             the next silence gets a longer answer window because of it
     dead    the mail goes out
     nothing we ask once more after seven days, wait five more, then it goes

   The old version asked a nominated person to confirm a verdict, repeatedly,
   and read their silence as agreement. That is gone. They are asked once, they
   are told doing nothing costs them nothing, and if they do nothing we proceed —
   but only after telling the author, twice, that this is happening and when.

   That is the part worth being careful about. "Mark as dead" is a decision the
   system makes about a human being, on incomplete information, and the only
   thing standing between that and a living person's family is that the author
   is still being emailed at every address they gave us, and still has a link
   that stops it. So that link stays live for the whole window — twelve days,
   or thirty once their one 'alive' has been spent.
   ========================================================================== */

export const REMINDER_DAYS = [1, 4, 9, 16, 23, 32, 42, 53, 65, 78]
export const ASK_DAY = 80          // the one person who knows them is told
export const ASK_AGAIN_DAY = 87    // once more, then five days of grace
export const DELIVER_DAY = 92      // 80 + 7 + 5
export const AUTHOR_WARN_DAY = 80  // "we have asked somebody"
export const FINAL_WARN_DAY = 87   // "this goes out in five days"
// Once the one person has spent their single 'alive' on a previous silence,
// they have earned the benefit of the doubt: the next silence is judged over
// thirty days of asking rather than twelve, before anything moves.
export const KIN_RECONFIRM_DAYS = 30

// Somebody who already knows they are terminal does not want ninety-two days.
// They want the mail to arrive while the family can still sit with it. Same
// sequence, same order, less waiting — and the same twelve-day second stage,
// because that is the part that is protecting the author.
export const SHORT_LADDER = {
  reminders: [1, 3, 6, 10, 15, 20],
  ask: 24,
  askAgain: 29,
  warn: 24,
  final: 29,
  deliver: 34,
}

export const CHECKIN_TOKEN_TTL_DAYS = 30
export const DELIVERY_TTL_DAYS = 30
export const SLOT_EXPIRY_WARNING_DAYS = 30

/* -------------------------------------------------------------- identity -- */
/**
 * Who each kind of mail is from. One verified domain — one SPF, one DKIM, one
 * reputation — but a distinct address per kind, so a person can see at a glance
 * which kind arrived, and a bounce on one kind never drags the others down.
 * The preview screen (`/#/mail`) renders every one of these from the same
 * copy functions the tick uses, so what is reviewed is what is sent.
 */
export const MAIL_IDENTITIES = {
  ping: 'Last Mail <checkins@coffinmail.com>',
  reminder: 'Last Mail <checkins@coffinmail.com>',
  kin: 'Last Mail <checkins@coffinmail.com>',
  expiry: 'Last Mail <billing@coffinmail.com>',
  auth: 'Last Mail <welcome@coffinmail.com>',
}

/** Delivery is from the person, not the service; the envelope is still ours. */
export function mailFrom(kind, payload = {}) {
  if (kind === 'delivery') return `${payload.fromName || 'Someone'} via Last Mail <letters@coffinmail.com>`
  return MAIL_IDENTITIES[kind] || null
}

/* ------------------------------------------------------------------ reach -- */
/**
 * How many addresses somebody has, and which of them we write to on a given day.
 *
 * Two rules, both of them deliberate:
 *
 *   1. At least two addresses are required. One inbox is a single point of
 *      failure: a dead address that nobody notices is the quietest way this
 *      product could fail somebody. Checkout refuses a purchase until there is a
 *      second one on file.
 *   2. The backup is not pinged from day one. Everyone gets one address at
 *      first, so writing to all of them at once means somebody who set this up
 *      on Tuesday has their partner and their accountant writing to them by
 *      Friday. The backup joins after BACKUP_AFTER_DAYS of silence — which is
 *      also exactly when it becomes useful, because by then a missing check-in
 *      looks more like a dead inbox than a busy week.
 */
export const MIN_ADDRESSES = 2
export const BACKUP_AFTER_DAYS = 3

/**
 * Which addresses a message on day `day` of silence goes to.
 *
 * `all` is every reachable address, in the order the snapshot returns them —
 * primary first. Returns the primary alone until the backup is due, then all of
 * them. An account with only one address still gets that one: the missing
 * second address is a gap we report loudly, not a reason to stop writing.
 */
export function reachFor(all, day = 0) {
  const list = (all || []).filter(Boolean)
  if (!list.length) return []
  if (list.length === 1) return list
  const backupsDue = Number(day) >= BACKUP_AFTER_DAYS
  return backupsDue ? list : [list[0]]
}

/** How many more addresses somebody needs before the ladder is trustworthy. */
export const missingAddresses = (all) => Math.max(0, MIN_ADDRESSES - (all || []).length)

/** The timetable, as data, so the tests and the UI cannot drift from it. */
export const LADDER = {
  standard: {
    reminders: REMINDER_DAYS,
    ask: ASK_DAY,
    askAgain: ASK_AGAIN_DAY,
    warn: AUTHOR_WARN_DAY,
    final: FINAL_WARN_DAY,
    deliver: DELIVER_DAY,
  },
  short: SHORT_LADDER,
}

export const ladderFor = (mode) => LADDER[mode] || LADDER.standard

export const PHASE = {
  ACTIVE: 'active',
  OVERDUE: 'overdue',       // the eighty days of writing to them
  ASKING: 'asking',         // the one person who knows them has been told
  GRACE: 'grace',           // asked once, nothing back, we are counting
  FINAL: 'final',           // five days left
  DELIVERED: 'delivered',
  RECOVERED: 'recovered',
  PAUSED: 'paused',
  HELD: 'held',             // we are refusing to send, and saying why
  SETUP: 'setup',           // no paid slot yet — nothing is on the clock
}

export const PHASE_COPY = {
  [PHASE.SETUP]: { label: 'Nothing is set yet', tone: 'neutral' },
  [PHASE.ACTIVE]: { label: 'All quiet', tone: 'good' },
  [PHASE.OVERDUE]: { label: 'Waiting on you', tone: 'warn' },
  [PHASE.ASKING]: { label: 'We have asked somebody', tone: 'warn' },
  [PHASE.GRACE]: { label: 'Still no word', tone: 'warn' },
  [PHASE.FINAL]: { label: 'Going out shortly', tone: 'danger' },
  [PHASE.HELD]: { label: 'Held — we cannot send', tone: 'danger' },
  [PHASE.DELIVERED]: { label: 'Sent', tone: 'danger' },
  [PHASE.RECOVERED]: { label: 'You came back', tone: 'good' },
  [PHASE.PAUSED]: { label: 'Paused by you', tone: 'good' },
}

const ms = (iso) => (iso ? new Date(iso).getTime() : null)
const wholeDays = (from, to) => Math.floor((to - from) / DAY)

/**
 * @param snapshot {{
 *   escalation: object, prefs: object, kin: object|null,
 *   armedLetters: number, hasRecipient: boolean, addressCount: number
 * }}
 *
 * The whole ladder turns on two facts: how many addresses we have for the
 * author, and whether one person has been named who knows them. Neither is a
 * detail — one of them decides whether the first stage is a conversation or a
 * letter into a dead inbox, and the other decides whether there is a second
 * stage at all.
 */
/**
 * @param {{ escalation?: any, prefs?: any, kin?: any, addressCount?: number, armedLetters?: any, hasRecipient?: boolean }} snapshot
 * @returns {any} the derived state; every early return carries the full `t` base
 */
export function derive(snapshot, now = Date.now()) {
  const esc = snapshot.escalation || {}
  const prefs = snapshot.prefs || {}
  const mode = esc.absence_mode === 'short' ? 'short' : 'standard'
  const rungs = ladderFor(mode)
  const kin = snapshot.kin || null
  const interval = (prefs.interval_days ?? 30) * DAY
  const grace = (prefs.grace_days ?? 30) * DAY
  const addresses = snapshot.addressCount ?? 1
  const hasClose = !!kin

  const start0 = ms(esc.cycle_started_at) ?? now
  // A pause defers everything rather than muting it, so coming back from six
  // weeks off-grid does not land you on the delivery day.
  const start = Math.max(start0, ms(esc.pause_until) ?? 0, ms(esc.hold_until) ?? 0)

  const dueAt = start + interval
  const silentAt = dueAt + grace
  const at = (d) => silentAt + d * DAY

  // Their one 'alive' is spent once per silence period, and once spent it
  // counts: from the next silence on, delivery opens only after thirty days of
  // asking instead of twelve. They have already shown they will speak up, so
  // the window they get to speak into is a month, not a fortnight.
  const kinUsedAlive = !!ms(kin?.said_alive_at)
  const naturalDeliverDay = hasClose
    ? (kinUsedAlive ? rungs.ask + KIN_RECONFIRM_DAYS : rungs.deliver)
    : rungs.ask
  const finalWarnDay = naturalDeliverDay - 5

  // Said alive: the person who knows them says they are well. The clock restarts
  // and we do not ask them again — they have told us what they know, and turning
  // them into a monthly poll is the thing this whole redesign exists to avoid.
  const saidAlive = !!ms(esc.kin_said_alive_at)
  // Said dead: they have told us what they believe. It does not skip anything —
  // the author is still warned, and the same link still stops it.
  const saidDeadAt = ms(esc.kin_said_dead_at)
  const askedAt = ms(esc.asked_at)
  const askedAgainAt = ms(esc.asked_again_at)

  const t = {
    dueAt,
    silentAt,
    askAt: at(rungs.ask),
    askAgainAt: at(rungs.askAgain),
    // With no one named, there is no second stage to wait for. The mail goes at
    // the end of the eighty days, on the strength of eighty days of writing to
    // every address and nothing coming back.
    naturalDeliverAt: at(naturalDeliverDay),
    deliveredAt: ms(esc.delivered_at) ?? at(naturalDeliverDay),
    // How long the person named gets to answer before silence is judged —
    // twelve days normally, thirty once their one 'alive' is spent.
    askWindowDays: naturalDeliverDay - rungs.ask,
    mode,
    hasClose,
  }

  if (!snapshot.armedLetters) {
    return { ...t, phase: PHASE.SETUP, day: 0, daysLeft: null, progress: 0, reminders: [], rung: null }
  }
  if (esc.recovered_at) {
    return { ...t, phase: PHASE.RECOVERED, day: wholeDays(t.deliveredAt, now), daysLeft: null, progress: 1, reminders: [], rung: null }
  }
  if (esc.delivered_at) {
    return { ...t, phase: PHASE.DELIVERED, day: wholeDays(t.deliveredAt, now), daysLeft: 0, progress: 1, reminders: [], rung: null }
  }
  if (esc.pause_until && ms(esc.pause_until) > now) {
    return { ...t, phase: PHASE.PAUSED, day: 0, daysLeft: wholeDays(now, ms(esc.pause_until)), progress: 0, reminders: [], rung: null }
  }

  // Nowhere to send it. Refuse, loudly, rather than mark it sent into a void.
  if (esc.delivery_held_reason) {
    return { ...t, phase: PHASE.HELD, day: wholeDays(silentAt, now), daysLeft: null, progress: 1, reminders: rungs.reminders, rung: null, heldReason: esc.delivery_held_reason }
  }

  const day = wholeDays(silentAt, now)
  const deliverAt = saidDeadAt ? saidDeadAt + (rungs.askAgain - rungs.ask) * DAY : t.naturalDeliverAt

  // Which single thing today? One name, never a set of flags: two of these
  // landing on the same day is how somebody gets emailed twice about the same
  // thing, which is the failure that ends a subscription permanently.
  let rung = null
  if (day >= 0 && !saidAlive) {
    if (!hasClose) {
      // Nobody named, so there is no second stage to wait for. The mail goes at
      // the end of the eighty days, on the strength of eighty days of writing to
      // every address and nothing coming back.
      if (day >= rungs.ask) rung = 'deliver'
      else if (day >= rungs.ask - 2) rung = 'final'
      else if (rungs.reminders.includes(day)) rung = 'remind'
    } else if (day >= naturalDeliverDay) {
      rung = 'deliver'
    } else if (day >= rungs.askAgain) {
      // Asked once already. Ask again if we have not; after that the author's
      // final warning waits until five days before delivery, which is thirty
      // days after the ask rather than seven when their 'alive' is spent.
      if (!askedAgainAt && !saidDeadAt) rung = 'ask-again'
      else if (day >= finalWarnDay) rung = 'final'
    } else if (day >= rungs.ask) {
      rung = askedAt || saidDeadAt ? 'warn' : 'ask'
    } else if (rungs.reminders.includes(day)) {
      rung = 'remind'
    }
  }

  if (rung === 'deliver' || (now >= deliverAt && !saidAlive)) {
    return { ...t, phase: PHASE.DELIVERED, day, daysLeft: 0, progress: 1, reminders: rungs.reminders, rung: null, asked: !!askedAt }
  }

  if (day < 0) {
    return { ...t, phase: PHASE.ACTIVE, day, daysLeft: -day, progress: 1 + day / (grace / DAY), reminders: [], rung: null }
  }

  const phase = saidDeadAt
    ? PHASE.FINAL
    : rung === 'final' || rung === 'ask-again'
      ? PHASE.FINAL
    : rung === 'ask'
      ? PHASE.ASKING
      : hasClose && day >= rungs.ask
        ? PHASE.GRACE
        : PHASE.OVERDUE

  return {
    ...t,
    phase,
    day,
    daysLeft: Math.max(0, wholeDays(deliverAt, now)),
    progress: Math.min(1, day / naturalDeliverDay),
    reminders: rungs.reminders.filter((d) => d <= day),
    rung,
    asked: !!askedAt,
    addresses,
    // Surfaced so the interface can be honest about the one thing that makes
    // this work at all: we write to them, and we never read anything.
    writesOnly: true,
  }
}


/* ------------------------------------------------------------- the price */
/**
 * $20 covers one message for one year. Every further message is $5, and every
 * further year is $5 for every message being held — a longer promise, and a
 * bigger exposure, are the same thing.
 *
 *   total = 2000 + 500 * (messages - 1) + 500 * (years - 1) * messages
 *
 *   1 message   1y $20   2y $25   5y $40    10y $65    50y $265
 *   2 messages  1y $25   2y $35   5y $65    10y $115   50y $500
 *   5 messages  1y $40   2y $65   5y $140   10y $365   50y $500
 *
 * …and $500 is the ceiling on all of it. Once the schedule reaches $500 it stops
 * there, so the longest term — the one the button calls Forever — costs five
 * hundred dollars however many messages it covers, and there is no combination
 * anybody can ask for that costs more. `public.price_cents` in the database is
 * the source of truth and the checkout recomputes there, so a stale figure here
 * can never change what anyone is charged — the tests pin the two together.
 */
export const BASE_CENTS = 2000
export const SLOT_STEP_CENTS = 500
export const YEAR_STEP_CENTS = 500
export const BLOCK_YEARS = 1 // one calendar year is the step, not two
export const MAX_YEARS = 50

/**
 * $500 is the ceiling on everything, and the price of the longest term — the one
 * the button calls Forever. It is a cap rather than a tier, so there is no
 * combination of messages and years that costs more than five hundred dollars:
 * the schedule climbs until it reaches the cap and stops there.
 *
 * The previous ladder did this differently and it was worth arguing about. It
 * climbed to a ceiling and then sold the ceiling, which quietly pushed people
 * towards the longest term anybody could be sold. A hard ceiling does the same
 * job without the nudge: whatever the schedule reaches, nobody pays more than
 * $500 for the promise of "for as long as we are here".
 */
export const CAP_CENTS = 50000
export const FOREVER = 'Forever'
export const LIFETIME_YEARS = 50
export const isLifetime = (years) => Number(years) >= LIFETIME_YEARS
export const isCapped = (years) => Number(years) >= LIFETIME_YEARS

/**
 * The trial. Three months on the house, no card, and the same ladder running the
 * whole time — a free trial that only let you look at a dashboard would teach
 * nothing about whether this works.
 *
 * It is priced as term_years = 0 rather than as a discounted year, because it
 * is not a cheaper year: it is a different thing, and it expires on its own
 * clock whether or not anybody pays.
 */
export const TRIAL_DAYS = 92
export const TRIAL_YEARS = 0
export const isTrial = (years) => !(Number(years) >= 1)

export function priceCents(slots, years) {
  const n = Math.floor(Number(slots) || 0)
  const y = Math.floor(Number(years) || 0)
  if (n < 1) return 0
  if (isTrial(y)) return 0 // the free trial: three months, no card
  const blocks = Math.max(1, Math.floor(y / BLOCK_YEARS))
  return Math.min(BASE_CENTS + SLOT_STEP_CENTS * (n - 1) + YEAR_STEP_CENTS * (blocks - 1) * n, CAP_CENTS)
}

/** What one message costs at that term — the per-message line on the pricing page. */
export const perSlotCents = (slots, years) => {
  const n = Math.max(1, Math.floor(Number(slots) || 1))
  return Math.round(priceCents(n, years) / n)
}

/**
 * What to call a term in the UI. The trial has a name of its own, the longest
 * term is the one promise rather than a number, and everything in between is
 * simply its years.
 */
export function termLabel(years) {
  if (isTrial(years)) return 'Free trial'
  const y = Number(years)
  if (y >= LIFETIME_YEARS) return FOREVER
  return `${y} ${y === 1 ? 'year' : 'years'}`
}

/** The terms worth offering. The last one is the promise rather than a number. */
export const TERM_PRESETS = [1, 2, 5, 10, 50]

export const perYearCents = (slots, years) => (years > 0 ? Math.round(priceCents(slots, years) / years) : 0)

/** The stops for the printed schedule the app draws. */
export function clockStops(s, hasKin) {
  const kin = !!hasKin
  const stops = [
    { at: s.dueAt, label: 'Day 0', sub: 'We ask if you are okay' },
    { at: s.dueAt + 1 * DAY, label: '1', sub: 'Reminder' },
    { at: s.dueAt + 7 * DAY, label: '7', sub: 'Reminder' },
    { at: s.dueAt + 20 * DAY, label: '20', sub: 'Reminder' },
    { at: s.unreachableAt, label: String(Math.round((s.unreachableAt - s.dueAt) / DAY)), sub: kin ? 'We ask your next of kin' : 'Final attempt' },
  ]
  if (kin) stops.push({ at: s.kinDeadline, label: String(Math.round((s.kinDeadline - s.dueAt) / DAY)), sub: 'Final attempt' })
  stops.push({ at: s.deliveredAt, label: String(Math.round((s.deliveredAt - s.dueAt) / DAY)), sub: 'Letters delivered' })
  return stops
}

/** The ping copy, personalised. Tone and wording come from the author. */
/**
 * Eighty days of writing to them.
 *
 * The tone matters more here than anywhere else in the product, because this is
 * an email a living person receives over and over. It must never once read as
 * an accusation or a countdown to their own death — which is how everyone else
 * in this category writes it: "we have not heard from you in 23 days, this is
 * attempt 4 of 5". That turns a safety net into a threat, and it is a large part
 * of why people never set these up at all.
 *
 * So: ask one small question, and say plainly that we only ever write to them
 * and never read anything. That sentence is the trust the product rests on and
 * it costs nothing to say.
 */
/** The mail itself, to whoever it is for. */
/** @param {any} o */
export function deliveryCopy(o = {}) {
  const { fromName, toName, attachments = 0 } = o
  return {
    subject: `${fromName} left you something`,
    body:
      `${toName},\n\n` +
      `${fromName} wrote you something, and asked for it to reach you.\n\n` +
      `It is below, or behind the link if it did not come through. There is no hurry and nothing to ` +
      `do tonight.\n\n` +
      (attachments
        ? `There ${attachments === 1 ? 'is one file' : `are ${attachments} files`} with it, at the ` +
          `bottom of the page. Those links stop working in an hour, so save anything you want to ` +
          `keep.\n\n`
        : '') +
      `If you want to talk to anyone, Samaritans answer 24 hours on 116 123, or text HOME to 741741. ` +
      `You do not have to be in crisis to use either.\n\n` +
      `— Last Mail`,
  }
}

/** @param {{ name?: string, day?: number, addresses?: number, final?: boolean, phase?: string, prefs?: any }} o */
export function pingCopy(o = {}) {
  const { name, day = 0, addresses = 1, final = false } = o
  const who = name || 'there'

  if (final) {
    return {
      subject: 'This goes out unless you say so',
      body:
        `${who},\n\n` +
        `We have written to every address you gave us and had nothing back, so this is the last word ` +
        `before it goes.\n\n` +
        `Your mail is ready and addressed. If you are fine — in hospital, away, off-grid, or simply not ` +
        `near a computer — one tap below stops all of it and nothing is sent to anyone.\n\n` +
        `If nobody hears from you, it goes anyway. That is the deal you made when you set this up, and ` +
        `it is why we have spent ${day} days writing to you first.\n\n` +
        `— Last Mail`,
    }
  }

  return {
    subject: day === 0 ? 'Are you about?' : 'Still nothing from you',
    body:
      `${who},\n\n` +
      (day === 0
        ? `This is a check-in. It is the only kind of email we send without being asked. Tap below and ` +
          `we start again.\n\n`
        : `We have written before and had nothing back. That is usually nothing — phones die, holidays ` +
          `happen, people get busy.\n\n`) +
      `We write to ${addresses === 1 ? 'the one address' : `all ${addresses} addresses`} you gave us, so ` +
      `if one has gone quiet you will still hear from us at another.\n\n` +
      `We cannot read your mail and we have no way of knowing whether you are well. All we know is that ` +
      `nobody has tapped.\n\n` +
      `— Last Mail`,
  }
}

/**
 * The one person who knows them.
 *
 * This message is the product now, so it is written for somebody who is not
 * technical, is grieving, has never heard of us, and is being asked about a death
 * they may have no way of confirming.
 *
 * Two buttons, no question, no document, and no "we will treat your silence as
 * confirmation" — that sentence, which the previous version ended on, turned a
 * stranger into somebody responsible for a death, on a deadline they never
 * agreed to, for the crime of not reading an email.
 *
 * What it says instead, clearly, is that doing nothing *does* have a
 * consequence: we count the days and then send. They are entitled to know that
 * before deciding to do nothing, and concealing it would be its own dishonesty.
 */
/** @param {{ name?: string, authorName?: string, day?: number, again?: boolean, daysLeft?: number, windowDays?: number, usedBefore?: boolean, link?: string }} o */
export function askCopy(o = {}) {
  const { name, authorName, day = 80, again = false, daysLeft = 5, windowDays = 12, usedBefore = false, link } = o
  return {
    subject: again ? `One more time about ${authorName}` : `Have you heard from ${authorName}?`,
    body:
      `Hello ${name},\n\n` +
      `${authorName} asked us to let you know that we have not been able to reach them. We have ` +
      `written to every address they gave us over many weeks and had no reply.\n\n` +
      `You are the one person they named. That is all this is — a note, not a duty, and nothing at ` +
      `all if you would rather leave it.\n\n` +
      (usedBefore
        ? `Last time you told us they were fine — thank you, that helped. We are asking again ` +
          `because we have not heard from them since. This is not a monthly poll: nothing further ` +
          `is expected of you either way.\n\n`
        : '') +
      `Two buttons. Neither asks you for proof of anything:\n\n` +
      `  • They are alive` +
      (again
        ? ' — we start again from zero. You will not hear from us about this again unless the same ' +
          'silence happens all over.\n\n'
        : ' — we start again from zero. It is often just a hospital stay or a dead phone.\n\n') +
      `  • They have died` +
      (again
        ? ` — their mail goes out in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}. They are emailed ` +
          `at every address they gave us and can still stop it themselves.\n\n`
        : usedBefore
          ? ` — we let ${day} days pass, ask you once more, then wait ${windowDays} days for an answer ` +
            `from anyone. If there is no word by then their mail goes out. They are emailed at every ` +
            `address in the meantime and can still stop it themselves.\n\n`
          : ` — we let ${day} days pass, ask you once more, wait a little, and then their mail goes out. ` +
            `They are emailed at every address in the meantime and can stop it themselves.\n\n`) +
      (link ? `  ${link}\n\n` : '') +
      `You do not have to be certain. Nobody is in a position to confirm a death, and we are not ` +
      `asking you to. We are asking whether you have heard from them.\n\n` +
      `— Last Mail`,
  }
}

/** The last note before it goes, to the author only. */
/** @param {any} o */
export function lastNoteCopy(o = {}) {
  const { name } = o
  return {
    subject: 'Five days',
    body:
      `${name || 'there'},\n\n` +
      `We asked someone who knows you whether they had heard from you. They have not answered, and we ` +
      `are not going to keep asking them.\n\n` +
      `Your mail goes out in five days unless you stop it. One tap below is all it takes, and it works ` +
      `right up to the moment it is sent.\n\n` +
      `— Last Mail`,
  }
}

/** @param {any} o */
export function expiryCopy(o = {}) {
  const { title, years, expiresAt } = o
  const when = new Date(expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const term = isTrial(years) ? 'your free trial' : `your ${years}-year slot`
  return {
    subject: `${term} for "${title}" runs out on ${when}`,
    body:
      `A quick note about money rather than mortality, for once.\n\n` +
      `The slot covering "${title}" — ${term} — ends on ${when}. When it does, we stop checking ` +
      `whether you are all right, and that letter will not be delivered by us ever again. It is not ` +
      `deleted; it simply goes quiet.\n\n` +
      `You can add years whenever you like. Nothing is charged automatically and nothing renews on ` +
      `its own — this email is the only warning you will get.\n\n` +
      `— Last Mail`,
  }
}
