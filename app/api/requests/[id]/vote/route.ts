import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { headers } from 'next/headers'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Rate-limit by IP: 1 vote per IP per request (stored in-memory for simplicity;
  // use Redis/DB for production multi-instance deployments)
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ??
    headersList.get('x-real-ip') ??
    'unknown'

  const cacheKey = `vote:${id}:${ip}`
  if (voteCache.has(cacheKey)) {
    return NextResponse.json({ error: 'Already voted' }, { status: 429 })
  }
  voteCache.set(cacheKey, true)

  const updated = await prisma.calendarRequest.update({
    where: { id },
    data: { votes: { increment: 1 } },
  }).catch(() => null)

  if (!updated) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ votes: updated.votes })
}

// Simple in-process vote dedup cache (resets on server restart)
const voteCache = new Map<string, boolean>()
