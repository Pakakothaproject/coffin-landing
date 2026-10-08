import { Link } from 'react-router-dom'
import { useSeo } from '../Seo.jsx'

export default function Privacy() {
  useSeo({
    title: 'Privacy — CoffinMail, who can read your letters',
    description:
      'Nobody reads your letters: not us, not staff, not support. What CoffinMail holds, who can see it, where it is kept, and how to export or delete all of it.',
    path: '/privacy',
  })

  return (
    <>
      <section className="band band--head">
        <div className="wrap">
          <p className="kicker">Privacy</p>
          <h1 className="h1">Who can read your words</h1>
          <p className="lede">
            Nobody — until the message is delivered to the person you wrote it to. Not us, not anybody who works here,
            not a support agent. That is how the service is built, not a promise in a policy: your words are sealed, and
            only the right person can open them.
          </p>
        </div>
      </section>

      <section className="band">
        <div className="wrap prose">
          <h2>What we hold for you</h2>
          <ul className="plain">
            <li>
              <strong>Your account</strong> — the sign-in you use, your name, and a phone number. The number is there for
              one reason: to reach you when email goes quiet.
            </li>
            <li>
              <strong>Your words</strong> — everything you write, and who you intend it for. Drafts are saved as you
              type. Nothing is sent, watched, or counted on unless a slot is behind it.
            </li>
            <li>
              <strong>Sealed items</strong> — accounts, logins and codes, sealed by your own device before they leave it.
              We hold them sealed. We cannot open them, and we do not hold the key that opens them.
            </li>
            <li>
              <strong>Files you attach</strong> — the original photographs, recordings and papers, kept privately and
              given only to the person each one was written for.
            </li>
            <li>
              <strong>The record of what we did</strong> — when we wrote to you, when we contacted the person you
              nominated, and what happened next. You can read all of this yourself while you are here.
            </li>
          </ul>

          <h2>Who can see it</h2>
          <ul className="plain">
            <li>
              <strong>You</strong>, always — including a one-click download of everything, whenever you want it.
            </li>
            <li>
              <strong>The person a message is for</strong>, once, when it is delivered. The link they use cannot be
              reused, cannot be guessed, and expires. Files attached to it are unlocked for an hour and no longer.
            </li>
            <li>
              <strong>The person you named</strong> — that you named them, where things stand, and the one question we
              asked them. They are asked once, and one more time if they do not answer. Never what any message says.
            </li>
            <li>
              <strong>Us</strong> — names, dates and states. We can see that a letter exists and where it is in the
              sequence. We cannot read it. There is no version of this service where that changes.
            </li>
          </ul>

          <h2>Where it is kept</h2>
          <p>
            Your account and your words are held by our database provider, our files are held by our storage provider, the
            service runs on our hosting provider, and messages to you are sent by our email provider from an address on a
            dedicated sending domain. Payments are handled by our payment provider, who is the merchant of record — card
            details never touch our systems. We name these companies in full in the{' '}
            <Link to="/terms">terms</Link>, because the list of places your words exist should not be a secret.
          </p>
          <p>
            We do not sell anything, we do not share anything for advertising, and there are no trackers on this site.
          </p>

          <h2>How long we keep it</h2>
          <p>
            Your account, your words and your files stay until you delete them. A slot has a term, and a month before
            that term ends you are told once — the letter itself survives and can be armed again whenever you like.
            Deleting your account deletes your words, your sealed items and your files, and every delivery link stops
            working, because there is nothing left behind it to unlock.
          </p>

          <h2>Your choices</h2>
          <p>
            Everything is downloadable from the app in one click: your letters as plain writing, your sealed items as a
            file only you can open, your files as the originals. Deleting your account is in the same place. If you would
            rather do either of those in writing, or you want a copy of anything we hold, write to the address in the
            app&rsquo;s Settings and a person will do it.
          </p>

          <h2>Cookies</h2>
          <p>
            This site sets none. The app keeps you signed in using your browser&rsquo;s own storage, clears it when you
            sign out, and is never used to follow you around the internet.
          </p>
        </div>
      </section>
    </>
  )
}