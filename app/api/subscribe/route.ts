import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db/client'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { calendarId } = await req.json()
  if (!calendarId) {
    return NextResponse.json({ error: 'calendarId required' }, { status: 400 })
  }

  const calendar = await prisma.calendar.findUnique({ where: { id: calendarId } })
  if (!calendar) {
    return NextResponse.json({ error: 'Calendar not found' }, { status: 404 })
  }

  // Upsert subscription + increment count atomically
  const existing = await prisma.userSubscription.findUnique({
    where: { userId_calendarId: { userId: session.user.id, calendarId } },
  })

  if (!existing) {
    await prisma.$transaction([
      prisma.userSubscription.create({
        data: { userId: session.user.id, calendarId },
      }),
      prisma.calendar.update({
        where: { id: calendarId },
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

  const { calendarId } = await req.json()
  if (!calendarId) {
    return NextResponse.json({ error: 'calendarId required' }, { status: 400 })
  }

  const existing = await prisma.userSubscription.findUnique({
    where: { userId_calendarId: { userId: session.user.id, calendarId } },
  })

  if (existing) {
    await prisma.$transaction([
      prisma.userSubscription.delete({
        where: { userId_calendarId: { userId: session.user.id, calendarId } },
      }),
      prisma.calendar.update({
        where: { id: calendarId },
        data: { subscriberCount: { decrement: 1 } },
      }),
    ])
  }

  return NextResponse.json({ subscribed: false })
}
