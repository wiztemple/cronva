import { prisma } from '@/lib/db/client'

const BASE = 'https://api.aladhan.com/v1'

// Calculation method 3 = Egyptian General Authority (widely used in West Africa)
const METHOD = 3

interface City {
  name: string
  lat: number
  lon: number
  timezone: string
}

const CITIES: Record<string, City> = {
  lagos: { name: 'Lagos', lat: 6.5244, lon: 3.3792, timezone: 'Africa/Lagos' },
  kano:  { name: 'Kano',  lat: 12.0022, lon: 8.5920, timezone: 'Africa/Lagos' },
  abuja: { name: 'Abuja', lat: 9.0579, lon: 7.4951, timezone: 'Africa/Lagos' },
}

interface AladhanTimings {
  Fajr: string
  Dhuhr: string
  Asr: string
  Maghrib: string
  Isha: string
  Imsak: string // Suhoor time
}

interface AladhanDay {
  date: { gregorian: { date: string } }
  timings: AladhanTimings
}

function parseCityTime(dateStr: string, timeStr: string, timezone: string): Date {
  // dateStr: "22-06-2026" (DD-MM-YYYY), timeStr: "04:32 (+01)"
  const cleanTime = timeStr.replace(/\s*\(.*\)/, '').trim()
  const [day, month, year] = dateStr.split('-')
  const isoStr = `${year}-${month}-${day}T${cleanTime}:00`
  // Parse in city local timezone via the Intl trick
  const dt = new Date(`${year}-${month}-${day}T${cleanTime}:00+01:00`)
  return dt
}

async function fetchMonthlyCalendar(
  city: City,
  year: number,
  month: number
): Promise<AladhanDay[]> {
  const url = `${BASE}/calendar/${year}/${month}?latitude=${city.lat}&longitude=${city.lon}&method=${METHOD}`
  const res = await fetch(url, { next: { revalidate: 0 } })
  if (!res.ok) {
    console.error(`[Aladhan] ${city.name} ${year}/${month} failed: ${res.status}`)
    return []
  }
  const data = await res.json()
  return data.data ?? []
}

export async function syncPrayerTimes(cityKey: string, calendarSlug: string) {
  const city = CITIES[cityKey]
  if (!city) throw new Error(`Unknown city: ${cityKey}`)

  const calendar = await prisma.calendar.findUnique({ where: { slug: calendarSlug } })
  if (!calendar) { console.warn(`[Aladhan] Calendar not found: ${calendarSlug}`); return }

  const now = new Date()
  const currentYear = now.getFullYear()
  const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const

  let upserted = 0
  // Fetch remaining months of current year + next 2 months
  for (let y = currentYear; y <= currentYear + 1; y++) {
    const startMonth = y === currentYear ? now.getMonth() + 1 : 1
    const endMonth = y === currentYear ? 12 : 2
    for (let m = startMonth; m <= endMonth; m++) {
      const days = await fetchMonthlyCalendar(city, y, m)
      for (const day of days) {
        for (const prayer of PRAYERS) {
          const timeStr = day.timings[prayer]
          const dateStr = day.date.gregorian.date
          const [dd, mm, yyyy] = dateStr.split('-')
          const cleanTime = timeStr.replace(/\s*\(.*\)/, '').trim()
          const start = new Date(`${yyyy}-${mm}-${dd}T${cleanTime}:00+01:00`)
          const end = new Date(start.getTime() + 30 * 60 * 1000)
          const externalId = `prayer-${cityKey}-${yyyy}${mm}${dd}-${prayer.toLowerCase()}`

          await prisma.event.upsert({
            where: { calendarId_externalId: { calendarId: calendar.id, externalId } },
            update: { startDatetime: start, endDatetime: end },
            create: {
              calendarId: calendar.id,
              externalId,
              title: `${prayer} — ${city.name}`,
              startDatetime: start,
              endDatetime: end,
              description: `${prayer} prayer time for ${city.name}`,
              location: city.name,
              status: 'scheduled',
            },
          })
          upserted++
        }
      }
      await new Promise((r) => setTimeout(r, 500)) // rate-limit Aladhan API
    }
  }

  await prisma.calendar.update({
    where: { id: calendar.id },
    data: { lastSyncedAt: new Date() },
  })
  console.log(`[Aladhan] ${calendarSlug}: ${upserted} prayer time events upserted`)
}

export async function syncRamadan(cityKey: string, calendarSlug: string) {
  const city = CITIES[cityKey]
  if (!city) throw new Error(`Unknown city: ${cityKey}`)

  const calendar = await prisma.calendar.findUnique({ where: { slug: calendarSlug } })
  if (!calendar) { console.warn(`[Aladhan] Calendar not found: ${calendarSlug}`); return }

  // Ramadan 2027: approx Feb 18 – Mar 19, 2027
  // Fetch Feb and Mar 2027 and filter Ramadan days via Imsak/Maghrib
  const RAMADAN_MONTHS: Array<{ year: number; month: number }> = [
    { year: 2027, month: 2 },
    { year: 2027, month: 3 },
  ]

  let upserted = 0
  for (const { year, month } of RAMADAN_MONTHS) {
    const days = await fetchMonthlyCalendar(city, year, month)
    for (const day of days) {
      const dateStr = day.date.gregorian.date
      const [dd, mm, yyyy] = dateStr.split('-')

      // Suhoor (Imsak) event
      const imsak = day.timings.Imsak.replace(/\s*\(.*\)/, '').trim()
      const maghrib = day.timings.Maghrib.replace(/\s*\(.*\)/, '').trim()

      const suhoorStart = new Date(`${yyyy}-${mm}-${dd}T${imsak}:00+01:00`)
      const suhoorEnd = new Date(suhoorStart.getTime() + 30 * 60 * 1000)
      const iftarStart = new Date(`${yyyy}-${mm}-${dd}T${maghrib}:00+01:00`)
      const iftarEnd = new Date(iftarStart.getTime() + 60 * 60 * 1000)

      for (const [type, start, end] of [
        ['Suhoor', suhoorStart, suhoorEnd],
        ['Iftar', iftarStart, iftarEnd],
      ] as [string, Date, Date][]) {
        const externalId = `ramadan-${cityKey}-${yyyy}${mm}${dd}-${type.toLowerCase()}`
        await prisma.event.upsert({
          where: { calendarId_externalId: { calendarId: calendar.id, externalId } },
          update: { startDatetime: start, endDatetime: end },
          create: {
            calendarId: calendar.id,
            externalId,
            title: `${type} — ${city.name} (${dd}/${mm}/${yyyy})`,
            startDatetime: start,
            endDatetime: end,
            description: `Ramadan 2027 ${type} time for ${city.name}`,
            location: city.name,
            status: 'scheduled',
          },
        })
        upserted++
      }
    }
    await new Promise((r) => setTimeout(r, 500))
  }

  await prisma.calendar.update({ where: { id: calendar.id }, data: { lastSyncedAt: new Date() } })
  console.log(`[Aladhan] ${calendarSlug}: ${upserted} Ramadan events upserted`)
}

export class AladhanFetcher {
  async syncAll() {
    await syncPrayerTimes('lagos', 'prayer-lagos')
    await syncRamadan('lagos', 'ramadan-lagos')
    await syncRamadan('kano', 'ramadan-kano')
    await syncRamadan('abuja', 'ramadan-abuja')
  }
}
