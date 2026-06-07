'use client'

import { useState } from 'react'
import { PlatformBrandIcon } from './PlatformBrandIcon'

interface Props {
  slug: string
  baseUrl: string
  selectedExternalIds?: string[]
  disabled?: boolean
}

function buildIcsPath(slug: string, selectedExternalIds?: string[]): string {
  const base = `/api/cal/${slug}.ics`
  if (!selectedExternalIds?.length) return base
  return `${base}?e=${selectedExternalIds.map(encodeURIComponent).join(',')}`
}

export function SubscribeButtons({ slug, baseUrl, selectedExternalIds, disabled }: Props) {
  const [copied, setCopied] = useState(false)

  const icsPath = buildIcsPath(slug, selectedExternalIds)
  const httpsBase = baseUrl.replace(/^http:\/\//, 'https://')
  const webcalUrl = `webcal://${httpsBase.replace(/^https?:\/\//, '')}${icsPath}`
  const httpsIcsUrl = `${httpsBase}${icsPath}`
  const encodedWebcal = encodeURIComponent(webcalUrl)

  const googleUrl = `https://calendar.google.com/calendar/r?cid=${encodedWebcal}`
  const appleUrl = webcalUrl
  const outlookUrl = `https://outlook.live.com/calendar/0/addfromweb?url=${encodedWebcal}`

  const btnStyle = disabled ? { opacity: 0.45, pointerEvents: 'none' as const } : undefined

  async function handleCopy() {
    if (disabled) return
    try {
      await navigator.clipboard.writeText(webcalUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {}
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <a
        href={googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-subscribe"
        style={{ justifyContent: 'flex-start', ...btnStyle }}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      >
        <GoogleCalIcon />
        Add to Google Calendar
      </a>

      <a
        href={appleUrl}
        className="btn-subscribe"
        style={{ justifyContent: 'flex-start', ...btnStyle }}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      >
        <PlatformBrandIcon platform="apple" size={18} />
        Add to Apple Calendar
      </a>

      <a
        href={outlookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-subscribe"
        style={{ justifyContent: 'flex-start', ...btnStyle }}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      >
        <PlatformBrandIcon platform="outlook" size={18} />
        Add to Outlook
      </a>

      <a
        href={httpsIcsUrl}
        download={`${slug}.ics`}
        className="btn-subscribe"
        style={{ justifyContent: 'flex-start', ...btnStyle }}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      >
        <DownloadIcon />
        Download .ics file
      </a>

      <button
        onClick={handleCopy}
        disabled={disabled}
        className="btn-subscribe"
        style={{
          justifyContent: 'flex-start',
          border: copied
            ? '1px solid rgba(26,63,111,0.25)'
            : '1px solid var(--color-blue)',
          color: copied ? 'var(--color-fog)' : 'var(--color-blue)',
          opacity: disabled ? 0.45 : 1,
        }}
      >
        <LinkIcon />
        {copied ? 'Link copied!' : 'Copy calendar link'}
      </button>
    </div>
  )
}

function GoogleCalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="#4A9FE8" strokeWidth="1.5" />
      <path d="M8 2v4M16 2v4M3 10h18" stroke="#4A9FE8" strokeWidth="1.5" />
      <path d="M8 14l2 2 4-4" stroke="#4A9FE8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 3v12M7 10l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
