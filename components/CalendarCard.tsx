import Link from 'next/link'

interface CalendarCardProps {
  slug: string
  name: string
  category: string
  subscriberCount: number
  nextEventTitle?: string | null
  nextEventDate?: Date | null
  secondEventDate?: Date | null
}

const CATEGORY_LABELS: Record<string, string> = {
  football: 'Football',
  basketball: 'Basketball',
  f1: 'F1',
  entertainment: 'Entertainment',
  tv: 'Movies & TV',
  boxing: 'Boxing',
  local: 'Local',
}

const CATEGORY_ICONS: Record<string, string> = {
  football: '⚽',
  basketball: '🏀',
  f1: '🏎',
  entertainment: '🎭',
  tv: '🎬',
  boxing: '🥊',
  local: '📍',
}

function formatEventDate(date: Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    month: 'short',
    day: 'numeric',
    timeZone: 'Africa/Lagos',
  }).format(date)
}

function formatSubscriberCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export function CalendarCard({
  slug,
  name,
  category,
  subscriberCount,
  nextEventTitle,
  nextEventDate,
  secondEventDate,
}: CalendarCardProps) {
  const icon = CATEGORY_ICONS[category] ?? '📅'
  const label = CATEGORY_LABELS[category] ?? category

  return (
    <Link href={`/cal/${slug}`} style={{ textDecoration: 'none' }}>
      <div className="cal-card h-full">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div
            style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--color-sky)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, flexShrink: 0,
            }}
          >
            {icon}
          </div>
          <span className="badge-category">{label}</span>
        </div>

        <h3
          style={{
            fontWeight: 500, fontSize: '15px', color: 'var(--color-navy)',
            marginBottom: 4, letterSpacing: '-0.1px', lineHeight: 1.3,
          }}
        >
          {name}
        </h3>

        {nextEventTitle && nextEventDate ? (
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(26,63,111,0.08)' }}>
            <p
              className="text-label"
              style={{ marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {nextEventTitle}
            </p>
            {/* Date pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: '11px', fontWeight: 500, color: 'var(--color-blue)',
                  background: 'var(--color-sky)', borderRadius: 9999,
                  padding: '2px 8px',
                }}
              >
                <span className="status-dot status-dot-upcoming" />
                {formatEventDate(nextEventDate)}
              </span>
              {secondEventDate && (
                <span
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontSize: '11px', fontWeight: 500, color: 'var(--color-fog)',
                    background: 'rgba(26,63,111,0.05)', borderRadius: 9999,
                    padding: '2px 8px',
                  }}
                >
                  {formatEventDate(secondEventDate)}
                </span>
              )}
            </div>
          </div>
        ) : (
          <p className="text-label" style={{ marginTop: 8, fontSize: '12px' }}>
            No upcoming events
          </p>
        )}

        <p className="text-label" style={{ marginTop: 8, fontSize: '12px' }}>
          {formatSubscriberCount(subscriberCount)} subscribers
        </p>
      </div>
    </Link>
  )
}
