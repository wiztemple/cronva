import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function POST(req: NextRequest) {
  const { calendarId, platform = 'whatsapp' } = await req.json()
  if (!calendarId) {
    return NextResponse.json({ error: 'calendarId required' }, { status: 400 })
  }

  await prisma.share.create({ data: { calendarId, platform } })
  return NextResponse.json({ ok: true })
}
