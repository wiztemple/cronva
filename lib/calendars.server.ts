import { prisma } from '@/lib/db/client'
import { toCalendarUI, formatHeroStatCount, type DbCalendarRow } from './calendar-ui'
import type { Calendar } from './calendars'
import { HOMEPAGE_GRID_SLUGS, FEATURED_SLUGS } from './calendars'
import {
  mapToArtistTour,
  mapToCountdownHighlight,
  mapToHotCard,
  mapToNigerianShow,
  mapToRankedCalendar,
  mapToWatchlistFixture,
} from './homepage-mappers'
import type {
  ArtistTourCard,
  CountdownHighlight,
  HotCardData,
  NigerianShowCard,
  RankedCalendar,
  WatchlistFixture,
} from './homepage-types'

const HOT_NOW_SLUGS = [
  'world-cup-2026',
  'super-eagles',
  'bbnnaija',
  'formula-1',
  'champions-league',
  'nba',
  'npfl',
  'afrobeats-tours',
] as const

const COUNTDOWN_SLUGS = [
  'world-cup-2026',
  'formula-1',
  'nba',
  'bbnnaija',
  'afcon',
  'super-eagles',
] as const

const NIGERIAN_SHOW_SLUGS = [
  'bbnnaija',
  'amvca-2026',
  'afrobeats-tours',
  'africa-magic',
  'nollywood',
  'upcoming-movies',
  'tv-episodes',
] as const

function calendarInclude(eventTake = 2) {
  const now = new Date()
  return {
    events: {
      where: { status: { not: 'cancelled' }, startDatetime: { gt: now } },
      orderBy: { startDatetime: 'asc' as const },
      take: eventTake,
    },
    _count: {
      select: { events: true, userSubscriptions: true },
    },
  }
}

function calendarIncludeAllEvents(eventTake = 3) {
  return calendarInclude(eventTake)
}

function mapRows(rows: DbCalendarRow[]): Calendar[] {
  return rows.map(toCalendarUI)
}

export async function getSiteStats() {
  const [calendarCount, eventCount, totalSubscribers] = await Promise.all([
    prisma.calendar.count({ where: { isActive: true } }),
    prisma.event.count({ where: { status: { not: 'cancelled' } } }),
    prisma.userSubscription.count(),
  ])

  return {
    calendarCount,
    eventCount,
    totalSubscribers,
    heroStats: [
      { value: String(calendarCount), label: 'live calendars' },
      {
        value: formatHeroStatCount(eventCount),
        label: 'fixtures synced',
      },
      { value: 'Free', label: 'always' },
    ],
  }
}

export async function getAllActiveCalendars(): Promise<Calendar[]> {
  const rows = await prisma.calendar.findMany({
    where: { isActive: true },
    orderBy: [{ isFeatured: 'desc' }, { subscriberCount: 'desc' }],
    include: calendarInclude(2),
  })
  return mapRows(rows as DbCalendarRow[])
}

export async function getCalendarsBySlugs(slugs: string[]): Promise<Calendar[]> {
  const rows = await prisma.calendar.findMany({
    where: { isActive: true, slug: { in: slugs } },
    include: calendarInclude(2),
  })

  const bySlug = new Map(rows.map((r) => [r.slug, r as DbCalendarRow]))
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((r): r is DbCalendarRow => r !== undefined)
    .map(toCalendarUI)
}

export async function getHotNowCards(): Promise<HotCardData[]> {
  const rows = await prisma.calendar.findMany({
    where: { isActive: true, slug: { in: [...HOT_NOW_SLUGS] } },
    include: calendarIncludeAllEvents(3),
  })

  const bySlug = new Map(rows.map((r) => [r.slug, r as DbCalendarRow]))
  return HOT_NOW_SLUGS.map((slug) => bySlug.get(slug))
    .filter((r): r is DbCalendarRow => r !== undefined)
    .map(mapToHotCard)
}

export async function getTrendingRanked(): Promise<RankedCalendar[]> {
  const { calendars } = await getTrendingData()
  return calendars.map((cal, i) => mapToRankedCalendar(cal, i + 1))
}

export async function getNigerianShows(): Promise<NigerianShowCard[]> {
  const rows = await prisma.calendar.findMany({
    where: {
      isActive: true,
      OR: [
        { slug: { in: [...NIGERIAN_SHOW_SLUGS] } },
        { country: 'nigeria', category: { in: ['entertainment', 'tv'] } },
      ],
    },
    include: calendarIncludeAllEvents(1),
    take: 6,
  })

  const seen = new Set<string>()
  return rows
    .filter((r) => {
      if (seen.has(r.slug)) return false
      seen.add(r.slug)
      return true
    })
    .map((r) => mapToNigerianShow(r as DbCalendarRow))
}

export async function getAfrobeatsTours(): Promise<ArtistTourCard[]> {
  const now = new Date()
  const events = await prisma.event.findMany({
    where: {
      status: { not: 'cancelled' },
      startDatetime: { gt: now },
      calendar: { slug: 'afrobeats-tours', isActive: true },
    },
    orderBy: { startDatetime: 'asc' },
    take: 5,
    include: { calendar: { select: { slug: true } } },
  })

  return events.map((ev) =>
    mapToArtistTour(ev.calendar.slug, ev.title, ev.startDatetime, ev.location)
  )
}

