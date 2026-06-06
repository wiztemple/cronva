import { PrismaClient } from '@prisma/client'
import eidEvents from '../data/eid-nigeria.json'

const prisma = new PrismaClient()

const ISLAMIC_CALENDARS = [
  {
    slug: 'ramadan-lagos',
    name: 'Ramadan 2027 — Lagos',
    category: 'islamic',
    description: 'Suhoor and Iftar times for Lagos during Ramadan 2027 (approx. Feb 18 – Mar 19).',
    country: 'nigeria',
  },
  {
    slug: 'ramadan-kano',
    name: 'Ramadan 2027 — Kano',
    category: 'islamic',
    description: 'Suhoor and Iftar times for Kano during Ramadan 2027.',
    country: 'nigeria',
  },
  {
    slug: 'ramadan-abuja',
    name: 'Ramadan 2027 — Abuja',
    category: 'islamic',
    description: 'Suhoor and Iftar times for Abuja during Ramadan 2027.',
    country: 'nigeria',
  },
  {
    slug: 'prayer-lagos',
    name: 'Lagos Daily Prayer Times',
    category: 'islamic',
    description: 'Fajr, Dhuhr, Asr, Maghrib and Isha prayer times for Lagos, Nigeria.',
    country: 'nigeria',
  },
  {
    slug: 'eid-nigeria',
    name: 'Eid & Islamic Holidays — Nigeria',
    category: 'islamic',
    description: 'Eid al-Fitr, Eid al-Adha, Mawlid an-Nabi and Islamic public holidays in Nigeria.',
    country: 'nigeria',
    isFeatured: false,
  },
]

async function main() {
  console.log('Seeding Islamic calendars...')

  // Upsert calendars
  for (const cal of ISLAMIC_CALENDARS) {
    await prisma.calendar.upsert({
      where: { slug: cal.slug },
      update: { name: cal.name, description: cal.description },
      create: {
        slug: cal.slug,
        name: cal.name,
        category: cal.category,
        description: cal.description,
        country: cal.country,
        isFeatured: false,
        isActive: true,
      },
    })
    console.log(`  ✓ ${cal.name}`)
  }

  // Seed Eid events
  const eidCal = await prisma.calendar.findUnique({ where: { slug: 'eid-nigeria' } })
  if (eidCal) {
    for (const ev of eidEvents) {
      await prisma.event.upsert({
        where: { calendarId_externalId: { calendarId: eidCal.id, externalId: ev.externalId } },
        update: { title: ev.title, startDatetime: new Date(ev.startDatetime), endDatetime: new Date(ev.endDatetime) },
        create: {
          calendarId: eidCal.id,
          externalId: ev.externalId,
          title: ev.title,
          startDatetime: new Date(ev.startDatetime),
          endDatetime: new Date(ev.endDatetime),
          description: ev.description,
          location: ev.location,
          status: 'scheduled',
        },
      })
      console.log(`  ✓ ${ev.title}`)
    }
  }

  console.log('\nIslamic calendars seeded. Run `npx tsx prisma/seed-aladhan.ts` to fetch prayer times from Aladhan API.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
