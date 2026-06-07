'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { calendarSyncHref } from '@/lib/calendar-sync'
import { Badge } from './Badge'
import { useSyncState } from '@/hooks/useSyncState'
import { CalendarIcon } from './CalendarIcon'
import { formatSubscriberCount, type BadgeVariant } from '@/lib/calendars'

interface CalendarCardProps {
  slug: string
  name: string
  sport: string
  category: string
  nextEvent: string
  nextDate?: string
  subscriberCount: number
  iconBg: string
  iconCategory: string
  iconUrl?: string | null
  badge?: BadgeVariant
  rank?: number
  growthBadge?: string
  subscribed?: boolean
  onUnsubscribe?: () => void
  faded?: boolean
}

export function CalendarCard({
  slug,
  name,
  sport,
  category,
  nextEvent,
  nextDate,
  subscriberCount,
  iconBg,
  iconCategory,
  iconUrl,
  badge,
  rank,
  growthBadge,
  subscribed = false,
  onUnsubscribe,
  faded = false,
}: CalendarCardProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [synced] = useSyncState(slug)
  const isSubscribed = subscribed || synced
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

  const nextEventText = nextDate ? `${nextEvent}${nextDate ? ` · ${nextDate}` : ''}` : nextEvent

  return (
    <div
      className={`calendar-card-fade${faded ? ' hidden-card' : ''}`}
      style={{ display: 'flex', width: '100%' }}
    >
      {rank !== undefined && (
        <div
          style={{
            width: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 30,
            fontWeight: 400,
            color: '#ECEAE4',
            letterSpacing: '-1px',
            flexShrink: 0,
            background: '#fff',
            borderBottom: '0.5px solid var(--color-border)',
            borderRight: '0.5px solid var(--color-border)',
          }}
        >
          {rank}
        </div>
      )}

      <Link href={`/cal/${slug}`} style={{ textDecoration: 'none', flex: 1, display: 'block' }}>
        <div
          className="calendar-card-inner"
          style={{
            background: '#fff',
            borderRight: '0.5px solid var(--color-border)',
            borderBottom: '0.5px solid var(--color-border)',
            padding: '20px 18px 16px',
            cursor: 'pointer',
            transition: 'background 150ms ease, box-shadow 150ms ease',
            height: '100%',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-sky)'
            e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(74, 159, 232, 0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fff'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <CalendarIcon
              slug={slug}
              iconCategory={iconCategory}
              iconUrl={iconUrl}
              iconBg={iconBg}
              size={40}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              {badge && <Badge variant={badge} />}
              {growthBadge && (
                <span
                  className="text-badge"
                  style={{
                    background: '#EAF3DE',
                    color: '#27500A',
                    padding: '3px 9px',
                    borderRadius: 9999,
                  }}
                >
                  {growthBadge}
                </span>
              )}
            </div>
          </div>

          <p
            className="text-badge"
            style={{ color: 'var(--color-fog)', marginBottom: 5 }}
          >
            {category}
          </p>

          <h3
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: 'var(--color-navy)',
              letterSpacing: '-0.1px',
              marginBottom: 3,
              lineHeight: 1.3,
            }}
          >
            {name}
          </h3>

          <p
            style={{
              fontSize: 12,
              color: 'var(--color-fog)',
              lineHeight: 1.45,
              marginBottom: 13,
            }}
          >
            {nextEventText}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#ccc' }}>
              {formatSubscriberCount(subscriberCount)} synced
            </span>
            <button
              type="button"
              onClick={handleAdd}
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: isSubscribed ? '#fff' : 'var(--color-blue)',
                border: `0.5px solid ${isSubscribed ? 'var(--color-navy)' : 'var(--color-blue)'}`,
                background: isSubscribed ? 'var(--color-navy)' : 'transparent',
                padding: '4px 11px',
                borderRadius: 9999,
                cursor: 'pointer',
                transition: 'background 120ms, color 120ms',
              }}
            >
              {isSubscribed ? 'Subscribed ✓' : '+ Sync'}
            </button>
          </div>

          {subscribed && onUnsubscribe && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onUnsubscribe()
              }}
              style={{
                marginTop: 8,
                fontSize: 11,
                color: 'var(--color-fog)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
              }}
            >
              Unsubscribe
            </button>
          )}
        </div>
      </Link>
    </div>
  )
}
