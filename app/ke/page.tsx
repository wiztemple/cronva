import { prisma } from '@/lib/db/client'
import { CalendarCard } from '@/components/CalendarCard'
import { CountryEditionBanner } from '@/components/CountryEditionBanner'
import { mapPrismaToCardProps } from '@/lib/map-calendar-card'

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
  const all = [...keCalendars, ...globalCalendars]

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
              <CalendarCard key={cal.slug} {...mapPrismaToCardProps(cal)} />
            ))}
          </div>
        </section>
      )}

      <section id="calendars" style={{ marginBottom: 80 }}>
        <h2 style={{ fontWeight: 500, fontSize: 20, letterSpacing: '-0.2px', color: 'var(--color-navy)', marginBottom: 20 }}>
          All calendars
        </h2>
        <div className="calendar-grid">
          {all.map((cal) => (
            <CalendarCard key={cal.slug} {...mapPrismaToCardProps(cal)} />
          ))}
        </div>
      </section>
    </div>
  )
}
