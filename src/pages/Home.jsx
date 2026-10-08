import { Link } from 'react-router-dom'
import VideoScene from '../VideoScene.jsx'
import { useMeta } from '../Layout.jsx'

const APP_URL = 'https://app.coffinmail.com'

const WHAT = [
  {
    title: 'You write it now, calmly',
    body:
      'Drafts are free and you can keep as many as you like. Start from one of five written beginnings or from a blank page, add photographs or recordings, and change it all next year if you want to. Nothing is watched, and nothing can be sent, until you choose to start.',
  },
  {
    title: 'You carry on living',
    body:
      'A check-in every month â€” or every 7, 14, 60 or 90 days if that suits you better. One tap in the email and you are left alone until the next time. No app to open, no streak to protect.',
  },
  {
    title: 'We never quietly give up on you',
    body:
      'One inbox can go quiet without anybody noticing, so we ask twice: your main address, and a second one you add at the start. The second one only hears from us if you have missed three days â€” no surprise mail for the people who happen to know your address.',
  },
]

const LADDER = [
  {
    at: 'Day 0',
    what: 'We ask if you are there',
    detail:
      'To the address you signed up with. One tap and the clock starts again. This is the only email we send without being asked.',
  },
  {
    at: 'Days 3 â€“ 78',
    what: 'Ten reminders, and a second address joins',
    detail:
      'From day three your spare address is included, and the reminders run all the way to day 78. None of them counts up at you, and none of them mentions dying â€” they ask one small question and tell you we only ever write, never read.',
  },
  {
    at: 'Day 80',
    what: 'Optional: someone you trust is asked',
    detail:
      'Only if you nominated somebody, and only then. One email, two buttons, no question to answer and no proof of anything â€” and they are told plainly that doing nothing costs them nothing. You are told the same day that it has happened.',
  },
  {
    at: 'Day 87',
    what: 'Once more, then five days of grace',
    detail:
      'If they have not answered we ask one final time and write to you again. The link that stops everything is still live, and it keeps working right up to the moment it is sent.',
  },
  {
    at: 'Day 92',
    what: 'Your messages are delivered',
    detail:
      'Assembled, addressed, and out â€” to the people you named, from an address they will recognise.',
  },
]

const PROMISES = [
  {
    title: 'Nobody reads them',
    body:
      'Not us, not staff, not support. Your words stay sealed until they are delivered to the person you wrote them to. We cannot open them, and there is no version of this service where that changes.',
  },
  {
    title: 'Eighty days of writing to you first',
    body:
      'A missed check-in is a dead inbox far more often than it is anything else, so every reminder goes out â€” to two addresses â€” before anything else happens.',
  },
  {
    title: 'One tap stops it, right to the end',
    body:
      'The same link is emailed to you at day 80 and again at day 87, and it works until the moment anything is sent. Come back in hospital, off-grid, or from a borrowed phone â€” it still works.',
  },
  {
    title: 'Nobody is put on a deadline',
    body:
      'Somebody who loves you cannot tell you are dead, and we never ask them to. They get one note with two buttons, they are told doing nothing is a complete answer, and one answer per silence is enough: we start again from zero, and a silence that follows their answer gets thirty days of asking rather than twelve.',
  },
]

const FAQ = [
  {
    q: 'What does it cost to try?',
    a: 'Nothing, for three months, and we never ask for a card â€” not to begin and not when the trial ends. Everything runs exactly as it would afterwards: the same letters, the same checking. We email you once before it runs out, and if you do nothing the checking stops and your letters go quiet. Nothing is deleted and nothing is ever sent because a trial lapsed.',
  },
  {
    q: 'How long before anything could be sent?',
    a: 'About five months from your last check-in. Roughly eleven weeks of that is spent writing to you, at two addresses, before anything else happens. If you would rather it moved sooner, there is a shorter version: the same sequence in the same order, about a month and a half from your last check-in.',
  },
  {
    q: 'What if I just forget, and it goes out while I am sitting here?',
    a: 'One missed check-in does nothing at all. Ten reminders over eighty days come first, and from day three they go to a second address as well. And a single tap, from a link we email you twice in that final stretch, stops all of it â€” right up to the moment it goes.',
  },
  {
    q: 'Does anyone else get contacted?',
    a: 'Only if you ask us to. Naming somebody is optional, it is one tap to add, and it is a single email with two buttons â€” not a question, not a document, and no proof of anything. They are told that doing nothing costs them nothing, and one reply per silence is enough - we start again from zero, with a longer window next time.',
  },
  {
    q: 'Why do you need two email addresses?',
    a: 'Because an address can quietly stop accepting mail without anybody noticing, and that is the quietest way this could go wrong. We ask the first one on its own, and only bring the second in once you have missed three days â€” so the people who happen to know your address never get surprise mail.',
  },
  {
    q: 'Can anyone at your end read my letters?',
    a: 'No. Not an administrator, not a support agent. The people running the service see names, dates and states â€” the way a clerk sees an envelope. The words themselves only move when they are delivered.',
  },
  {
    q: 'Is this legal proof of anything?',
    a: 'No, and we are careful never to pretend it is. It is not a death certificate, not a probate step, and not a determination of anything. It is a message you set in advance, kept by us, and delivered when you can no longer tell us to stop.',
  },
]

