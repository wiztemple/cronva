'use client'

import { useState } from 'react'
import Link from 'next/link'
import { NavBar } from '@/components/NavBar'
import { HeroSplit } from '@/components/HeroSplit'
import { NavyPanel } from '@/components/NavyPanel'
import { SubscribePanel } from '@/components/SubscribePanel'
import { FixtureRow } from '@/components/FixtureRow'
import { Footer } from '@/components/Footer'
import { CalendarIcon } from '@/components/CalendarIcon'
import { formatSubscriberCount, type Calendar } from '@/lib/calendars'
import type { Fixture } from '@/lib/fixtures'

interface CalendarDetailViewProps {
  calendar: Calendar
  slug: string
  fixtures: Fixture[]
  related: Calendar[]
}

export function CalendarDetailView({ calendar, slug, fixtures, related }: CalendarDetailViewProps) {
  const [showAllFixtures, setShowAllFixtures] = useState(false)

  const displayedFixtures = showAllFixtures ? fixtures : fixtures.slice(0, 10)

  return (
    <>
      <NavBar />

      <HeroSplit
        left={
          <NavyPanel
            variant="detail"
            backHref="/"
            backLabel="← All calendars"
            eyebrow={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <CalendarIcon
                  slug={slug}
                  iconCategory={calendar.iconCategory}
                  iconUrl={calendar.iconUrl}
                  iconBg={calendar.iconBg}
                  size={28}
                  logoHeight={14}
                  sportIconSize={14}
                />
                {calendar.category}
              </span>
            }
            title={calendar.name}
            subtitle={calendar.description}
            stats={[
              {
                value: formatSubscriberCount(calendar.subscriberCount),
                label: 'subscribers synced',
              },
              {
                value: calendar.fixturesPerSeason.toLocaleString(),
                label: 'fixtures per season',
              },
              {
                value: `${calendar.refreshHours}h`,
                label: 'refresh rate',
              },
            ]}
          />
        }
        right={
          <SubscribePanel
            slug={slug}
            calendarName={calendar.name}
            iconBg={calendar.iconBg}
          />
        }
      />

      <section
        className="fixtures-section"
        style={{ padding: '28px 32px', maxWidth: 1280, margin: '0 auto' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <h2 className="text-section-title" style={{ color: 'var(--color-navy)', fontSize: 13 }}>
            Upcoming fixtures
          </h2>
          <span style={{ fontSize: 12, color: 'var(--color-blue)', fontWeight: 500 }}>
            All {fixtures.length} →
          </span>
        </div>

        {fixtures.length === 0 ? (
          <p style={{ fontSize: 14, color: 'var(--color-fog)', padding: '24px 0' }}>
            No upcoming fixtures scheduled yet.
          </p>
        ) : (
          <>
            <div
              style={{
                border: '0.5px solid var(--color-border)',
                borderRadius: 10,
                overflow: 'hidden',
                background: '#fff',
              }}
            >
              {displayedFixtures.map((fixture, i) => (
                <FixtureRow
                  key={fixture.id}
                  fixture={fixture}
                  isLast={i === displayedFixtures.length - 1}
                />
              ))}
            </div>

            {!showAllFixtures && fixtures.length > 10 && (
              <button
                type="button"
                onClick={() => setShowAllFixtures(true)}
                style={{
                  marginTop: 16,
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--color-blue)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Load more
              </button>
            )}
          </>
        )}
      </section>

      {related.length > 0 && (
        <section
          className="related-section"
          style={{ padding: '0 32px 36px', maxWidth: 1280, margin: '0 auto' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <h2 className="text-section-title" style={{ color: 'var(--color-navy)', fontSize: 13 }}>
              More {calendar.sport} calendars
            </h2>
            <Link
              href="/"
              style={{ fontSize: 12, color: 'var(--color-blue)', textDecoration: 'none', fontWeight: 500 }}
            >
              See all →
            </Link>
          </div>

          <div
            className="related-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
            }}
          >
            {related.map((rel) => (
              <Link
                key={rel.slug}
                href={`/cal/${rel.slug}`}
                style={{
                  border: '0.5px solid var(--color-border)',
                  borderRadius: 10,
                  padding: 16,
                  background: '#fff',
                  textDecoration: 'none',
                  transition: 'background 120ms',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-offwhite)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#fff' }}
              >
                <p className="text-badge" style={{ color: 'var(--color-fog)', marginBottom: 6 }}>
                  {rel.category}
                </p>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'var(--color-navy)',
                    marginBottom: 6,
                  }}
                >
                  {rel.name}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--color-fog)', marginBottom: 12 }}>
                  {rel.nextEvent}
                </p>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: 'var(--color-blue)',
                    border: '0.5px solid var(--color-blue)',
                    padding: '4px 11px',
                    borderRadius: 9999,
                    display: 'inline-block',
                  }}
                >
                  + Add
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />

      <style>{`
        @media (max-width: 767px) {
          .fixtures-section { padding: 16px 18px !important; }
          .related-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
