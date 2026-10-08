import { useEffect } from 'react'

/**
 * Every head tag a page needs, in one place.
 *
 * This used to be a `useMeta` that set a title, a description and two OG tags,
 * which is not enough to be found by anything. What a page needs is a canonical
 * URL (so every share of it resolves to one address), an absolute og:url and
 * og:image (relative URLs are ignored by every consumer, so the link preview
 * silently does nothing), a Twitter card, a robots directive, and structured
 * data — which is the difference between being found by Google and being quoted
 * by an answer engine.
 *
 * JSON-LD is injected rather than living in index.html because most of it is
 * per-page: the FAQ only exists on the homepage, and a schema.org FAQPage on a
 * page with no questions on it is a lie that gets the whole graph distrusted.
 */

export const SITE = 'https://www.coffinmail.com'
// The card make-og.mjs renders, not the logo: a link preview wants 1200x630 of
// something readable, and a bare mark on transparency is a small grey smudge.
const IMAGE = `${SITE}/og.png`
const IMAGE_W = 1200
const IMAGE_H = 630
const NAME = 'CoffinMail'

/** The org, once, everywhere. This is the entity an answer engine resolves. */
const ORGANIZATION = {
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: NAME,
  url: SITE,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE}/logo.png`,
    width: 512,
    height: 512,
  },
  image: IMAGE,
  slogan: 'Mails After Death',
  description:
    'A dead man’s switch for the words you would want said. Write now, check in monthly, and the letters are only ever delivered after months of writing to you first.',
  // No email: nothing here has been confirmed as a monitored address, and an
  // Organization.contactPoint pointing at a dead inbox is worse than no contact
  // at all. Add it when there is a real one, and give it contactType too.
  knowsAbout: [
    'Digital legacy',
    'Last letters',
    'End-of-life planning',
    'Conditional message delivery',
    'Estate planning',
  ],
}

const WEBSITE = {
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  url: SITE,
  name: NAME,
  description: 'Mails After Death. Write your Death Mail; we make sure it reaches them.',
  publisher: { '@id': `${SITE}/#organization` },
  inLanguage: 'en',
}

/** Set or update one <meta>. Cheaper and safer than rewriting the whole head. */
function meta(attr, key, content) {
  if (content === null || content === undefined) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/** Same for <link rel="…">, which is how canonical and the icon are declared. */
function link(rel, href, extra) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
  if (extra) for (const [k, v] of Object.entries(extra)) el.setAttribute(k, v)
}

/** A JSON-LD <script>. Replacing rather than appending keeps it to one graph. */
function jsonLd(graph) {
  const id = 'ld-json'
  let el = document.getElementById(id)
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = id
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(
    { '@context': 'https://schema.org', '@graph': graph },
    null,
    0,
  )
}

/**
 * @param {object} opts
 * @param {string}  opts.title       document title, already the full string
 * @param {string}  opts.description meta description, 70-160 characters
 * @param {string}  opts.path        '/', '/pricing', … used for canonical + og:url
 * @param {string} [opts.ogTitle]    defaults to title
 * @param {boolean}[opts.noindex]    true on the 404 route, so junk URLs stay out of the index
 * @param {object} [opts.faq]        [{ question, answer }] -> FAQPage
 * @param {object} [opts.howTo]      { name, steps: [{ name, text }] }
 * @param {string} [opts.type]       og:type, default 'website'
 */
