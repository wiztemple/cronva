/**
 * Sync FIFA World Cup 2026 fixtures from football-data.org (official schedule).
 * Removes stale local wc2026-* events from the old JSON seed.
 *
 * Requires FOOTBALL_DATA_API_KEY in .env.local
 */
import { PrismaClient } from '@prisma/client'
import { FootballDataFetcher } from '../lib/fetchers/football-data'

const prisma = new PrismaClient()

async function main() {
  const calendar = await prisma.calendar.findUnique({ where: { slug: 'world-cup-2026' } })
  if (!calendar) {
    console.error('world-cup-2026 calendar not found — run npm run db:seed first')
    process.exit(1)
  }

  const removed = await prisma.event.deleteMany({
    where: {
      calendarId: calendar.id,
      externalId: { startsWith: 'wc2026-' },
    },
  })
  if (removed.count > 0) {
    console.log(`Removed ${removed.count} outdated local WC fixtures`)
  }

  if (!process.env.FOOTBALL_DATA_API_KEY) {
    console.error('FOOTBALL_DATA_API_KEY is required — add it to .env.local')
    process.exit(1)
  }

  console.log('Syncing World Cup 2026 from football-data.org…')
  await new FootballDataFetcher().syncWorldCup()

  const count = await prisma.event.count({ where: { calendarId: calendar.id } })
  const opener = await prisma.event.findFirst({
    where: { calendarId: calendar.id },
    orderBy: { startDatetime: 'asc' },
    select: { title: true, startDatetime: true },
  })

  console.log(`\n${count} World Cup 2026 fixtures synced.`)
  if (opener) {
    console.log(`Opener: ${opener.title} — ${opener.startDatetime.toISOString()}`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
