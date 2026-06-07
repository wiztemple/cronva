import { prisma } from '@/lib/db/client'

const API_URL = 'https://api.football-data.org/v4/competitions'

const COMPETITION_MAP: Record<string, string> = {
  PL: 'epl',
  CL: 'champions-league',
  PD: 'la-liga',
  BL1: 'bundesliga',
  SA: 'serie-a',
  WC: 'world-cup-2026',
  EC: 'euro',
}

interface FDMatch {
  id: number
  utcDate: string
  status: string
  homeTeam: { name: string }
  awayTeam: { name: string }
  venue?: string
  matchday?: number
  stage?: string
  group?: string | null
}

function mapStatus(fdStatus: string): string {
  if (fdStatus === 'IN_PLAY' || fdStatus === 'PAUSED') return 'live'
  if (fdStatus === 'POSTPONED') return 'postponed'
  if (fdStatus === 'CANCELLED') return 'cancelled'
  if (fdStatus === 'FINISHED') return 'scheduled'
  return 'scheduled'
}

async function fetchCompetition(code: string, calendarSlug: string) {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY
  if (!apiKey) {
    console.warn('[FootballData] Missing FOOTBALL_DATA_API_KEY — skipping')
    return
  }

  const calendar = await prisma.calendar.findUnique({ where: { slug: calendarSlug } })
  if (!calendar) {
    console.warn(`[FootballData] Calendar not found: ${calendarSlug}`)
    return
  }

  const res = await fetch(`${API_URL}/${code}/matches`, {
    headers: { 'X-Auth-Token': apiKey },
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    console.error(`[FootballData] ${code} fetch failed: ${res.status} ${res.statusText}`)
    return
  }

  const data = await res.json()
  const matches: FDMatch[] = data.matches ?? []

  let upserted = 0
  for (const match of matches) {
    const start = new Date(match.utcDate)
    const end = new Date(start.getTime() + 105 * 60 * 1000) // 90min + 15min buffer

    const title = `${match.homeTeam.name} vs ${match.awayTeam.name}`
    const description = [
      match.stage ? `Stage: ${match.stage}` : null,
      match.group ? `Group: ${match.group}` : null,
      match.matchday ? `Matchday ${match.matchday}` : null,
    ]
      .filter(Boolean)
      .join(' · ')

    await prisma.event.upsert({
      where: {
        calendarId_externalId: {
          calendarId: calendar.id,
          externalId: `fd-${match.id}`,
        },
      },
      update: {
        title,
        startDatetime: start,
        endDatetime: end,
        description: description || null,
        location: match.venue ?? null,
        status: mapStatus(match.status),
      },
      create: {
        calendarId: calendar.id,
        externalId: `fd-${match.id}`,
        title,
        startDatetime: start,
        endDatetime: end,
        description: description || null,
        location: match.venue ?? null,
        status: mapStatus(match.status),
      },
    })
    upserted++
  }

  await prisma.calendar.update({
    where: { id: calendar.id },
    data: { lastSyncedAt: new Date() },
  })

  console.log(`[FootballData] ${code} (${calendarSlug}): ${upserted} events upserted`)
}

export class FootballDataFetcher {
  async syncCompetition(code: string, calendarSlug: string) {
    await fetchCompetition(code, calendarSlug)
  }

  async syncWorldCup() {
    await fetchCompetition('WC', 'world-cup-2026')
  }

  async syncAll() {
    for (const [code, slug] of Object.entries(COMPETITION_MAP)) {
      try {
        await fetchCompetition(code, slug)
      } catch (err) {
        console.error(`[FootballData] Error syncing ${code}:`, err)
      }
      // Respect 10 req/min rate limit on free tier
      await new Promise((r) => setTimeout(r, 6500))
    }
  }
}
