'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useCountdown } from '@/hooks/useCountdown'
import type { CountdownHighlight } from '@/lib/homepage-types'
import { resolveCalendarIconUrl } from '@/lib/brand-logos'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

interface CountdownCardProps {
  event: CountdownHighlight
}

export function CountdownCard({ event }: CountdownCardProps) {
  const { days, hours, minutes, seconds, isLive } = useCountdown(event.targetISO)
  const [bookmarked, setBookmarked] = useState(false)
  const logoUrl = event.logoSlug ? resolveCalendarIconUrl(event.logoSlug) : null

  return (
    <div
      style={{
        minWidth: 280,
        height: 180,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 22,
        background: event.gradient,
        flexShrink: 0,
        scrollSnapAlign: 'start',
      }}
    >
      {/* Background watermark */}
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt=""
          aria-hidden
          width={96}
          height={96}
          style={{
            position: 'absolute',
            right: 12,
            bottom: 12,
            opacity: 0.14,
            objectFit: 'contain',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
      ) : (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            right: 16,
            bottom: 16,
            fontSize: 80,
            lineHeight: 1,
            opacity: 0.12,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {event.watermarkEmoji}
        </span>
      )}

      {/* Bookmark button */}
      <button
        type="button"
        onClick={() => setBookmarked((v) => !v)}
        aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark event'}
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 4,
          lineHeight: 1,
          opacity: bookmarked ? 1 : 0.6,
          transition: 'opacity 120ms',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
        onMouseLeave={(e) => { if (!bookmarked) e.currentTarget.style.opacity = '0.6' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={bookmarked ? 'white' : 'none'} stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 3h14a1 1 0 0 1 1 1v17l-8-5-8 5V4a1 1 0 0 1 1-1z" />
        </svg>
      </button>

      {/* Top: category + title + subtitle */}
      <div style={{ paddingRight: 36 }}>
        <p
          style={{
            fontSize: 10,
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1,
          }}
        >
          {event.category}
        </p>
        <h3
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: '#fff',
            letterSpacing: '-0.5px',
            lineHeight: 1.15,
            marginTop: 5,
          }}
        >
          {event.title}
        </h3>
        {event.subtitle && (
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 3, lineHeight: 1.3 }}>
            {event.subtitle}
          </p>
        )}
      </div>

      {/* Bottom: countdown or LIVE badge */}
      {isLive ? (
        <div>
          <span
            style={{
              display: 'inline-block',
              background: 'var(--color-gold)',
              color: '#412402',
              fontSize: 11,
              fontWeight: 500,
              padding: '4px 12px',
              borderRadius: 9999,
              letterSpacing: '0.04em',
            }}
          >
            LIVE
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { value: days, label: 'DAYS' },
            { value: hours, label: 'HRS' },
            { value: minutes, label: 'MIN' },
            { value: seconds, label: 'SEC' },
          ].map(({ value, label }) => (
            <div
              key={label}
              style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: 8,
                padding: '7px 9px',
                textAlign: 'center',
                minWidth: 44,
              }}
            >
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  color: '#fff',
                  letterSpacing: '-0.5px',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {pad(value)}
              </p>
              <p
                style={{
                  fontSize: 8,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'rgba(255,255,255,0.55)',
                  marginTop: 3,
                }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
