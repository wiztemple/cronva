'use client'

import { useState } from 'react'
import { IconChevronRight } from '@tabler/icons-react'
import { SubscribeButton } from './SubscribeButton'
import { PlatformBrandIcon } from './PlatformBrandIcon'

interface SubscribePanelProps {
  slug: string
  calendarName: string
  iconBg?: string
}

export function SubscribePanel({ slug, calendarName, iconBg }: SubscribePanelProps) {
  const [copied, setCopied] = useState(false)
  const icsUrl = `webcal://cronva.app/api/cal/${slug}.ics`

  const waText = encodeURIComponent(
    `Check out the ${calendarName} calendar on Cronva — every fixture auto-synced to your phone.\n\nhttps://cronva.app/cal/${slug}`
  )
  const waUrl = `https://wa.me/?text=${waText}`

  async function copyUrl() {
    await navigator.clipboard.writeText(icsUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div
      className="subscribe-panel"
      style={{
        background: '#fff',
        padding: '32px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        justifyContent: 'center',
      }}
    >
      <p className="text-section-title" style={{ marginBottom: 4 }}>
        Add to your calendar
      </p>

      <SubscribeButton platform="google" slug={slug} iconBg={iconBg} />
      <SubscribeButton platform="apple" slug={slug} iconBg={iconBg} />
      <SubscribeButton platform="outlook" slug={slug} iconBg={iconBg} />
      <SubscribeButton platform="copy" slug={slug} iconBg={iconBg} />

      <div
        style={{
          background: 'var(--color-offwhite)',
          border: '0.5px solid var(--color-border)',
          borderRadius: 8,
          padding: '9px 13px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 4,
        }}
      >
        <span
          style={{
            flex: 1,
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-fog)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {icsUrl}
        </span>
        <button
          type="button"
          onClick={copyUrl}
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--color-blue)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          border: '0.5px solid var(--color-border)',
          borderRadius: 10,
          padding: '14px 16px',
          cursor: 'pointer',
          background: '#fff',
          textDecoration: 'none',
          transition: 'background 120ms, border-color 120ms',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#EAF3DE'
          e.currentTarget.style.borderColor = '#EAF3DE'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#fff'
          e.currentTarget.style.borderColor = 'var(--color-border)'
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            background: '#EAF3DE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <PlatformBrandIcon platform="whatsapp" size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: '#27500A', marginBottom: 2 }}>
            Share on WhatsApp
          </p>
          <p style={{ fontSize: 11, color: '#3B6D11', margin: 0 }}>
            Send this calendar to friends
          </p>
        </div>
        <IconChevronRight size={16} color="var(--color-fog)" stroke={1.5} />
      </a>
    </div>
  )
}
