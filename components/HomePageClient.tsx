'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { NavBar } from '@/components/NavBar'
import { HeroSplit } from '@/components/HeroSplit'
import { NavyPanel } from '@/components/NavyPanel'
import { FeaturedCard } from '@/components/FeaturedCard'
import { CountdownCard } from '@/components/CountdownCard'
import { HotCard } from '@/components/HotCard'
import { CategoryFilter, type CategoryTab } from '@/components/CategoryFilter'
import { CalendarGrid } from '@/components/CalendarGrid'
import { WatchlistSection } from '@/components/WatchlistSection'
import { EntertainmentSection } from '@/components/EntertainmentSection'
import { HowItWorks } from '@/components/HowItWorks'
import { Footer } from '@/components/Footer'
import { Toast } from '@/components/Toast'
import type { Calendar } from '@/lib/calendars'
import type {
  ArtistTourCard,
  CountdownHighlight,
  HotCardData,
  NigerianShowCard,
  RankedCalendar,
  WatchlistFixture,
} from '@/lib/homepage-types'

/* ─── Helpers ─── */

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

function formatFeaturedNextEvent(cal: Calendar): string {
  if (!cal.nextEventDate) return cal.nextEvent
  return `${cal.nextEvent} · ${cal.nextEventDate}`
}

/* ─── Props ─── */

interface HomePageClientProps {
  heroStats: Array<{ value: string; label: string }>
  totalCalendars: number
  featured: {
    epl?: Calendar
    superEagles?: Calendar
    bbnaija?: Calendar
  }
  gridCalendars: Calendar[]
  hotNowCards: HotCardData[]
  countdownHighlights: CountdownHighlight[]
  trendingRanked: RankedCalendar[]
  nigerianShows: NigerianShowCard[]
  afrobeatsTours: ArtistTourCard[]
  watchlistFixtures: WatchlistFixture[]
}

/* ─── Component ─── */

