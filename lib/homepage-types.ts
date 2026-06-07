export interface HotCardEvent {
  name: string
  date: string
  sportEmoji: string
  color: string
  teamA?: string
  teamB?: string
}

export interface HotCardData {
  slug: string
  name: string
  sport: string
  iconEmoji: string
  iconBg: string
  iconCategory?: string
  upcomingEvents: HotCardEvent[]
}

export interface RankedCalendar {
  slug: string
  rank: number
  emoji: string
  iconCategory?: string
  name: string
  nextEvent: string
  subscribers: string
}

export interface NigerianShowCard {
  slug: string
  name: string
  nextDate: string
  gradient: string
  emoji: string
}

export interface ArtistTourCard {
  slug: string
  artist: string
  tourName: string
  nextShow: string
  emoji: string
  iconBg: string
}

export interface WatchlistFixture {
  date: string
  time: string
  teamA: string
  teamB: string
  competition: string
}

export interface CountdownHighlight {
  slug: string
  category: string
  title: string
  subtitle: string
  targetISO: string | null
  gradient: string
  watermarkEmoji: string
  logoSlug?: string
}
