import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const AFRICAN_CALENDARS = [
  // Ghana
  {
    slug: 'ghana-premier-league',
    name: 'Ghana Premier League',
    category: 'football',
    sport: 'football',
    description: "Ghana's top domestic football league — all 16 clubs, all fixtures.",
    country: 'gh',
    isFeatured: false,
  },
  {
    slug: 'black-stars',
    name: 'Ghana Black Stars',
    category: 'football',
    sport: 'football',
    description: "Full schedule of Ghana's national football team — qualifiers, friendlies, AFCON.",
    country: 'gh',
    isFeatured: false,
  },
  // Kenya
  {
    slug: 'kpl',
    name: 'Kenya Premier League',
    category: 'football',
    sport: 'football',
    description: "Kenya's top-flight domestic football competition.",
    country: 'ke',
    isFeatured: false,
  },
  {
    slug: 'harambee-stars',
    name: 'Harambee Stars',
    category: 'football',
    sport: 'football',
    description: "Kenya national football team — all international fixtures.",
    country: 'ke',
    isFeatured: false,
  },
]

async function main() {
  console.log('Seeding African market calendars...')
  for (const cal of AFRICAN_CALENDARS) {
    await prisma.calendar.upsert({
      where: { slug: cal.slug },
      update: { name: cal.name, description: cal.description },
      create: { ...cal, isActive: true },
    })
    console.log(`  ✓ ${cal.name} (${cal.country.toUpperCase()})`)
  }
  console.log('Done.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
