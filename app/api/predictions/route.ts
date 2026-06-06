import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db/client'
import { createHash } from 'crypto'
import { headers } from 'next/headers'

const VALID_PICKS = ['home', 'draw', 'away']

export async function POST(req: NextRequest) {
  const { eventId, pick } = await req.json()

  if (!eventId || !VALID_PICKS.includes(pick)) {
    return NextResponse.json({ error: 'eventId and pick (home|draw|away) required' }, { status: 400 })
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true, startDatetime: true, status: true },
  })
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  if (event.startDatetime < new Date()) {
    return NextResponse.json({ error: 'Cannot predict on a past event' }, { status: 400 })
  }

  const session = await auth()
  const userId = session?.user?.id ?? null

  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ??
    headersList.get('x-real-ip') ??
    'unknown'
  const ipHash = createHash('sha256').update(ip).digest('hex')

  // For anonymous: deduplicate by ip_hash per event
  if (!userId) {
    const existing = await prisma.prediction.findFirst({
      where: { eventId, userId: null, ipHash },
    })
    if (existing) {
      return NextResponse.json({ error: 'Already voted from this IP' }, { status: 429 })
    }
  }

  try {
    await prisma.prediction.upsert({
      where: {
        eventId_userId: userId
          ? { eventId, userId }
          : { eventId, userId: null as unknown as string },
      },
      update: { pick },
      create: { eventId, userId, ipHash, pick },
    })
  } catch {
    // If unique constraint hit for anonymous (no userId), insert directly
    if (!userId) {
      await prisma.prediction.create({ data: { eventId, userId: null, ipHash, pick } })
    }
  }

  // Return updated tally
  const tally = await getPredictionTally(eventId)
  return NextResponse.json({ ok: true, tally })
}

export async function GET(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get('eventId')
  if (!eventId) return NextResponse.json({ error: 'eventId required' }, { status: 400 })

  const tally = await getPredictionTally(eventId)
  return NextResponse.json(tally)
}

async function getPredictionTally(eventId: string) {
  const counts = await prisma.prediction.groupBy({
    by: ['pick'],
    where: { eventId },
    _count: { pick: true },
  })

  const total = counts.reduce((s, r) => s + r._count.pick, 0)
  const pct = (pick: string) => {
    const row = counts.find((r) => r.pick === pick)
    return total > 0 ? Math.round(((row?._count.pick ?? 0) / total) * 100) : 0
  }

  return {
    total,
    home: pct('home'),
    draw: pct('draw'),
    away: pct('away'),
  }
}
