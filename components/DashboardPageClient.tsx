'use client'

import Link from 'next/link'
import { NavBar } from '@/components/NavBar'
import { CalendarCard } from '@/components/CalendarCard'
import { EmptyState } from '@/components/EmptyState'
import { Footer } from '@/components/Footer'
import type { Calendar } from '@/lib/calendars'

interface DashboardPageClientProps {
  calendars: Calendar[]
  userName?: string | null
  userImage?: string | null
}

export function DashboardPageClient({
  calendars,
  userName,
  userImage,
}: DashboardPageClientProps) {
  return (
    <>
      <NavBar authenticated userName={userName ?? undefined} userImage={userImage} />

      <section
        style={{
          background: 'var(--color-navy)',
          padding: '32px',
          minHeight: 120,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 400,
                color: '#fff',
                letterSpacing: '-0.5px',
                marginBottom: 4,
              }}
            >
              My calendars
            </h1>
            <p style={{ fontSize: 14, color: 'var(--color-blue)', margin: 0 }}>
              {calendars.length} calendar{calendars.length !== 1 ? 's' : ''} synced
            </p>
          </div>
          <Link
            href="/"
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: '#fff',
              border: '0.5px solid rgba(255,255,255,0.3)',
              padding: '8px 18px',
              borderRadius: 6,
              textDecoration: 'none',
              transition: 'background 120ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            Browse more calendars →
          </Link>
        </div>
      </section>

      <section style={{ padding: '40px 32px 80px', maxWidth: 1280, margin: '0 auto' }}>
        {calendars.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="calendar-grid">
            {calendars.map((cal) => (
              <CalendarCard
                key={cal.slug}
                slug={cal.slug}
                name={cal.name}
                sport={cal.sport}
                category={cal.category}
                nextEvent={cal.nextEvent}
                nextDate={cal.nextEventDate}
                subscriberCount={cal.subscriberCount}
                iconBg={cal.iconBg}
                iconCategory={cal.iconCategory}
                iconUrl={cal.iconUrl}
                badge={cal.badge}
                subscribed
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  )
}
