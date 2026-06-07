import { Suspense } from 'react'
import { SearchPageClient } from '@/components/SearchPageClient'
import { getAllActiveCalendars } from '@/lib/calendars.server'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search sports and entertainment calendars on Cronva.',
}

interface Props {
  searchParams: Promise<{ q?: string }>
}

async function SearchContent({ query }: { query: string }) {
  const calendars = await getAllActiveCalendars()
  return <SearchPageClient calendars={calendars} initialQuery={query} />
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  return (
    <Suspense>
      <SearchContent query={query} />
    </Suspense>
  )
}
