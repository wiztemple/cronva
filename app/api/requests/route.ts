import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function POST(req: NextRequest) {
  const { email, calendarName, description, category } = await req.json()

  if (!calendarName?.trim()) {
    return NextResponse.json({ error: 'Calendar name required' }, { status: 400 })
  }

  const request = await prisma.calendarRequest.create({
    data: {
      email: email?.trim() || null,
      calendarName: calendarName.trim(),
      description: description?.trim() || null,
      category: category?.trim() || null,
    },
  })

  return NextResponse.json({ id: request.id })
}

export async function GET() {
  const requests = await prisma.calendarRequest.findMany({
    orderBy: { votes: 'desc' },
    take: 10,
  })
  return NextResponse.json(requests)
}
