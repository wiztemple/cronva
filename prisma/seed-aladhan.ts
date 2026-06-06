/**
 * Fetches prayer times and Ramadan suhoor/iftar from Aladhan API.
 * Run once after seed-islamic.ts: npx tsx prisma/seed-aladhan.ts
 * Safe to re-run (upserts).
 */
import { PrismaClient } from '@prisma/client'
import { syncPrayerTimes, syncRamadan } from '../lib/fetchers/aladhan'

// Quick shim so the fetcher can work standalone
const prisma = new PrismaClient()

async function main() {
  console.log('Fetching Lagos daily prayer times (this may take ~2 minutes)...')
  await syncPrayerTimes('lagos', 'prayer-lagos')

  console.log('Fetching Ramadan 2027 Suhoor/Iftar times...')
  await syncRamadan('lagos', 'ramadan-lagos')
  await syncRamadan('kano',  'ramadan-kano')
  await syncRamadan('abuja', 'ramadan-abuja')

  console.log('Done.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
