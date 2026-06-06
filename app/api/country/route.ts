import { NextRequest, NextResponse } from 'next/server'
import type { CountryCode } from '@/lib/geo'

const VALID: CountryCode[] = ['ng', 'gh', 'ke', 'za', 'global']

export async function POST(req: NextRequest) {
  const { country } = await req.json()
  if (!VALID.includes(country)) {
    return NextResponse.json({ error: 'Invalid country' }, { status: 400 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('cronva_country', country, {
    maxAge: 365 * 24 * 60 * 60,
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
  })
  return res
}
