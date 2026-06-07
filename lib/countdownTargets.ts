export interface CountdownEvent {
  slug: string
  category: string
  title: string
  subtitle: string
  targetISO: string | null // null → show LIVE immediately
  gradient: string
  watermarkEmoji: string
  /** Calendar slug for brand logo watermark (e.g. monaco-gp → formula-1) */
  logoSlug?: string
}

// Targets based on today 2026-06-07.
// Monaco GP (May 25) is already past → shows LIVE.
// NBA Finals ongoing → shows LIVE.
export const COUNTDOWN_EVENTS: CountdownEvent[] = [
  {
    slug: 'world-cup-2026',
    category: 'Football',
    title: 'FIFA World Cup 2026',
    subtitle: 'USA · Canada · Mexico',
    targetISO: '2026-06-11T20:00:00Z',
    gradient: 'linear-gradient(135deg, #0A4020, #1A7A3A)',
    watermarkEmoji: '🌍',
    logoSlug: 'world-cup-2026',
  },
  {
    slug: 'monaco-gp',
    category: 'Formula 1',
    title: 'Monaco Grand Prix',
    subtitle: 'Circuit de Monaco',
    targetISO: '2026-05-25T13:00:00Z', // past → LIVE
    gradient: 'linear-gradient(135deg, #8B0000, #CC2200)',
    watermarkEmoji: '🏎',
    logoSlug: 'formula-1',
  },
  {
    slug: 'nba',
    category: 'Basketball',
    title: 'NBA Finals 2026',
    subtitle: 'Playoffs underway',
    targetISO: null, // explicitly LIVE
    gradient: 'linear-gradient(135deg, #1A1A6E, #3535C2)',
    watermarkEmoji: '🏀',
  },
  {
    slug: 'bbnnaija',
    category: 'Reality TV',
    title: 'Big Brother Naija S9',
    subtitle: 'Season 9 launch night',
    targetISO: '2026-07-13T19:00:00+01:00', // WAT = UTC+1
    gradient: 'linear-gradient(135deg, #7B1F8A, #C44DB5)',
    watermarkEmoji: '🎬',
  },
  {
    slug: 'afcon',
    category: 'Football',
    title: 'AFCON 2027',
    subtitle: 'Continental championship',
    targetISO: '2027-01-10T18:00:00Z',
    gradient: 'linear-gradient(135deg, #0D3D0D, #1A6E1A)',
    watermarkEmoji: '⚽',
  },
  {
    slug: 'super-eagles',
    category: 'Nigeria',
    title: 'Super Eagles',
    subtitle: 'World Cup qualifier · TBC',
    targetISO: null, // date TBC → LIVE placeholder
    gradient: 'linear-gradient(135deg, #0D2D0D, #007A00)',
    watermarkEmoji: '🦅',
  },
]
