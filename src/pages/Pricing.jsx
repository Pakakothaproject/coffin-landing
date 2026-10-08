import { Link } from 'react-router-dom'
import { useMeta } from '../Layout.jsx'

const APP_URL = 'https://app.coffinmail.com'

/*
 * $20 covers one message for one year. Every further message is $5, and every
 * further year is $5 for every message being held — and the whole schedule is
 * capped at $500, which is the price of the longest term we sell. `check-price.mjs`
 * in this folder compares this copy against the product's own formula and the
 * database migration that implements it, so the published table cannot quietly
 * become a different price from the one anybody is charged.
 */
const CAP_CENTS = 50000
const price = (messages, years) =>
  Math.min(2000 + 500 * (messages - 1) + 500 * (years - 1) * messages, CAP_CENTS)
const money = (cents) => '$' + (cents / 100).toFixed(0)

const TERMS = [
  [1, 'One year to live with it'],
  [2, 'The two years most people mean'],
  [5, 'Five years of not thinking about it'],
  [10, 'A decade of putting it down'],
  [50, 'As long as we are here — Forever'],
]

const MESSAGES = [1, 2, 3, 5]

export default function Pricing() {
  useMeta(
    'Pricing — CoffinMail',
    'Three months free to try, with no card. After that $20 covers one message for a year, every further message is $5, and nothing ever costs more than $500.',
  )

  return (
    <>
      <section className="band band--head">
        <div className="wrap">
          <p className="kicker">Pricing</p>
          <h1 className="h1">Three months free. Then twenty dollars.</h1>
          <p className="lede">
            Start with the whole thing running for three months, on the house, and no card asked for — not to begin, and
            not at the end. When that runs out you decide whether it is worth keeping. Writing is free either way, and so
            is privacy.
          </p>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <h2 className="h2">What a message costs to keep</h2>
          <div className="price-scroll" tabIndex={0} role="region" aria-label="Price schedule, scrollable">
            <table className="price">
              <caption>
                One payment for the whole term. The first message is {money(2000)} for a year, each further message
                is {money(500)}, and each further year adds {money(500)} per message — and then it stops, because{' '}
                <strong>nothing ever costs more than {money(CAP_CENTS)}</strong>. That is the price of the longest
                term, whatever it covers and however long you ask for.
              </caption>
              <thead>
                <tr>
                  <th scope="col">How long we keep checking</th>
                  {MESSAGES.map((m) => (
                    <th scope="col" key={m}>
                      {m} {m > 1 ? 'messages' : 'message'}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TERMS.map(([years, note]) => (
                  <tr key={years}>
                    <th scope="row">
                      {years === 50 ? 'Forever' : `${years} ${years === 1 ? 'year' : 'years'}`}
                      <span className="price__note">{note}</span>
                    </th>
                    {MESSAGES.map((m) => (
                      <td key={m}>{money(price(m, years))}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="fine">
            Prices in dollars; any tax is handled at checkout. You can move cover from one message to another, or add
            more, at any time before anything is sent. Nothing renews itself; we email you once a month before a term
            ends, and if it lapses the letter goes quiet rather than being delivered.
          </p>
        </div>
      </section>

      <section className="band band--deep">
        <div className="wrap">
          <h2 className="h2">The free trial, in plain terms</h2>
          <dl className="kinds">
            <div className="kinds__row">
              <dt>Three months, no card</dt>
              <dd>
                Everything runs exactly as it would once you pay — the same letters, the same people, the same checking.
                We never ask for card details, at the start or on the last day.
              </dd>
            </div>
            <div className="kinds__row">
              <dt>We tell you before it ends</dt>
              <dd>
                One email a month before your trial is over, saying what it costs to keep going and what happens if you
                do nothing. No surprise, no auto-charge, because there is nothing to charge.
              </dd>
            </div>
            <div className="kinds__row">
              <dt>If you do nothing</dt>
              <dd>
                The checking stops and your letters go quiet. They are not deleted, they are simply no longer watched, and
                nothing is ever sent because a trial ran out. Pick up again whenever you like.
              </dd>
            </div>
            <div className="kinds__row">
              <dt>Your words are yours throughout</dt>
              <dd>
                Whether you pay or not, nobody can read them — not us, not support — and you can download everything and
                leave at any point.
              </dd>
            </div>
          </dl>
          <p className="acts">
            <a className="btn btn--solid" href={APP_URL}>
              Start the free trial
            </a>
            <Link className="btn" to="/features">
              What you get
            </Link>
          </p>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <h2 className="h2">The two fair questions</h2>
          <dl className="qa">
            <div>
              <dt>Why does a longer term cost more?</dt>
              <dd>
                Because we are the ones holding the promise. Keeping a letter safe for ten years means keeping it safe
                through whatever happens to us in those ten years. So the price climbs — and then stops, at five hundred
                dollars, which is the most this will ever cost for as long as we exist.
              </dd>
            </div>
            <div>
              <dt>What does &ldquo;Forever&rdquo; actually mean?</dt>
              <dd>
                It means the longest term we sell, at {money(CAP_CENTS)}, and it is the top of the scale rather than a
                special deal: ask for a hundred years instead of fifty and you pay the same five hundred dollars. What
                you are buying is our promise to keep checking, and that promise is written down — ninety days&rsquo;
                notice, everything exported with one click, refunds sent automatically, every message still waiting gone
                out before we are.
              </dd>
            </div>
            <div>
              <dt>Why is the first message more than the others?</dt>
              <dd>
                Because the first one carries the whole cost of standing behind a service — the account, the checking,
                the emails, the part where a stranger decides whether to trust us. Every message after that is close to
                free, and it stays that way however many you add.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="band band--tight">
        <div className="wrap">
          <h2 className="h2">The uncomfortable part</h2>
          <p className="lede">
            We are a small company, and small companies fail. This one may not exist in twenty years. It is the biggest
            risk in the whole idea, so it is written down rather than implied: ninety days’ notice, everything exported
            with one click, refunds sent automatically, and every message still waiting goes out first.
          </p>
        </div>
      </section>
    </>
  )
}