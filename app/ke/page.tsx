import { prisma } from '@/lib/db/client'
import { CalendarGrid } from '@/components/CalendarGrid'
import { CalendarCard } from '@/components/CalendarCard'
import { CountryEditionBanner } from '@/components/CountryEditionBanner'

export const revalidate = 3600

export const metadata = {
  title: 'Cronva Kenya — Sports Calendars',
  description: 'Kenya Premier League, Harambee Stars, and global sports calendars syncing to any app.',
}

async function getData() {
  const now = new Date()
  const [keCalendars, globalCalendars] = await Promise.all([
    prisma.calendar.findMany({
      where: { isActive: true, country: 'ke' },
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
  return { keCalendars, globalCalendars }
}

export default async function KenyaPage() {
  const { keCalendars, globalCalendars } = await getData()
  const all = [...keCalendars, ...globalCalendars].map((c) => ({
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
      <CountryEditionBanner country="ke" flag="🇰🇪" name="Kenya" />

      <section style={{ paddingTop: 48, paddingBottom: 56, textAlign: 'center' }}>
        <h1
          className="text-display"
          style={{ color: 'var(--color-navy)', margin: '0 auto 16px', maxWidth: 640 }}
        >
          🇰🇪 Sports calendars for Kenya
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--color-fog)', maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.6 }}>
          Kenya Premier League, Harambee Stars fixtures, and global sports — syncing to your calendar app.
        </p>
        <a href="#calendars" className="btn-primary">Browse all</a>
      </section>

      {keCalendars.length > 0 && (
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontWeight: 500, fontSize: 20, letterSpacing: '-0.2px', color: 'var(--color-navy)', marginBottom: 16 }}>
            🇰🇪 Kenya calendars
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {keCalendars.map((cal) => (
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

      <section id="calendars" style={{ marginBottom: 80 }}>
        <CalendarGrid calendars={all} title="All calendars" showTabs />
      </section>
    </div>
  )
}
