import { TrendingPageClient } from '@/components/TrendingPageClient'
import { getTrendingData } from '@/lib/calendars.server'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Trending',
  description: 'The fastest-growing sports and entertainment calendars on Cronva this week.',
}

export default async function TrendingPage() {
  const { calendars, top3 } = await getTrendingData()
  return <TrendingPageClient calendars={calendars} top3={top3} />
}
