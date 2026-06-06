import { prisma } from '@/lib/db/client'
import manualEvents from '@/data/manual-events.json'

interface ManualEvent {
  calendarSlug: string
  externalId: string
  title: string
  startDatetime: string
  endDatetime: string
  description?: string
  location?: string
}

export class ManualFetcher {
  async syncAll() {
    const events = manualEvents as ManualEvent[]

    // Group by calendar slug to avoid repeated DB lookups
    const bySlug = new Map<string, ManualEvent[]>()
    for (const ev of events) {
      if (!bySlug.has(ev.calendarSlug)) bySlug.set(ev.calendarSlug, [])
      bySlug.get(ev.calendarSlug)!.push(ev)
    }

    for (const [slug, calEvents] of bySlug.entries()) {
      const calendar = await prisma.calendar.findUnique({ where: { slug } })
      if (!calendar) {
        console.warn(`[ManualFetcher] Calendar not found: ${slug}`)
        continue
      }

      let upserted = 0
      for (const ev of calEvents) {
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
        upserted++
      }

      await prisma.calendar.update({
        where: { id: calendar.id },
        data: { lastSyncedAt: new Date() },
      })

      console.log(`[ManualFetcher] ${slug}: ${upserted} events upserted`)
    }
  }
}
