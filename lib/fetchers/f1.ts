import { prisma } from '@/lib/db/client'

const BASE_URL = 'https://api.openf1.org/v1'

interface OpenF1Session {
  session_key: number
  session_name: string
  session_type: string
  date_start: string
  date_end: string
  location: string
  country_name: string
  circuit_short_name: string
  meeting_key: number
  year: number
}

function sessionTitle(session: OpenF1Session): string {
  return `F1 ${session.location} — ${session.session_name}`
}

function mapStatus(session: OpenF1Session): string {
  const now = new Date()
  const start = new Date(session.date_start)
  const end = new Date(session.date_end)
  if (now >= start && now <= end) return 'live'
  return 'scheduled'
}

export class F1Fetcher {
  async syncAll() {
    const calendar = await prisma.calendar.findUnique({ where: { slug: 'formula-1' } })
    if (!calendar) {
      console.warn('[F1Fetcher] formula-1 calendar not found')
      return
    }

    const currentYear = new Date().getFullYear()
    const url = `${BASE_URL}/sessions?year=${currentYear}`

    let sessions: OpenF1Session[] = []
    try {
      const res = await fetch(url, { next: { revalidate: 0 } })
      if (!res.ok) {
        console.error(`[F1Fetcher] sessions fetch failed: ${res.status}`)
        return
      }
      sessions = await res.json()
    } catch (err) {
      console.error('[F1Fetcher] fetch error:', err)
      return
    }

    let upserted = 0
    for (const session of sessions) {
      const start = new Date(session.date_start)
      const end = new Date(session.date_end)
      const location = [session.circuit_short_name, session.country_name].filter(Boolean).join(', ')

      await prisma.event.upsert({
        where: {
          calendarId_externalId: {
            calendarId: calendar.id,
            externalId: `f1-${session.session_key}`,
          },
        },
        update: {
          title: sessionTitle(session),
          startDatetime: start,
          endDatetime: end,
          description: `${session.session_type} session at ${session.location} Grand Prix`,
          location: location || null,
          status: mapStatus(session),
        },
        create: {
          calendarId: calendar.id,
          externalId: `f1-${session.session_key}`,
          title: sessionTitle(session),
          startDatetime: start,
          endDatetime: end,
          description: `${session.session_type} session at ${session.location} Grand Prix`,
          location: location || null,
          status: mapStatus(session),
        },
      })
      upserted++
    }

    await prisma.calendar.update({
      where: { id: calendar.id },
      data: { lastSyncedAt: new Date() },
    })

    console.log(`[F1Fetcher] ${upserted} sessions upserted`)
  }
}
