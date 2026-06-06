'use client'

import Link from 'next/link'

interface Props {
  country: string
  flag: string
  name: string
}

export function CountryEditionBanner({ country, flag, name }: Props) {
  async function handleSwitch() {
    await fetch('/api/country', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: 'ng' }),
    })
    window.location.href = '/'
  }

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, padding: '10px 16px',
        background: 'var(--color-sky)',
        borderRadius: 8, marginTop: 16, marginBottom: 8,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 16 }}>{flag}</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-navy)' }}>
          {name} Edition
        </span>
        <span style={{ fontSize: 12, color: 'var(--color-fog)' }}>
          — Showing {name}-specific calendars first
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link
          href="/gh"
          style={{ fontSize: 12, color: country === 'gh' ? 'var(--color-blue)' : 'var(--color-fog)', textDecoration: 'none', fontWeight: country === 'gh' ? 500 : 400 }}
        >
          🇬🇭 Ghana
        </Link>
        <Link
          href="/ke"
          style={{ fontSize: 12, color: country === 'ke' ? 'var(--color-blue)' : 'var(--color-fog)', textDecoration: 'none', fontWeight: country === 'ke' ? 500 : 400 }}
        >
          🇰🇪 Kenya
        </Link>
        <button
          onClick={handleSwitch}
          style={{
            fontSize: 12, color: 'var(--color-fog)', background: 'none',
            border: 'none', cursor: 'pointer', textDecoration: 'underline',
          }}
        >
          Switch to Nigeria
        </button>
      </div>
    </div>
  )
}