export default function Home() {
  useMeta(
    'CoffinMail â€” write your Death Mail',
    'Write your Death Mail now. A monthly check-in keeps it waiting; it only goes out after eighty days of writing to you, and never on silence alone.',
  )

  return (
    <>
      <section className="hero">
        <VideoScene className="hero__video" position="50% 50%" />
        <div className="hero__in">
          <p className="hero__eyebrow">Mails After Death</p>
          <h1 className="hero__title">
            <span className="hero__title-1">Write your Death Mail.</span>
            <span className="hero__title-2">And we&rsquo;ll make sure it reaches them after you die.</span>
          </h1>
          <p className="hero__lede">
            Three months free, no card. Check in monthly; stop answering and we keep writing to you
            for months before anything moves.
          </p>
          <p className="hero__acts">
            <a className="btn btn--solid" href={APP_URL}>
              Start your three free months
            </a>
            <Link className="btn" to="/features">
              See how it works
            </Link>
          </p>
        </div>
      </section>

      <section className="band band--tight">
        <div className="wrap">
          <h2 className="h2">What you get</h2>
          <div className="seals">
            {WHAT.map((w) => (
              <article className="seal" key={w.title}>
                <h3 className="seal__title">{w.title}</h3>
                <p className="seal__body">{w.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band band--deep">
        <div className="wrap">
          <h2 className="h2">What happens if you stop answering</h2>
          <p className="lede">
            This is the whole sequence. There is no hidden stage, no shortened version, and nothing here happens on a
            single missed check-in.
          </p>
          <ol className="ladder">
            {LADDER.map((s) => (
              <li className="ladder__rung" key={s.at}>
                <p className="ladder__at">{s.at}</p>
                <div>
                  <h3 className="ladder__what">{s.what}</h3>
                  <p className="ladder__detail">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="fine">
            Without somebody named, there is no second stage to wait for: the letters go at the end of the eighty days,
            on the strength of everything we wrote to you first. If you did name somebody, they are asked before
            anything is sent.
          </p>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <h2 className="h2">What we promise</h2>
          <div className="cards">
            {PROMISES.map((p) => (
              <article className="card" key={p.title}>
                <h3 className="card__title">{p.title}</h3>
                <p className="card__body">{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band band--tight band--deep">
        <div className="wrap">
          <h2 className="h2">Two ways to do it</h2>
          <p className="lede">
            If you are arranging for later, take the time the sequence needs. If you already know you are ill, the
            shorter version exists for exactly that reason â€” same order, same stops, much less waiting. You choose, and
            you can see the whole thing before you switch anything on.
          </p>
          <dl className="kinds">
            <div className="kinds__row">
              <dt>The long way</dt>
              <dd>
                Monthly check-ins. Your person is asked on day 80, delivery on day 92 â€” about five months from your last
                check-in, with roughly eleven weeks of it spent writing to you.
              </dd>
            </div>
            <div className="kinds__row">
              <dt>The short way</dt>
              <dd>
                The same sequence in the same order, compressed. Your person is asked on day 24, delivery on day 34. The
                link that stops it works exactly as it does on the long way.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="band band--deep">
        <div className="wrap">
          <h2 className="h2">Three months, on us, with no card</h2>
          <div className="split">
            <p>
              Not a demo and not a countdown to a payment screen. For three months you get the whole thing â€” your letters,
              your files, the checking, the sending â€” exactly as it is afterwards. <strong>We never ask for a card</strong>,
              not to begin and not on the last day.
            </p>
            <p>
              When it runs out we email you once, a month beforehand, saying what it costs to keep going and what happens
              if you do nothing. There is nothing to charge, because there is no card on file. If you do nothing, the
              checking stops and your letters go quiet â€” they are not deleted, and nothing is ever sent because a trial
              lapsed.
            </p>
          </div>
          <p className="acts">
            <a className="btn btn--solid" href={APP_URL}>
              Start your three free months
            </a>
          </p>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <h2 className="h2">Three months free. Then twenty dollars.</h2>
          <div className="split">
            <p>
              Start with everything running for three months, on the house, and <strong>no card asked for</strong> â€” not
              to begin, and not on the last day. When it ends you decide. We email you once before then, and if you do
              nothing the checking simply stops.
            </p>
            <p>
              After that, <strong>$20</strong> keeps one message watched for a year. Every further message is $5, and
              every further year adds $5 per message â€” until it stops, because <strong>nothing ever costs more than
              $500</strong>. That is the longest term there is, and we call it Forever, because a number is a smaller
              promise than the one being made. One payment, nothing that renews.
            </p>
          </div>
          <p>
            <Link className="more" to="/pricing">
              See the full price schedule
            </Link>
          </p>
        </div>
      </section>

      <section className="band band--tight band--deep">
        <div className="wrap">
          <h2 className="h2">If we ever stop</h2>
          <p className="lede">
            You would be asking a small company to hold the last words of your life, so the failure case is written down
            now rather than argued about later.
          </p>
          <ol className="promise">
            <li>
              <strong>Ninety daysâ€™ notice</strong> to everyone with an account â€” by email, and on the screen itself.
            </li>
            <li>
              <strong>Everything out, in one click</strong> â€” your letters as plain writing, your sealed items as a file
              only you can open, your photographs as the original files. No fee, no waiting, no asking permission.
            </li>
            <li>
              <strong>No slot ever becomes a bill.</strong> A slot was a promise to keep checking, not a subscription.
              If we stop, the promise ends with the liability.
            </li>
            <li>
              <strong>Refunds automatically</strong>, for whatever time you have left. Sent, not offered.
            </li>
            <li>
              <strong>Every message still waiting goes out first.</strong> You paid for those words; they leave before we
              do.
            </li>
          </ol>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <h2 className="h2">The questions everybody asks</h2>
          <dl className="qa">
            {FAQ.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
          <p className="acts">
            <a className="btn btn--solid" href={APP_URL}>
              Start writing
            </a>
            <Link className="btn" to="/privacy">
              How your words are handled
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}