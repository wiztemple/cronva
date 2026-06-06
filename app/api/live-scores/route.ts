import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export const dynamic = 'force-dynamic'

interface LiveData {
  homeGoals: number
  awayGoals: number
  minute: number
  statusDetail: string
  redCardsHome: number
  redCardsAway: number
}

export async function GET(req: NextRequest) {
  const calendarId = req.nextUrl.searchParams.get('calendarId')
  if (!calendarId) return NextResponse.json({ events: [] })

  const now = new Date()

  // status:'live' is set by the poller when liveData is present — use it as discriminator
  const liveEvents = await prisma.event.findMany({
    where: {
      calendarId,
      status: 'live',
      startDatetime: { lte: now },
      endDatetime: { gte: new Date(now.getTime() - 120 * 60 * 1000) },
    },
    select: { id: true, title: true, startDatetime: true, liveData: true },
    take: 5,
  })

  return NextResponse.json({
    events: liveEvents.map((ev) => ({
      id: ev.id,
      title: ev.title,
      startDatetime: ev.startDatetime,
      liveData: ev.liveData as LiveData | null,
    })),
  })
}
