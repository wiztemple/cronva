import { PrismaClient } from '@prisma/client'
import fixtures from '../data/wc2026-fixtures.json'

const prisma = new PrismaClient()

interface Fixture {
  matchday: string
  date: string
  time: string
  tz: string
  home: string
  away: string
  venue: string
  city: string
}

async function main() {
  const calendar = await prisma.calendar.findUnique({ where: { slug: 'world-cup-2026' } })
  if (!calendar) {
    console.error('world-cup-2026 calendar not found — run npm run db:seed first')
    process.exit(1)
  }

  let upserted = 0
  for (const fix of fixtures as Fixture[]) {
    const dateStr = `${fix.date}T${fix.time}:00${fix.tz}`
    const start = new Date(dateStr)
    // Football match: 90min + 15min buffer = 105min
    const end = new Date(start.getTime() + 105 * 60 * 1000)

    const title =
      fix.home === 'TBD' || fix.away === 'TBD'
        ? `FIFA World Cup 2026 — ${fix.matchday}`
        : `${fix.home} vs ${fix.away}`

    const externalId = `wc2026-${fix.date}-${fix.home.replace(/[^a-z]/gi, '')}-${fix.away.replace(/[^a-z]/gi, '')}`.toLowerCase()

    await prisma.event.upsert({
      where: { calendarId_externalId: { calendarId: calendar.id, externalId } },
      update: { title, startDatetime: start, endDatetime: end, location: `${fix.venue}, ${fix.city}`, description: fix.matchday },
      create: {
        calendarId: calendar.id,
        externalId,
        title,
        startDatetime: start,
        endDatetime: end,
        location: `${fix.venue}, ${fix.city}`,
        description: fix.matchday,
        status: 'scheduled',
      },
    })
    upserted++
    console.log(`  ✓ ${title} — ${fix.date}`)
  }

  await prisma.calendar.update({
    where: { id: calendar.id },
    data: { lastSyncedAt: new Date() },
  })

  console.log(`\n${upserted} WC 2026 fixtures seeded.`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
