import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db/client'
import { CalendarDetailLayout } from '@/components/CalendarDetailLayout'
import { CalendarCard } from '@/components/CalendarCard'
import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 1800

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const calendar = await prisma.calendar.findUnique({ where: { slug } })
  if (!calendar) return {}
  return {
    title: calendar.name,
    description: calendar.description ?? `Subscribe to ${calendar.name} fixtures on Cronva.`,
  }
}

export async function generateStaticParams() {
  const calendars = await prisma.calendar.findMany({
    where: { isActive: true },
    select: { slug: true },
  })
  return calendars.map((c) => ({ slug: c.slug }))
}

function formatSubscriberCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

const CATEGORY_ICONS: Record<string, string> = {
  football: '⚽',
  basketball: '🏀',
  f1: '🏎',
  entertainment: '🎭',
  tv: '🎬',
  boxing: '🥊',
  local: '📍',
}

const CATEGORY_LABELS: Record<string, string> = {
  football: 'Football',
  basketball: 'Basketball',
  tennis: 'Tennis',
  f1: 'F1',
  entertainment: 'Entertainment',
  tv: 'Movies & TV',
  boxing: 'Boxing',
  local: 'Local',
}

export default async function CalendarPage({ params }: Props) {
  const { slug } = await params
  const session = await auth()

  const calendar = await prisma.calendar.findUnique({ where: { slug } })
  if (!calendar || !calendar.isActive) notFound()

  const now = new Date()

  const userId = session?.user?.id ?? null
  const isSubscribed = userId
    ? await prisma.userSubscription.findUnique({
        where: { userId_calendarId: { userId, calendarId: calendar.id } },
      }).then(Boolean)
    : false

  const eventLimit = 50

  const upcomingEvents = await prisma.event.findMany({
    where: {
      calendarId: calendar.id,
      status: { not: 'cancelled' },
      startDatetime: { gt: now },
    },
    orderBy: { startDatetime: 'asc' },
    take: eventLimit,
  })

  const relatedCalendars = await prisma.calendar.findMany({
    where: { category: calendar.category, isActive: true, slug: { not: slug } },
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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://cronva.app'
  const icon = CATEGORY_ICONS[calendar.category] ?? '📅'

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
      {/* Breadcrumb */}
      <div style={{ paddingTop: 32, marginBottom: 24 }}>
        <Link href="/" style={{ fontSize: '13px', color: 'var(--color-fog)', textDecoration: 'none' }}>
          ← All calendars
        </Link>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
          <div
            style={{
              width: 56, height: 56, borderRadius: 12,
              background: 'var(--color-sky)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, flexShrink: 0,
            }}
          >
            {icon}
          </div>
          <div>
            <span className="badge-category" style={{ marginBottom: 8, display: 'inline-block' }}>
              {CATEGORY_LABELS[calendar.category] ?? calendar.category}
            </span>
            <h1 style={{ fontWeight: 500, fontSize: '28px', letterSpacing: '-0.3px', color: 'var(--color-navy)', marginBottom: 6 }}>
              {calendar.name}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--color-fog)' }}>
              {formatSubscriberCount(calendar.subscriberCount)} subscribers
              {calendar.country && calendar.country !== 'global'
                ? ` · ${calendar.country.charAt(0).toUpperCase() + calendar.country.slice(1)}`
                : ''}
            </p>
          </div>
        </div>
        {calendar.description && (
          <p style={{ fontSize: '16px', color: 'var(--color-fog)', lineHeight: 1.6, maxWidth: 600 }}>
            {calendar.description}
          </p>
        )}
      </div>

      <CalendarDetailLayout
        events={upcomingEvents.map((ev) => ({
          id: ev.id,
          externalId: ev.externalId,
          title: ev.title,
          startDatetime: ev.startDatetime.toISOString(),
          location: ev.location,
        }))}
        pickable={upcomingEvents.length > 0}
        calendarId={calendar.id}
        calendarName={calendar.name}
        calendarSlug={slug}
        baseUrl={baseUrl}
        isSubscribed={!!isSubscribed}
      />

      {/* Related calendars */}
      {relatedCalendars.length > 0 && (
        <section style={{ marginTop: 80, marginBottom: 80 }}>
          <h2 style={{ fontWeight: 500, fontSize: '20px', letterSpacing: '-0.2px', color: 'var(--color-navy)', marginBottom: 20 }}>
            More {CATEGORY_LABELS[calendar.category] ?? calendar.category} calendars
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {relatedCalendars.map((rel) => (
              <CalendarCard
                key={rel.slug}
                slug={rel.slug}
                name={rel.name}
                category={rel.category}
                subscriberCount={rel.subscriberCount}
                nextEventTitle={rel.events[0]?.title ?? null}
                nextEventDate={rel.events[0]?.startDatetime ?? null}
              />
            ))}
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 640px) {
          .cal-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