export async function getCountdownHighlights(): Promise<CountdownHighlight[]> {
  const now = new Date()
  const rows = await prisma.calendar.findMany({
    where: { isActive: true, slug: { in: [...COUNTDOWN_SLUGS] } },
    include: {
      events: {
        where: { status: { not: 'cancelled' }, startDatetime: { gt: now } },
        orderBy: { startDatetime: 'asc' },
        take: 1,
      },
    },
  })

  const bySlug = new Map(rows.map((r) => [r.slug, r]))
  return COUNTDOWN_SLUGS.map((slug) => {
    const row = bySlug.get(slug)
    if (!row) return null
    const next = row.events[0] ?? null
    return mapToCountdownHighlight(slug, row.name, next)
  }).filter((h): h is CountdownHighlight => h !== null)
}

export async function getWatchlistFixtures(
  userId: string
): Promise<WatchlistFixture[]> {
  const now = new Date()
  const events = await prisma.event.findMany({
    where: {
      status: { not: 'cancelled' },
      startDatetime: { gt: now },
      calendar: {
        isActive: true,
        userSubscriptions: { some: { userId } },
      },
    },
    orderBy: { startDatetime: 'asc' },
    take: 8,
    include: { calendar: { select: { name: true } } },
  })

  return events.map((ev) =>
    mapToWatchlistFixture(ev.title, ev.startDatetime, ev.calendar.name)
  )
}

export async function getHomepageData(userId?: string) {
  const [
    stats,
    featured,
    grid,
    hotNowCards,
    trendingRanked,
    nigerianShows,
    afrobeatsTours,
    countdownHighlights,
    watchlistFixtures,
  ] = await Promise.all([
    getSiteStats(),
    getCalendarsBySlugs([...FEATURED_SLUGS]),
    getCalendarsBySlugs([...HOMEPAGE_GRID_SLUGS]),
    getHotNowCards(),
    getTrendingRanked(),
    getNigerianShows(),
    getAfrobeatsTours(),
    getCountdownHighlights(),
    userId ? getWatchlistFixtures(userId) : Promise.resolve([]),
  ])

  const featuredBySlug = new Map(featured.map((c) => [c.slug, c]))

  return {
    stats,
    totalCalendars: stats.calendarCount,
    featured: {
      epl: featuredBySlug.get('epl'),
      superEagles: featuredBySlug.get('super-eagles'),
      bbnaija: featuredBySlug.get('bbnnaija'),
    },
    gridCalendars: grid,
    hotNowCards,
    trendingRanked,
    nigerianShows,
    afrobeatsTours,
    countdownHighlights,
    watchlistFixtures,
    allCalendars: await getAllActiveCalendars(),
  }
}

export async function getCalendarBySlug(slug: string): Promise<Calendar | null> {
  const row = await prisma.calendar.findUnique({
    where: { slug, isActive: true },
    include: calendarInclude(2),
  })
  if (!row) return null
  return toCalendarUI(row as DbCalendarRow)
}

export async function getCalendarDetail(slug: string, userId?: string) {
  const now = new Date()

  const row = await prisma.calendar.findUnique({
    where: { slug, isActive: true },
    include: {
      events: {
        where: { status: { not: 'cancelled' }, startDatetime: { gt: now } },
        orderBy: { startDatetime: 'asc' },
        take: 50,
      },
      _count: { select: { events: true, userSubscriptions: true } },
    },
  })

  if (!row) return null

  const calendar = toCalendarUI(row as DbCalendarRow)

  let isSubscribed = false
  if (userId) {
    const sub = await prisma.userSubscription.findUnique({
      where: { userId_calendarId: { userId, calendarId: row.id } },
    })
    isSubscribed = Boolean(sub)
  }

  const relatedRows = await prisma.calendar.findMany({
    where: {
      category: row.category,
      isActive: true,
      slug: { not: slug },
    },
    orderBy: { subscriberCount: 'desc' },
    take: 3,
    include: calendarInclude(1),
  })

  return {
    calendar,
    calendarId: row.id,
    isSubscribed,
    events: row.events.map((ev) => ({
      id: ev.id,
      externalId: ev.externalId,
      title: ev.title,
      startDatetime: ev.startDatetime.toISOString(),
      location: ev.location,
    })),
    related: mapRows(relatedRows as DbCalendarRow[]),
  }
}

function isTonight(date: Date): boolean {
  const now = new Date()
  const lagosNow = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Lagos' }))
  const lagosEvent = new Date(date.toLocaleString('en-US', { timeZone: 'Africa/Lagos' }))
  return (
    lagosNow.getFullYear() === lagosEvent.getFullYear() &&
    lagosNow.getMonth() === lagosEvent.getMonth() &&
    lagosNow.getDate() === lagosEvent.getDate()
  )
}

export async function getTrendingData() {
  const rows = await prisma.calendar.findMany({
    where: { isActive: true },
    orderBy: { subscriberCount: 'desc' },
    take: 12,
    include: calendarInclude(1),
  })

  const calendars = mapRows(rows as DbCalendarRow[])
  return { calendars, top3: calendars.slice(0, 3) }
}

export async function getUserDashboardCalendars(userId: string) {
  const subs = await prisma.userSubscription.findMany({
    where: { userId },
    orderBy: { subscribedAt: 'desc' },
    include: {
      calendar: {
        include: calendarInclude(1),
      },
    },
  })

  return subs.map((s) => toCalendarUI(s.calendar as DbCalendarRow))
}
