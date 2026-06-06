import { prisma } from '@/lib/db/client'
import { CalendarGrid } from '@/components/CalendarGrid'
import { CalendarCard } from '@/components/CalendarCard'
import { CountryEditionBanner } from '@/components/CountryEditionBanner'
import Link from 'next/link'

export const revalidate = 3600

export const metadata = {
  title: 'Cronva Ghana — Sports Calendars',
  description: 'Ghana Premier League, Black Stars, and global sports calendars that sync to any calendar app.',
}

async function getData() {
  const now = new Date()
  const [ghCalendars, globalCalendars] = await Promise.all([
    prisma.calendar.findMany({
      where: { isActive: true, country: 'gh' },
      orderBy: { subscriberCount: 'desc' },
      include: {
        events: {
          where: { status: { not: 'cancelled' }, startDatetime: { gt: now } },
          orderBy: { startDatetime: 'asc' },
          take: 2,
        },
      },
    }),
    prisma.calendar.findMany({
      where: { isActive: true, country: { in: ['global', 'africa'] } },
      orderBy: [{ isFeatured: 'desc' }, { subscriberCount: 'desc' }],
      include: {
        events: {
          where: { status: { not: 'cancelled' }, startDatetime: { gt: now } },
          orderBy: { startDatetime: 'asc' },
          take: 2,
        },
      },
    }),
  ])
  return { ghCalendars, globalCalendars }
}

export default async function GhanaPage() {
  const { ghCalendars, globalCalendars } = await getData()
  const all = [...ghCalendars, ...globalCalendars].map((c) => ({
    slug: c.slug,
    name: c.name,
    category: c.category,
    subscriberCount: c.subscriberCount,
    isFeatured: c.isFeatured,
    nextEventTitle: c.events[0]?.title ?? null,
    nextEventDate: c.events[0]?.startDatetime ?? null,
    secondEventDate: c.events[1]?.startDatetime ?? null,
  }))

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
      <CountryEditionBanner country="gh" flag="🇬🇭" name="Ghana" />

      {/* Hero */}
      <section style={{ paddingTop: 48, paddingBottom: 56, textAlign: 'center' }}>
        <h1
          className="text-display"
          style={{ color: 'var(--color-navy)', margin: '0 auto 16px', maxWidth: 640 }}
        >
          🇬🇭 Sports calendars for Ghana
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--color-fog)', maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.6 }}>
          Ghana Premier League, Black Stars fixtures, and global sports — all syncing to your calendar.
        </p>
        <a href="#calendars" className="btn-primary">Browse all</a>
      </section>

      {/* Ghana-specific calendars */}
      {ghCalendars.length > 0 && (
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontWeight: 500, fontSize: 20, letterSpacing: '-0.2px', color: 'var(--color-navy)', marginBottom: 16 }}>
            🇬🇭 Ghana calendars
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {ghCalendars.map((cal) => (
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
        <CalendarGrid calendars={all} title="All calendars" showTabs />
      </section>
    </div>
  )
}
