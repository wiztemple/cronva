import { prisma } from '@/lib/db/client'
import { CalendarCard } from '@/components/CalendarCard'
import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Trending',
  description: 'The fastest-growing sports and entertainment calendars on Cronva this week.',
}

export default async function TrendingPage() {
  const now = new Date()

  const calendars = await prisma.calendar.findMany({
    where: { isActive: true },
    orderBy: { subscriberCount: 'desc' },
    take: 12,
    include: {
      events: {
        where: { status: { not: 'cancelled' }, startDatetime: { gt: now } },
        orderBy: { startDatetime: 'asc' },
        take: 1,
      },
      _count: {
        select: {
          userSubscriptions: true,
        },
      },
    },
  })

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
      <div style={{ paddingTop: 64, paddingBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span className="badge-live">Trending</span>
        </div>
        <h1
          style={{
            fontWeight: 500,
            fontSize: '32px',
            letterSpacing: '-0.384px',
            color: 'var(--color-navy)',
            marginBottom: 8,
          }}
        >
          Trending this week
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--color-fog)' }}>
          The most-subscribed sports and entertainment calendars on Cronva right now.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 12,
          marginBottom: 80,
        }}
      >
        {calendars.map((cal, rank) => (
          <div key={cal.slug} style={{ position: 'relative' }}>
            {/* Rank badge */}
            <div
              style={{
                position: 'absolute',
                top: -8,
                left: -8,
                zIndex: 1,
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: rank < 3 ? 'var(--color-navy)' : 'var(--color-fog)',
                color: rank < 3 ? 'var(--color-gold)' : 'var(--color-snow)',
                fontSize: '12px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              #{rank + 1}
            </div>
            <CalendarCard
              slug={cal.slug}
              name={cal.name}
              category={cal.category}
              subscriberCount={cal.subscriberCount}
              nextEventTitle={cal.events[0]?.title ?? null}
              nextEventDate={cal.events[0]?.startDatetime ?? null}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
