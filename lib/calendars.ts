export type BadgeVariant = 'live' | 'hot' | 'soon' | 'active' | 'playoffs'

export interface Calendar {
  slug: string
  name: string
  sport: string
  category: string
  country: string
  description: string
  subscriberCount: number
  fixturesPerSeason: number
  refreshHours: number
  iconBg: string
  sportColor: string
  nextEvent: string
  nextEventDate: string
  badge?: BadgeVariant
  filterCategory: string
  iconCategory: string
  iconUrl?: string | null
}

export const FEATURED_SLUGS = ['epl', 'super-eagles', 'bbnnaija'] as const

export const HOMEPAGE_GRID_SLUGS = [
  'champions-league',
  'formula-1',
  'nba',
  'la-liga',
  'npfl',
  'afcon',
  'bundesliga',
  'serie-a',
  'boxing',
  'afrobeats-tours',
  'world-cup-2026',
  'ramadan',
] as const

export function formatSubscriberCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.round(n / 100) / 10}k`.replace('.0k', 'k')
  return n.toLocaleString()
}

export function formatSubscriberCountFull(n: number): string {
  return `${n.toLocaleString()} synced`
}
