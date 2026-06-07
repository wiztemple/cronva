'use client'

import { CalendarIcon } from './CalendarIcon'
import { TeamLogo } from './TeamLogo'
import { hasCalendarBrandLogo } from '@/lib/brand-logos'
import type { HotCardData } from '@/lib/homepage-types'
import { useSyncState } from '@/hooks/useSyncState'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'

export type { HotCardData, HotCardEvent } from '@/lib/homepage-types'

interface HotCardProps extends HotCardData {
  onSync?: () => void
}

export function HotCard({
  slug,
  name,
  sport,
  iconEmoji,
  iconBg,
  iconCategory = 'football',
  upcomingEvents,
  onSync,
}: HotCardProps) {
  const useBrandLogo = hasCalendarBrandLogo(slug)
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [synced, sync] = useSyncState(slug)

  function handleSync(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (synced) return
    if (!session?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname || '/')}`)
      return
    }
    sync()
    onSync?.()
  }

  return (
    <div
      style={{
        minWidth: 230,
        background: '#fff',
        border: '0.5px solid var(--color-border)',
        borderRadius: 14,
        padding: 18,
        flexShrink: 0,
        scrollSnapAlign: 'start',
      }}
    >
      {/* Top row: icon + name/sport + sync button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {useBrandLogo ? (
          <CalendarIcon
            slug={slug}
            iconCategory={iconCategory}
            iconBg={iconBg}
            size={40}
          />
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            {iconEmoji}
          </div>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: 'var(--color-navy)',
              lineHeight: 1.25,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </p>
          <p style={{ fontSize: 11, color: 'var(--color-fog)', marginTop: 2, lineHeight: 1 }}>
            {sport}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSync}
          style={{
            fontSize: 12,
            fontWeight: 500,
            padding: '6px 14px',
            borderRadius: 9999,
            cursor: synced ? 'default' : 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            transition: 'background 120ms',
            lineHeight: 1.3,
            ...(synced
              ? { background: '#EAF3DE', color: '#27500A', border: '0.5px solid #B5D9A0' }
              : { background: 'var(--color-blue)', color: '#fff', border: '0.5px solid var(--color-blue)' }),
          }}
          onMouseEnter={(e) => {
            if (!synced) e.currentTarget.style.background = '#3A8FD8'
          }}
          onMouseLeave={(e) => {
            if (!synced) e.currentTarget.style.background = 'var(--color-blue)'
          }}
        >
          {synced ? 'Synced ✓' : 'Sync'}
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--color-border)', margin: '14px 0', opacity: 0.5 }} />

      {/* Upcoming events */}
      <p
        style={{
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--color-fog)',
          fontWeight: 500,
          marginBottom: 10,
        }}
      >
        Upcoming events
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {upcomingEvents.slice(0, 3).map((ev, i) => (
          <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
            {/* Coloured left border */}
            <div
              style={{
                width: 3,
                minHeight: 32,
                borderRadius: 9999,
                background: ev.color,
                flexShrink: 0,
                alignSelf: 'stretch',
              }}
            />
            <div style={{ minWidth: 0 }}>
              {ev.teamA && ev.teamB ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'var(--color-navy)',
                    lineHeight: 1.3,
                    maxWidth: 160,
                    overflow: 'hidden',
                  }}
                >
                  <TeamLogo team={ev.teamA} size={22} />
                  <span style={{ flexShrink: 0, color: 'var(--color-fog)', fontWeight: 400 }}>vs</span>
                  <TeamLogo team={ev.teamB} size={22} />
                  <span
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {ev.name}
                  </span>
                </div>
              ) : (
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'var(--color-navy)',
                    lineHeight: 1.3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: 160,
                  }}
                >
                  {ev.sportEmoji} {ev.name}
                </p>
              )}
              <p style={{ fontSize: 11, color: 'var(--color-fog)', marginTop: 2, lineHeight: 1 }}>
                {ev.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
