'use client'

import { useState, useMemo } from 'react'
import { SubscribeSection } from './SubscribeSection'

export interface CalendarEventItem {
  id: string
  externalId: string
  title: string
  startDatetime: string
  location: string | null
}

interface Props {
  events: CalendarEventItem[]
  pickable: boolean
  calendarId: string
  calendarName: string
  calendarSlug: string
  baseUrl: string
  isSubscribed: boolean
}

function formatWAT(iso: string): string {
  return new Intl.DateTimeFormat('en-NG', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'Africa/Lagos',
  }).format(new Date(iso))
}

function formatTimeWAT(iso: string): string {
  return new Intl.DateTimeFormat('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Africa/Lagos',
  }).format(new Date(iso))
}

export function CalendarDetailLayout({
  events,
  pickable,
  calendarId,
  calendarName,
  calendarSlug,
  baseUrl,
  isSubscribed,
}: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const selectedExternalIds = useMemo(() => [...selected], [selected])

  function toggle(externalId: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(externalId)) next.delete(externalId)
      else next.add(externalId)
      return next
    })
  }

  function selectAll() {
    setSelected(new Set(events.map((e) => e.externalId)))
  }

  function clearAll() {
    setSelected(new Set())
  }

  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 48, alignItems: 'start' }}
      className="cal-detail-grid"
    >
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
          <h2 style={{ fontWeight: 500, fontSize: '16px', letterSpacing: '-0.1px', color: 'var(--color-navy)', margin: 0 }}>
            Upcoming events
          </h2>
          {pickable && events.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12 }}>
              <span style={{ color: 'var(--color-fog)' }}>
                {selected.size} selected
              </span>
              <button type="button" onClick={selectAll} style={{ color: 'var(--color-blue)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 12 }}>
                Select all
              </button>
              <button type="button" onClick={clearAll} style={{ color: 'var(--color-fog)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 12 }}>
                Clear
              </button>
            </div>
          )}
        </div>

        {pickable && (
          <p style={{ fontSize: 13, color: 'var(--color-fog)', marginBottom: 16, lineHeight: 1.5 }}>
            Tick the events you want, or leave all unchecked to add the full calendar.
          </p>
        )}

        {events.length === 0 ? (
          <p style={{ color: 'var(--color-fog)', fontSize: '15px', padding: '32px 0' }}>
            No upcoming events scheduled yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {events.map((ev, i) => {
              const isSelected = selected.has(ev.externalId)
              return (
                <label
                  key={ev.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: pickable ? '20px 80px 60px 1fr' : '80px 60px 1fr',
                    gap: 16,
                    padding: '14px 0',
                    borderBottom: i < events.length - 1 ? '1px solid rgba(26,63,111,0.08)' : 'none',
                    alignItems: 'start',
                    cursor: pickable ? 'pointer' : 'default',
                    background: pickable && isSelected ? 'rgba(74,159,232,0.04)' : 'transparent',
                    margin: pickable ? '0 -8px' : 0,
                    paddingLeft: pickable ? 8 : 0,
                    paddingRight: pickable ? 8 : 0,
                    borderRadius: pickable ? 6 : 0,
                  }}
                >
                  {pickable && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggle(ev.externalId)}
                      style={{ width: 16, height: 16, marginTop: 2, accentColor: 'var(--color-blue)', cursor: 'pointer' }}
                    />
                  )}
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-navy)' }}>
                      {formatWAT(ev.startDatetime)}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--color-fog)' }}>
                      {formatTimeWAT(ev.startDatetime)} WAT
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-navy)', marginBottom: 2 }}>
                      {ev.title}
                    </p>
                    {ev.location && (
                      <p style={{ fontSize: '12px', color: 'var(--color-fog)' }}>{ev.location}</p>
                    )}
                  </div>
                </label>
              )
            })}
          </div>
        )}
      </section>

      <aside>
        <SubscribeSection
          calendarId={calendarId}
          calendarName={calendarName}
          calendarSlug={calendarSlug}
          baseUrl={baseUrl}
          isSubscribed={isSubscribed}
          pickable={pickable}
          selectedExternalIds={pickable ? selectedExternalIds : undefined}
        />
      </aside>
    </div>
  )
}
