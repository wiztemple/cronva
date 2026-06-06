import { prisma } from '@/lib/db/client'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('en-NG', {
    weekday: 'short', month: 'short', day: 'numeric',
    timeZone: 'Africa/Lagos',
  }).format(d)
}
function formatTime(d: Date) {
  return new Intl.DateTimeFormat('en-NG', {
    hour: '2-digit', minute: '2-digit', hour12: true,
    timeZone: 'Africa/Lagos',
  }).format(d)
}

export default async function EmbedPage({ params }: Props) {
  const { slug } = await params
  const headersList = await headers()
  const origin = headersList.get('origin') ?? ''
  const referer = headersList.get('referer') ?? ''

  const domain = (() => {
    try { return new URL(origin || referer).hostname } catch { return '' }
  })()

  const calendar = await prisma.calendar.findUnique({
    where: { slug, isActive: true },
  })
  if (!calendar) notFound()

  const now = new Date()
  const events = await prisma.event.findMany({
    where: { calendarId: calendar.id, status: { not: 'cancelled' }, startDatetime: { gt: now } },
    orderBy: { startDatetime: 'asc' },
    take: 5,
  })

  if (domain && !['localhost', ''].includes(domain)) {
    await prisma.partner.upsert({
      where: { domain_calendarId: { domain, calendarId: calendar.id } },
      update: { embedCount: { increment: 1 } },
      create: { domain, calendarId: calendar.id, embedCount: 1 },
    }).catch(() => {})
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://cronva.app'

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: ui-sans-serif, system-ui, sans-serif;
            background: #ffffff;
            padding: 16px;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(26,63,111,0.1);
          }
          .cal-name {
            font-size: 14px;
            font-weight: 500;
            color: #1A3F6F;
          }
          .row {
            display: grid;
            grid-template-columns: 72px 56px 1fr;
            gap: 10px;
            padding: 10px 0;
            border-bottom: 1px solid rgba(26,63,111,0.06);
            align-items: start;
          }
          .row:last-child { border-bottom: none; }
          .date { font-size: 11px; font-weight: 500; color: #1A3F6F; }
          .time { font-size: 11px; color: #8A8F98; }
          .title { font-size: 13px; font-weight: 500; color: #1A3F6F; }
          .venue { font-size: 11px; color: #8A8F98; margin-top: 2px; }
          .footer {
            margin-top: 12px;
            padding-top: 10px;
            border-top: 1px solid rgba(26,63,111,0.08);
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .cronva-link {
            font-size: 11px;
            color: #8A8F98;
            text-decoration: none;
          }
          .cta {
            font-size: 12px;
            font-weight: 500;
            color: #4A9FE8;
            text-decoration: none;
            border: 1px solid #4A9FE8;
            padding: 4px 12px;
            border-radius: 9999px;
          }
          .empty { font-size: 13px; color: #8A8F98; padding: 20px 0; text-align: center; }
        `}</style>
      </head>
      <body>
        <div className="header">
          <span className="cal-name">{calendar.name}</span>
          <span style={{ fontSize: 10, color: '#8A8F98', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Upcoming
          </span>
        </div>

        {events.length === 0 ? (
          <p className="empty">No upcoming events</p>
        ) : (
          events.map((ev) => (
            <div key={ev.id} className="row">
              <span className="date">{formatDate(ev.startDatetime)}</span>
              <span className="time">{formatTime(ev.startDatetime)}</span>
              <div>
                <div className="title">{ev.title}</div>
                {ev.location && <div className="venue">{ev.location}</div>}
              </div>
            </div>
          ))
        )}

        <div className="footer">
          <a href={baseUrl} target="_blank" rel="noopener" className="cronva-link">
            Powered by Cronva
          </a>
          <a
            href={`${baseUrl}/cal/${calendar.slug}`}
            target="_blank"
            rel="noopener"
            className="cta"
          >
            Subscribe free →
          </a>
        </div>
      </body>
    </html>
  )
}
