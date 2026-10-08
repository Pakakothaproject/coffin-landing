import { Link } from 'react-router-dom'
import VideoScene from './VideoScene.jsx'

const LINKS = [
  { label: 'How it works', to: '/features' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'The app', href: 'https://app.coffinmail.com' },
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms', to: '/terms' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <VideoScene className="footer__video" position="50% 35%" />

      <div className="footer__content">
        <img
          className="footer__mark"
          src="/logo.png"
          alt=""
          aria-hidden="true"
          width="512"
          height="512"
          decoding="async"
        />

        <p className="footer__brand">
          <Link to="/" aria-label="CoffinMail home">
            CoffinMail
          </Link>
        </p>

        <p className="footer__tagline">
          Write the words you&rsquo;d want said. We make sure they get there.
        </p>

        <nav className="footer__nav" aria-label="Footer">
          <ul>
            {LINKS.map((l) => (
              <li key={l.label}>
                {l.href ? (
                  <a href={l.href}>{l.label}</a>
                ) : (
                  <Link to={l.to}>{l.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <p className="footer__copy">
          &copy; <span id="year">2026</span> CoffinMail
        </p>
      </div>
    </footer>
  )
}