import Link from 'next/link'
import { CronvaMark } from './CronvaMark'

const SPORTS_LINKS = [
  { label: 'EPL', href: '/cal/epl' },
  { label: 'Champions League', href: '/cal/champions-league' },
  { label: 'La Liga', href: '/cal/la-liga' },
  { label: 'Super Eagles', href: '/cal/super-eagles' },
  { label: 'NPFL', href: '/cal/npfl' },
  { label: 'Formula 1', href: '/cal/formula-1' },
  { label: 'NBA', href: '/cal/nba' },
  { label: 'Boxing', href: '/cal/boxing' },
  { label: 'AFCON', href: '/cal/afcon' },
  { label: 'World Cup 2026', href: '/cal/world-cup-2026' },
]

const ENTERTAINMENT_LINKS = [
  { label: 'BBNaija', href: '/cal/bbnnaija' },
  { label: 'Afrobeats Tours', href: '/cal/afrobeats-tours' },
  { label: 'Nollywood', href: '/cal/nollywood' },
  { label: 'AMVCA', href: '/cal/amvca-2026' },
  { label: 'Islamic Calendar', href: '/cal/ramadan' },
  { label: 'Prayer Times', href: '/cal/ramadan' },
]

const PLATFORM_LINKS = [
  { label: 'How it works', href: '/about' },
  { label: 'Browse all', href: '/' },
  { label: 'Request a calendar', href: '/request' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/about' },
  { label: 'Sitemap', href: '/' },
]

function FooterLinkList({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p
        style={{
          fontSize: 11,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--color-fog)',
          marginBottom: 14,
        }}
      >
        {title}
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              style={{
                fontSize: 13,
                color: 'var(--color-fog)',
                textDecoration: 'none',
                transition: 'color 120ms',
                lineHeight: 1,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-navy)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-fog)' }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer
      style={{
        background: '#fff',
        borderTop: '0.5px solid var(--color-border)',
        padding: '40px 32px 0',
      }}
    >
      <div
        className="footer-columns"
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '220px 1fr 1fr 1fr',
          gap: 40,
          paddingBottom: 32,
        }}
      >
        {/* Col 1: Brand */}
        <div>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 12 }}>
            <CronvaMark size={20} />
            <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-navy)', letterSpacing: '-0.2px' }}>
              cronva
            </span>
          </Link>
          <p style={{ fontSize: 13, color: 'var(--color-fog)', lineHeight: 1.6, marginBottom: 6 }}>
            Time, delivered.
          </p>
          <p style={{ fontSize: 12, color: 'var(--color-fog)', lineHeight: 1.5, marginBottom: 20 }}>
            Built for Nigeria. Works everywhere.
          </p>

          {/* Social icons */}
          <div style={{ display: 'flex', gap: 12 }}>
            {/* Twitter/X */}
            <a
              href="#"
              aria-label="Cronva on X"
              style={{ color: 'var(--color-fog)', transition: 'color 120ms' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--color-navy)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--color-fog)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* Instagram */}
            <a
              href="#"
              aria-label="Cronva on Instagram"
              style={{ color: 'var(--color-fog)', transition: 'color 120ms' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--color-navy)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--color-fog)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>

        {/* Cols 2-4: Link lists */}
        <FooterLinkList title="Sports" links={SPORTS_LINKS} />
        <FooterLinkList title="Entertainment" links={ENTERTAINMENT_LINKS} />
        <FooterLinkList title="Platform" links={PLATFORM_LINKS} />
      </div>

      {/* Bottom bar */}
      <div
        className="footer-bottom"
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          borderTop: '0.5px solid var(--color-border)',
          padding: '18px 0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <p style={{ fontSize: 12, color: '#ccc', margin: 0 }}>
          © 2026 Cronva · Free forever · Made with ☕ in Lagos
        </p>
        <p style={{ fontSize: 12, color: '#ccc', margin: 0 }}>
          cronva.app
        </p>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .footer-columns { grid-template-columns: 1fr 1fr !important; }
          .footer-columns > *:first-child { grid-column: 1 / -1; }
        }
        @media (max-width: 767px) {
          .footer-columns { grid-template-columns: 1fr !important; gap: 28px !important; }
          .footer-bottom { flex-direction: column !important; gap: 6px !important; text-align: center; }
        }
      `}</style>
    </footer>
  )
}
