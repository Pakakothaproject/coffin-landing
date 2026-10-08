import { useSeo } from '../Seo.jsx'

export default function Terms() {
  useSeo({
    title: 'Terms — CoffinMail, Mails After Death',
    description:
      'The terms of CoffinMail, including the part that matters most: this service never determines whether you have died, and no letter is ever sent on silence alone.',
    path: '/terms',
  })

  return (
    <>
      <section className="band band--head">
        <div className="wrap">
          <p className="kicker">Terms</p>
          <h1 className="h1">The terms, in plain words</h1>
          <p className="lede">
            Nobody reads a document they cannot follow, and a term nobody reads protects nobody. The clause that governs
            everything else is the first one: this service does not decide whether you are dead.
          </p>
        </div>
      </section>

      <section className="band">
        <div className="wrap prose">
          <h2>1. What the service does</h2>
          <p>
            You write one or more messages, say who should receive them, and buy a slot behind each message for a term
            you choose. While a slot is running we ask you at your chosen interval — monthly by default — whether you are
            still there, at every address you gave us. If you stop answering, we write to you ten times across eighty
            days, then we ask the person you named, if you named one, and only then do your messages go out.
          </p>

          <h2>2. This is not a determination of death</h2>
          <p>
            Nothing here is a death certificate, a probate step, or evidence of either. We are not in a position to
            determine anything of the kind, and we do not claim to be. A confirmation from the person you nominated is
            their statement, not our finding. Neither they nor anyone receiving a message is responsible for having
            confirmed in good faith.
          </p>

          <h2>3. Silence is never enough on its own</h2>
          <p>
            A single missed check-in sends nothing. Before anything is delivered the service writes to you ten times
            across eighty days, at every address you gave us. If you named somebody, they are asked as well — once, and
            one more time if they do not reply. If they tell us you are alive, everything resets and nothing happens. You
            can respond at any point, including after your messages have been assembled and everyone has been told,
            because the same link is emailed to you and keeps working until the moment anything is sent. There is no
            penalty for responding late.
          </p>

          <h2>4. A slot, and what it is not</h2>
          <p>
            A slot is a payment for our promise to keep checking on one message for the term you bought. It is not a
            subscription, it does not renew, and it is never turned into another charge. If the service ends, the time
            remaining on your slots is refunded to you automatically.
          </p>

          <h2>5. Your words remain yours</h2>
          <p>
            You keep every right in what you write. You allow us only what is needed to keep it safely and hand it to the
            person you named, at the moment we have both agreed on. We do not read it, sell it, licence it, or use it in
            advertising. Delivery links work once and expire; they cannot be shared onward in a way that keeps working.
          </p>

          <h2>6. Using the service properly</h2>
          <p>
            Please do not use it to harass anyone, to pretend to be somebody else, or to send anything unlawful. A message
            that appears forged, or that names someone who has not been told to expect it, can be paused while we write
            to you about it. Where the law requires us to withhold or hand something over, we will tell you unless we are
            forbidden to.
          </p>

          <h2>7. Availability</h2>
          <p>
            The service is provided as it is. We do not promise an uptime figure we have not written down and tested.
            What we do promise is behaviour: the sequence above is built into the service and checked by tests, and if
            any of those checks fail the sequence stops rather than guessing. Sending early is the one failure worth
            preventing, so it is the one we spend our effort on.
          </p>

          <h2>8. If we ever stop</h2>
          <p>
            Ninety days’ notice to everyone with an account, by email and on the screen. Everything you have written
            stays downloadable, with no fee and no waiting period. Every message already prepared and addressed is
            delivered before the service closes. This is part of the product rather than an afterthought, and it is the
            reason it is written down at all.
          </p>

          <h2>9. Liability</h2>
          <p>
            To the extent the law allows it, our responsibility for any slot is limited to the amount you paid for it.
            This does not limit anything that cannot lawfully be limited, including liability for death or personal
            injury caused by our negligence, or for fraud, and it does not remove any right you have as a consumer under
            the law where you live.
          </p>

          <h2>10. Changes, and the last few blanks</h2>
          <p>
            If these terms change in a way that affects a slot you already paid for, we will tell you before the change
            takes effect. Our registered company name, its address and the governing law are filled in and published here
            before we take a payment from anybody.
          </p>
          <p className="fine">Questions go to the address in the app’s Settings, and reach a person.</p>
        </div>
      </section>
    </>
  )
}