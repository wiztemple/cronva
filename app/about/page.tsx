import type { Metadata } from 'next'
import Link from 'next/link'
import { CronvaLogo } from '@/components/CronvaLogo'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn how Cronva delivers sports and entertainment fixtures directly to your calendar app — no account, no download required.',
}

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
      <div style={{ paddingTop: 64, paddingBottom: 80 }}>
        {/* Header */}
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <CronvaLogo size={48} />
          </div>
          <h1
            style={{
              fontWeight: 500,
              fontSize: '32px',
              letterSpacing: '-0.384px',
              color: 'var(--color-navy)',
              marginBottom: 12,
            }}
          >
            About Cronva
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: 'var(--color-fog)',
              lineHeight: 1.6,
            }}
          >
            Time, delivered.
          </p>
        </div>

        {/* What is Cronva */}
        <section style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontWeight: 500,
              fontSize: '20px',
              letterSpacing: '-0.2px',
              color: 'var(--color-navy)',
              marginBottom: 16,
            }}
          >
            What is Cronva?
          </h2>
          <div style={{ fontSize: '16px', color: '#3a4a5c', lineHeight: 1.75 }}>
            <p style={{ marginBottom: 16 }}>
              Cronva is a sports and entertainment calendar sync platform. We aggregate
              fixtures, schedules, and event dates from across sports and entertainment — EPL,
              Champions League, Formula 1, NBA, upcoming movies, TV episodes, BBNaija, and more —
              and deliver them directly to your existing calendar app.
            </p>
            <p>
              No new app to download. No account to create. One tap, and every fixture
              for your favourite league auto-syncs to Google Calendar, Apple Calendar,
              or Outlook — and stays up to date automatically.
            </p>
          </div>
        </section>

        {/* How iCal sync works */}
        <section style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontWeight: 500,
              fontSize: '20px',
              letterSpacing: '-0.2px',
              color: 'var(--color-navy)',
              marginBottom: 16,
            }}
          >
            How calendar sync works
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              {
                step: '01',
                title: 'Browse and subscribe',
                desc: 'Find the calendar you want — say, the English Premier League — and click "Add to Google Calendar" or "Add to Apple Calendar."',
              },
              {
                step: '02',
                title: 'Your app subscribes to a live feed',
                desc: 'We generate a secure .ics (iCalendar) feed URL. Your calendar app subscribes to this URL, just like a podcast RSS feed.',
              },
              {
                step: '03',
                title: 'Fixtures sync automatically',
                desc: 'Your calendar app checks the feed every few hours. When we add new fixtures or update kick-off times, changes appear automatically in your calendar.',
              },
              {
                step: '04',
                title: 'Reschedules handled for you',
                desc: 'If a match is postponed or cancelled, we update the event status in the feed. Your calendar app applies the change automatically.',
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr',
                  gap: 16,
                  alignItems: 'start',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'var(--color-sky)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: 'var(--color-navy)',
                    letterSpacing: '0.05em',
                    flexShrink: 0,
                  }}
                >
                  {step}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '15px',
                      fontWeight: 500,
                      color: 'var(--color-navy)',
                      marginBottom: 4,
                    }}
                  >
                    {title}
                  </p>
                  <p style={{ fontSize: '14px', color: 'var(--color-fog)', lineHeight: 1.6 }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Data sources */}
        <section style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontWeight: 500,
              fontSize: '20px',
              letterSpacing: '-0.2px',
              color: 'var(--color-navy)',
              marginBottom: 16,
            }}
          >
            Data sources
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-fog)', marginBottom: 20, lineHeight: 1.6 }}>
            Cronva aggregates data from several sports data providers:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              {
                name: 'football-data.org',
                desc: 'EPL, Champions League, La Liga, Bundesliga, Serie A, World Cup 2026, EURO',
              },
              {
                name: 'API-Sports (api-sports.io)',
                desc: 'NPFL, Super Eagles, AFCON, CAF Champions League',
              },
              {
                name: 'TheSportsDB',
                desc: 'NBA and World Championship Boxing',
              },
              {
                name: 'API-Tennis (api-tennis.com)',
                desc: 'ATP and WTA singles fixtures — optional, requires API_TENNIS_KEY',
              },
              {
                name: 'OpenF1 (openf1.org)',
                desc: 'Formula 1 — all sessions including practice, qualifying, sprint and race',
              },
              {
                name: 'TMDB (The Movie Database)',
                desc: 'Upcoming theatrical movie releases worldwide',
              },
              {
                name: 'Manually curated',
                desc: 'Tennis Grand Slams, TV episodes, BBNaija, Afrobeats tours, Nollywood premieres',
              },
            ].map(({ name, desc }) => (
              <div
                key={name}
                style={{
                  padding: '12px 16px',
                  background: '#ffffff',
                  border: '0.5px solid rgba(26,63,111,0.15)',
                  borderRadius: 8,
                }}
              >
                <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-navy)', marginBottom: 2 }}>
                  {name}
                </p>
                <p style={{ fontSize: '13px', color: 'var(--color-fog)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ textAlign: 'center', paddingTop: 16 }}>
          <Link href="/" className="btn-primary">
            Browse calendars
          </Link>
        </section>
      </div>
    </div>
  )
}
