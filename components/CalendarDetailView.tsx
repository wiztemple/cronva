'use client'

import Link from 'next/link'
import { NavBar } from '@/components/NavBar'
import { HeroSplit } from '@/components/HeroSplit'
import { NavyPanel } from '@/components/NavyPanel'
import { Footer } from '@/components/Footer'
import { CalendarIcon } from '@/components/CalendarIcon'
import { CalendarDetailLayout, type CalendarEventItem } from '@/components/CalendarDetailLayout'
import { formatSubscriberCount, type Calendar } from '@/lib/calendars'

interface CalendarDetailViewProps {
  calendar: Calendar
  slug: string
  calendarId: string
  events: CalendarEventItem[]
  related: Calendar[]
  baseUrl: string
  isSubscribed: boolean
  syncMode?: boolean
}

export function CalendarDetailView({
  calendar,
  slug,
  calendarId,
  events,
  related,
  baseUrl,
  isSubscribed,
  syncMode = false,
}: CalendarDetailViewProps) {
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
          <div
            style={{
              background: '#fff',
              padding: '28px 32px',
              borderBottom: '0.5px solid var(--color-border)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--color-navy)',
                marginBottom: 8,
              }}
            >
              {syncMode ? 'Choose your fixtures' : 'Sync to your calendar'}
            </p>
            <p style={{ fontSize: 13, color: 'var(--color-fog)', lineHeight: 1.55, margin: 0 }}>
              {syncMode
                ? 'Select the events you want below, then add them to Google, Apple, or Outlook.'
                : 'Add the full calendar in one tap, or pick individual fixtures.'}
            </p>
            {!syncMode && (
              <Link
                href={`/cal/${slug}?sync=1`}
                style={{
                  display: 'inline-block',
                  marginTop: 14,
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#fff',
                  background: 'var(--color-blue)',
                  padding: '8px 18px',
                  borderRadius: 9999,
                  textDecoration: 'none',
                }}
              >
                + Pick events to sync
              </Link>
            )}
          </div>
        }
      />

      {syncMode && (
        <div
          style={{
            background: 'var(--color-sky)',
            borderBottom: '0.5px solid var(--color-border)',
            padding: '14px 32px',
          }}
        >
          <p style={{ fontSize: 13, color: 'var(--color-navy)', margin: 0, maxWidth: 1280, marginInline: 'auto' }}>
            <strong>Step 1:</strong> Tick the events you want &nbsp;→&nbsp; <strong>Step 2:</strong> Choose your calendar app on the right
          </p>
        </div>
      )}

      <section style={{ padding: '32px', maxWidth: 1280, margin: '0 auto' }}>
        <CalendarDetailLayout
          events={events}
          pickable={syncMode}
          calendarId={calendarId}
          calendarName={calendar.name}
          calendarSlug={slug}
          baseUrl={baseUrl}
          isSubscribed={isSubscribed}
        />
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
                href={`/cal/${rel.slug}?sync=1`}
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
                  + Sync
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />

      <style>{`
        @media (max-width: 767px) {
          .related-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
