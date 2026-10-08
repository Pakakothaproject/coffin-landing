import { Link } from 'react-router-dom'
import { useMeta } from '../Layout.jsx'

export default function NotFound() {
  useMeta('Not found — CoffinMail', 'That page does not exist. The ladder, the pricing and the policies are all still here.')

  return (
    <section className="band band--head">
      <div className="wrap">
        <p className="kicker">404</p>
        <h1 className="h1">Nothing on this rung</h1>
        <p className="lede">
          That address does not exist. Everything real is three links away.
        </p>
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