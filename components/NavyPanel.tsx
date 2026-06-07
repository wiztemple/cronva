'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

interface Stat {
  value: string
  label: string
}

interface NavyPanelProps {
  variant?: 'home' | 'detail' | 'trending'
  eyebrow?: ReactNode
  title: ReactNode
  subtitle?: string
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  stats?: Stat[]
  backHref?: string
  backLabel?: string
}

export function NavyPanel({
  variant = 'home',
  eyebrow,
  title,
  subtitle,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  stats,
  backHref,
  backLabel,
}: NavyPanelProps) {
  return (
    <div
      className="navy-panel"
      style={{
        background: 'linear-gradient(145deg, #1A3F6F 0%, #0D1B2E 55%, #122a4a 100%)',
        padding: '48px 36px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: variant === 'home' ? 380 : undefined,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="hero-orb hero-orb-1" aria-hidden />
      <div className="hero-orb hero-orb-2" aria-hidden />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {backHref && (
          <Link
            href={backHref}
            style={{
              display: 'inline-block',
              fontSize: 12,
              color: 'rgba(255,255,255,0.4)',
              textDecoration: 'none',
              marginBottom: 20,
              transition: 'color 120ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
          >
            {backLabel ?? '← All calendars'}
          </Link>
        )}

        {eyebrow && (
          <p
            style={{
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.09em',
              textTransform: 'uppercase',
              color: 'var(--color-blue)',
              marginBottom: 16,
            }}
          >
            {eyebrow}
          </p>
        )}

        <h1
          className="text-display-hero"
          style={{ color: '#fff', marginBottom: 16 }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.46)',
              lineHeight: 1.75,
              maxWidth: variant === 'detail' ? 300 : 290,
              marginBottom: searchPlaceholder ? 24 : 0,
            }}
          >
            {subtitle}
          </p>
        )}

        {searchPlaceholder && onSearchChange && (
          <div
            className="hero-search"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              background: 'rgba(255,255,255,0.10)',
              border: '0.5px solid rgba(255,255,255,0.18)',
              borderRadius: 10,
              padding: '11px 16px',
              maxWidth: 340,
              marginTop: 24,
              transition: 'border-color 150ms ease, box-shadow 150ms ease, background 150ms ease',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="7" stroke="rgba(255,255,255,0.36)" strokeWidth="1.5" />
              <path d="M20 20L16.5 16.5" stroke="rgba(255,255,255,0.36)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: 14,
                color: '#fff',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => {
                const el = e.currentTarget.parentElement!
                el.style.borderColor = 'rgba(74, 159, 232, 0.6)'
                el.style.boxShadow = '0 0 0 3px rgba(74, 159, 232, 0.15)'
                el.style.background = 'rgba(255,255,255,0.14)'
              }}
              onBlur={(e) => {
                const el = e.currentTarget.parentElement!
                el.style.borderColor = 'rgba(255,255,255,0.18)'
                el.style.boxShadow = 'none'
                el.style.background = 'rgba(255,255,255,0.10)'
              }}
            />
            <style>{`
              .navy-panel input::placeholder { color: rgba(255,255,255,0.26); }
            `}</style>
          </div>
        )}
      </div>

      {stats && stats.length > 0 && (
        <div
          style={{
            borderTop: '0.5px solid rgba(255,255,255,0.12)',
            paddingTop: 20,
            marginTop: 32,
            display: 'flex',
            gap: 28,
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {stats.map((stat, i) => (
            <div key={stat.label}>
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: i === 0 ? 'var(--color-gold)' : '#fff',
                  letterSpacing: '-0.5px',
                  marginBottom: 4,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {stat.value}
              </p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 767px) {
          .navy-panel { padding: 28px 20px !important; }
        }
      `}</style>
    </div>
  )
}
