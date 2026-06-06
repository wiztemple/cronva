import type { Metadata } from 'next'
import './globals.css'
import { Nav } from '@/components/Nav'
import { Providers } from '@/components/Providers'


export const metadata: Metadata = {
  title: {
    default: 'Cronva — Time, delivered.',
    template: '%s | Cronva',
  },
  description:
    'Subscribe to sports and entertainment calendars — EPL, F1, NBA, movies, TV episodes, BBNaija and more. Auto-syncs to Google, Apple, or Outlook. No app required.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://cronva.app'),
  openGraph: {
    title: 'Cronva — Time, delivered.',
    description: 'Sports and entertainment calendars that sync to any calendar app.',
    siteName: 'Cronva',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Nav />
          <main>{children}</main>
          <footer
            style={{
              borderTop: '1px solid rgba(26,63,111,0.1)',
              padding: '32px 24px',
              marginTop: 80,
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '13px', color: 'var(--color-fog)' }}>
              © {new Date().getFullYear()} Cronva · Time, delivered. ·{' '}
              <a href="/about" style={{ color: 'var(--color-fog)', textDecoration: 'underline' }}>
                About
              </a>
              {' · '}
              <a href="/trending" style={{ color: 'var(--color-fog)', textDecoration: 'underline' }}>
                Trending
              </a>
              {' · '}
              <a href="/request" style={{ color: 'var(--color-fog)', textDecoration: 'underline' }}>
                Request a calendar
              </a>
            </p>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
