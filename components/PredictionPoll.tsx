'use client'

import { useState, useEffect } from 'react'

interface Props {
  eventId: string
  homeTeam: string
  awayTeam: string
  isCompleted?: boolean
}

interface Tally { total: number; home: number; draw: number; away: number }

export function PredictionPoll({ eventId, homeTeam, awayTeam, isCompleted }: Props) {
  const [voted, setVoted] = useState<string | null>(null)
  const [tally, setTally] = useState<Tally | null>(null)
  const [loading, setLoading] = useState(false)

  // Check localStorage for prior vote
  useEffect(() => {
    const stored = localStorage.getItem(`pred:${eventId}`)
    if (stored) setVoted(stored)
  }, [eventId])

  // Fetch tally if already voted or completed
  useEffect(() => {
    if (!voted && !isCompleted) return
    fetch(`/api/predictions/${eventId}`)
      .then((r) => r.json())
      .then(setTally)
      .catch(() => {})
  }, [voted, isCompleted, eventId])

  async function handlePick(pick: string) {
    if (voted || loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, pick }),
      })
      const data = await res.json()
      if (res.ok) {
        setVoted(pick)
        localStorage.setItem(`pred:${eventId}`, pick)
        if (data.tally) setTally(data.tally)
      }
    } finally {
      setLoading(false)
    }
  }

  const PICKS = [
    { key: 'home', label: homeTeam || 'Home Win' },
    { key: 'draw', label: 'Draw' },
    { key: 'away', label: awayTeam || 'Away Win' },
  ]

  const barColor = (key: string) =>
    key === 'home' ? 'var(--color-blue)' : key === 'draw' ? 'var(--color-fog)' : 'var(--color-navy)'

  return (
    <div
      style={{
        background: '#ffffff',
        border: '0.5px solid rgba(26,63,111,0.12)',
        borderRadius: 10,
        padding: '14px 16px',
        marginTop: 12,
      }}
    >
      <p
        style={{
          fontSize: 12, fontWeight: 500, color: 'var(--color-fog)',
          letterSpacing: '0.07em', textTransform: 'uppercase',
          marginBottom: 10,
        }}
      >
        Community prediction
      </p>

      {voted || isCompleted ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {PICKS.map(({ key, label }) => {
            const pct = tally?.[key as keyof Tally] as number ?? 0
            const isMyVote = voted === key
            return (
              <div key={key}>
                <div
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 3,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12, fontWeight: isMyVote ? 500 : 400,
                      color: isMyVote ? 'var(--color-navy)' : 'var(--color-fog)',
                    }}
                  >
                    {label}{isMyVote && ' ✓'}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-navy)' }}>
                    {pct}%
                  </span>
                </div>
                <div
                  style={{
                    height: 4, background: 'var(--color-sky)', borderRadius: 2, overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%', width: `${pct}%`,
                      background: barColor(key),
                      borderRadius: 2,
                      transition: 'width 600ms ease',
                    }}
                  />
                </div>
              </div>
            )
          })}
          {tally && (
            <p style={{ fontSize: 11, color: 'var(--color-fog)', marginTop: 4 }}>
              {tally.total.toLocaleString()} prediction{tally.total !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 6 }}>
          {PICKS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handlePick(key)}
              disabled={loading}
              style={{
                flex: 1, padding: '7px 4px', borderRadius: 6,
                border: '1px solid rgba(26,63,111,0.2)',
                background: 'transparent', color: 'var(--color-navy)',
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'background 160ms',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
