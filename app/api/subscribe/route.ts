import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db/client'

async function resolveCalendarId(calendarId?: string, slug?: string) {
  if (calendarId) {
    const calendar = await prisma.calendar.findUnique({ where: { id: calendarId } })
    return calendar?.id ?? null
  }
  if (slug) {
    const calendar = await prisma.calendar.findUnique({ where: { slug } })
    return calendar?.id ?? null
  }
  return null
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ subscribed: false, slugs: [] })
  }

  const slug = req.nextUrl.searchParams.get('slug')
  if (slug) {
    const calendar = await prisma.calendar.findUnique({ where: { slug } })
    if (!calendar) {
      return NextResponse.json({ subscribed: false })
    }
    const existing = await prisma.userSubscription.findUnique({
      where: { userId_calendarId: { userId: session.user.id, calendarId: calendar.id } },
    })
    return NextResponse.json({ subscribed: Boolean(existing) })
  }

  const subs = await prisma.userSubscription.findMany({
    where: { userId: session.user.id },
    include: { calendar: { select: { slug: true } } },
  })

  return NextResponse.json({
    slugs: subs.map((sub) => sub.calendar.slug),
  })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { calendarId, slug } = await req.json()
  const resolvedId = await resolveCalendarId(calendarId, slug)
  if (!resolvedId) {
    return NextResponse.json({ error: 'calendarId or slug required' }, { status: 400 })
  }

  const calendar = await prisma.calendar.findUnique({ where: { id: resolvedId } })
  if (!calendar) {
    return NextResponse.json({ error: 'Calendar not found' }, { status: 404 })
  }

  // Upsert subscription + increment count atomically
  const existing = await prisma.userSubscription.findUnique({
    where: { userId_calendarId: { userId: session.user.id, calendarId: resolvedId } },
  })

  if (!existing) {
    await prisma.$transaction([
      prisma.userSubscription.create({
        data: { userId: session.user.id, calendarId: resolvedId },
      }),
      prisma.calendar.update({
        where: { id: resolvedId },
        data: { subscriberCount: { increment: 1 } },
      }),
    ])
  }

  return NextResponse.json({ subscribed: true })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { calendarId, slug } = await req.json()
  const resolvedId = await resolveCalendarId(calendarId, slug)
  if (!resolvedId) {
    return NextResponse.json({ error: 'calendarId or slug required' }, { status: 400 })
  }

  const existing = await prisma.userSubscription.findUnique({
    where: { userId_calendarId: { userId: session.user.id, calendarId: resolvedId } },
  })

  if (existing) {
    await prisma.$transaction([
      prisma.userSubscription.delete({
        where: { userId_calendarId: { userId: session.user.id, calendarId: resolvedId } },
      }),
      prisma.calendar.update({
        where: { id: resolvedId },
        data: { subscriberCount: { decrement: 1 } },
      }),
    ])
  }

  return NextResponse.json({ subscribed: false })
}
