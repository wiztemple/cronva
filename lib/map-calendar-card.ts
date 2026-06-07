const SPORT_BG: Record<string, string> = {
  football: '#E6F1FB',
  basketball: '#E1F5EE',
  f1: '#FAEEDA',
  entertainment: '#FBEAF0',
  tv: '#FBEAF0',
  boxing: '#EAF3DE',
  music: '#FAECE7',
  islamic: '#F1EFE8',
  local: '#EEEDFE',
}

import { resolveCalendarIconUrl } from './brand-logos'

interface PrismaCalendarLike {
  slug: string
  name: string
  category: string
  subscriberCount: number
  iconUrl?: string | null
  events: Array<{ title: string; startDatetime: Date }>
}

export function mapPrismaToCardProps(cal: PrismaCalendarLike) {
  const event = cal.events[0]
  const nextDate = event
    ? new Intl.DateTimeFormat('en-NG', {
        month: 'short',
        day: 'numeric',
        timeZone: 'Africa/Lagos',
      }).format(event.startDatetime)
    : undefined

  return {
    slug: cal.slug,
    name: cal.name,
    sport: cal.category,
    category: cal.category,
    nextEvent: event?.title ?? 'No upcoming events',
    nextDate,
    subscriberCount: cal.subscriberCount,
    iconBg: SPORT_BG[cal.category] ?? '#E6F1FB',
    iconCategory: cal.category,
    iconUrl: resolveCalendarIconUrl(cal.slug, cal.iconUrl),
  }
}
