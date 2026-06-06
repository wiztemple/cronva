import { headers } from 'next/headers'

export type CountryCode = 'ng' | 'gh' | 'ke' | 'za' | 'global'

const PRIORITY_MAP: Record<string, CountryCode> = {
  NG: 'ng',
  GH: 'gh',
  KE: 'ke',
  ZA: 'za',
}

// Countries to show their local calendars first
export const LOCAL_COUNTRY_SLUGS: Record<CountryCode, string[]> = {
  ng: ['super-eagles', 'npfl', 'bbnnaija', 'afrobeats-tours', 'eid-nigeria', 'prayer-lagos', 'ramadan-lagos', 'ramadan-kano', 'ramadan-abuja'],
  gh: ['ghana-premier-league', 'black-stars'],
  ke: ['kpl', 'harambee-stars'],
  za: [],
  global: [],
}

export async function detectCountry(): Promise<CountryCode> {
  const headersList = await headers()

  // Cloudflare provides this header in production
  const cfCountry = headersList.get('cf-ipcountry')
  if (cfCountry && PRIORITY_MAP[cfCountry]) {
    return PRIORITY_MAP[cfCountry]
  }

  // Vercel / generic CDN
  const vercelCountry = headersList.get('x-vercel-ip-country')
  if (vercelCountry && PRIORITY_MAP[vercelCountry]) {
    return PRIORITY_MAP[vercelCountry]
  }

  return 'ng' // Default: Nigeria-first
}

export async function getCountryFromCookie(): Promise<CountryCode | null> {
  // This must be called from a Server Component or API route
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const val = cookieStore.get('cronva_country')?.value
  if (val && (val in LOCAL_COUNTRY_SLUGS)) return val as CountryCode
  return null
}
