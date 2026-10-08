import { useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Footer from './Footer.jsx'

const APP_URL = 'https://app.coffinmail.com'

// Privacy and Terms are deliberately not here. Nobody looks for a privacy policy
// in a top bar, and having them there makes a short site look like a long one.
const NAV = [
  { label: 'How it works', to: '/features' },
  { label: 'Pricing', to: '/pricing' },
]

export default function Layout({ children }) {
  const { pathname } = useLocation()

  useEffect(() => {
    document.getElementById('year').textContent = String(new Date().getFullYear())
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <header className="masthead">
        <div className="masthead__in">
          <Link className="masthead__brand" to="/">
            <img className="masthead__mark" src="/icon-256.png" alt="" aria-hidden="true" width="256" height="256" decoding="async" />
            CoffinMail
          </Link>
          <nav className="masthead__nav" aria-label="Primary">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? 'is-active' : '')}>
                {n.label}
              </NavLink>
            ))}
            <a className="masthead__cta" href={APP_URL}>
              Open the app
            </a>
          </nav>
        </div>
      </header>

      <main id="main">{children}</main>

      <Footer />
    </>
  )
}