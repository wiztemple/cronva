import { prisma } from '@/lib/db/client'

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/1'

// league IDs on TheSportsDB
const LEAGUE_MAP: Array<{ leagueId: string; calendarSlug: string }> = [
  { leagueId: '4387', calendarSlug: 'nba' },          // NBA
  { leagueId: '4352', calendarSlug: 'boxing' },        // World Championship Boxing
  { leagueId: '4367', calendarSlug: 'nba' },           // NBA Playoffs (supplemental)
]

interface TSDBEvent {
  idEvent: string
  strEvent: string
  strVenue: string | null
  strCity: string | null
  strCountry: string | null
  dateEvent: string
  strTime: string | null
  strDescriptionEN: string | null
  strStatus?: string | null
  strPostponed?: string | null
}

function buildDatetime(dateEvent: string, strTime: string | null): Date {
  const timeStr = strTime ?? '00:00:00'
  return new Date(`${dateEvent}T${timeStr}Z`)
}

function mapStatus(event: TSDBEvent): string {
  if (event.strPostponed === 'yes') return 'postponed'
  if (event.strStatus?.toLowerCase().includes('cancel')) return 'cancelled'
  return 'scheduled'
}

async function fetchLeagueNextEvents(leagueId: string, calendarSlug: string) {
  const calendar = await prisma.calendar.findUnique({ where: { slug: calendarSlug } })
  if (!calendar) return

  // TheSportsDB free endpoint: next 15 events for a league
  const url = `${BASE_URL}/eventsnextleague.php?id=${leagueId}`
  const res = await fetch(url, { next: { revalidate: 0 } })

  if (!res.ok) {
    console.error(`[TheSportsDB] league ${leagueId} failed: ${res.status}`)
    return
  }

  const data = await res.json()
  const events: TSDBEvent[] = data.events ?? []

  let upserted = 0
  for (const ev of events) {
    const start = buildDatetime(ev.dateEvent, ev.strTime)
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000) // 3hr default

    const location = [ev.strVenue, ev.strCity, ev.strCountry].filter(Boolean).join(', ')

    await prisma.event.upsert({
      where: {
        calendarId_externalId: {
          calendarId: calendar.id,
          externalId: `tsdb-${ev.idEvent}`,
        },
      },
      update: {
        title: ev.strEvent,
        startDatetime: start,
        endDatetime: end,
        description: ev.strDescriptionEN || null,
        location: location || null,
        status: mapStatus(ev),
      },
      create: {
        calendarId: calendar.id,
        externalId: `tsdb-${ev.idEvent}`,
        title: ev.strEvent,
        startDatetime: start,
        endDatetime: end,
        description: ev.strDescriptionEN || null,
        location: location || null,
        status: mapStatus(ev),
      },
    })
    upserted++
  }

  // Also fetch past events to keep recent history
  const pastUrl = `${BASE_URL}/eventspastleague.php?id=${leagueId}`
  const pastRes = await fetch(pastUrl, { next: { revalidate: 0 } })
  if (pastRes.ok) {
    const pastData = await pastRes.json()
    const pastEvents: TSDBEvent[] = pastData.events ?? []
    for (const ev of pastEvents) {
      const start = buildDatetime(ev.dateEvent, ev.strTime)
      const end = new Date(start.getTime() + 3 * 60 * 60 * 1000)
      const location = [ev.strVenue, ev.strCity, ev.strCountry].filter(Boolean).join(', ')
      await prisma.event.upsert({
        where: {
          calendarId_externalId: { calendarId: calendar.id, externalId: `tsdb-${ev.idEvent}` },
        },
        update: { title: ev.strEvent, startDatetime: start, endDatetime: end, location: location || null },
        create: {
          calendarId: calendar.id,
          externalId: `tsdb-${ev.idEvent}`,
          title: ev.strEvent,
          startDatetime: start,
          endDatetime: end,
          location: location || null,
          status: mapStatus(ev),
        },
      })
      upserted++
    }
  }

  await prisma.calendar.update({
    where: { id: calendar.id },
    data: { lastSyncedAt: new Date() },
  })

  console.log(`[TheSportsDB] league ${leagueId} → ${calendarSlug}: ${upserted} events`)
}

export class TheSportsDBFetcher {
  async syncAll() {
    // Deduplicate slugs so we only run each calendar once
    const seen = new Set<string>()
    for (const entry of LEAGUE_MAP) {
      const key = `${entry.leagueId}-${entry.calendarSlug}`
      if (seen.has(key)) continue
      seen.add(key)
      try {
        await fetchLeagueNextEvents(entry.leagueId, entry.calendarSlug)
      } catch (err) {
        console.error(`[TheSportsDB] Error syncing ${entry.leagueId}:`, err)
      }
      await new Promise((r) => setTimeout(r, 1000))
    }
  }
}
