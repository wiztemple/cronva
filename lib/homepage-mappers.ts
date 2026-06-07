import { formatSubscriberCount, type Calendar } from './calendars'
import { parseFixtureTeams } from './brand-logos'
import type {
  ArtistTourCard,
  CountdownHighlight,
  HotCardData,
  HotCardEvent,
  NigerianShowCard,
  RankedCalendar,
  WatchlistFixture,
} from './homepage-types'
import type { DbCalendarRow } from './calendar-ui'

const SLUG_EMOJI: Record<string, string> = {
  'world-cup-2026': '🌍',
  'super-eagles': '🦅',
  bbnnaija: '🎬',
  'formula-1': '🏎',
  nba: '🏀',
  'champions-league': '🏆',
  npfl: '⚽',
  'afrobeats-tours': '🎤',
  afcon: '⚽',
  boxing: '🥊',
  ramadan: '🕌',
  epl: '⚽',
}

const CATEGORY_EMOJI: Record<string, string> = {
  football: '⚽',
  basketball: '🏀',
  f1: '🏎',
  entertainment: '🎬',
  tv: '📺',
  boxing: '🥊',
  tennis: '🏀',
  islamic: '🕌',
  music: '🎤',
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

const NIGERIAN_GRADIENTS: Record<string, string> = {
  bbnnaija: 'linear-gradient(160deg, #7B1F8A, #C44DB5)',
  'amvca-2026': 'linear-gradient(160deg, #2C1A70, #6B48C8)',
  'afrobeats-tours': 'linear-gradient(160deg, #8B3A00, #E07B30)',
  'africa-magic': 'linear-gradient(160deg, #0D3D0D, #1A8A1A)',
  nollywood: 'linear-gradient(160deg, #7A1A1A, #D44040)',
  'upcoming-movies': 'linear-gradient(160deg, #2C1A70, #6B48C8)',
  'tv-episodes': 'linear-gradient(160deg, #0D3D0D, #1A8A1A)',
  'new-series': 'linear-gradient(160deg, #7A1A1A, #D44040)',
}

const COUNTDOWN_STYLES: Record<
  string,
  Pick<CountdownHighlight, 'gradient' | 'watermarkEmoji' | 'logoSlug' | 'category'>
> = {
  'world-cup-2026': {
    category: 'Football',
    gradient: 'linear-gradient(135deg, #0A4020, #1A7A3A)',
    watermarkEmoji: '🌍',
    logoSlug: 'world-cup-2026',
  },
  'formula-1': {
    category: 'Formula 1',
    gradient: 'linear-gradient(135deg, #8B0000, #CC2200)',
    watermarkEmoji: '🏎',
    logoSlug: 'formula-1',
  },
  nba: {
    category: 'Basketball',
    gradient: 'linear-gradient(135deg, #1A1A6E, #3535C2)',
    watermarkEmoji: '🏀',
    logoSlug: 'nba',
  },
  bbnnaija: {
    category: 'Reality TV',
    gradient: 'linear-gradient(135deg, #7B1F8A, #C44DB5)',
    watermarkEmoji: '🎬',
  },
  afcon: {
    category: 'Football',
    gradient: 'linear-gradient(135deg, #0D3D0D, #1A6E1A)',
    watermarkEmoji: '⚽',
  },
  'super-eagles': {
    category: 'Nigeria',
    gradient: 'linear-gradient(135deg, #0D2D0D, #007A00)',
    watermarkEmoji: '🦅',
  },
}

function formatEventDateTime(date: Date): string {
  const day = new Intl.DateTimeFormat('en-NG', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'Africa/Lagos',
  }).format(date)
  const time = new Intl.DateTimeFormat('en-NG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Africa/Lagos',
  }).format(date)
  return `${day} · ${time} WAT`
}

function formatFixtureCardDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'Africa/Lagos',
  })
    .format(date)
    .toUpperCase()
}

function formatFixtureCardTime(date: Date): string {
  return (
    new Intl.DateTimeFormat('en-NG', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Africa/Lagos',
    }).format(date) + ' WAT'
  )
}

