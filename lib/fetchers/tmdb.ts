import { prisma } from '@/lib/db/client'

const API_BASE = 'https://api.themoviedb.org/3'
const CALENDAR_SLUG = 'upcoming-movies'
const MAX_PAGES = 5

interface TmdbMovie {
  id: number
  title: string
  overview: string
  release_date: string
}

interface TmdbPage {
  results: TmdbMovie[]
  total_pages: number
}

function auth(): { headers: HeadersInit; apiKey: string | null } {
  const token = process.env.TMDB_READ_TOKEN
  const apiKey = process.env.TMDB_API_KEY ?? null

  if (token) {
    return {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      apiKey: null,
    }
  }
  if (apiKey) {
    return { headers: { Accept: 'application/json' }, apiKey }
  }
  return { headers: {}, apiKey: null }
}

function buildUrl(path: string, params: Record<string, string>, apiKey: string | null): string {
  const url = new URL(`${API_BASE}${path}`)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  if (apiKey) url.searchParams.set('api_key', apiKey)
  return url.toString()
}

async function fetchPage(
  path: string,
  params: Record<string, string>,
  headers: HeadersInit,
  apiKey: string | null,
): Promise<TmdbPage | null> {
  const res = await fetch(buildUrl(path, params, apiKey), { headers, next: { revalidate: 0 } })
  if (res.status === 429) {
    console.warn('[TMDB] Rate limited — stopping pagination')
    return null
  }
  if (!res.ok) {
    console.error(`[TMDB] ${path} failed: ${res.status} ${res.statusText}`)
    return null
  }
  return res.json()
}

function releaseWindow(): { gte: string; lte: string } {
  const today = new Date()
  const end = new Date(today)
  end.setFullYear(end.getFullYear() + 1)
  const fmt = (d: Date) => d.toISOString().slice(0, 10)
  return { gte: fmt(today), lte: fmt(end) }
}

function movieEventTimes(releaseDate: string): { start: Date; end: Date } {
  // All-day release anchored to 09:00 WAT (+01:00)
  const start = new Date(`${releaseDate}T09:00:00+01:00`)
  const end = new Date(`${releaseDate}T23:59:00+01:00`)
  return { start, end }
}

function truncate(text: string, max: number): string {
  if (!text) return ''
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`
}

async function collectMovies(headers: HeadersInit, apiKey: string | null): Promise<Map<number, TmdbMovie>> {
  const movies = new Map<number, TmdbMovie>()
  const { gte, lte } = releaseWindow()

  const sources: { path: string; params: Record<string, string> }[] = [
    { path: '/movie/upcoming', params: { language: 'en-US', page: '1' } },
    {
      path: '/discover/movie',
      params: {
        language: 'en-US',
        sort_by: 'primary_release_date.asc',
        'primary_release_date.gte': gte,
        'primary_release_date.lte': lte,
        include_adult: 'false',
        page: '1',
      },
    },
  ]

  for (const { path, params: baseParams } of sources) {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const data = await fetchPage(path, { ...baseParams, page: String(page) }, headers, apiKey)
      if (!data) break

      for (const movie of data.results) {
        if (!movie.release_date) continue
        if (movie.release_date < gte) continue
        movies.set(movie.id, movie)
      }

      if (page >= data.total_pages) break
      await new Promise((r) => setTimeout(r, 250))
    }
  }

  return movies
}

export class TmdbFetcher {
  async syncAll() {
    const { headers, apiKey } = auth()
    if (!process.env.TMDB_READ_TOKEN && !apiKey) {
      console.warn('[TMDB] Missing TMDB_READ_TOKEN or TMDB_API_KEY — skipping')
      return
    }

    const calendar = await prisma.calendar.findUnique({ where: { slug: CALENDAR_SLUG } })
    if (!calendar) {
      console.warn(`[TMDB] Calendar not found: ${CALENDAR_SLUG}`)
      return
    }

    const movies = await collectMovies(headers, apiKey)
    let upserted = 0

    for (const movie of movies.values()) {
      const { start, end } = movieEventTimes(movie.release_date)

      await prisma.event.upsert({
        where: {
          calendarId_externalId: {
            calendarId: calendar.id,
            externalId: `tmdb-movie-${movie.id}`,
          },
        },
        update: {
          title: `${movie.title} — Theatrical Release`,
          startDatetime: start,
          endDatetime: end,
          description: truncate(movie.overview, 500) || null,
          location: 'Cinemas',
        },
        create: {
          calendarId: calendar.id,
          externalId: `tmdb-movie-${movie.id}`,
          title: `${movie.title} — Theatrical Release`,
          startDatetime: start,
          endDatetime: end,
          description: truncate(movie.overview, 500) || null,
          location: 'Cinemas',
          status: 'scheduled',
        },
      })
      upserted++
    }

    await prisma.calendar.update({
      where: { id: calendar.id },
      data: { lastSyncedAt: new Date() },
    })

    console.log(`[TMDB] ${CALENDAR_SLUG}: ${upserted} events upserted`)
  }
}
