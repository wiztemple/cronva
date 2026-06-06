import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db/client'

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { calendarId, enabled } = await req.json()
  if (!calendarId || typeof enabled !== 'boolean') {
    return NextResponse.json({ error: 'calendarId and enabled required' }, { status: 400 })
  }

  const sub = await prisma.userSubscription.findUnique({
    where: { userId_calendarId: { userId: session.user.id, calendarId } },
  })
  if (!sub) {
    return NextResponse.json({ error: 'Not subscribed to this calendar' }, { status: 404 })
  }

  await prisma.userSubscription.update({
    where: { userId_calendarId: { userId: session.user.id, calendarId } },
    data: { waAlert: enabled },
  })

  return NextResponse.json({ waAlert: enabled })
}
