import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sendOtp } from '@/lib/wa'

// In-memory OTP store: phone → { otp, userId, expires }
export const otpStore = new Map<string, { otp: string; userId: string; expires: number }>()

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { phone } = await req.json()
  if (!phone || !/^\+[1-9]\d{7,14}$/.test(phone)) {
    return NextResponse.json({ error: 'Valid phone number required (e.g. +2348012345678)' }, { status: 400 })
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  otpStore.set(phone, {
    otp,
    userId: session.user.id,
    expires: Date.now() + 10 * 60 * 1000,
  })

  try {
    await sendOtp(phone, otp)
    return NextResponse.json({ sent: true })
  } catch {
    otpStore.delete(phone)
    return NextResponse.json({ error: 'Failed to send OTP — check phone number and try again' }, { status: 500 })
  }
}
