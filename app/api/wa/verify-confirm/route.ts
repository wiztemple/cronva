import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db/client'
import { otpStore } from '../verify-send/route'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { phone, otp } = await req.json()
  if (!phone || !otp) {
    return NextResponse.json({ error: 'phone and otp required' }, { status: 400 })
  }

  const record = otpStore.get(phone)
  if (!record || record.userId !== session.user.id) {
    return NextResponse.json({ error: 'No OTP pending for this number' }, { status: 400 })
  }
  if (Date.now() > record.expires) {
    otpStore.delete(phone)
    return NextResponse.json({ error: 'OTP expired — please request a new one' }, { status: 400 })
  }
  if (record.otp !== otp) {
    return NextResponse.json({ error: 'Incorrect code' }, { status: 400 })
  }

  otpStore.delete(phone)

  await prisma.user.update({
    where: { id: session.user.id },
    data: { waPhone: phone, waAlertsOn: true },
  })

  return NextResponse.json({ verified: true })
}
