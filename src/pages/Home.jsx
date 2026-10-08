import { Link } from 'react-router-dom'
import VideoScene from '../VideoScene.jsx'
import { useSeo, HOME_FAQ, LADDER_STEPS } from '../Seo.jsx'

// The FAQ renders from the same array the FAQPage schema is built from, so the
// markup can never describe questions the page does not show.
const FAQ = HOME_FAQ

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


export default function Home() {
  useSeo({
    title: 'CoffinMail — Mails After Death, written before you are',
    description:
      'Write your Death Mail now. Check in once a month; if you stop, we write to you ten times over eighty days before anything is sent. Three months free, no card.',
    path: '/',
    faq: HOME_FAQ,
    howTo: {
      name: 'How CoffinMail delivers a letter after death',
      description:
        'The full sequence, from the first monthly check-in to delivery on day 92. Ten reminders come first; a person is only asked if you nominated one.',
      totalTime: 'P92D',
      steps: LADDER_STEPS,
    },
  })

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
          {/* Answer-first, and invisible as a device: the paragraph a search
              engine or an answer engine lifts out for "what is a dead man's
              switch" is the same one a person reads. */}
          <p className="lede lede--answer">
            CoffinMail keeps letters you write now and delivers them to the people you name if you stop being
            able to tell us to stop. You check in once a month with a one-tap email. If you go quiet, we write to
            you ten times across eighty days, and a person you nominated is asked before anything is sent. If nobody
            ever replies, the letters go out on day 92.
          </p>
          <h2 className="h2 h2--after">What you get</h2>
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
          <h2 className="h2">What happens if I stop checking in?</h2>
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
          <h2 className="h2">What do you promise me?</h2>
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
          <h2 className="h2">How long does it take before anything is sent?</h2>
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
          <h2 className="h2">Is there a free trial?</h2>
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
          <h2 className="h2">What does it cost after the trial?</h2>
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
          <h2 className="h2">What happens if CoffinMail ever stops?</h2>
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
          <h2 className="h2">Questions people actually ask</h2>
          <dl className="qa">
            {FAQ.map(({ question: q, answer: a }) => (
              <div key={q}>
                <dt>{q}</dt>
                <dd>{a}</dd>
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