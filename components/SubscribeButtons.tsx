'use client'

import { useState } from 'react'

interface Props {
  slug: string
  baseUrl: string
}

export function SubscribeButtons({ slug, baseUrl }: Props) {
  const [copied, setCopied] = useState(false)

  const icsPath = `/api/cal/${slug}.ics`
  const webcalUrl = `webcal://${baseUrl.replace(/^https?:\/\//, '')}${icsPath}`
  const encodedWebcal = encodeURIComponent(webcalUrl)

  const googleUrl = `https://calendar.google.com/calendar/r?cid=${encodedWebcal}`
  const appleUrl = webcalUrl
  const outlookUrl = `https://outlook.live.com/calendar/0/addfromweb?url=${encodedWebcal}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(webcalUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback: select text from a temp input
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <a
        href={googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-subscribe"
        style={{ justifyContent: 'flex-start' }}
      >
        <GoogleCalIcon />
        Add to Google Calendar
      </a>

      <a
        href={appleUrl}
        className="btn-subscribe"
        style={{ justifyContent: 'flex-start' }}
      >
        <AppleCalIcon />
        Add to Apple Calendar
      </a>

      <a
        href={outlookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-subscribe"
        style={{ justifyContent: 'flex-start' }}
      >
        <OutlookIcon />
        Add to Outlook
      </a>

      <button
        onClick={handleCopy}
        className="btn-subscribe"
        style={{
          justifyContent: 'flex-start',
          border: copied
            ? '1px solid rgba(26,63,111,0.25)'
            : '1px solid var(--color-blue)',
          color: copied ? 'var(--color-fog)' : 'var(--color-blue)',
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

function AppleCalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="17" rx="2" stroke="#4A9FE8" strokeWidth="1.5" />
      <path d="M8 2v4M16 2v4M3 10h18" stroke="#4A9FE8" strokeWidth="1.5" />
      <circle cx="12" cy="16" r="2" fill="#4A9FE8" />
    </svg>
  )
}

function OutlookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="#4A9FE8" strokeWidth="1.5" />
      <path d="M2 9h20" stroke="#4A9FE8" strokeWidth="1.5" />
      <rect x="5" y="12" width="6" height="5" rx="1" fill="#4A9FE8" opacity="0.6" />
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