export function HomePageClient({
  heroStats,
  totalCalendars,
  featured,
  gridCalendars,
  hotNowCards,
  countdownHighlights,
  trendingRanked,
  nigerianShows,
  afrobeatsTours,
  watchlistFixtures,
}: HomePageClientProps) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<CategoryTab>('All')
  const debouncedSearch = useDebounce(search, 300)

  // Toast state
  const [toastVisible, setToastVisible] = useState(false)
  const showToast = useCallback(() => {
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2500)
  }, [])

  return (
    <>
      <NavBar />

      {/* Section 1: Hero */}
      <HeroSplit
        left={
          <NavyPanel
            eyebrow={`Free forever · ${totalCalendars} calendars · syncs to any calendar app`}
            title={
              <>
                Time, <em style={{ color: 'var(--color-gold)', fontStyle: 'normal' }}>delivered.</em>
              </>
            }
            subtitle="Every match, race and show you follow — straight into your phone calendar. Set once. Never check again."
            searchPlaceholder="Search EPL, BBNaija, Super Eagles, F1..."
            searchValue={search}
            onSearchChange={setSearch}
            stats={heroStats}
          />
        }
        right={
          <div>
            {featured.epl && (
              <FeaturedCard
                slug={featured.epl.slug}
                sport="⚽ Football"
                name={featured.epl.name}
                nextEvent={formatFeaturedNextEvent(featured.epl)}
                subscriberCount={featured.epl.subscriberCount}
                badge="active"
                badgeLabel="Season active"
                iconCategory={featured.epl.iconCategory}
                iconUrl={featured.epl.iconUrl}
                iconBg={featured.epl.iconBg}
              />
            )}
            {featured.superEagles && (
              <FeaturedCard
                slug={featured.superEagles.slug}
                sport="🦅 Nigeria"
                name={featured.superEagles.name}
                nextEvent={formatFeaturedNextEvent(featured.superEagles)}
                subscriberCount={featured.superEagles.subscriberCount}
                badge="hot"
                badgeLabel="Most synced"
                iconCategory={featured.superEagles.iconCategory}
                iconUrl={featured.superEagles.iconUrl}
                iconBg={featured.superEagles.iconBg}
              />
            )}
            {featured.bbnaija && (
              <FeaturedCard
                slug={featured.bbnaija.slug}
                sport="🎬 Entertainment"
                name={featured.bbnaija.name}
                nextEvent={formatFeaturedNextEvent(featured.bbnaija)}
                subscriberCount={featured.bbnaija.subscriberCount}
                badge="soon"
                badgeLabel="Coming July"
                iconCategory={featured.bbnaija.iconCategory}
                iconUrl={featured.bbnaija.iconUrl}
                iconBg={featured.bbnaija.iconBg}
              />
            )}
          </div>
        }
      />

      {/* Section 2: Countdown Heroes */}
      <section className="section-surface-alt" style={{ padding: '48px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="section-header fade-up" style={{ padding: '0 32px' }}>
            <span className="section-header-icon" aria-hidden>🔔</span>
            <div>
              <h2 className="section-header-title">Events you don&apos;t want to miss</h2>
              <p className="section-header-sub">Sync once. Your calendar counts down automatically.</p>
            </div>
          </div>

          <div
            className="scroll-row"
            style={{
              display: 'flex',
              gap: 16,
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              padding: '0 32px 4px',
            }}
          >
            {countdownHighlights.map((event, i) => (
              <div
                key={event.slug}
                className={`fade-up fade-up-delay-${Math.min(i + 1, 4)}`}
                style={{ flexShrink: 0 }}
              >
                <CountdownCard event={event} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Hot Now */}
      <section className="section-surface" style={{ padding: '48px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="section-header fade-up" style={{ padding: '0 32px' }}>
            <span className="section-header-icon" aria-hidden>🔥</span>
            <div>
              <h2 className="section-header-title">Hot now</h2>
              <p className="section-header-sub">The calendars everyone is syncing this week.</p>
            </div>
          </div>

          <div
            className="scroll-row"
            style={{
              display: 'flex',
              gap: 14,
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              padding: '0 32px 4px',
            }}
          >
            {hotNowCards.length > 0 ? (
              hotNowCards.map((card, i) => (
                <div
                  key={card.slug}
                  className={`fade-up fade-up-delay-${Math.min(i + 1, 4)}`}
                  style={{ flexShrink: 0 }}
                >
                  <HotCard {...card} onSync={showToast} />
                </div>
              ))
            ) : (
              <p style={{ fontSize: 13, color: 'var(--color-fog)', padding: '0 32px' }}>
                No upcoming events yet — run the sync jobs to populate fixtures.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Section 4: Browse by Category */}
      <CategoryFilter active={activeCategory} onChange={setActiveCategory} />

      <section style={{ padding: '40px 32px 80px', maxWidth: 1280, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <h2
            className="section-header-title"
            style={{ margin: 0 }}
          >
            Browse by sport
          </h2>
          <Link
            href="/"
            style={{
              fontSize: 13,
              color: 'var(--color-blue)',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            {totalCalendars} total →
          </Link>
        </div>

        {gridCalendars.length > 0 ? (
          <CalendarGrid
            calendars={gridCalendars}
            activeCategory={activeCategory}
            searchQuery={debouncedSearch}
          />
        ) : (
          <p style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-fog)' }}>
            No calendars available yet.
          </p>
        )}
      </section>

      {/* Section 5: Watchlist */}
      <WatchlistSection fixtures={watchlistFixtures} />

      {/* Section 6: Entertainment */}
      <EntertainmentSection
        onSync={showToast}
        trendingRanked={trendingRanked}
        nigerianShows={nigerianShows}
        afrobeatsTours={afrobeatsTours}
      />

      {/* Section 7: How it works */}
      <HowItWorks />

      {/* Section 8: Footer */}
      <Footer />

      {/* Toast notification */}
      <Toast visible={toastVisible} message="Added to your calendar ✓" />
    </>
  )
}
