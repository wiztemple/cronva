/** Local brand assets in /public/brand — keyed by calendar slug */
export const CALENDAR_BRAND_LOGOS: Record<string, string> = {
  epl: '/brand/Premier_League_Logo_Alternative_0.svg',
  'champions-league': '/brand/ucl.svg',
  'serie-a': '/brand/italy-seriea.svg',
  'formula-1': '/brand/Formula_1_Logo_0.svg',
  nba: '/brand/NBA_id-njA-Hob_0.svg',
  'world-cup-2026': '/brand/fifa26.svg',
  bundesliga: '/brand/bundesliga.jpeg',
}

/** National team crests in /public/brand — keyed by normalized slug */
export const TEAM_BRAND_LOGOS: Record<string, string> = {
  algeria: '/brand/algeria.svg',
  argentina: '/brand/argentina.svg',
  australia: '/brand/australia.svg',
  austria: '/brand/austria.svg',
  belgium: '/brand/belgium.svg',
  bosnia: '/brand/bosnia.svg',
  brazil: '/brand/brazil.svg',
  canada: '/brand/canada.svg',
  'cape-verde': '/brand/cape-verde.svg',
  colombia: '/brand/colombia.svg',
  congo: '/brand/congo.svg',
  'cote-d-ivoire': '/brand/cote-d-ivoire.svg',
  croatia: '/brand/croatia.svg',
  curacao: '/brand/curacao.svg',
  czechia: '/brand/czechia.svg',
  ecuador: '/brand/ecuador.svg',
  egypt: '/brand/egypt.svg',
  england: '/brand/england.svg',
  france: '/brand/france.svg',
  germany: '/brand/germany.svg',
  ghana: '/brand/ghana.svg',
  haiti: '/brand/haiti.svg',
  iran: '/brand/iran.svg',
  iraq: '/brand/iraq.svg',
  japan: '/brand/japan.svg',
  jordan: '/brand/jordan.svg',
  mexico: '/brand/mexico.svg',
  morocco: '/brand/morocco.svg',
  netherlands: '/brand/netherlands.svg',
  'new-zealand': '/brand/new-zealand.svg',
  norway: '/brand/norway.svg',
  panama: '/brand/panama.svg',
  paraguay: '/brand/paraguay.svg',
  portugal: '/brand/portugal.svg',
  qatar: '/brand/qatar.svg',
  'saudi-arabia': '/brand/saudi-arabia.svg',
  scotland: '/brand/scotland.svg',
  senegal: '/brand/senegal.svg',
  'south-africa': '/brand/south-africa.svg',
  'south-korea': '/brand/south-korea.svg',
  spain: '/brand/spain.svg',
  sweden: '/brand/sweden.svg',
  switzerland: '/brand/switzerland.svg',
  tunisia: '/brand/tunisia.svg',
  turkey: '/brand/turkey.svg',
  uruguay: '/brand/uruguay.svg',
  usa: '/brand/usa.svg',
  uzbekistan: '/brand/uzbekistan.svg',
}

const TEAM_NAME_ALIASES: Record<string, string> = {
  mexico: 'mexico',
  'south africa': 'south-africa',
  's. africa': 'south-africa',
  's africa': 'south-africa',
  usa: 'usa',
  'united states': 'usa',
  'u.s.a.': 'usa',
  us: 'usa',
  canada: 'canada',
  argentina: 'argentina',
  brazil: 'brazil',
  france: 'france',
  germany: 'germany',
  spain: 'spain',
  england: 'england',
  portugal: 'portugal',
  netherlands: 'netherlands',
  holland: 'netherlands',
  belgium: 'belgium',
  croatia: 'croatia',
  switzerland: 'switzerland',
  austria: 'austria',
  poland: 'poland',
  senegal: 'senegal',
  morocco: 'morocco',
  ghana: 'ghana',
  nigeria: 'nigeria',
  algeria: 'algeria',
  tunisia: 'tunisia',
  egypt: 'egypt',
  cameroon: 'cameroon',
  'south korea': 'south-korea',
  'korea republic': 'south-korea',
  japan: 'japan',
  australia: 'australia',
  'saudi arabia': 'saudi-arabia',
  iran: 'iran',
  qatar: 'qatar',
  uruguay: 'uruguay',
  colombia: 'colombia',
  ecuador: 'ecuador',
  paraguay: 'paraguay',
  chile: 'chile',
  peru: 'peru',
  panama: 'panama',
  'costa rica': 'costa-rica',
  jamaica: 'jamaica',
  haiti: 'haiti',
  'côte d\'ivoire': 'cote-d-ivoire',
  'cote d\'ivoire': 'cote-d-ivoire',
  'côte d’ivoire': 'cote-d-ivoire',
  'ivory coast': 'cote-d-ivoire',
  'cape verde': 'cape-verde',
  'cabo verde': 'cape-verde',
  curacao: 'curacao',
  curaçao: 'curacao',
  congo: 'congo',
  'dr congo': 'congo',
  'democratic republic of the congo': 'congo',
  bosnia: 'bosnia',
  'bosnia and herzegovina': 'bosnia',
  czechia: 'czechia',
  'czech republic': 'czechia',
  scotland: 'scotland',
  sweden: 'sweden',
  norway: 'norway',
  turkey: 'turkey',
  iraq: 'iraq',
  jordan: 'jordan',
  uzbekistan: 'uzbekistan',
  'new zealand': 'new-zealand',
}

/** Platform icons for subscribe buttons */
export const PLATFORM_BRAND_LOGOS: Record<string, string> = {
  apple: '/brand/Apple_Logo_0.svg',
  outlook: '/brand/outlook.jpeg',
  whatsapp: '/brand/whatsapp.svg',
}

function normalizeTeamName(teamName: string): string {
  return teamName
    .replace(/^[\p{Emoji}\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+/u, '')
    .toLowerCase()
    .trim()
}

/** Prefer static brand map so asset updates apply even if DB iconUrl is stale. */
export function resolveCalendarIconUrl(
  slug: string,
  dbIconUrl?: string | null
): string | null {
  return CALENDAR_BRAND_LOGOS[slug] ?? dbIconUrl ?? null
}

export function hasCalendarBrandLogo(slug: string): boolean {
  return slug in CALENDAR_BRAND_LOGOS
}

export function resolveTeamLogoUrl(teamName: string): string | null {
  const normalized = normalizeTeamName(teamName)
  const slug =
    TEAM_NAME_ALIASES[normalized] ??
    normalized.replace(/\./g, '').replace(/\s+/g, '-')
  return TEAM_BRAND_LOGOS[slug] ?? null
}

export function hasTeamBrandLogo(teamName: string): boolean {
  return resolveTeamLogoUrl(teamName) !== null
}

export function parseFixtureTeams(title: string): { teamA: string; teamB: string } | null {
  if (!title.includes(' vs ')) return null
  const [teamA, teamB] = title.split(' vs ')
  if (!teamA?.trim() || !teamB?.trim()) return null
  return {
    teamA: teamA.trim(),
    teamB: teamB.trim().split(' — ')[0].trim(),
  }
}
