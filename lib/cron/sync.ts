import cron from 'node-cron'
import { FootballDataFetcher } from '@/lib/fetchers/football-data'
import { ApiFootballFetcher } from '@/lib/fetchers/api-football'
import { TheSportsDBFetcher } from '@/lib/fetchers/thesportsdb'
import { F1Fetcher } from '@/lib/fetchers/f1'
import { ManualFetcher } from '@/lib/fetchers/manual'
import { TvFetcher } from '@/lib/fetchers/tv'
import { TmdbFetcher } from '@/lib/fetchers/tmdb'
import { AladhanFetcher } from '@/lib/fetchers/aladhan'
import { pollLiveScores } from '@/lib/fetchers/live-scores'
import { sendWeeklyDigests } from '@/lib/email/digest'
import { sendMatchAlert } from '@/lib/wa'
import { cacheDel } from '@/lib/redis'
import { prisma } from '@/lib/db/client'

let started = false

// ─── Full sync (free calendars, every 6h) ────────────────────────────────────

export async function runSyncOnce() {
  console.log('[Sync] Running full sync...')
  const fetchers = [
    new ManualFetcher(),
    new TvFetcher(),
    new TmdbFetcher(),
    new F1Fetcher(),
    new TheSportsDBFetcher(),
    new FootballDataFetcher(),
    new ApiFootballFetcher(),
  ]
  for (const fetcher of fetchers) {
    try {
      await fetcher.syncAll()
    } catch (err) {
      console.error('[Sync] Fetcher error:', err)
    }
  }

  const calendars = await prisma.calendar.findMany({
    where: { isActive: true },
    select: { slug: true },
  })
  await Promise.all(calendars.map((c: { slug: string }) => cacheDel(`cal:${c.slug}`)))
  console.log(`[Sync] Cache invalidated for ${calendars.length} calendars`)

  console.log('[Sync] Done.')
}

// ─── Frequent sync (every 30min) ──────────────────────────────────────────────

async function runFrequentSync() {
  const calendars = await prisma.calendar.findMany({
    where: { isActive: true },
    select: { slug: true },
  })

  const fetchers = [new ManualFetcher(), new TvFetcher(), new ApiFootballFetcher()]
  for (const fetcher of fetchers) {
    try {
      await fetcher.syncAll()
    } catch (err) {
      console.error('[Sync] Frequent fetcher error:', err)
    }
  }

  await Promise.all(calendars.map((c: { slug: string }) => cacheDel(`cal:${c.slug}`)))
  console.log(`[Sync] Frequent refresh done (${calendars.length} calendars)`)
}

// ─── Prayer times sync (weekly, Sunday midnight) ─────────────────────────────

async function runAladhanSync() {
  try {
    await new AladhanFetcher().syncAll()
    // Invalidate Islamic calendar caches
    const islamicSlugs = ['prayer-lagos', 'ramadan-lagos', 'ramadan-kano', 'ramadan-abuja']
    await Promise.all(islamicSlugs.map((s) => cacheDel(`cal:${s}`)))
    console.log('[Cron] Aladhan sync done')
  } catch (err) {
    console.error('[Cron] Aladhan sync error:', err)
  }
}

// ─── Live scores (every 60s) ──────────────────────────────────────────────────

async function runLiveScorePoll() {
  try {
    await pollLiveScores()
  } catch (err) {
    console.error('[Cron] Live score poll error:', err)
  }
}

// ─── Prediction scoring (after match windows close) ──────────────────────────

async function scorePredictions() {
  // Find events that ended in the last 30 minutes with unscoredpredictions
  const cutoff = new Date(Date.now() - 30 * 60 * 1000)
  const recentlyEnded = await prisma.event.findMany({
    where: {
      endDatetime: { gte: cutoff, lte: new Date() },
      status: 'live',
      predictions: { some: { isCorrect: null } },
    },
    select: {
      id: true,
      title: true,
      liveData: true,
    },
  })

  for (const ev of recentlyEnded) {
    const ld = ev.liveData as { homeGoals?: number; awayGoals?: number } | null
    if (!ld) continue

    const homeGoals = ld.homeGoals ?? 0
    const awayGoals = ld.awayGoals ?? 0
    const result =
      homeGoals > awayGoals ? 'home' : homeGoals < awayGoals ? 'away' : 'draw'

    await prisma.prediction.updateMany({
      where: { eventId: ev.id, isCorrect: null },
      data: { isCorrect: false },
    })
    await prisma.prediction.updateMany({
      where: { eventId: ev.id, pick: result },
      data: { isCorrect: true },
    })
    console.log(`[Predictions] Scored ${ev.title} → result: ${result}`)
  }
}

