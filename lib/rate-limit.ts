import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

let ratelimit: Ratelimit | null = null

function getRatelimiter(): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }
  if (!ratelimit) {
    ratelimit = new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      }),
      limiter: Ratelimit.slidingWindow(100, '1 m'),
      analytics: false,
    })
  }
  return ratelimit
}

export async function checkRateLimit(req: NextRequest): Promise<NextResponse | null> {
  const rl = getRatelimiter()
  if (!rl) return null // No Redis configured — skip rate limiting in dev

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  const { success, limit, remaining, reset } = await rl.limit(`cal:${ip}`)
  if (!success) {
    return new NextResponse('Too many requests', {
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': String(remaining),
      },
    })
  }
  return null
}
