'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { calendarSyncHref } from '@/lib/calendar-sync'
import { Badge } from './Badge'
import { useSyncState } from '@/hooks/useSyncState'
import { CalendarIcon } from './CalendarIcon'
import { formatSubscriberCountFull, type BadgeVariant } from '@/lib/calendars'

interface FeaturedCardProps {
  slug: string
  sport: string
  name: string
  nextEvent: string
  subscriberCount: number
  badge?: BadgeVariant
  badgeLabel?: string
  iconCategory?: string
  iconUrl?: string | null
  iconBg?: string
}

export function FeaturedCard({
  slug,
  sport,
  name,
  nextEvent,
  subscriberCount,
  badge,
  badgeLabel,
  iconCategory,
  iconUrl,
  iconBg,
}: FeaturedCardProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [synced] = useSyncState(slug)
  const syncHref = calendarSyncHref(slug)

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!session?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(syncHref)}`)
      return
    }
    router.push(syncHref)
  }

  return (
    <Link href={`/cal/${slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        className="featured-card"
        style={{
          background: '#fff',
          padding: '22px 28px',
          borderBottom: '0.5px solid var(--color-border)',
          cursor: 'pointer',
          transition: 'background 150ms ease, padding-left 150ms ease, border-left 150ms ease',
          borderLeft: '3px solid transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--color-sky)'
          e.currentTarget.style.borderLeftColor = 'var(--color-blue)'
          e.currentTarget.style.paddingLeft = '25px'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#fff'
          e.currentTarget.style.borderLeftColor = 'transparent'
          e.currentTarget.style.paddingLeft = '28px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {iconCategory && (
              <CalendarIcon
                slug={slug}
                iconCategory={iconCategory}
                iconUrl={iconUrl}
                iconBg={iconBg}
                size={36}
              />
            )}
            <span className="text-badge" style={{ color: 'var(--color-fog)' }}>{sport}</span>
          </div>
          {badge && <Badge variant={badge} label={badgeLabel} />}
        </div>

        <h3
          className="featured-card-name"
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: 'var(--color-navy)',
            letterSpacing: '-0.2px',
            marginBottom: 4,
          }}
        >
          {name}
        </h3>

        <p
          style={{
            fontSize: 13,
            color: 'var(--color-fog)',
            lineHeight: 1.5,
            marginBottom: 14,
          }}
        >
          {nextEvent}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#ccc' }}>
            {formatSubscriberCountFull(subscriberCount)}
          </span>
          <button
            type="button"
            onClick={handleAdd}
            style={{
              fontSize: 12,
              fontWeight: 500,
              border: '0.5px solid var(--color-navy)',
              color: synced ? '#fff' : 'var(--color-navy)',
              background: synced ? 'var(--color-navy)' : 'transparent',
              padding: '6px 14px',
              borderRadius: 9999,
              cursor: 'pointer',
              transition: 'background 120ms, color 120ms',
            }}
          >
            {synced ? '✓ Synced' : 'Sync'}
          </button>
        </div>
      </div>

      <style>{`
        .featured-card:last-child { border-bottom: none; }
        @media (max-width: 767px) {
          .featured-card { padding: 16px 18px !important; }
          .featured-card-name { font-size: 15px !important; }
        }
      `}</style>
    </Link>
  )
}
