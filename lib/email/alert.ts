import { Resend } from 'resend'
import { prisma } from '@/lib/db/client'
import { fixtureChangeHtml } from './templates'

export async function sendFixtureChangeAlert(params: {
  eventId: string
  calendarId: string
  matchTitle: string
  calendarName: string
  calendarSlug: string
  oldDatetime: Date
  newDatetime: Date | null
  status: string
}) {
  if (!process.env.RESEND_API_KEY) return

  const resend = new Resend(process.env.RESEND_API_KEY)

  const subscribers = await prisma.userSubscription.findMany({
    where: { calendarId: params.calendarId },
    include: { user: { select: { email: true } } },
  })

  if (subscribers.length === 0) return

  const html = fixtureChangeHtml(params)
  const subject =
    params.status === 'cancelled'
      ? `Match cancelled: ${params.matchTitle}`
      : `Schedule change: ${params.matchTitle}`

  const emails = subscribers.map((s) => s.user.email)

  for (let i = 0; i < emails.length; i += 50) {
    const batch = emails.slice(i, i + 50)
    try {
      await resend.batch.send(
        batch.map((to: string) => ({
          from: 'Cronva <noreply@cronva.app>',
          to,
          subject,
          html,
        }))
      )
    } catch (err) {
      console.error('[Alert] Batch send error:', err)
    }
  }

  console.log(`[Alert] Sent "${subject}" to ${emails.length} subscribers`)
}
