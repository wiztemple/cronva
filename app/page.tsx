import { prisma } from '@/lib/db/client'
import { CalendarGrid } from '@/components/CalendarGrid'
import { CalendarCard } from '@/components/CalendarCard'
import Link from 'next/link'

export const revalidate = 3600

async function getData() {
  const now = new Date()

  const calendars = await prisma.calendar.findMany({
    where: { isActive: true },
    orderBy: [{ isFeatured: 'desc' }, { subscriberCount: 'desc' }],
    include: {
      events: {
        where: { status: { not: 'cancelled' }, startDatetime: { gt: now } },
        orderBy: { startDatetime: 'asc' },
        take: 2,
      },
    },
  })

  const trending = await prisma.calendar.findMany({
    where: { isActive: true },
    orderBy: { subscriberCount: 'desc' },
    take: 4,
    include: {
      events: {
        where: { status: { not: 'cancelled' }, startDatetime: { gt: now } },
        orderBy: { startDatetime: 'asc' },
        take: 1,
      },
    },
  })

  return { calendars, trending }
}

export default async function HomePage() {
  const { calendars, trending } = await getData()

  // Featured: manual is_featured first; fallback to top 6 by subscriber_count
  const manualFeatured = calendars.filter((c) => c.isFeatured)
  const featured = (manualFeatured.length > 0 ? manualFeatured : calendars).slice(0, 6)

  const cardProps = calendars.map((cal) => ({
    slug: cal.slug,
    name: cal.name,
    category: cal.category,
    subscriberCount: cal.subscriberCount,
    isFeatured: cal.isFeatured,
    nextEventTitle: cal.events[0]?.title ?? null,
    nextEventDate: cal.events[0]?.startDatetime ?? null,
    secondEventDate: cal.events[1]?.startDatetime ?? null,
  }))

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
      {/* Hero */}
      <section style={{ paddingTop: 80, paddingBottom: 72, textAlign: 'center' }}>
        <h1
          className="text-display"
          style={{ color: 'var(--color-navy)', margin: '0 auto 20px', maxWidth: 720 }}
        >
          Every fixture,<br />in your calendar.
        </h1>
        <p
          style={{
            fontSize: '18px', color: 'var(--color-fog)',
            maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.6,
          }}
        >
          Subscribe to sports, movies, TV, and entertainment calendars in one tap.
          Auto-syncs to Google, Apple, or Outlook. No app download required.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#calendars" className="btn-primary">Browse calendars</a>
          <Link href="/about" className="btn-subscribe">How it works</Link>
        </div>
      </section>

      {/* Trending this week */}
      {trending.length > 0 && (
        <section style={{ marginBottom: 72 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="badge-live">Trending</span>
              <h2 style={{ fontWeight: 500, fontSize: '20px', letterSpacing: '-0.2px', color: 'var(--color-navy)' }}>
                Trending this week
              </h2>
            </div>
            <Link href="/trending" style={{ fontSize: '13px', color: 'var(--color-blue)', textDecoration: 'none', fontWeight: 500 }}>
              See all →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {trending.map((cal) => (
              <CalendarCard
                key={cal.slug}
                slug={cal.slug}
                name={cal.name}
                category={cal.category}
                subscriberCount={cal.subscriberCount}
                nextEventTitle={cal.events[0]?.title ?? null}
                nextEventDate={cal.events[0]?.startDatetime ?? null}
              />
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section style={{ marginBottom: 72 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <h2 style={{ fontWeight: 500, fontSize: '20px', letterSpacing: '-0.2px', color: 'var(--color-navy)' }}>
              Popular calendars
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {featured.map((cal) => (
              <CalendarCard
                key={cal.slug}
                slug={cal.slug}
                name={cal.name}
                category={cal.category}
                subscriberCount={cal.subscriberCount}
                nextEventTitle={cal.events[0]?.title ?? null}
                nextEventDate={cal.events[0]?.startDatetime ?? null}
              />
            ))}
          </div>
        </section>
      )}

      {/* All calendars with tabs */}
      <section id="calendars" style={{ marginBottom: 80 }}>
        <CalendarGrid calendars={cardProps} title="All calendars" showTabs />
      </section>
    </div>
  )
}
