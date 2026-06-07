'use client'

import { useState } from 'react'
import { IconChevronRight } from '@tabler/icons-react'
import { PLATFORM_BRAND_LOGOS } from '@/lib/brand-logos'
import { PlatformBrandIcon } from './PlatformBrandIcon'
import type { Platform } from './icons/PlatformIcon'

interface SubscribeButtonProps {
  platform: Platform
  slug: string
  iconBg?: string
}

const PLATFORMS: Record<Platform, { name: string; description: string }> = {
  google: { name: 'Google Calendar', description: 'Opens in browser — one tap subscribe' },
  apple: { name: 'Apple Calendar', description: 'Opens Calendar app on iPhone or Mac' },
  outlook: { name: 'Outlook', description: 'Works with Outlook.com and Office 365' },
  copy: { name: 'Copy calendar URL', description: 'Paste into any calendar app' },
  whatsapp: { name: 'Share on WhatsApp', description: 'Send this calendar to friends' },
}

function getSubscribeUrl(platform: Platform, slug: string): string | null {
  const icsUrl = `webcal://cronva.app/api/cal/${slug}.ics`
  const encoded = encodeURIComponent(icsUrl)
  switch (platform) {
    case 'google':
      return `https://calendar.google.com/calendar/r?cid=${encoded}`
    case 'apple':
      return icsUrl
    case 'outlook':
      return `https://outlook.live.com/calendar/0/addfromweb?url=${encoded}`
    case 'copy':
    case 'whatsapp':
      return null
  }
}

export function SubscribeButton({ platform, slug, iconBg = '#E6F1FB' }: SubscribeButtonProps) {
  const [copied, setCopied] = useState(false)
  const info = PLATFORMS[platform]
  const icsUrl = `webcal://cronva.app/api/cal/${slug}.ics`

  async function handleClick() {
    if (platform === 'copy') {
      await navigator.clipboard.writeText(icsUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
      return
    }
    const url = getSubscribeUrl(platform, slug)
    if (url) window.open(url, '_blank')
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        border: '0.5px solid var(--color-border)',
        borderRadius: 10,
        padding: '14px 16px',
        cursor: 'pointer',
        background: '#fff',
        textAlign: 'left',
        transition: 'border-color 120ms',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-navy)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          background: PLATFORM_BRAND_LOGOS[platform] ? '#fff' : iconBg,
          border: PLATFORM_BRAND_LOGOS[platform] ? '0.5px solid var(--color-border)' : undefined,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          padding: PLATFORM_BRAND_LOGOS[platform] ? 6 : 0,
        }}
      >
        <PlatformBrandIcon platform={platform} size={18} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-navy)', marginBottom: 2 }}>
          {platform === 'copy' && copied ? 'Copied!' : info.name}
        </p>
        <p style={{ fontSize: 11, color: 'var(--color-fog)', margin: 0 }}>{info.description}</p>
      </div>
      <IconChevronRight size={16} color="var(--color-fog)" stroke={1.5} />
    </button>
  )
}
