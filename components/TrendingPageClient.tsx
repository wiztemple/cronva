'use client'

import { NavBar } from '@/components/NavBar'
import { HeroSplit } from '@/components/HeroSplit'
import { NavyPanel } from '@/components/NavyPanel'
import { FeaturedCard } from '@/components/FeaturedCard'
import { CalendarCard } from '@/components/CalendarCard'
import { Footer } from '@/components/Footer'
import { formatSubscriberCount, type Calendar } from '@/lib/calendars'

const GROWTH_BADGES = [
  '+18% this week',
  '+14% this week',
  '+12% this week',
  '+11% this week',
  '+9% this week',
  '+8% this week',
  '+7% this week',
  '+6% this week',
  '+5% this week',
  '+4% this week',
  '+3% this week',
  '+2% this week',
]

interface TrendingPageClientProps {
  calendars: Calendar[]
  top3: Calendar[]
}

function formatNextEvent(cal: Calendar): string {
  if (!cal.nextEventDate) return cal.nextEvent
  return `${cal.nextEvent} · ${cal.nextEventDate}`
}

export function TrendingPageClient({ calendars, top3 }: TrendingPageClientProps) {
  return (
    <>
      <NavBar />

      <HeroSplit
        left={
          <NavyPanel
            eyebrow="This week's most popular"
            title={
              <>
                Trending
                <br />
                now.
              </>
            }
            subtitle="The calendars everyone is syncing this week."
            stats={top3.map((cal, i) => ({
              value: formatSubscriberCount(cal.subscriberCount),
              label: `#${i + 1} ${cal.name.split(' ').slice(0, 2).join(' ')}`,
            }))}
          />
        }
        right={
          <div>
            {top3.map((cal, i) => (
              <FeaturedCard
                key={cal.slug}
                slug={cal.slug}
                sport={cal.category.split(' · ')[0]}
                name={cal.name}
                nextEvent={formatNextEvent(cal)}
                subscriberCount={cal.subscriberCount}
                badge={i === 0 ? 'hot' : cal.badge}
                badgeLabel={i === 0 ? 'Most synced' : undefined}
                iconCategory={cal.iconCategory}
                iconUrl={cal.iconUrl}
                iconBg={cal.iconBg}
              />
            ))}
          </div>
        }
      />

      <section style={{ padding: '40px 32px 80px', maxWidth: 1280, margin: '0 auto' }}>
        <div
          style={{
            border: '0.5px solid var(--color-border)',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {calendars.map((cal, index) => (
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
              rank={index + 1}
              growthBadge={GROWTH_BADGES[index]}
            />
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}
