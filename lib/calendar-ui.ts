import type { BadgeVariant, Calendar } from './calendars'
import { resolveCalendarIconUrl } from './brand-logos'

const CATEGORY_LABELS: Record<string, string> = {
  football: 'Football',
  basketball: 'Basketball',
  f1: 'Motorsport',
  entertainment: 'Entertainment',
  tv: 'Movies & TV',
  boxing: 'Boxing',
  tennis: 'Tennis',
  islamic: 'Islamic',
  music: 'Music',
}

const ICON_BG: Record<string, string> = {
  football: '#E6F1FB',
  basketball: '#E1F5EE',
  f1: '#FAEEDA',
  entertainment: '#FBEAF0',
  tv: '#FBEAF0',
  boxing: '#EAF3DE',
  tennis: '#E1F5EE',
  islamic: '#F1EFE8',
  music: '#FAECE7',
}

const COUNTRY_LABELS: Record<string, string> = {
  england: 'England',
  spain: 'Spain',
  nigeria: 'Nigeria',
  global: 'Global',
  europe: 'Europe',
  africa: 'Africa',
  germany: 'Germany',
  italy: 'Italy',
  ghana: 'Ghana',
  kenya: 'Kenya',
}

const NIGERIAN_SLUGS = new Set(['super-eagles', 'npfl', 'bbnnaija', 'afrobeats-tours', 'ramadan'])

export function getFilterCategory(category: string, country: string, slug: string): string {
  if (slug === 'afrobeats-tours') return 'Music'
  if (category === 'f1') return 'Formula 1'
  if (NIGERIAN_SLUGS.has(slug) || country === 'nigeria') return 'Nigerian'
  return CATEGORY_LABELS[category] ?? category
}

export function getDisplayCategory(category: string, country: string): string {
  const label = CATEGORY_LABELS[category] ?? category
  const region = COUNTRY_LABELS[country] ?? country.charAt(0).toUpperCase() + country.slice(1)
  return `${label} · ${region}`
}

function formatEventDateTime(date: Date): string {
  const datePart = new Intl.DateTimeFormat('en-NG', {
    month: 'short',
    day: 'numeric',
    timeZone: 'Africa/Lagos',
  }).format(date)

  const timePart = new Intl.DateTimeFormat('en-NG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Africa/Lagos',
  }).format(date)

  return `${datePart} · ${timePart} WAT`
}

function isTonight(date: Date): boolean {
  const now = new Date()
  const lagosNow = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Lagos' }))
  const lagosEvent = new Date(date.toLocaleString('en-US', { timeZone: 'Africa/Lagos' }))
  return (
    lagosNow.getFullYear() === lagosEvent.getFullYear() &&
    lagosNow.getMonth() === lagosEvent.getMonth() &&
    lagosNow.getDate() === lagosEvent.getDate()
  )
}

function deriveBadge(
  category: string,
  nextEvent?: { title: string; startDatetime: Date } | null
): BadgeVariant | undefined {
  if (!nextEvent) return undefined
  if (isTonight(nextEvent.startDatetime)) return 'live'
  if (category === 'basketball' && /playoff/i.test(nextEvent.title)) return 'playoffs'
  return undefined
}

export interface DbCalendarRow {
  slug: string
  name: string
  category: string
  sport: string | null
  description: string | null
  country: string
  subscriberCount: number
  isFeatured: boolean
  iconUrl?: string | null
  events: Array<{ title: string; startDatetime: Date; location?: string | null }>
  _count?: { events: number; userSubscriptions?: number }
}

export function toCalendarUI(row: DbCalendarRow): Calendar {
  const next = row.events[0]
  const nextEvent = next?.title ?? 'No upcoming events'
  const nextEventDate = next ? formatEventDateTime(next.startDatetime) : ''

  return {
    slug: row.slug,
    name: row.name,
    sport: row.sport ?? row.category,
    category: getDisplayCategory(row.category, row.country),
    country: row.country,
    description: row.description ?? '',
    subscriberCount: row._count?.userSubscriptions ?? row.subscriberCount,
    fixturesPerSeason: row._count?.events ?? row.events.length,
    refreshHours: 6,
    iconBg: ICON_BG[row.category] ?? '#E6F1FB',
    sportColor: ICON_BG[row.category] ?? '#E6F1FB',
    nextEvent,
    nextEventDate,
    badge: deriveBadge(row.category, next),
    filterCategory: getFilterCategory(row.category, row.country, row.slug),
    iconCategory: row.category,
    iconUrl: resolveCalendarIconUrl(row.slug, row.iconUrl),
  }
}

export function formatHeroStatCount(n: number): string {
  if (n >= 1_000_000) return `${Math.floor(n / 100_000) / 10}M+`.replace('.0M', 'M')
  if (n >= 1_000) return `${Math.floor(n / 100) / 10}k+`.replace('.0k', 'k')
  return n.toLocaleString()
}
