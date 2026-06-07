import { auth } from '@/auth'
import { HomePageClient } from '@/components/HomePageClient'
import { getHomepageData } from '@/lib/calendars.server'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const session = await auth()
  const data = await getHomepageData(session?.user?.id)

  return (
    <HomePageClient
      heroStats={data.stats.heroStats}
      totalCalendars={data.totalCalendars}
      featured={data.featured}
      gridCalendars={data.gridCalendars}
      hotNowCards={data.hotNowCards}
      countdownHighlights={data.countdownHighlights}
      trendingRanked={data.trendingRanked}
      nigerianShows={data.nigerianShows}
      afrobeatsTours={data.afrobeatsTours}
      watchlistFixtures={data.watchlistFixtures}
    />
  )
}
