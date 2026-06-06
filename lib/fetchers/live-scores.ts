import { prisma } from '@/lib/db/client'

const BASE = 'https://v3.football.api-sports.io'

interface LiveFixture {
  fixture: {
    id: number
    status: { elapsed: number | null; short: string }
  }
  teams: {
    home: { name: string }
    away: { name: string }
  }
  goals: { home: number | null; away: number | null }
  events?: Array<{ type: string; team: { id: number } }>
}

function countRedCards(fix: LiveFixture, teamId: number): number {
  return (fix.events ?? []).filter(
    (e) => e.type === 'Card' && e.team.id === teamId
  ).length
}

export async function pollLiveScores() {
  const apiKey = process.env.API_FOOTBALL_KEY
  if (!apiKey) return

  const now = new Date()

  // Check if there are any events currently in a live window before hitting the API
  const activeCount = await prisma.event.count({
    where: {
      startDatetime: { lte: now },
      endDatetime: { gte: new Date(now.getTime() - 120 * 60 * 1000) },
      status: { not: 'cancelled' },
      calendar: { category: 'football' },
    },
  })
  if (activeCount === 0) return // nothing live — skip API call

  const res = await fetch(`${BASE}/fixtures?live=all`, {
    headers: { 'x-apisports-key': apiKey },
    next: { revalidate: 0 },
  })
  if (!res.ok) {
    console.error(`[LiveScores] API error: ${res.status}`)
    return
  }

  const data = await res.json()
  const fixtures: LiveFixture[] = data.response ?? []
  if (fixtures.length === 0) return

  const fixtureIds = fixtures.map((f) => `apif-${f.fixture.id}`)

  const matchingEvents = await prisma.event.findMany({
    where: { externalId: { in: fixtureIds } },
    select: { id: true, externalId: true },
  })

  const eventMap = Object.fromEntries(
    matchingEvents.map((e: { externalId: string; id: string }) => [e.externalId, e.id])
  )

  let updated = 0
  for (const fix of fixtures) {
    const externalId = `apif-${fix.fixture.id}`
    const eventId = eventMap[externalId]
    if (!eventId) continue

    const liveData = {
      homeGoals: fix.goals.home ?? 0,
      awayGoals: fix.goals.away ?? 0,
      minute: fix.fixture.status.elapsed ?? 0,
      statusDetail: fix.fixture.status.short,
      redCardsHome: countRedCards(fix, (fix as unknown as { teams: { home: { id: number } } }).teams.home.id),
      redCardsAway: countRedCards(fix, (fix as unknown as { teams: { away: { id: number } } }).teams.away.id),
    }

    await prisma.event.update({
      where: { id: eventId },
      data: { liveData: liveData as object, status: 'live' },
    })
    updated++
  }

  // Clear liveData for events that were live but no longer appear in the feed
  const liveEventIds = Object.values(eventMap)
  if (liveEventIds.length > updated) {
    await prisma.event.updateMany({
      where: {
        id: { in: liveEventIds.filter((id) => !matchingEvents.find((e: { id: string }) => e.id === id)) },
        status: 'live',
      },
      data: { status: 'scheduled' },
    })
  }

  if (updated > 0) console.log(`[LiveScores] Updated ${updated} live events`)
}
