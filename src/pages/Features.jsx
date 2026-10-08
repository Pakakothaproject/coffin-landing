import { Link } from 'react-router-dom'
import { useSeo } from '../Seo.jsx'

const APP_URL = 'https://app.coffinmail.com'

const INCLUDED = [
  {
    title: 'As many drafts as you like',
    body:
      'Writing is free and unlimited, and saved as you type. Five written beginnings — to someone, arrangements and wishes, access and accounts, where things are, and how to do something — or a blank page. All of it stays editable right up to delivery.',
  },
  {
    title: 'Photographs, recordings and papers',
    body:
      'Attach what should travel with the words. Files go out with the message to that one person, unlocked for an hour so they can save what they want to keep.',
  },
  {
    title: 'Sealed lists for the practical things',
    body:
      'Accounts, logins, codes and keys, sealed on your own device before they leave it. Your named person can be given a readable copy to go out with a letter, or the sealed file to open themselves.',
  },
  {
    title: 'Recipients however you reach them',
    body:
      'Names, email addresses and phone numbers, plus a second way of getting hold of someone if one address goes quiet. Nobody is told a message exists until you decide they should be, or until it is delivered.',
  },
  {
    title: 'Check-ins shaped around you',
    body:
      'Every 7, 14, 30, 60 or 90 days, sent at an hour and on a day that suits you. Two addresses are on file by default: we write to the first on its own, and only bring the second in once you have missed three days — so the people who happen to know your address never get surprise mail.',
  },
  {
    title: 'A second pair of eyes, if you want one',
    body:
      'Optional, and never required. Name somebody who knows you and they get a single email if the time comes — two buttons, no question, no proof, and nothing to do if they would rather not. If they say you are fine, everything starts again.',
  },
  {
    title: 'See the whole sequence first',
    body:
      'Before anything is armed, you can read exactly what will be sent, to whom, and on which day — and switch between the long way and the short way yourself. Nothing about the sequence is inferred for you.',
  },
  {
    title: 'A record you can read',
    body:
      'Every message sent, every stage reached, and why — dates and states, visible to you while you are here. You can also take everything with you, in one click, whenever you want it.',
  },
]

const NOT = [
  [
    'Not a will, a probate, or a legal document',
    'It says nothing to a court and certifies nothing. It is a message you set in advance, kept by us, and delivered when you can no longer tell us to stop.',
  ],
  [
    'Not a subscription',
    'One payment for a term. Nothing renews, nothing recurs, nothing is ever converted into another charge, and we warn you a month before a slot ends.',
  ],
  [
    'Not a countdown',
    'Nothing in the service is watching you. The only clock is there to make sure nothing is sent too early — it works in one direction.',
  ],
  [
    'Not read by anyone',
    'Not by us, not by support, not by anybody else — not even the person you name — until the moment it is delivered.',
  ],
  [
    'Not a service that promises to outlive us',
    'This is a small company and it may not exist in twenty years. It is the largest risk in the whole idea, which is why the shutdown terms are written down rather than implied.',
  ],
]

export default function Features() {
  useSeo({
    title: 'What you get — CoffinMail, Mails After Death',
    description:
      'Unlimited free drafts, photographs and sealed lists, a monthly check-in at two addresses, and an optional second pair of eyes. What is included, what is not.',
    path: '/features',
  })

  return (
    <>
      <section className="band band--head">
        <div className="wrap">
          <p className="kicker">What you get</p>
          <h1 className="h1">Everything included, and nothing held back</h1>
          <p className="lede">
            You are handing a stranger the last words of your life. So here is the whole service in plain terms — what
            you can write, what we keep, and precisely what happens if you go quiet.
          </p>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <h2 className="h2">What exactly do I get?</h2>
          <div className="cards">
            {INCLUDED.map((f) => (
              <article className="card" key={f.title}>
                <h3 className="card__title">{f.title}</h3>
                <p className="card__body">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band band--deep">
        <div className="wrap">
          <h2 className="h2">What is this not?</h2>
          <p className="lede">
            Said plainly, because the gaps are where people get misled by services like this one.
          </p>
          <dl className="kinds">
            {NOT.map(([label, blurb]) => (
              <div className="kinds__row" key={label}>
                <dt>{label}</dt>
                <dd>{blurb}</dd>
              </div>
            ))}
          </dl>
          <p className="acts">
            <a className="btn btn--solid" href={APP_URL}>
              Start writing
            </a>
            <Link className="btn" to="/pricing">
              What a slot costs
            </Link>
          </p>
        </div>
      </section>

      <section className="band band--tight">
        <div className="wrap">
          <h2 className="h2">Who can read what I write?</h2>
          <p className="lede">
            Sealed on your own device, kept where only the right person can reach them, and handed over once — through a
            link that cannot be reused or guessed. The long version, in plain terms, is on the{' '}
            <Link to="/privacy">privacy page</Link>.
          </p>
        </div>
      </section>
    </>
  )
}