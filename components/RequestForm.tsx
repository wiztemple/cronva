'use client'

import { useState } from 'react'

const CATEGORIES = ['football', 'basketball', 'f1', 'entertainment', 'tv', 'boxing', 'local', 'other']

export function RequestForm() {
  const [form, setForm] = useState({ email: '', calendarName: '', description: '', category: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!form.calendarName.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setSuccess(true)
      setForm({ email: '', calendarName: '', description: '', category: '' })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div
        style={{
          background: '#ffffff',
          border: '0.5px solid rgba(26,63,111,0.15)',
          borderRadius: 12,
          padding: '28px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
        <h3
          style={{
            fontWeight: 500,
            fontSize: '16px',
            color: 'var(--color-navy)',
            marginBottom: 8,
          }}
        >
          Request received
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--color-fog)' }}>
          We'll review it soon. Others can upvote your request to help it move up the list.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="btn-subscribe"
          style={{ marginTop: 20 }}
        >
          Submit another
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        background: '#ffffff',
        border: '0.5px solid rgba(26,63,111,0.15)',
        borderRadius: 12,
        padding: '28px 24px',
      }}
    >
      <h2
        style={{
          fontWeight: 500,
          fontSize: '16px',
          color: 'var(--color-navy)',
          marginBottom: 20,
        }}
      >
        Submit a request
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label className="text-label" style={{ display: 'block', marginBottom: 6 }}>
            Calendar / league name *
          </label>
          <input
            type="text"
            className="search-input"
            placeholder="e.g. NPFL Women's League"
            value={form.calendarName}
            onChange={(e) => setForm({ ...form, calendarName: e.target.value })}
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label className="text-label" style={{ display: 'block', marginBottom: 6 }}>
            Category
          </label>
          <select
            className="search-input"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={{ width: '100%' }}
          >
            <option value="">Select a category…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-label" style={{ display: 'block', marginBottom: 6 }}>
            Description (optional)
          </label>
          <textarea
            className="search-input"
            placeholder="Any details that help us find it…"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            style={{ width: '100%', resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>

        <div>
          <label className="text-label" style={{ display: 'block', marginBottom: 6 }}>
            Your email (optional — we'll notify you when it's added)
          </label>
          <input
            type="email"
            className="search-input"
            placeholder="you@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ width: '100%' }}
          />
        </div>

        {error && (
          <p style={{ fontSize: '13px', color: '#EB5757' }}>{error}</p>
        )}

        <button
          type="submit"
          className="btn-primary"
          disabled={loading || !form.calendarName.trim()}
          style={{ marginTop: 4, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Submitting…' : 'Submit request'}
        </button>
      </form>
    </div>
  )
}