function calendarEmoji(slug: string, category: string): string {
  return SLUG_EMOJI[slug] ?? CATEGORY_EMOJI[category] ?? '📅'
}

function mapEventToHotCardEvent(
  title: string,
  startDatetime: Date,
  emoji: string,
  color: string
): HotCardEvent {
  const teams = parseFixtureTeams(title)
  return {
    name: title,
    date: formatEventDateTime(startDatetime),
    sportEmoji: emoji,
    color,
    ...(teams ? { teamA: teams.teamA, teamB: teams.teamB } : {}),
  }
}

export function mapToHotCard(row: DbCalendarRow): HotCardData {
  const emoji = calendarEmoji(row.slug, row.category)
  const color = ICON_BG[row.category] ?? '#E6F1FB'
  const events = row.events.slice(0, 3)

  const upcomingEvents: HotCardEvent[] =
    events.length > 0
      ? events.map((ev) =>
          mapEventToHotCardEvent(ev.title, ev.startDatetime, emoji, color)
        )
      : [
          {
            name: 'No upcoming events',
            date: 'Check back soon',
            sportEmoji: emoji,
            color,
          },
        ]

  return {
    slug: row.slug,
    name: row.name,
    sport: row.sport ?? row.category,
    iconEmoji: emoji,
    iconBg: ICON_BG[row.category] ?? '#E6F1FB',
    iconCategory: row.category,
    upcomingEvents,
  }
}

export function mapToRankedCalendar(cal: Calendar, rank: number): RankedCalendar {
  return {
    slug: cal.slug,
    rank,
    emoji: calendarEmoji(cal.slug, cal.iconCategory),
    iconCategory: cal.iconCategory,
    name: cal.name,
    nextEvent: cal.nextEventDate || cal.nextEvent,
    subscribers: formatSubscriberCount(cal.subscriberCount),
  }
}

export function mapToNigerianShow(row: DbCalendarRow): NigerianShowCard {
  const next = row.events[0]
  const nextDate = next
    ? new Intl.DateTimeFormat('en-NG', {
        month: 'short',
        year: 'numeric',
        timeZone: 'Africa/Lagos',
      }).format(next.startDatetime)
    : 'Coming soon'

  return {
    slug: row.slug,
    name: row.name,
    nextDate,
    gradient:
      NIGERIAN_GRADIENTS[row.slug] ??
      'linear-gradient(160deg, #2C1A70, #6B48C8)',
    emoji: calendarEmoji(row.slug, row.category),
  }
}

export function mapToArtistTour(
  calendarSlug: string,
  title: string,
  startDatetime: Date,
  location?: string | null
): ArtistTourCard {
  const parts = title.split(' — ')
  const artist = parts[0]?.trim() ?? title
  const tourName = parts[1]?.trim() ?? 'Live show'
  const datePart = new Intl.DateTimeFormat('en-NG', {
    month: 'short',
    day: 'numeric',
    timeZone: 'Africa/Lagos',
  }).format(startDatetime)

  return {
    slug: calendarSlug,
    artist,
    tourName,
    nextShow: location ? `${location} · ${datePart}` : datePart,
    emoji: '🎤',
    iconBg: ICON_BG.music,
  }
}

export function mapToCountdownHighlight(
  slug: string,
  name: string,
  nextEvent: { title: string; startDatetime: Date; location?: string | null } | null
): CountdownHighlight | null {
  const style = COUNTDOWN_STYLES[slug]
  if (!style) return null

  return {
    slug,
    category: style.category,
    title: name,
    subtitle: nextEvent?.location ?? nextEvent?.title ?? 'Date TBC',
    targetISO: nextEvent ? nextEvent.startDatetime.toISOString() : null,
    gradient: style.gradient,
    watermarkEmoji: style.watermarkEmoji,
    logoSlug: style.logoSlug,
  }
}

export function mapToWatchlistFixture(
  title: string,
  startDatetime: Date,
  competition: string
): WatchlistFixture {
  const teams = parseFixtureTeams(title)
  return {
    date: formatFixtureCardDate(startDatetime),
    time: formatFixtureCardTime(startDatetime),
    teamA: teams?.teamA ?? title,
    teamB: teams?.teamB ?? '',
    competition,
  }
}
