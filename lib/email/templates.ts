const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://cronva.app'

export function emailWrapper(content: string, unsubscribeUrl?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Cronva</title>
</head>
<body style="margin:0;padding:0;background:#F1EFE8;font-family:ui-sans-serif,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1EFE8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;border:0.5px solid rgba(26,63,111,0.12);">

          <!-- Header -->
          <tr>
            <td style="background:#1A3F6F;padding:20px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:18px;font-weight:500;color:#F7F8F8;letter-spacing:-0.2px;">Cronva</span>
                    <span style="font-size:12px;color:rgba(247,248,248,0.5);margin-left:8px;">Time, delivered.</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 28px 24px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 28px;border-top:1px solid rgba(26,63,111,0.08);">
              <p style="margin:0;font-size:12px;color:#8A8F98;">
                You received this because you subscribed on
                <a href="${BASE_URL}" style="color:#4A9FE8;text-decoration:none;">cronva.app</a>.
                ${unsubscribeUrl ? `<a href="${unsubscribeUrl}" style="color:#8A8F98;margin-left:8px;">Unsubscribe</a>` : ''}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

interface EventRow {
  title: string
  startDatetime: Date
  location?: string | null
}

interface CalendarGroup {
  calendarName: string
  calendarSlug: string
  events: EventRow[]
}

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Africa/Lagos',
  }).format(d)
}

export function weeklyDigestHtml(groups: CalendarGroup[]): string {
  const rows = groups
    .map(
      (g) => `
    <div style="margin-bottom:24px;">
      <h3 style="margin:0 0 12px;font-size:14px;font-weight:500;color:#1A3F6F;">
        <a href="${BASE_URL}/cal/${g.calendarSlug}" style="color:#1A3F6F;text-decoration:none;">${g.calendarName}</a>
      </h3>
      ${g.events
        .map(
          (ev) => `
      <div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid rgba(26,63,111,0.06);">
        <div style="min-width:4px;border-radius:2px;background:#F5C400;"></div>
        <div>
          <p style="margin:0 0 3px;font-size:14px;font-weight:500;color:#1A3F6F;">${ev.title}</p>
          <p style="margin:0;font-size:12px;color:#8A8F98;">${formatDate(ev.startDatetime)}${ev.location ? ` · ${ev.location}` : ''}</p>
        </div>
      </div>`
        )
        .join('')}
    </div>`
    )
    .join('')

  const body = `
    <h2 style="margin:0 0 6px;font-size:20px;font-weight:500;color:#1A3F6F;letter-spacing:-0.2px;">
      Your fixtures this week
    </h2>
    <p style="margin:0 0 24px;font-size:14px;color:#8A8F98;">
      ${new Intl.DateTimeFormat('en-NG', { month: 'long', day: 'numeric' }).format(new Date())} — next 7 days
    </p>
    ${rows}
    <div style="margin-top:24px;">
      <a href="${BASE_URL}/dashboard" style="display:inline-block;background:#4A9FE8;color:#F7F8F8;padding:10px 22px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:500;">
        View my calendars
      </a>
    </div>`

  return emailWrapper(body)
}

export function fixtureChangeHtml(params: {
  matchTitle: string
  calendarName: string
  calendarSlug: string
  oldDatetime: Date
  newDatetime: Date | null
  status: string
}): string {
  const { matchTitle, calendarName, calendarSlug, oldDatetime, newDatetime, status } = params

  const statusText =
    status === 'cancelled'
      ? '⛔ This match has been cancelled.'
      : `📅 Rescheduled to <strong style="color:#1A3F6F;">${newDatetime ? formatDate(newDatetime) : 'TBD'}</strong>`

  const body = `
    <h2 style="margin:0 0 6px;font-size:20px;font-weight:500;color:#1A3F6F;letter-spacing:-0.2px;">
      Schedule change
    </h2>
    <p style="margin:0 0 20px;font-size:14px;color:#8A8F98;">
      <a href="${BASE_URL}/cal/${calendarSlug}" style="color:#4A9FE8;text-decoration:none;">${calendarName}</a>
    </p>

    <div style="background:#F1EFE8;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
      <p style="margin:0 0 8px;font-size:16px;font-weight:500;color:#1A3F6F;">${matchTitle}</p>
      <p style="margin:0 0 4px;font-size:13px;color:#8A8F98;text-decoration:line-through;">
        Was: ${formatDate(oldDatetime)}
      </p>
      <p style="margin:0;font-size:14px;color:#1A3F6F;">${statusText}</p>
    </div>

    <a href="${BASE_URL}/cal/${calendarSlug}" style="display:inline-block;background:#4A9FE8;color:#F7F8F8;padding:10px 22px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:500;">
      View calendar
    </a>`

  return emailWrapper(body)
}
