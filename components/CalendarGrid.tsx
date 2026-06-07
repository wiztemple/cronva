'use client'

import { CalendarCard } from './CalendarCard'
import type { Calendar } from '@/lib/calendars'
import type { CategoryTab } from './CategoryFilter'

interface CalendarGridProps {
  calendars: Calendar[]
  activeCategory: CategoryTab
  searchQuery?: string
}

function matchesCategory(cal: Calendar, category: CategoryTab): boolean {
  if (category === 'All') return true
  return cal.filterCategory === category
}

function matchesSearch(cal: Calendar, query: string): boolean {
  if (!query.trim()) return true
  const q = query.toLowerCase()
  return (
    cal.name.toLowerCase().includes(q) ||
    cal.sport.toLowerCase().includes(q) ||
    cal.category.toLowerCase().includes(q)
  )
}

export function CalendarGrid({ calendars, activeCategory, searchQuery = '' }: CalendarGridProps) {
  const hasSearch = searchQuery.trim().length > 0
  const visible = calendars.filter(
    (cal) => matchesCategory(cal, activeCategory) && matchesSearch(cal, searchQuery)
  )

  if (hasSearch && visible.length === 0) {
    return (
      <p
        style={{
          textAlign: 'center',
          padding: '48px 32px',
          color: 'var(--color-fog)',
          fontSize: 14,
        }}
      >
        No calendars found for &apos;{searchQuery}&apos;
      </p>
    )
  }

  return (
    <div className="calendar-grid">
      {calendars.map((cal) => {
        const categoryMatch = matchesCategory(cal, activeCategory)
        const searchMatch = matchesSearch(cal, searchQuery)
        const faded = !categoryMatch || !searchMatch

        if (hasSearch && !searchMatch) return null

        return (
          <CalendarCard
            key={cal.slug}
            slug={cal.slug}
            name={cal.name}
            sport={cal.sport}
            category={cal.category}
            nextEvent={cal.nextEvent}
            nextDate={cal.nextEventDate}
            subscriberCount={cal.subscriberCount}
            iconBg={cal.iconBg}
            iconCategory={cal.iconCategory}
            iconUrl={cal.iconUrl}
            badge={cal.badge}
            faded={faded}
          />
        )
      })}
    </div>
  )
}
