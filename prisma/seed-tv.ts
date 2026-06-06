import { PrismaClient } from '@prisma/client'
import tvEvents from '../data/tv-events.json'

const prisma = new PrismaClient()

const calendars = [
  {
    slug: 'upcoming-movies',
    name: 'Upcoming Movies',
    category: 'tv',
    sport: null,
    description: 'Theatrical releases and streaming premieres — blockbusters, indies, and Nollywood.',
    country: 'global',
    isFeatured: true,
    iconUrl: null,
  },
  {
    slug: 'tv-episodes',
    name: 'TV Episode Air Dates',
    category: 'tv',
    sport: null,
    description: 'Weekly episode drops and finales for the shows you follow — HBO, Netflix, Disney+, and more.',
    country: 'global',
    isFeatured: true,
    iconUrl: null,
  },
  {
    slug: 'new-series',
    name: 'New Series & Seasons',
    category: 'tv',
    sport: null,
    description: 'Series premieres and new season launches — never miss a debut episode.',
    country: 'global',
    isFeatured: false,
    iconUrl: null,
  },
]

interface TvEvent {
  calendarSlug: string
  externalId: string
  title: string
  startDatetime: string
  endDatetime: string
  description?: string
  location?: string
}

async function main() {
  console.log('Seeding TV calendars...')
  for (const cal of calendars) {
    await prisma.calendar.upsert({
      where: { slug: cal.slug },
      update: {
        name: cal.name,
        category: cal.category,
        description: cal.description,
        isFeatured: cal.isFeatured,
      },
      create: cal,
    })
    console.log(`  ✓ ${cal.name}`)
  }

  console.log('Seeding TV events...')
  for (const ev of tvEvents as TvEvent[]) {
    const calendar = await prisma.calendar.findUnique({ where: { slug: ev.calendarSlug } })
    if (!calendar) continue

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
  }
  console.log(`  ✓ ${(tvEvents as TvEvent[]).length} events`)
  console.log('Done.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
