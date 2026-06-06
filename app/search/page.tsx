import { prisma } from '@/lib/db/client'
import { CalendarCard } from '@/components/CalendarCard'
import type { Metadata } from 'next'
import Link from 'next/link'

interface Props {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `"${q}" — Search` : 'Search',
    description: 'Search sports and entertainment calendars on Cronva.',
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  const now = new Date()

  const calendars = query
    ? await prisma.calendar.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: [{ isFeatured: 'desc' }, { subscriberCount: 'desc' }],
        include: {
          events: {
            where: { status: { not: 'cancelled' }, startDatetime: { gt: now } },
            orderBy: { startDatetime: 'asc' },
            take: 1,
          },
        },
      })
    : []

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
      <div style={{ paddingTop: 48, paddingBottom: 48 }}>
        <div style={{ marginBottom: 8 }}>
          <Link
            href="/"
            style={{ fontSize: '13px', color: 'var(--color-fog)', textDecoration: 'none' }}
          >
            ← Home
          </Link>
        </div>

        <h1
          style={{
            fontWeight: 500,
            fontSize: '28px',
            letterSpacing: '-0.3px',
            color: 'var(--color-navy)',
            marginBottom: 8,
          }}
        >
          {query ? `Results for "${query}"` : 'Search calendars'}
        </h1>

        {query && (
          <p style={{ fontSize: '13px', color: 'var(--color-fog)' }}>
            {calendars.length} calendar{calendars.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {/* Search form (client side search bar for refinement) */}
      <form action="/search" method="GET" style={{ marginBottom: 40, maxWidth: 480 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="search"
            name="q"
            defaultValue={query}
            className="search-input"
            placeholder="Search calendars…"
            autoFocus
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn-primary" style={{ flexShrink: 0 }}>
            Search
          </button>
        </div>
      </form>

      {!query ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-fog)' }}>
          <p style={{ fontSize: '16px', marginBottom: 16 }}>
            Search for a sport, league, or competition.
          </p>
          <p style={{ fontSize: '13px' }}>
            Try: "Premier League", "F1", "BBNaija", "Nigeria"
          </p>
        </div>
      ) : calendars.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontSize: '16px', color: 'var(--color-navy)', marginBottom: 12 }}>
            No calendars found for "{query}"
          </p>
          <p style={{ fontSize: '13px', color: 'var(--color-fog)', marginBottom: 24 }}>
            Try a different search term or browse all calendars.
          </p>
          <Link href="/" className="btn-primary">
            Browse all calendars
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 12,
            marginBottom: 80,
          }}
        >
          {calendars.map((cal) => (
            <CalendarCard
              key={cal.slug}
              slug={cal.slug}
              name={cal.name}
              category={cal.category}
              subscriberCount={cal.subscriberCount}
              nextEventTitle={cal.events[0]?.title ?? null}
              nextEventDate={cal.events[0]?.startDatetime ?? null}
            />
          ))}
        </div>
      )}
    </div>
  )
}
