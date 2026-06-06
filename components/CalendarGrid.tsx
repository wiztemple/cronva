'use client'

import { useState } from 'react'
import { CalendarCard } from './CalendarCard'
import { CategoryTabs } from './CategoryTabs'

interface CalendarItem {
  slug: string
  name: string
  category: string
  subscriberCount: number
  nextEventTitle?: string | null
  nextEventDate?: Date | null
}

interface Props {
  calendars: CalendarItem[]
  title?: string
  showTabs?: boolean
}

export function CalendarGrid({ calendars, title, showTabs = true }: Props) {
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered =
    activeCategory === 'all'
      ? calendars
      : calendars.filter((c) => c.category === activeCategory)

  return (
    <section>
      {title && (
        <h2
          style={{
            fontWeight: 500,
            fontSize: '20px',
            letterSpacing: '-0.2px',
            color: 'var(--color-navy)',
            marginBottom: 20,
          }}
        >
          {title}
        </h2>
      )}

      {showTabs && (
        <div style={{ marginBottom: 24 }}>
          <CategoryTabs onSelect={setActiveCategory} />
        </div>
      )}

      {filtered.length === 0 ? (
        <p
          style={{
            color: 'var(--color-fog)',
            fontSize: '15px',
            textAlign: 'center',
            padding: '48px 0',
          }}
        >
          No calendars in this category yet.
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 12,
          }}
        >
          {filtered.map((cal) => (
            <CalendarCard key={cal.slug} {...cal} />
          ))}
        </div>
      )}
    </section>
  )
}