export function useSeo({ title, description, path, ogTitle, noindex, faq, howTo, type = 'website' }) {
  useEffect(() => {
    const url = `${SITE}${path}`

    document.title = title
    meta('name', 'description', description)
    meta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large')

    link('canonical', url)

    meta('property', 'og:type', type)
    meta('property', 'og:site_name', NAME)
    meta('property', 'og:title', ogTitle || title)
    meta('property', 'og:description', description)
    meta('property', 'og:url', url)
    meta('property', 'og:image', IMAGE)
    meta('property', 'og:image:width', String(IMAGE_W))
    meta('property', 'og:image:height', String(IMAGE_H))
    meta('property', 'og:image:alt', `${NAME} — Mails After Death`)
    meta('property', 'og:locale', 'en_GB')

    meta('name', 'twitter:card', 'summary_large_image')
    meta('name', 'twitter:title', ogTitle || title)
    meta('name', 'twitter:description', description)
    meta('name', 'twitter:image', IMAGE)
  }, [title, description, path, ogTitle, noindex, type])

  useEffect(() => {
    const url = `${SITE}${path}`
    const graph = [
      { ...ORGANIZATION },
      { ...WEBSITE },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: title,
        description,
        isPartOf: { '@id': `${SITE}/#website` },
        about: { '@id': `${SITE}/#organization` },
        inLanguage: 'en-GB',
        primaryImageOfPage: { '@id': `${SITE}/#primaryimage` },
      },
      {
        '@type': 'ImageObject',
        '@id': `${SITE}/#primaryimage`,
        url: IMAGE,
        contentUrl: IMAGE,
        width: IMAGE_W,
        height: IMAGE_H,
        caption: `${NAME} — Mails After Death`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: NAME, item: SITE },
          ...(path === '/'
            ? []
            : [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: document.title.split(/[—·]/)[0].trim(),
                  item: url,
                },
              ]),
        ],
      },
    ]

    // A FAQ on a page with no questions on it is a lie, and one lie costs the
    // whole graph. So these are only emitted where the questions exist.
    if (faq?.length) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: faq.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      })
    }

    if (howTo?.steps?.length) {
      graph.push({
        '@type': 'HowTo',
        '@id': `${url}#howto`,
        name: howTo.name,
        description: howTo.description || description,
        totalTime: howTo.totalTime || undefined,
        step: howTo.steps.map((s, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: s.name,
          text: s.text,
        })),
      })
    }

    jsonLd(graph)
  }, [title, description, path, faq, howTo])
}

/**
 * The homepage's FAQ, exported once so the schema and the visible page cannot
 * disagree — Google penalises FAQPage markup whose questions are not on the
 * page, so these are the same strings the page renders, not a second hand-written
 * copy that drifts. `check-schema.mjs` asserts it.
 */
export const HOME_FAQ = [
  {
    question: 'How much does it cost to try?',
    answer:
      'Nothing, for three months, and we never ask for a card — not to begin and not when the trial ends. Everything runs exactly as it would afterwards: the same letters, the same checking. We email you once before it runs out, and if you do nothing the checking stops and your letters go quiet. Nothing is deleted and nothing is ever sent because a trial lapsed.',
  },
  {
    question: 'How long before anything could be sent?',
    answer:
      'About five months from your last check-in. Roughly eleven weeks of that is spent writing to you, at two addresses, before anything else happens. If you would rather it moved sooner, there is a shorter version: the same sequence in the same order, about a month and a half from your last check-in.',
  },
  {
    question: 'What if I just forget, and it goes out while I am sitting here?',
    answer:
      'One missed check-in does nothing at all. Ten reminders over eighty days come first, and from day three they go to a second address as well. And a single tap, from a link we email you twice in that final stretch, stops all of it — right up to the moment it goes.',
  },
  {
    question: 'Does anyone else get contacted?',
    answer:
      'Only if you ask us to. Naming somebody is optional, it is one tap to add, and it is a single email with two buttons — not a question, not a document, and no proof of anything. They are told that doing nothing costs them nothing, and if they reply we never ask them again.',
  },
  {
    question: 'Why do you need two email addresses?',
    answer:
      'Because an address can quietly stop accepting mail without anybody noticing, and that is the quietest way this could go wrong. We ask the first one on its own, and only bring the second in once you have missed three days — so the people who happen to know your address never get surprise mail.',
  },
  {
    question: 'Can anyone at your end read my letters?',
    answer:
      'No. Not an administrator, not a support agent. The people running the service see names, dates and states — the way a clerk sees an envelope. The words themselves only move when they are delivered.',
  },
  {
    question: 'Is this legal proof of anything?',
    answer:
      'No, and we are careful never to pretend it is. It is not a death certificate, not a probate step, and not a determination of anything. It is a message you set in advance, kept by us, and delivered when you can no longer tell us to stop.',
  },
]

export const LADDER_STEPS = [
  { name: 'We ask if you are there', text: 'Day 0. One tap in an email and the clock starts again. This is the only email sent without being asked.' },
  { name: 'Ten reminders', text: 'Days 3 to 78. From day three a second address is included. None of them counts up at you and none mentions dying.' },
  { name: 'Someone you trust is asked', text: 'Day 80, and only if you nominated somebody. One email, two buttons, no proof required, and doing nothing is a complete answer.' },
  { name: 'One more time, then five days', text: 'Day 87. The link that stops everything is still live and keeps working until the moment anything is sent.' },
  { name: 'The messages are delivered', text: 'Day 92, to the people you named, from an address they will recognise.' },
]