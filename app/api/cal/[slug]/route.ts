import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import ical, { ICalEventStatus } from 'ical-generator'
import { cacheGet, cacheSet } from '@/lib/redis'
import { checkRateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  // Rate limit: 100 req/min per IP
  const rateLimitResponse = await checkRateLimit(req)
  if (rateLimitResponse) return rateLimitResponse

  const { slug } = await params
  const cleanSlug = slug.replace(/\.ics$/, '')

  const calendar = await prisma.calendar.findUnique({ where: { slug: cleanSlug } })

  if (!calendar || !calendar.isActive) {
    return new NextResponse('Calendar not found', { status: 404 })
  }

  const filterParam = req.nextUrl.searchParams.get('e')
  const externalIds = filterParam
    ? [...new Set(filterParam.split(',').map((s) => s.trim()).filter(Boolean))].slice(0, 100)
    : null

  const cacheKey = externalIds ? null : `cal:${cleanSlug}`
  const TTL = 3600

  if (cacheKey) {
    const cached = await cacheGet<string>(cacheKey)
    if (cached) {
      return new NextResponse(cached, {
        status: 200,
        headers: {
          'Content-Type': 'text/calendar; charset=utf-8',
          'Cache-Control': `public, max-age=${TTL}, s-maxage=${TTL}`,
          'Content-Disposition': `inline; filename="${cleanSlug}.ics"`,
          'X-Cache': 'HIT',
        },
      })
    }
  }

  const now = new Date()
  const events = await prisma.event.findMany({
    where: {
      calendarId: calendar.id,
      endDatetime: { gt: now },
      ...(externalIds?.length ? { externalId: { in: externalIds } } : {}),
    },
    orderBy: { startDatetime: 'asc' },
    take: externalIds?.length ? externalIds.length : 200,
  })

  const calName = externalIds?.length
    ? `Cronva — ${calendar.name} (${events.length} selected)`
    : `Cronva — ${calendar.name}`
  const cal = ical({ name: calName })
  for (const ev of events) {
    cal.createEvent({
      id: `${ev.externalId}@cronva.app`,
      summary: ev.title,
      start: ev.startDatetime,
      end: ev.endDatetime,
      description: ev.description ?? undefined,
      location: ev.location ?? undefined,
      lastModified: ev.updatedAt,
      status: ev.status === 'cancelled' ? ICalEventStatus.CANCELLED : ICalEventStatus.CONFIRMED,
    })
  }

  const icsString = cal.toString()

  if (cacheKey) {
    await cacheSet(cacheKey, icsString, TTL)
  }

  return new NextResponse(icsString, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Cache-Control': externalIds ? 'private, no-cache' : `public, max-age=${TTL}, s-maxage=${TTL}`,
      'Content-Disposition': `inline; filename="${cleanSlug}.ics"`,
      'X-Cache': cacheKey ? 'MISS' : 'BYPASS',
    },
  })
}
