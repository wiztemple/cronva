import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params

  const [counts, total] = await Promise.all([
    prisma.prediction.groupBy({
      by: ['pick'],
      where: { eventId },
      _count: { pick: true },
    }),
    prisma.prediction.count({ where: { eventId } }),
  ])

  const pct = (pick: string) => {
    const row = counts.find((r) => r.pick === pick)
    return total > 0 ? Math.round(((row?._count.pick ?? 0) / total) * 100) : 0
  }

  return NextResponse.json({
    total,
    home: pct('home'),
    draw: pct('draw'),
    away: pct('away'),
  })
}
