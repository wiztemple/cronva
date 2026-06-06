'use client'

import { useState, useEffect } from 'react'

interface LiveData {
  homeGoals: number
  awayGoals: number
  minute: number
  statusDetail: string
  redCardsHome: number
  redCardsAway: number
}

interface LiveEvent {
  id: string
  title: string
  startDatetime: string
  liveData: LiveData
}

interface Props {
  calendarId: string
}

export function LiveScoreOverlay({ calendarId }: Props) {
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([])

  useEffect(() => {
    let cancelled = false
    async function poll() {
      try {
        const res = await fetch(`/api/live-scores?calendarId=${calendarId}`)
        const data = await res.json()
        if (!cancelled) setLiveEvents(data.events ?? [])
      } catch {}
    }
    poll()
    const interval = setInterval(poll, 60_000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [calendarId])

  if (liveEvents.length === 0) return null

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span className="badge-live badge-live-animated">LIVE</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-navy)' }}>
          {liveEvents.length} match{liveEvents.length !== 1 ? 'es' : ''} in progress
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {liveEvents.map((ev) => (
          <LiveScoreCard key={ev.id} event={ev} />
        ))}
      </div>
    </div>
  )
}

function LiveScoreCard({ event }: { event: LiveEvent }) {
  const { liveData: ld, title } = event
  const parts = title.split(' vs ')
  const homeTeam = parts[0]?.trim() ?? 'Home'
  const awayTeam = parts[1]?.trim() ?? 'Away'

  const minuteLabel = ld.statusDetail === 'HT'
    ? 'HT'
    : ld.statusDetail === 'FT'
    ? 'FT'
    : `${ld.minute}'`

  return (
    <div
      style={{
        background: 'var(--color-cosmos)',
        border: '1px solid var(--color-navy)',
        borderRadius: 10, padding: '14px 16px',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'center' }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-snow)' }}>{homeTeam}</p>
          {ld.redCardsHome > 0 && (
            <span style={{ fontSize: 11, color: '#EB5757' }}>🟥 ×{ld.redCardsHome}</span>
          )}
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 22, fontWeight: 500, color: '#F5C400', letterSpacing: '-0.5px' }}>
            {ld.homeGoals} – {ld.awayGoals}
          </p>
          <p style={{ fontSize: 11, color: 'var(--color-fog)', marginTop: 2 }}>{minuteLabel}</p>
        </div>

        <div>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-snow)' }}>{awayTeam}</p>
          {ld.redCardsAway > 0 && (
            <span style={{ fontSize: 11, color: '#EB5757' }}>🟥 ×{ld.redCardsAway}</span>
          )}
        </div>
      </div>
    </div>
  )
}
