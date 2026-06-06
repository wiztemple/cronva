/**
 * Seeds Serie A 2026-27 matchday schedule.
 * Team-specific fixtures are placeholders (TBD) until a football-data.org
 * API key is configured and npm run sync is executed.
 *
 * Season: Aug 22 2026 → May 30 2027 (38 matchdays)
 */
import { PrismaClient } from '@prisma/client'
import schedule from '../data/serie-a-2026-27.json'

const prisma = new PrismaClient()

// Typical Serie A Saturday kick-off slots (CET = UTC+1 in winter, UTC+2 in summer)
// We store in UTC. Summer: CET-1h, Winter: CET-1h (actually +1 over UTC in winter).
// Using UTC-adjusted times: 12:30, 15:00, 18:00, 20:45 CET
// For simplicity, seed a block of 4 representative game slots per matchday.
const SATURDAY_SLOTS = ['13:00', '16:00', '19:00', '21:45'] // approx UTC for CET slots
const SUNDAY_SLOTS   = ['11:30', '14:00', '17:00', '19:45']

interface MatchdayRow {
  md: number
  sat?: string
  wed?: string
  sun?: string
  note?: string
}

function isSummerDate(date: Date): boolean {
  const m = date.getMonth() + 1
  return m >= 4 && m <= 10
}

function buildSlotEvents(dateStr: string, matchday: number) {
  const date = new Date(dateStr)
  const isSummer = isSummerDate(date)
  const offset = isSummer ? 2 : 1   // CET/CEST offset from UTC
  const slots = dateStr === schedule.find(r => r.sun === dateStr)?.sun
    ? SUNDAY_SLOTS
    : SATURDAY_SLOTS

  return slots.map((timeUtc, i) => {
    const [hh, mm] = timeUtc.split(':').map(Number)
    const start = new Date(Date.UTC(
      date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      hh, mm, 0
    ))
    const end = new Date(start.getTime() + 105 * 60 * 1000)
    const slot = i + 1

    return {
      externalId: `sa2627-md${matchday}-slot${slot}`,
      title: `Serie A 2026-27 — Matchday ${matchday} (TBD vs TBD)`,
      startDatetime: start,
      endDatetime: end,
      description: `Matchday ${matchday} — kick-off slot ${slot}. Team fixtures TBD; add FOOTBALL_DATA_API_KEY and run npm run sync to populate.`,
      location: 'Italy',
      status: 'scheduled' as const,
    }
  })
}

async function main() {
  const calendar = await prisma.calendar.findUnique({ where: { slug: 'serie-a' } })
  if (!calendar) {
    console.error('serie-a calendar not found — run npm run db:seed first')
    process.exit(1)
  }

  // Clear existing events so a re-run is idempotent
  await prisma.event.deleteMany({
    where: { calendarId: calendar.id, externalId: { startsWith: 'sa2627-' } },
  })

  let total = 0
  for (const row of schedule as MatchdayRow[]) {
    const dateStr = row.sat ?? row.wed ?? row.sun
    if (!dateStr) continue

    const events = buildSlotEvents(dateStr, row.md)
    for (const ev of events) {
      await prisma.event.create({
        data: { calendarId: calendar.id, ...ev },
      })
      total++
    }

    const displayDate = dateStr
    const label = row.note ? ` (${row.note})` : ''
    console.log(`  ✓ Matchday ${String(row.md).padStart(2)} — ${displayDate}${label}`)
  }

  // Update calendar description to reflect current season
  await prisma.calendar.update({
    where: { id: calendar.id },
    data: {
      description: "Italy's premier football division — 2026-27 season, Aug 22 2026 → May 30 2027. Full fixtures sync when FOOTBALL_DATA_API_KEY is configured.",
      lastSyncedAt: new Date(),
    },
  })

  console.log(`\n${total} slot events seeded across 38 matchdays.`)
  console.log('Run `npm run sync` with FOOTBALL_DATA_API_KEY set to replace TBD fixtures with actual teams.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
