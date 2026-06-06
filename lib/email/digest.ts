import { Resend } from 'resend'
import { prisma } from '@/lib/db/client'
import { weeklyDigestHtml } from './templates'

export async function sendWeeklyDigests() {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Digest] No RESEND_API_KEY — skipping')
    return
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const now = new Date()
  const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const users = await prisma.user.findMany({
    where: { userSubscriptions: { some: {} } },
    include: {
      userSubscriptions: {
        include: {
          calendar: {
            include: {
              events: {
                where: {
                  status: { not: 'cancelled' },
                  startDatetime: { gte: now, lte: weekEnd },
                },
                orderBy: { startDatetime: 'asc' },
                take: 5,
              },
            },
          },
        },
      },
    },
  })

  let sent = 0
  for (const user of users) {
    const groups = user.userSubscriptions
      .filter((sub) => sub.calendar.events.length > 0)
      .map((sub) => ({
        calendarName: sub.calendar.name,
        calendarSlug: sub.calendar.slug,
        events: sub.calendar.events.map((ev) => ({
          title: ev.title,
          startDatetime: ev.startDatetime,
          location: ev.location,
        })),
      }))

    if (groups.length === 0) continue

    try {
      await resend.emails.send({
        from: 'Cronva <noreply@cronva.app>',
        to: user.email,
        subject: `Your fixtures this week — ${new Intl.DateTimeFormat('en-NG', { month: 'short', day: 'numeric' }).format(now)}`,
        html: weeklyDigestHtml(groups),
      })
      sent++
    } catch (err) {
      console.error(`[Digest] Failed to send to ${user.email}:`, err)
    }
  }

  console.log(`[Digest] Sent to ${sent} users`)
}
