import { prisma } from '@/lib/db/client'
import { API_SPORTS_BASE_URL } from './api-sports'

// NPFL=332, Super Eagles=Nigeria national team id=6, AFCON=id=6, CAF CL=id=20
const LEAGUE_MAP: Array<{ leagueId: number; season: number; calendarSlug: string; isTeam?: boolean; teamId?: number }> = [
  { leagueId: 332, season: 2025, calendarSlug: 'npfl' },
  { leagueId: 6, season: 2025, calendarSlug: 'afcon' },
  { leagueId: 20, season: 2024, calendarSlug: 'afcon' }, // CAF CL maps to afcon calendar for now
  { leagueId: 6, season: 2025, calendarSlug: 'super-eagles', isTeam: true, teamId: 3 },
]

interface APIFootballFixture {
  fixture: {
    id: number
    date: string
    venue: { name: string | null; city: string | null }
    status: { short: string }
  }
  teams: {
    home: { name: string }
    away: { name: string }
  }
  league: { round: string }
}

function mapStatus(short: string): string {
  if (['1H', '2H', 'ET', 'P', 'LIVE'].includes(short)) return 'live'
  if (short === 'PST') return 'postponed'
  if (short === 'CANC') return 'cancelled'
  return 'scheduled'
}

async function fetchLeague(leagueId: number, season: number, calendarSlug: string) {
  const apiKey = process.env.API_FOOTBALL_KEY
  if (!apiKey) {
    console.warn('[ApiFootball] Missing API_FOOTBALL_KEY — skipping')
    return
  }

  const calendar = await prisma.calendar.findUnique({ where: { slug: calendarSlug } })
  if (!calendar) return

  const url = `${API_SPORTS_BASE_URL}/fixtures?league=${leagueId}&season=${season}`
  const res = await fetch(url, {
    headers: { 'x-apisports-key': apiKey },
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    console.error(`[ApiFootball] league ${leagueId} failed: ${res.status}`)
    return
  }

  const data = await res.json()
  const fixtures: APIFootballFixture[] = data.response ?? []

  let upserted = 0
  for (const f of fixtures) {
    const start = new Date(f.fixture.date)
    const end = new Date(start.getTime() + 105 * 60 * 1000)

    const venue = [f.fixture.venue.name, f.fixture.venue.city].filter(Boolean).join(', ')

    await prisma.event.upsert({
      where: {
        calendarId_externalId: {
          calendarId: calendar.id,
          externalId: `apif-${f.fixture.id}`,
        },
      },
      update: {
        title: `${f.teams.home.name} vs ${f.teams.away.name}`,
        startDatetime: start,
        endDatetime: end,
        description: f.league.round || null,
        location: venue || null,
        status: mapStatus(f.fixture.status.short),
      },
      create: {
        calendarId: calendar.id,
        externalId: `apif-${f.fixture.id}`,
        title: `${f.teams.home.name} vs ${f.teams.away.name}`,
        startDatetime: start,
        endDatetime: end,
        description: f.league.round || null,
        location: venue || null,
        status: mapStatus(f.fixture.status.short),
      },
    })
    upserted++
  }

  await prisma.calendar.update({
    where: { id: calendar.id },
    data: { lastSyncedAt: new Date() },
  })

  console.log(`[ApiFootball] league ${leagueId} → ${calendarSlug}: ${upserted} events`)
}

export class ApiFootballFetcher {
  async syncAll() {
    // Max 1 request per 15 min per league on free tier (100 req/day total)
    const DELAY_MS = 15 * 60 * 1000

    for (const entry of LEAGUE_MAP) {
      try {
        await fetchLeague(entry.leagueId, entry.season, entry.calendarSlug)
      } catch (err) {
        console.error(`[ApiFootball] Error syncing league ${entry.leagueId}:`, err)
      }
      // Stagger requests — do NOT wait 15min in a cron (would block the process);
      // we rely on the 6-hour cron interval to space runs across the day.
      await new Promise((r) => setTimeout(r, 2000))
    }
  }
}
