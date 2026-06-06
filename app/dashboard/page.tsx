import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/client'
import Link from 'next/link'
import { CalendarCard } from '@/components/CalendarCard'
import { UnsubscribeButton } from '@/components/UnsubscribeButton'
import { WaAlertsSection } from '@/components/WaAlertsSection'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/dashboard')

  const userId = session.user.id
  const now = new Date()

  const [user, userSubs] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { waPhone: true, waAlertsOn: true },
    }),
    prisma.userSubscription.findMany({
      where: { userId },
      orderBy: { subscribedAt: 'desc' },
      include: {
        calendar: {
          include: {
            events: {
              where: { status: { not: 'cancelled' }, startDatetime: { gt: now } },
              orderBy: { startDatetime: 'asc' },
              take: 1,
            },
          },
        },
      },
    }),
  ])

  const userName = session.user.name?.split(' ')[0] ?? 'there'

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
      <div style={{ paddingTop: 48, marginBottom: 32 }}>
        <p style={{ fontSize: '13px', color: 'var(--color-fog)', marginBottom: 8 }}>
          Welcome back, {userName}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ fontWeight: 500, fontSize: '28px', letterSpacing: '-0.3px', color: 'var(--color-navy)' }}>
            My calendars
          </h1>
          {userSubs.length > 0 && (
            <span className="badge-category">{userSubs.length} subscribed</span>
          )}
        </div>
      </div>

      {userSubs.length === 0 ? (
        <div
          style={{
            textAlign: 'center', padding: '80px 24px',
            background: '#ffffff', border: '0.5px solid rgba(26,63,111,0.1)',
            borderRadius: 16, marginBottom: 48,
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
          <h2 style={{ fontWeight: 500, fontSize: '20px', color: 'var(--color-navy)', marginBottom: 8 }}>
            No calendars yet
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-fog)', marginBottom: 24 }}>
            Subscribe to leagues and events to save them here.
          </p>
          <Link href="/" className="btn-primary">Browse calendars →</Link>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 12, marginBottom: 48,
          }}
        >
          {userSubs.map(({ calendar }: { calendar: typeof userSubs[number]['calendar'] }) => (
            <div key={calendar.id} style={{ position: 'relative' }}>
              <CalendarCard
                slug={calendar.slug}
                name={calendar.name}
                category={calendar.category}
                subscriberCount={calendar.subscriberCount}
                nextEventTitle={calendar.events[0]?.title ?? null}
                nextEventDate={calendar.events[0]?.startDatetime ?? null}
              />
              <div style={{ position: 'absolute', top: 12, right: 12 }}>
                <UnsubscribeButton calendarId={calendar.id} />
              </div>
            </div>
          ))}
        </div>
      )}

      <WaAlertsSection
        initialPhone={user?.waPhone ?? null}
        initialAlertsOn={user?.waAlertsOn ?? false}
        subscriptions={userSubs.map((s: typeof userSubs[number]) => ({
          calendarId: s.calendarId,
          calendarName: s.calendar.name,
          waAlert: s.waAlert,
        }))}
      />
    </div>
  )
}
