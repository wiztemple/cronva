'use client'

import Link from 'next/link'
import { CalendarIcon } from './CalendarIcon'
import { hasCalendarBrandLogo } from '@/lib/brand-logos'
import type {
  ArtistTourCard,
  NigerianShowCard as NigerianShow,
  RankedCalendar,
} from '@/lib/homepage-types'
import { SyncButton } from './SyncButton'

function NigerianShowCard({ show, onSync }: { show: NigerianShow; onSync: () => void }) {
  return (
    <div
      style={{
        minWidth: 130,
        flexShrink: 0,
        scrollSnapAlign: 'start',
        cursor: 'pointer',
      }}
    >
      {/* Poster */}
      <div
        className="card-lift"
        style={{
          width: 130,
          height: 180,
          borderRadius: 12,
          background: show.gradient,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <span style={{ fontSize: 48, lineHeight: 1 }}>{show.emoji}</span>
        <p
          style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            right: 10,
            fontSize: 11,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          {show.name}
        </p>
      </div>
      <p
        style={{
          fontSize: 12,
          color: 'var(--color-fog)',
          marginBottom: 8,
          lineHeight: 1.3,
        }}
      >
        {show.nextDate}
      </p>
      <SyncButton slug={show.slug} size="sm" label="+ Sync" onSync={onSync} />
    </div>
  )
}

function TourCard({ tour, onSync }: { tour: ArtistTourCard; onSync: () => void }) {
  return (
    <div
      className="card-lift"
      style={{
        minWidth: 240,
        background: '#fff',
        border: '0.5px solid var(--color-border)',
        borderRadius: 14,
        padding: 16,
        flexShrink: 0,
        scrollSnapAlign: 'start',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: tour.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          flexShrink: 0,
        }}
      >
        {tour.emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-navy)', lineHeight: 1.2 }}>
          {tour.artist}
        </p>
        <p
          style={{
            fontSize: 12,
            color: 'var(--color-fog)',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginTop: 2,
          }}
        >
          {tour.tourName}
        </p>
        <p style={{ fontSize: 11, color: 'var(--color-blue)', marginTop: 4, fontWeight: 500 }}>
          {tour.nextShow}
        </p>
      </div>
      <SyncButton slug={tour.slug} size="sm" label="Sync" onSync={onSync} />
    </div>
  )
}

function GlobalSportRow({ sport, onSync }: { sport: RankedCalendar; onSync: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '12px 0',
        borderBottom: '0.5px solid var(--color-border)',
      }}
    >
      {/* Rank */}
      <span
        style={{
          fontSize: 28,
          fontWeight: 400,
          color: '#ECEAE4',
          letterSpacing: '-1px',
          width: 36,
          textAlign: 'right',
          flexShrink: 0,
        }}
      >
        {sport.rank}
      </span>

      {hasCalendarBrandLogo(sport.slug) ? (
        <CalendarIcon
          slug={sport.slug}
          iconCategory={sport.iconCategory ?? 'football'}
          size={28}
          sportIconSize={14}
        />
      ) : (
        <span style={{ fontSize: 20, flexShrink: 0 }}>{sport.emoji}</span>
      )}

      {/* Name + next event */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-navy)', lineHeight: 1.2 }}>
          {sport.name}
        </p>
        <p style={{ fontSize: 12, color: 'var(--color-fog)', marginTop: 2 }}>
          {sport.nextEvent}
        </p>
      </div>

      {/* Subscriber count */}
      <span
        style={{
          fontSize: 12,
          color: '#ccc',
          flexShrink: 0,
          display: 'none',
        }}
        className="global-sport-subs"
      >
        {sport.subscribers}
      </span>

      <SyncButton slug={sport.slug} size="sm" label="+ Sync" onSync={onSync} />
    </div>
  )
}

/* ─── Main export ─── */

interface EntertainmentSectionProps {
  onSync?: () => void
  trendingRanked: RankedCalendar[]
  nigerianShows: NigerianShow[]
  afrobeatsTours: ArtistTourCard[]
}

export function EntertainmentSection({
  onSync = () => {},
  trendingRanked,
  nigerianShows,
  afrobeatsTours,
}: EntertainmentSectionProps) {
  return (
    <div>
      {/* A: Nigerian entertainment */}
      <section
        style={{
          padding: '80px 0 0',
          borderTop: '0.5px solid var(--color-border)',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              padding: '0 32px',
              marginBottom: 20,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  color: 'var(--color-navy)',
                  marginBottom: 6,
                  letterSpacing: '-0.3px',
                }}
              >
                🎬 Nigerian entertainment
              </h2>
              <p style={{ fontSize: 13, color: 'var(--color-fog)' }}>
                Shows, awards and events that matter most.
              </p>
            </div>
            <Link
              href="/trending"
              style={{ fontSize: 13, color: 'var(--color-blue)', textDecoration: 'none', fontWeight: 500 }}
            >
              See all →
            </Link>
          </div>

          <div
            className="scroll-row"
            style={{
              display: 'flex',
              gap: 14,
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              padding: '0 32px 24px',
            }}
          >
            {nigerianShows.map((show) => (
              <NigerianShowCard key={show.slug} show={show} onSync={onSync} />
            ))}
          </div>
        </div>
      </section>

      {/* B: Afrobeats tours */}
      <section style={{ padding: '40px 0 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ padding: '0 32px', marginBottom: 20 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: 'var(--color-navy)',
                marginBottom: 6,
                letterSpacing: '-0.3px',
              }}
            >
              🎤 Afrobeats tours
            </h2>
            <p style={{ fontSize: 13, color: 'var(--color-fog)' }}>
              The artists your city is waiting for.
            </p>
          </div>

          <div
            className="scroll-row"
            style={{
              display: 'flex',
              gap: 12,
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              padding: '0 32px 24px',
            }}
          >
            {afrobeatsTours.map((tour) => (
              <TourCard key={tour.slug} tour={tour} onSync={onSync} />
            ))}
          </div>
        </div>
      </section>

      {/* C: Global sports this week */}
      <section style={{ padding: '40px 0 80px' }}>
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
            🌍 Global sports this week
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-fog)', marginBottom: 20 }}>
            Ranked by sync activity.
          </p>

          <div>
            {trendingRanked.map((sport) => (
              <GlobalSportRow key={sport.slug} sport={sport} onSync={onSync} />
            ))}
          </div>

          <style>{`
            @media (min-width: 768px) {
              .global-sport-subs { display: inline !important; }
            }
          `}</style>
        </div>
      </section>
    </div>
  )
}
