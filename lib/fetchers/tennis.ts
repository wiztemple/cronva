import { prisma } from '@/lib/db/client'
import tennisEvents from '@/data/tennis-events.json'

const API_BASE = 'https://api.api-tennis.com/tennis/'
const LOOKAHEAD_DAYS = 45

interface ManualEvent {
  calendarSlug: string
  externalId: string
  title: string
  startDatetime: string
  endDatetime: string
  description?: string
  location?: string
}

interface ApiTennisFixture {
  event_key: string
  event_date: string
  event_time: string
  event_first_player: string
  event_second_player: string
  event_status: string
  event_type_type: string
  tournament_name: string
  tournament_round?: string
}

const TOUR_MAP: Array<{ slug: string; idPrefix: string; matchType: string }> = [
  { slug: 'atp-tour', idPrefix: 'atp', matchType: 'Atp Singles' },
  { slug: 'wta-tour', idPrefix: 'wta', matchType: 'Wta Singles' },
]

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function buildStart(eventDate: string, eventTime: string): Date {
  const time = eventTime?.trim() || '12:00'
  return new Date(`${eventDate}T${time}:00Z`)
}

async function syncManual() {
  const events = tennisEvents as ManualEvent[]
  const bySlug = new Map<string, ManualEvent[]>()

  for (const ev of events) {
    if (!bySlug.has(ev.calendarSlug)) bySlug.set(ev.calendarSlug, [])
    bySlug.get(ev.calendarSlug)!.push(ev)
  }

  for (const [slug, calEvents] of bySlug.entries()) {
    const calendar = await prisma.calendar.findUnique({ where: { slug } })
    if (!calendar) continue

    let upserted = 0
    for (const ev of calEvents) {
      await prisma.event.upsert({
        where: {
          calendarId_externalId: {
            calendarId: calendar.id,
            externalId: ev.externalId,
          },
        },
        update: {
          title: ev.title,
          startDatetime: new Date(ev.startDatetime),
          endDatetime: new Date(ev.endDatetime),
          description: ev.description ?? null,
          location: ev.location ?? null,
        },
        create: {
          calendarId: calendar.id,
          externalId: ev.externalId,
          title: ev.title,
          startDatetime: new Date(ev.startDatetime),
          endDatetime: new Date(ev.endDatetime),
          description: ev.description ?? null,
          location: ev.location ?? null,
          status: 'scheduled',
        },
      })
      upserted++
    }

    await prisma.calendar.update({
      where: { id: calendar.id },
      data: { lastSyncedAt: new Date() },
    })
    console.log(`[Tennis] manual ${slug}: ${upserted} events`)
  }
}

async function fetchApiFixtures(apiKey: string): Promise<ApiTennisFixture[]> {
  const start = new Date()
  const end = new Date(start)
  end.setDate(end.getDate() + LOOKAHEAD_DAYS)

  const url = new URL(API_BASE)
  url.searchParams.set('method', 'get_fixtures')
  url.searchParams.set('APIkey', apiKey)
  url.searchParams.set('date_start', fmtDate(start))
  url.searchParams.set('date_stop', fmtDate(end))

  const res = await fetch(url.toString(), { next: { revalidate: 0 } })
  if (!res.ok) {
    console.error(`[Tennis] API failed: ${res.status}`)
    return []
  }

  const data = await res.json()
  if (data.success !== 1 || !Array.isArray(data.result)) {
    console.warn('[Tennis] API returned no fixtures')
    return []
  }

  return data.result as ApiTennisFixture[]
}

async function syncApiTour(
  slug: string,
  idPrefix: string,
  matchType: string,
  fixtures: ApiTennisFixture[],
) {
  const calendar = await prisma.calendar.findUnique({ where: { slug } })
  if (!calendar) return

  const matches = fixtures.filter(
    (f) =>
      f.event_type_type === matchType &&
      f.event_status !== 'Finished' &&
      f.event_first_player &&
      f.event_second_player,
  )

  let upserted = 0
  for (const m of matches) {
    const start = buildStart(m.event_date, m.event_time)
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000)
    const round = m.tournament_round ? ` · ${m.tournament_round}` : ''

    await prisma.event.upsert({
      where: {
        calendarId_externalId: {
          calendarId: calendar.id,
          externalId: `${idPrefix}-${m.event_key}`,
        },
      },
      update: {
        title: `${m.event_first_player} vs ${m.event_second_player}`,
        startDatetime: start,
        endDatetime: end,
        description: `${m.tournament_name}${round}`,
        location: m.tournament_name,
      },
      create: {
        calendarId: calendar.id,
        externalId: `${idPrefix}-${m.event_key}`,
        title: `${m.event_first_player} vs ${m.event_second_player}`,
        startDatetime: start,
        endDatetime: end,
        description: `${m.tournament_name}${round}`,
        location: m.tournament_name,
        status: 'scheduled',
      },
    })
    upserted++
  }

  await prisma.calendar.update({
    where: { id: calendar.id },
    data: { lastSyncedAt: new Date() },
  })

  console.log(`[Tennis] API ${slug}: ${upserted} matches`)
}

export class TennisFetcher {
  async syncAll() {
    await syncManual()

    const apiKey = process.env.API_TENNIS_KEY
    if (!apiKey) {
      console.warn('[Tennis] Missing API_TENNIS_KEY — using curated events only')
      return
    }

    try {
      const fixtures = await fetchApiFixtures(apiKey)
      for (const tour of TOUR_MAP) {
        await syncApiTour(tour.slug, tour.idPrefix, tour.matchType, fixtures)
      }
    } catch (err) {
      console.error('[Tennis] API sync error:', err)
    }
  }
}