// ─── Subscriber count recalc (nightly) ───────────────────────────────────────

async function recalcSubscriberCounts() {
  const counts = await prisma.userSubscription.groupBy({
    by: ['calendarId'],
    _count: { calendarId: true },
  })
  for (const row of counts) {
    await prisma.calendar.update({
      where: { id: row.calendarId },
      data: { subscriberCount: row._count.calendarId },
    })
  }
  const subscribedIds = counts.map((r: { calendarId: string }) => r.calendarId)
  if (subscribedIds.length > 0) {
    await prisma.calendar.updateMany({
      where: { id: { notIn: subscribedIds } },
      data: { subscriberCount: 0 },
    })
  }
  console.log('[Cron] Subscriber counts recalculated')
}

// ─── WhatsApp alerts (every 15min) ───────────────────────────────────────────

async function sendWhatsAppMatchAlerts() {
  if (!process.env.META_WA_TOKEN) return

  const now = new Date()
  const windowStart = new Date(now.getTime() + 105 * 60 * 1000)
  const windowEnd = new Date(now.getTime() + 135 * 60 * 1000)

  const events = await prisma.event.findMany({
    where: {
      startDatetime: { gte: windowStart, lte: windowEnd },
      status: 'scheduled',
    },
    include: { calendar: true },
  })

  for (const ev of events) {
    const subscribers = await prisma.userSubscription.findMany({
      where: {
        calendarId: ev.calendarId,
        waAlert: true,
        user: { waPhone: { not: null }, waAlertsOn: true },
      },
      include: {
        user: {
          select: { waPhone: true },
        },
      },
    })

    for (const sub of subscribers) {
      if (!sub.user.waPhone) continue
      try {
        const [teamA, teamB] = ev.title.includes(' vs ')
          ? ev.title.split(' vs ')
          : [ev.title, '']
        await sendMatchAlert({
          phone: sub.user.waPhone,
          teamA: teamA.trim(),
          teamB: (teamB ?? '').trim(),
          startDatetime: ev.startDatetime,
          competition: ev.calendar.name,
          venue: ev.location,
        })
      } catch (err) {
        console.error('[WA] Alert send error:', err)
      }
    }
  }
  if (events.length > 0) console.log(`[WA] Alerts processed for ${events.length} events`)
}

// ─── Scheduler ────────────────────────────────────────────────────────────────

export function startCronSync() {
  if (started) return
  started = true

  // Full sync — every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    await runSyncOnce()
  })

  // Frequent refresh — every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    await runFrequentSync().catch((e) => console.error('[Cron] Frequent sync error:', e))
  })

  // Live score polling — every 60 seconds
  cron.schedule('* * * * *', async () => {
    await runLiveScorePoll()
  })

  // Prediction scoring — every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    await scorePredictions().catch((e) => console.error('[Cron] Prediction scoring error:', e))
  })

  // WhatsApp alerts — every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    await sendWhatsAppMatchAlerts().catch((e) => console.error('[Cron] WA alert error:', e))
  })

  // Subscriber count recalc — midnight WAT (23:00 UTC)
  cron.schedule('0 23 * * *', async () => {
    await recalcSubscriberCounts()
  })

  // Aladhan prayer times — weekly, Sunday 02:00 UTC
  cron.schedule('0 2 * * 0', async () => {
    await runAladhanSync()
  })

  // Weekly digest — Monday 07:00 WAT (06:00 UTC)
  cron.schedule('0 6 * * 1', async () => {
    await sendWeeklyDigests().catch((e) => console.error('[Cron] Digest error:', e))
  })

  console.log('[Cron] Scheduled: sync 6h | refresh 30m | live 1m | scores 5m | WA 15m | digest Mon 07:00 WAT')
}
