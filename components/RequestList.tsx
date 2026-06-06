'use client'

import { useState } from 'react'

interface RequestItem {
  id: string
  calendarName: string
  category: string | null
  votes: number
}

interface Props {
  initialRequests: RequestItem[]
}

export function RequestList({ initialRequests }: Props) {
  const [requests, setRequests] = useState(initialRequests)
  const [voted, setVoted] = useState<Set<string>>(new Set())

  async function handleVote(id: string) {
    if (voted.has(id)) return
    const res = await fetch(`/api/requests/${id}/vote`, { method: 'POST' })
    if (res.ok) {
      const data = await res.json()
      setRequests((prev) =>
        prev
          .map((r) => (r.id === id ? { ...r, votes: data.votes } : r))
          .sort((a, b) => b.votes - a.votes)
      )
      setVoted((prev) => new Set([...prev, id]))
    }
  }

  if (requests.length === 0) {
    return (
      <p style={{ fontSize: '14px', color: 'var(--color-fog)', padding: '24px 0' }}>
        No requests yet — be the first!
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {requests.map((r) => (
        <div
          key={r.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            background: '#ffffff',
            border: '0.5px solid rgba(26,63,111,0.12)',
            borderRadius: 8,
          }}
        >
          {/* Upvote */}
          <button
            onClick={() => handleVote(r.id)}
            disabled={voted.has(r.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              minWidth: 36,
              padding: '6px 8px',
              borderRadius: 6,
              border: voted.has(r.id)
                ? '1px solid var(--color-blue)'
                : '1px solid rgba(26,63,111,0.2)',
              background: voted.has(r.id) ? 'var(--color-sky)' : 'transparent',
              color: voted.has(r.id) ? 'var(--color-blue)' : 'var(--color-fog)',
              cursor: voted.has(r.id) ? 'default' : 'pointer',
              transition: 'all 160ms',
            }}
          >
            <span style={{ fontSize: 10, lineHeight: 1 }}>▲</span>
            <span style={{ fontSize: '12px', fontWeight: 500 }}>{r.votes}</span>
          </button>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--color-navy)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {r.calendarName}
            </p>
            {r.category && (
              <span className="badge-category" style={{ marginTop: 4 }}>
                {r.category}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
