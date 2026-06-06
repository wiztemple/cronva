import { PrismaClient } from '@prisma/client'
import tennisEvents from '../data/tennis-events.json'

const prisma = new PrismaClient()

const calendars = [
  {
    slug: 'tennis-grand-slams',
    name: 'Tennis Grand Slams',
    category: 'tennis',
    sport: 'tennis',
    description: 'Australian Open, Roland Garros, Wimbledon, and US Open — finals and key draw dates.',
    country: 'global',
    isFeatured: true,
    iconUrl: null,
  },
  {
    slug: 'atp-tour',
    name: 'ATP Tour',
    category: 'tennis',
    sport: 'tennis',
    description: 'ATP singles matches — Masters 1000, 500, and 250 events worldwide.',
    country: 'global',
    isFeatured: false,
    iconUrl: null,
  },
  {
    slug: 'wta-tour',
    name: 'WTA Tour',
    category: 'tennis',
    sport: 'tennis',
    description: 'WTA singles matches — Premier, 1000, and 500 events worldwide.',
    country: 'global',
    isFeatured: false,
    iconUrl: null,
  },
]

interface ManualEvent {
  calendarSlug: string
  externalId: string
  title: string
  startDatetime: string
  endDatetime: string
  description?: string
  location?: string
}

async function main() {
  console.log('Seeding tennis calendars...')
  for (const cal of calendars) {
    await prisma.calendar.upsert({
      where: { slug: cal.slug },
      update: { name: cal.name, category: cal.category, description: cal.description, isFeatured: cal.isFeatured },
      create: cal,
    })
    console.log(`  ✓ ${cal.name}`)
  }

  for (const ev of tennisEvents as ManualEvent[]) {
    const calendar = await prisma.calendar.findUnique({ where: { slug: ev.calendarSlug } })
    if (!calendar) continue

    await prisma.event.upsert({
      where: {
        calendarId_externalId: { calendarId: calendar.id, externalId: ev.externalId },
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
  console.log(`  ✓ ${(tennisEvents as ManualEvent[]).length} grand slam events`)
  console.log('Done.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
