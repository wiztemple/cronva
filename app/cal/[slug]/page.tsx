import { notFound } from 'next/navigation'
import { CalendarDetailView } from '@/components/CalendarDetailView'
import { getCalendarDetail } from '@/lib/calendars.server'
import { prisma } from '@/lib/db/client'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

/** Always read fixtures from DB — avoids stale SSG after sync jobs */
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const detail = await getCalendarDetail(slug)
  if (!detail) return {}
  return {
    title: detail.calendar.name,
    description: detail.calendar.description,
  }
}

export async function generateStaticParams() {
  const calendars = await prisma.calendar.findMany({
    where: { isActive: true },
    select: { slug: true },
  })
  return calendars.map((c) => ({ slug: c.slug }))
}

export default async function CalendarDetailPage({ params }: Props) {
  const { slug } = await params
  const detail = await getCalendarDetail(slug)
  if (!detail) notFound()

  return (
    <CalendarDetailView
      calendar={detail.calendar}
      slug={slug}
      fixtures={detail.fixtures}
      related={detail.related}
    />
  )
}
