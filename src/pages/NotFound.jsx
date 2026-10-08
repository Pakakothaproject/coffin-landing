import { Link } from 'react-router-dom'
import { useSeo } from '../Seo.jsx'

export default function NotFound() {
  // noindex: this route answers every unknown URL, and the SPA fallback returns
  // HTTP 200 for all of them. Without this, the entire URL space — every typo,
  // every tracking-tag variant — is an indexable soft 404.
  useSeo({
    title: 'Page not found — CoffinMail',
    description: 'That page does not exist. How it works, the pricing and the policies are all still here.',
    path: '/404',
    noindex: true,
  })

  return (
    <section className="band band--head">
      <div className="wrap">
        <p className="kicker">404</p>
        <h1 className="h1">Nothing on this rung</h1>
        <p className="lede">That address does not exist. Everything real is three links away.</p>
        <p className="acts">
          <Link className="btn btn--solid" to="/">
            Back to the start
          </Link>
          <Link className="btn" to="/features">
            How it works
          </Link>
          <Link className="btn" to="/pricing">
            Pricing
          </Link>
        </p>
      </div>
    </section>
  )
}