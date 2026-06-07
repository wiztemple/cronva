import Link from 'next/link'
import { CronvaMark } from './CronvaMark'

interface EmptyStateProps {
  heading?: string
  body?: string
  ctaLabel?: string
  ctaHref?: string
}

export function EmptyState({
  heading = 'No calendars yet',
  body = "Browse 47 free calendars and tap add — they'll appear here.",
  ctaLabel = 'Browse calendars',
  ctaHref = '/',
}: EmptyStateProps) {
  return (
    <div
      style={{
        maxWidth: 280,
        margin: '80px auto',
        textAlign: 'center',
      }}
    >
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: 'var(--color-navy)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CronvaMark variant="dark" size={28} />
        </div>
      </div>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 500,
          color: 'var(--color-navy)',
          marginBottom: 8,
        }}
      >
        {heading}
      </h2>
      <p
        style={{
          fontSize: 13,
          color: 'var(--color-fog)',
          lineHeight: 1.65,
          marginBottom: 24,
        }}
      >
        {body}
      </p>
      <Link
        href={ctaHref}
        style={{
          display: 'inline-block',
          fontSize: 13,
          fontWeight: 500,
          color: '#fff',
          background: 'var(--color-blue)',
          padding: '10px 20px',
          borderRadius: 6,
          textDecoration: 'none',
        }}
      >
        {ctaLabel}
      </Link>
    </div>
  )
}
