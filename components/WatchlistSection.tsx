'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { CronvaMark } from './CronvaMark'
import { TeamLogo } from './TeamLogo'
import type { WatchlistFixture } from '@/lib/homepage-types'

function FixtureScrollCard({ fixture }: { fixture: WatchlistFixture }) {
  return (
    <div
      style={{
        minWidth: 210,
        background: '#fff',
        border: '0.5px solid var(--color-border)',
        borderRadius: 14,
        padding: '18px 18px 16px',
        flexShrink: 0,
        scrollSnapAlign: 'start',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {/* Date + time row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            color: 'var(--color-fog)',
            fontWeight: 500,
          }}
        >
          {fixture.date}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--color-navy)',
            background: '#fff',
            border: '0.5px solid var(--color-border)',
            borderRadius: 6,
            padding: '3px 9px',
            lineHeight: 1.3,
          }}
        >
          {fixture.time}
        </span>
      </div>

      {/* Teams */}
      <div>
        {fixture.teamB ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexWrap: 'wrap',
              fontSize: 14,
              fontWeight: 500,
              color: 'var(--color-navy)',
              lineHeight: 1.3,
            }}
          >
            <TeamLogo team={fixture.teamA} size={26} />
            <span>{fixture.teamA}</span>
            <span style={{ color: 'var(--color-fog)', fontWeight: 400 }}>vs</span>
            <TeamLogo team={fixture.teamB} size={26} />
            <span>{fixture.teamB}</span>
          </div>
        ) : (
          <p
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: 'var(--color-navy)',
              lineHeight: 1.3,
            }}
          >
            {fixture.teamA}
          </p>
        )}
        <p style={{ fontSize: 12, color: 'var(--color-fog)', marginTop: 3, lineHeight: 1.3 }}>
          {fixture.competition}
        </p>
      </div>

      {/* Tickets link */}
      <Link
        href="#"
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--color-blue)',
          textDecoration: 'none',
          marginTop: 'auto',
        }}
      >
        Get Tickets →
      </Link>
    </div>
  )
}

interface WatchlistSectionProps {
  fixtures: WatchlistFixture[]
}

export function WatchlistSection({ fixtures }: WatchlistSectionProps) {
  const { data: session, status } = useSession()
  const isSignedIn = status === 'authenticated' && !!session

  return (
    <section
      style={{
        padding: '80px 0',
        borderTop: '0.5px solid var(--color-border)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: 'var(--color-navy)',
            marginBottom: 6,
            letterSpacing: '-0.3px',
          }}
        >
          📌 Your watchlist
        </h2>
        <p style={{ fontSize: 13, color: 'var(--color-fog)', marginBottom: 24 }}>
          Your synced calendars in one place.
        </p>
      </div>

      {!isSignedIn ? (
        /* Signed-out prompt */
        <div style={{ padding: '0 32px' }}>
          <div
            style={{
              background: 'var(--color-offwhite)',
              borderRadius: 14,
              padding: '48px 40px',
              textAlign: 'center',
              maxWidth: 480,
              margin: '0 auto',
            }}
          >
            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
              <CronvaMark size={48} />
            </div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: 'var(--color-navy)',
                marginBottom: 12,
              }}
            >
              Your synced calendars
            </h3>
            <p
              style={{
                fontSize: 14,
                color: 'var(--color-fog)',
                lineHeight: 1.65,
                marginBottom: 24,
                maxWidth: 340,
                margin: '0 auto 24px',
              }}
            >
              Sign in to save your favourite calendars and see all your upcoming fixtures in one place.
            </p>
            <Link
              href="/login"
              style={{
                display: 'inline-block',
                background: 'var(--color-navy)',
                color: '#fff',
                padding: '10px 26px',
                borderRadius: 9999,
                fontSize: 14,
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'opacity 120ms',
              }}
            >
              Sign in or create account
            </Link>
          </div>
        </div>
      ) : (
        /* Signed-in: fixture scroll row */
        <div style={{ padding: '0 32px' }}>
          <div
            className="scroll-row"
            style={{
              display: 'flex',
              gap: 14,
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              paddingBottom: 4,
            }}
          >
            {fixtures.length > 0 ? (
              fixtures.map((fixture, i) => (
                <FixtureScrollCard key={i} fixture={fixture} />
              ))
            ) : (
              <p style={{ fontSize: 13, color: 'var(--color-fog)' }}>
                Sync a calendar to see your upcoming fixtures here.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
