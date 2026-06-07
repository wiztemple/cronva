'use client'

import { useState, useEffect } from 'react'
import { NavBar } from '@/components/NavBar'
import { NavyPanel } from '@/components/NavyPanel'
import { CalendarGrid } from '@/components/CalendarGrid'
import { Footer } from '@/components/Footer'
import type { Calendar } from '@/lib/calendars'
import type { CategoryTab } from '@/components/CategoryFilter'

interface SearchPageClientProps {
  calendars: Calendar[]
  initialQuery?: string
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export function SearchPageClient({ calendars, initialQuery = '' }: SearchPageClientProps) {
  const [search, setSearch] = useState(initialQuery)
  const debouncedSearch = useDebounce(search, 300)
  const activeCategory: CategoryTab = 'All'

  const resultCount = debouncedSearch.trim()
    ? calendars.filter((c) => {
        const q = debouncedSearch.toLowerCase()
        return (
          c.name.toLowerCase().includes(q) ||
          c.sport.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
        )
      }).length
    : 0

  return (
    <>
      <NavBar />

      <div style={{ borderBottom: '0.5px solid var(--color-border)' }}>
        <NavyPanel
          eyebrow="Search calendars"
          title="Find your fixture."
          subtitle="Search by league, team, sport, or country."
          searchPlaceholder="Search EPL, Super Eagles, Formula 1..."
          searchValue={search}
          onSearchChange={setSearch}
          stats={
            debouncedSearch.trim()
              ? [{ value: String(resultCount), label: 'results found' }]
              : [{ value: String(calendars.length), label: 'calendars available' }]
          }
        />
      </div>

      <section style={{ padding: '40px 32px 80px', maxWidth: 1280, margin: '0 auto' }}>
        {debouncedSearch.trim() ? (
          <CalendarGrid
            calendars={calendars}
            activeCategory={activeCategory}
            searchQuery={debouncedSearch}
          />
        ) : (
          <p
            style={{
              textAlign: 'center',
              padding: '48px 0',
              color: 'var(--color-fog)',
              fontSize: 14,
            }}
          >
            Start typing to search calendars
          </p>
        )}
      </section>

      <Footer />
    </>
  )
}
