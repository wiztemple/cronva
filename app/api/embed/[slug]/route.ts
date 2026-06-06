import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const headersList = await headers()
  const referer = headersList.get('referer') ?? ''
  const origin = headersList.get('origin') ?? ''

  const domain = (() => {
    try {
      return new URL(origin || referer).hostname
    } catch {
      return origin || referer || 'unknown'
    }
  })()

  const calendar = await prisma.calendar.findUnique({
    where: { slug, isActive: true },
  })

  if (!calendar) {
    return new NextResponse(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const now = new Date()
  const events = await prisma.event.findMany({
    where: {
      calendarId: calendar.id,
      status: { not: 'cancelled' },
      startDatetime: { gt: now },
    },
    orderBy: { startDatetime: 'asc' },
    take: 5,
  })

  // Log domain for B2B outreach
  if (domain && domain !== 'unknown' && domain !== 'localhost') {
    await prisma.partner.upsert({
      where: { domain_calendarId: { domain, calendarId: calendar.id } },
      update: { embedCount: { increment: 1 } },
      create: { domain, calendarId: calendar.id, embedCount: 1 },
    }).catch(() => {}) // non-critical
  }

  return new NextResponse(
    JSON.stringify({ calendar: { name: calendar.name, slug: calendar.slug }, events }),
    {
      status: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    }
  )
}
