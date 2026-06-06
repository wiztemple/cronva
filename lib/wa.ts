const GRAPH_BASE = 'https://graph.facebook.com/v19.0'

function headers() {
  return {
    Authorization: `Bearer ${process.env.META_WA_TOKEN}`,
    'Content-Type': 'application/json',
  }
}

export async function sendWhatsAppText(to: string, text: string): Promise<void> {
  const phoneId = process.env.META_WA_PHONE_ID
  if (!phoneId || !process.env.META_WA_TOKEN) {
    console.warn('[WA] Missing META_WA_TOKEN or META_WA_PHONE_ID — skipping')
    return
  }

  const phone = to.replace(/\D/g, '') // strip non-digits
  const res = await fetch(`${GRAPH_BASE}/${phoneId}/messages`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: phone,
      type: 'text',
      text: { body: text },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.error('[WA] Send error:', err)
    throw new Error('WhatsApp send failed')
  }
}

export async function sendOtp(phone: string, otp: string): Promise<void> {
  await sendWhatsAppText(
    phone,
    `Your Cronva verification code is: *${otp}*\n\nThis code expires in 10 minutes.`
  )
}

export async function sendMatchAlert(params: {
  phone: string
  teamA: string
  teamB: string
  startDatetime: Date
  competition: string
  venue?: string | null
}): Promise<void> {
  const timeWAT = new Intl.DateTimeFormat('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Africa/Lagos',
  }).format(params.startDatetime)

  const lines = [
    `⚽ *Cronva Match Alert*`,
    ``,
    `${params.teamA} vs ${params.teamB} kicks off in 2 hours.`,
    `🕐 ${timeWAT} WAT · ${params.competition}`,
  ]
  if (params.venue) lines.push(`📍 ${params.venue}`)

  await sendWhatsAppText(params.phone, lines.join('\n'))
}
